import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to generate a random ID for tasks
function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}

// Adds a new task to the tasks array and saves to AsyncStorage
export async function addTask(
  projectId,
  newTaskName,
  newTaskDescription,
  assignedTo,
  dueDate,
  status
) {
  const tasks = await loadTasksFromStorage(); // Load existing tasks from AsyncStorage

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

  tasks.push(newTask); // Add the new task to the in-memory tasks array

  // Save the updated tasks array to AsyncStorage
  await saveTasksToStorage(tasks);
}

// Loads tasks from AsyncStorage
export async function loadTasksFromStorage() {
  try {
    const storedTasks = await AsyncStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.log("Error loading tasks:", error);
    return [];
  }
}

// Saves tasks to AsyncStorage
export async function saveTasksToStorage(tasks) {
  try {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.log("Error saving tasks:", error);
  }
}
export async function editTask(taskId, updatedTask) {
  try {
    let tasks = await loadTasksFromStorage(); // Load existing tasks from AsyncStorage

    // Find the index of the task with the provided taskId
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      // Update the task with the provided updatedTask object
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

      // Save the updated tasks array to AsyncStorage
      await saveTasksToStorage(tasks);
    } else {
      console.log("Task not found.");
    }
  } catch (error) {
    console.log("Error editing task:", error);
  }
}