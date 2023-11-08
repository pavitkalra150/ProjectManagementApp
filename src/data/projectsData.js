export const projects = [
  {
    id: getRandomId(),
    name: "Project 1",
    description: "Description of Project 1",
  },
  {
    id: getRandomId(),
    name: "Project 2",
    description: "Description of Project 2",
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
