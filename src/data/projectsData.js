import AsyncStorage from "@react-native-async-storage/async-storage";

function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}

export async function addProject(newProjectName, newProjectDescription, createdBy) {
  const newProject = {
    id: getRandomId(),
    name: newProjectName,
    description: newProjectDescription,
    createdBy: createdBy,
    status: "Open",
  };

  try {
    const storedProjects = await loadProjectsFromStorage();
    const updatedProjects = storedProjects ? [...storedProjects, newProject] : [newProject];
    await saveProjectsToStorage(updatedProjects);
    return true;
  } catch (error) {
    console.log('Error adding project:', error);
    throw error;
  }
}

export async function filterProjectsByUser(email) {
  try {
    const storedProjects = await loadProjectsFromStorage();
    return storedProjects ? storedProjects.filter((project) => project.createdBy === email) : [];
  } catch (error) {
    console.log('Error filtering projects:', error);
    throw error;
  }
}

export async function loadProjectsFromStorage() {
  try {
    const storedProjects = await AsyncStorage.getItem('projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.log('Error loading projects:', error);
    throw error;
  }
}

export async function fetchProjectNameById(projectId) {
  try {
    const storedProjects = await AsyncStorage.getItem('projects');
    const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];
    
    const project = parsedProjects.find((proj) => proj.id === projectId);
    return project ? project.name : "Project Not Found";
  } catch (error) {
    console.log('Error fetching project name:', error);
    throw error;
  }
}

export async function saveProjectsToStorage(projects) {
  try {
    await AsyncStorage.setItem("projects", JSON.stringify(projects));
  } catch (error) {
    console.log("Error saving projects:", error);
    throw error;
  }
}

export async function updateProjectStatus(projectId, tasks) {
  try {
    const storedProjects = await loadProjectsFromStorage();
    const projectToUpdate = storedProjects.find((project) => project.id === projectId);

    if (projectToUpdate) {
      const projectTasks = tasks.filter((task) => task.projectId === projectId);
      const completedTasks = projectTasks.filter(
        (task) => task.status === "Completed"
      );

      if (completedTasks.length === projectTasks.length) {
        // All tasks are completed for this project
        return "Completed";
      } else {
        return "In Progress";
      }
    }

    return null; // Indicates that the project was not found
  } catch (error) {
    console.error("Error updating project status:", error);
    throw error;
  }
}



export function computeProjectStatus(projectId, tasks) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);

  if (projectTasks.length === 0) {
    return "No tasks";
  }

  const allTasksClosed = projectTasks.every((task) => task.status === "Closed");
  const anyTaskInProgress = projectTasks.some((task) => task.status === "In Progress");

  if (allTasksClosed) {
    return "Completed";
  } else if (anyTaskInProgress) {
    return "In Progress";
  } else {
    return "Open";
  }
}

export function computeProjectCost(projectId, tasks, hourlyRate) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  let totalHoursWorked = 0;

  projectTasks.forEach((task) => {
    const storedHoursWorked = parseFloat(task.hoursWorked) || 0;
    totalHoursWorked += storedHoursWorked;
  });

  const projectCost = totalHoursWorked * hourlyRate;

  return projectCost;
}

const loadHoursWorkedForTask = async (taskId) => {
  let storedHoursWorked = hoursWorkedData[taskId];
  if (!storedHoursWorked) {
    try {
      const hours = await AsyncStorage.getItem(`hours_worked_${taskId}`);
      storedHoursWorked = hours || '0'; // Assuming default as '0' if hours not found
      hoursWorkedData[taskId] = storedHoursWorked;
    } catch (error) {
      console.error(`Error loading hours worked for task ${taskId}:`, error);
      storedHoursWorked = '0'; // Setting default value in case of error
    }
  }
  return parseFloat(storedHoursWorked);
};
export async function editProject(projectId, updatedProjectData) {
  try {
    const storedProjects = await loadProjectsFromStorage();
    const updatedProjects = storedProjects.map((project) => {
      if (project.id === projectId) {
        return { ...project, ...updatedProjectData };
      }
      return project;
    });
    await saveProjectsToStorage(updatedProjects);
    return true;
  } catch (error) {
    console.log('Error editing project:', error);
    throw error;
  }
}
export async function deleteProject(projectId) {
  try {
    const storedProjects = await loadProjectsFromStorage();
    const updatedProjects = storedProjects.filter(
      (project) => project.id !== projectId
    );
    await saveProjectsToStorage(updatedProjects);
    return true;
  } catch (error) {
    console.log('Error deleting project:', error);
    throw error;
  }
}