export const tasks = [
    {
      id: getRandomId(),
      projectId: 1,
      name: 'Task 1',
      description: 'Description of Task 1',
      assignedTo: 'user1@example.com',
      dueDate: '2023-12-31',
    },
    {
      id: getRandomId(),
      projectId: 1,
      name: 'Task 2',
      description: 'Description of Task 2',
      assignedTo: 'user1@example.com',
      dueDate: '2023-11-15',
    },
    {
      id: getRandomId(),
      projectId: 2,
      name: 'Task 3',
      description: 'Description of Task 3',
      assignedTo: 'user2@example.com',
      dueDate: '2023-11-15',
    },
    {
      id: getRandomId(),
      projectId: 2,
      name: 'Task 4',
      description: 'Description of Task 4',
      assignedTo: 'user2@example.com',
      dueDate: '2023-11-15',
    },
    // Add more tasks here
  ];
  
  function getRandomId() {
    const randomNumber = Math.random().toString().substr(2);
    const timestamp = new Date().getTime().toString();
    return timestamp + randomNumber;
  }
  
  export function addTask(projectId, newTaskName, newTaskDescription, assignedTo, dueDate) {
    const newTask = {
      id: getRandomId(),
      projectId: projectId,
      name: newTaskName,
      description: newTaskDescription,
      assignedTo: assignedTo,
      dueDate: dueDate,
    };
    tasks.push(newTask);
  }
  