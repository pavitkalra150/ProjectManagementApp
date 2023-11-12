


import AsyncStorage from '@react-native-async-storage/async-storage';
export const tasks = [
  {
    id: getRandomId(),
    projectId: 1,
    name: "Task 1",
    description: "Description of Task 1",
    assignedTo: "user1@example.com",
    dueDate: "2023-12-31",
    status: "Open",
    dependencyId: null, // No dependency for the first task
    hoursWorked: 0,
  },
  {
    id: getRandomId(),
    projectId: 1,
    name: "Task 2",
    description: "Description of Task 2",
    assignedTo: "user1@example.com",
    dueDate: "2023-11-15",
    status: "In Progress",
    hoursWorked: 0,   
  },
  {
    id: getRandomId(),
    projectId: 2,
    name: "Task 3",
    description: "Description of Task 3",
    assignedTo: "user2@example.com",
    dueDate: "2023-11-15",
    status: "Completed",
    hoursWorked: 0,
  },
  {
    id: getRandomId(),
    projectId: 2,
    name: "Task 4",
    description: "Description of Task 4",
    assignedTo: "user2@example.com",
    dueDate: "2023-11-15",
    status: "Open",
    hoursWorked: 0,
  },
  {
    id: getRandomId(),
    projectId: 1,
    name: "Task 4",
    description: "Description of Task 4",
    assignedTo: "user2@example.com",
    dueDate: "2023-11-15",
    status: "Completed",
    hoursWorked: 0,
  },

  // Add more tasks here
];
function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}
export function addTask(
  projectId,
  newTaskName,
  newTaskDescription,
  assignedTo,
  dueDate,
  status
) {
  const lastTask = tasks[tasks.length - 1];
  const newTask = {
    id: getRandomId(),
    projectId: projectId,
    name: newTaskName,
    description: newTaskDescription,
    assignedTo: assignedTo,
    dueDate: dueDate,
    status: status || "Open", // Default to 'Open' if status is not provided
    dependencyId: lastTask ? lastTask.id : null,
    hoursWorked: 0,
  };

  tasks.push(newTask); // This is still in-memory addition

  // Save the tasks to AsyncStorage
  saveTasksToStorage(tasks);
}
export async function loadTasksFromStorage() {
  try {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks !== null) {
      return JSON.parse(storedTasks);
    }
  } catch (error) {
    console.log('Error loading tasks:', error);
  }
  return [];
}

export function saveTasksToStorage(tasks) {
  try {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.log('Error saving tasks:', error);
  }
}