import "./style.css";
import { v4 as uuidv4 } from "uuid";

interface Project {
  id: string;
  name: string;
  description: string;
}

const projects: Project[] = [];

// CREATE
const addProject = (name: string, description: string) => {
  console.log("Działa funkcja add project");
  const id = uuidv4();
  const newProject: Project = { id, name, description };
  projects.push(newProject);
  displayProjects();
};
// READ
const displayProjects = () => {
  console.log("Działa funkcja display project");
  const projectsDiv = document.getElementById("projects")!;
  projectsDiv.innerHTML= "";
  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.innerHTML = `
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <button onclick="editProject('${project.id}')">Edytuj</button>
      <button onclick="deleteProject('${project.id}')">Usuń</button>
    `;
    projectsDiv.appendChild(projectElement);
  });
};

// UPDATE
const editProject = (id: string) => {
  const projectToEdit = projects.find((project) => project.id === id);
  if (!projectToEdit) return;
  const newName = prompt("Wprowadź nową nazwę projektu:", projectToEdit.name);
  const newDescription = prompt(
    "Wprowadź nowy opis projektu:",
    projectToEdit.description
  );
  if (newName !== null && newDescription !== null) {
    projectToEdit.name = newName;
    projectToEdit.description = newDescription;
    displayProjects();
  }
};

// DELETE
const deleteProject = (id: string) => {
  const index = projects.findIndex((project) => project.id === id);
  if (index !== -1) {
    projects.splice(index, 1);
    displayProjects();
  }
};

const handleFormSubmit = (event: Event) => {
  console.log("Działa funkcja handle projecct");
  const projectNameInput = document.getElementById(
    "projectName"
  ) as HTMLInputElement;
  const projectDescriptionInput = document.getElementById(
    "projectDescription"
  ) as HTMLTextAreaElement;
  const projectName = projectNameInput.value;
  const projectDescription = projectDescriptionInput.value;
  addProject(projectName, projectDescription);
 
};
const projectForm = document.getElementById("projectForm");

projectForm?.addEventListener("submit", handleFormSubmit);



document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div>
<form id="projectForm">
    
        <div>
            <label for="projectName">Nazwa Projektu:</label>
            <input type="text" id="projectName" name="projectName" required>
        </div>
        <div>
            <label for="projectDescription">Opis Projektu:</label>
            <textarea id="projectDescription" name="projectDescription" rows="4" required></textarea>
        </div>
        <button type="submit">Dodaj Projekt</button>
        </form>
        <div id="projects"></div>
        </div>


`;
