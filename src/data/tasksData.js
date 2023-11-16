import AsyncStorage from "@react-native-async-storage/async-storage";

export const tasks = [
  {
    id: getRandomId(),
    projectId: 1,
    name: 'Testing 1',
    description: 'Description of Task 1',
    assignedTo: 'user1@example.com',
    dueDate: '2023-12-31',
    hoursWorked: 5,
    status: "Open",
  },
  {
    id: getRandomId(),
    projectId: 1,
    name: 'Testing 2',
    description: 'Description of Task 2',
    assignedTo: 'user1@example.com',
    dueDate: '2023-11-15',
    hoursWorked: 6,
    status: "Open",
  },
  {
    id: getRandomId(),
    projectId: 2,
    name: 'Testing 3',
    description: 'Description of Task 3',
    assignedTo: 'user2@example.com',
    dueDate: '2023-11-15',
    hoursWorked: 8,
    status: "Completed",
  },
  {
    id: getRandomId(),
    projectId: 2,
    name: 'Testing 4',
    description: 'Description of Task 4',
    assignedTo: 'user2@example.com',
    dueDate: '2023-11-15',
    hoursWorked: 10,
    status: "Completed",
  },
  {
    id: getRandomId(),
    projectId: 2,
    name: 'Testing 5',
    description: 'Description of Task 5',
    assignedTo: 'user2@example.com',
    dueDate: '2023-11-15',
    hoursWorked: 10,
    status: "Completed",
  },
  // Add more tasks here
];



function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}
export async function addTask(
  projectId,
  newTaskName,
  newTaskDescription,
  assignedTo,
  dueDate,
  status
) {
  const tasks = await loadTasksFromStorage();

  const lastTask = tasks[tasks.length - 1];
  const newTask = {
    id: getRandomId(),
    projectId: projectId,
    name: newTaskName,
    description: newTaskDescription,
    assignedTo: assignedTo,
    dueDate: dueDate,
    status: status || "Open",
    dependencyId: lastTask ? lastTask.id : null,
    hoursWorked: 0,
  };

  tasks.push(newTask);
  await saveTasksToStorage(tasks);
}

export async function loadTasksFromStorage() {
  try {
    const storedTasks = await AsyncStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.log("Error loading tasks:", error);
    return [];
  }
}

export async function saveTasksToStorage(tasks) {
  try {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.log("Error saving tasks:", error);
  }
}
export async function editTask(taskId, updatedTask) {
  try {
    let tasks = await loadTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      await saveTasksToStorage(tasks);
    } else {
      console.log("Task not found.");
    }
  } catch (error) {
    console.log("Error editing task:", error);
  }
}
export async function deleteTask(taskId) {
  try {
    let tasks = await loadTasksFromStorage(); 
    tasks = tasks.filter((task) => task.id !== taskId);

    await saveTasksToStorage(tasks);
  } catch (error) {
    console.log("Error deleting task:", error);
  }
}

