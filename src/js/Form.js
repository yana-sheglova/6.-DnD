import Card from "./Card";

export default class Form {
  constructor(column) {
    this.column = column;
    this.columnId = this.column.dataset.columnId;
    this.formElement = this.createForm();
    this.column.appendChild(this.formElement);
    this.bindEvents();
  }

  createForm() {
    const form = document.createElement("div");
    form.classList.add("form");
    form.innerHTML = `
            <textarea class="task-text" rows="3" placeholder="Enter task text"></textarea>
            <div class="button-container">
                <button class="add">Add</button>
                <button class="close">✖</button>
            </div>
        `;
    setTimeout(() => form.querySelector(".task-text").focus(), 0);

    return form;
  }

  // Привязка событий
  bindEvents() {
    this.formElement.querySelector(".add").addEventListener("click", () => {
      const text = this.formElement.querySelector(".task-text").value;

      if (text) {
        const card = new Card(text);

        const addTaskBtn = this.column.querySelector(".add-task");
        this.column.insertBefore(card.cardElement, addTaskBtn);

        this.saveToLocalStorage(text, this.columnId);

        this.formElement.querySelector(".task-text").value = "";

        this.column.removeChild(this.formElement);
        addTaskBtn.style.display = "block";
      }
    });

    this.formElement.querySelector(".close").addEventListener("click", () => {
      this.column.removeChild(this.formElement);
      this.column.querySelector(".add-task").style.display = "block";
    });
  }

  saveToLocalStorage(text, columnId) {
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards.push({ text, columnId });
    localStorage.setItem("cards", JSON.stringify(cards));
  }
}
