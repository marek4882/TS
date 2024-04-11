import { v4 as uuid } from "uuid";
import "./style.css";

export interface Project {
  id: string;
  name: string;
  description: string;
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div>
  <form>
    <div>
      <label for="projectName">Nazwa Projektu:</label>
      <input type="text" id="projectName" name="projectName" required>
    </div>
    <div>
      <label for="projectDescription">Opis Projektu:</label>
      <textarea id="projectDescription" name="projectDescription" rows="4" required></textarea>
    </div>
    <button type="submit" id="add">Dodaj Projekt</button>
  </form>
</div>
<div id="projectList"></div>
</div>`;

export interface Repository {
  readProjects(): Project[];
  saveProjects(projects: Project[]): void;
}

export class LocalRepository implements Repository {
  private static readonly storageKey = "projects";

  public readProjects(): Project[] {
    const projectsData = localStorage.getItem(LocalRepository.storageKey);
    return projectsData ? JSON.parse(projectsData) : [];
  }

  public saveProjects(projects: Project[]): void {
    localStorage.setItem(LocalRepository.storageKey, JSON.stringify(projects));
  }
}

export class ProjectManager {
  private repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  public add(name: string, description: string): void {
    const projects = this.repository.readProjects();
    const project: Project = {
      id: uuid(),
      name,
      description,
    };
    projects.push(project);
    this.repository.saveProjects(projects);
  }

  public read(): Project[] {
    return this.repository.readProjects();
  }

  public update(id: string, newName: string, newDescription: string): boolean {
    const projects = this.repository.readProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      projects[index].name = newName;
      projects[index].description = newDescription;
      this.repository.saveProjects(projects);
      return true;
    }
    return false;
  }

  public delete(id: string): boolean {
    const projects = this.repository.readProjects();
    const initialLength = projects.length;
    const updatedProjects = projects.filter((project) => project.id !== id);
    if (updatedProjects.length !== initialLength) {
      this.repository.saveProjects(updatedProjects);
      return true;
    }
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const projectManager = new ProjectManager(new LocalRepository());

  const form = document.querySelector<HTMLFormElement>("form")!;
  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const projectNameInput =
      document.querySelector<HTMLInputElement>("#projectName")!;
    const projectDescriptionInput = document.querySelector<HTMLTextAreaElement>(
      "#projectDescription"
    )!;

    const projectName = projectNameInput.value.trim();
    const projectDescription = projectDescriptionInput.value.trim();

    if (projectName && projectDescription) {
      projectManager.add(projectName, projectDescription);
      projectNameInput.value = "";
      projectDescriptionInput.value = "";
      refreshProjectList();
    }
  });

  function refreshProjectList(): void {
    const projectListContainer =
      document.querySelector<HTMLDivElement>("#projectList")!;
    const projects = projectManager.read();
    projectListContainer.innerHTML = "";
    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <button class="edit-btn" data-id="${project.id}">Edytuj</button>
        <button class="delete-btn" data-id="${project.id}">Usuń</button>
      `;
      projectListContainer.appendChild(projectElement);
    });

    const editButtons = document.querySelectorAll<HTMLButtonElement>(".edit-btn");
    editButtons.forEach(button => {
      button.addEventListener("click", () => {
        const projectId = button.dataset.id!;
        editProject(projectId);
      });
    });

    const deleteButtons = document.querySelectorAll<HTMLButtonElement>(".delete-btn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const projectId = button.dataset.id!;
        deleteProject(projectId);
      });
    });
  }

  function editProject(id: string): void {
    const newName = prompt("Nowa nazwa projektu:");
    const newDescription = prompt("Nowy opis projektu:");
    if (newName !== null && newDescription !== null) {
      const updated = projectManager.update(id, newName, newDescription);
      if (updated) {
        refreshProjectList();
      } else {
        alert(
          "Nie można zaktualizować projektu - projekt o podanym ID nie istnieje."
        );
      }
    }
  }

  function deleteProject(id: string): void {
    const deleted = projectManager.delete(id);
    if (deleted) {
      refreshProjectList();
    } else {
      alert("Nie można usunąć projektu - projekt o podanym ID nie istnieje.");
    }
  }

  refreshProjectList();
});
