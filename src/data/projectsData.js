export const projects = [
  {
    id: 1,
    name: "Project 1",
    description: "Description of Project 1",
  },
  {
    id: 2,
    name: "Project 2",
    description: "Description of Project 2",
  },
  {
    id: 3,
    name: "Project 3",
    description: "Description of Project 3",
  },
  // Add more projects here
];

function getRandomId() {
  const randomNumber = Math.random().toString().substr(2);
  const timestamp = new Date().getTime().toString();
  return timestamp + randomNumber;
}

export function addProject(newProjectName, newProjectDescription) {
  const newProject = {
    id: getRandomId(),
    name: newProjectName,
    description: newProjectDescription,
  };
  projects.push(newProject);
}
