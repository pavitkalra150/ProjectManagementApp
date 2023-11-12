import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../data/UserDataManager'; // Import the user data file


export const projects = [
  {
    id: 1,
    name: "Project 1",
    description: "Description of Project 1",
    createdBy: "user1@example.com",
  },
  {
    id: 2,
    name: "Project 2",
    description: "Description of Project 2",
    createdBy: "user2@example.com",
  },
  {
    id: 3,
    name: "Project 3",
    description: "Description of Project 3",
    createdBy: "user1@example.com",
  },
  {
    id: 4,
    name: "Project 4",
    description: "Description of Project 4",
    createdBy: "user2@example.com",
  },
  // Add more projects here
];

function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}
export function computeProjectStatus(projectId, tasks) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const completedTasks = projectTasks.filter((task) => task.status === 'Done');

  if (completedTasks.length === projectTasks.length) {
    return 'Completed';
  }

  return 'In Progress';
}

export function addProject(newProjectName, newProjectDescription, createdBy) {
  const newProject = {
    id: getRandomId(),
    name: newProjectName,
    description: newProjectDescription,
    createdBy: createdBy,
    status: "Open",
  };
  projects.push(newProject);

  saveProjectsToStorage(projects);
  return projects; // Return the updated projects array
}
export function filterProjectsByUser(email) {
  return projects.filter((project) => project.createdBy === email);
}
export async function loadProjectsFromStorage(userEmail) {
  try {
    const storedProjects = await AsyncStorage.getItem('projects');
    if (storedProjects !== null) {
      const parsedProjects = JSON.parse(storedProjects);
      console.log('All projects:', parsedProjects); // Check what's being retrieved from storage
      const filteredProjects = parsedProjects.filter((project) => project.createdBy === userEmail);
      console.log('Filtered projects:', filteredProjects); // Verify the projects after filtering
      return filteredProjects;
    }
  } catch (error) {
    console.log('Error loading projects:', error);
  }
  return []; // Return an empty array or handle appropriately if there's an issue loading from AsyncStorage
}
export function fetchProjectNameById(projectId) {
  const project = projects.find((project) => project.id === projectId);
  return project ? project.name : 'Project Not Found';
}
export function saveProjectsToStorage(projects) {
  try {
    AsyncStorage.setItem('projects', JSON.stringify(projects));
  } catch (error) {
    console.log('Error saving projects:', error);
  }
}
export const updateProjectStatus = (projectId, tasks) => {
  const projectToUpdate = projects.find((project) => project.id === projectId);

  if (projectToUpdate) {
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const completedTasks = projectTasks.filter((task) => task.status === 'Done');

    if (completedTasks.length === projectTasks.length) {
      // All tasks are completed for this project
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }

  return null; // Indicates that the project was not found
};

export function computeProjectCost(projectId, tasks, hourlyRate) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  let totalHoursWorked = 0;

  projectTasks.forEach((task) => {
    totalHoursWorked += parseFloat(task.hoursWorked);
  });

  const projectCost = totalHoursWorked * hourlyRate;

  return projectCost;
}