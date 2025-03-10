export default class Card {
  constructor(text, columnId) {
    this.text = text;
    this.columnId = columnId;
    this.cardElement = this.createCard();
    this.bindEvents();
  }

  // Создание карточки
  createCard() {
    const card = document.createElement("div");
    card.classList.add("task");
    card.setAttribute("draggable", true);
    card.innerHTML = `
            <span>${this.text}</span>
            <button class="delete">✖</button>
        `;
    return card;
  }

  // Привязка событий
  bindEvents() {
    // начало перетаскивания
    this.cardElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.text); // Передаем данные
      event.dataTransfer.effectAllowed = "move"; // Разрешаем перемещение
      this.cardElement.classList.add("dragging");
    });

    // окончание перетаскивания
    this.cardElement.addEventListener("dragend", () => {
      this.cardElement.classList.remove("dragging");
    });

    // Удаление карточки
    this.cardElement.querySelector(".delete").addEventListener("click", () => {
      this.removeCard();
    });
  }

  // Удаление карточки
  removeCard() {
    this.cardElement.remove();
    this.removeFromLocalStorage(this.text);
  }

  // Удаление карточки из localStorage
  removeFromLocalStorage(text) {
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    const updatedCards = cards.filter((card) => card.text !== text);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  }
}
