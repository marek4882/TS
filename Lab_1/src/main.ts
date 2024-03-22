import { v4 as uuid } from "uuid";

export type Project = {
  id: string;
  name: string;
  description: string;
};

export interface Repository {
  readProjects(): Project[];
  saveProjects(projects: Project[]): void;
}

export class LocalRepository implements Repository {
  private static readonly storageKey = 'projects';

  public readProjects(): Project[] {
    const projectsData = localStorage.getItem(LocalRepository.storageKey);
    return projectsData ? JSON.parse(projectsData) : [];
  }

  public saveProjects(projects: Project[]): void {
    localStorage.setItem(LocalRepository.storageKey, JSON.stringify(projects));
  }
}



export class ProjectManager{
  private repository: Repository;

  constructor(repository: Repository){
    this.repository = repository
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



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
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
`

