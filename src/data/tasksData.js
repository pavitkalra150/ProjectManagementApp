import AsyncStorage from "@react-native-async-storage/async-storage";

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

