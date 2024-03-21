import './style.css'

interface Project{
  id: number;
  name: string;
  description: string;
}

const addProject = document.getElementById("add")

addProject?.addEventListener("click", () =>{
  const newProject = {
    id: randomUUID(),
    name:
  }
})




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

