import Card from "./Card";
import Form from "./Form";

export default class Container {
  constructor() {
    this.columns = document.querySelectorAll(".column");
    this.init();
  }

  // Инициализация
  init() {
    this.columns.forEach((column) => {
      // Разрешаем перетаскивание над колонкой
      column.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move"; //эффект перемещения

        const cardDragged = document.querySelector(".dragging");
        if (!cardDragged) return; //

        const afterElement = this.getDragAfterElement(column, event.clientY);
        const addTaskBtn = column.querySelector(".add-task"); //

        if (afterElement) {
          column.insertBefore(cardDragged, afterElement);
        } else {
          column.insertBefore(cardDragged, addTaskBtn);
        }
      });

      // событие броска карточки в колонку
      column.addEventListener("drop", (event) => {
        event.preventDefault();
        const text = event.dataTransfer.getData("text/plain");

        // Находим оригинальную карточку и удаляем её
        const originalCard = Array.from(this.columns)
          .flatMap((column) => Array.from(column.querySelectorAll(".task")))
          .find((card) => card.querySelector("span").textContent === text);

        if (originalCard) {
          originalCard.remove();
        }

        // Создаем новую карточку и вставляем ее перед кнопкой
        const card = new Card(text, column.dataset.columnId);
        const afterElement = this.getDragAfterElement(column, event.clientY); //
        const addTaskBtn = column.querySelector(".add-task"); //

        if (afterElement) {
          column.insertBefore(card.cardElement, afterElement);
        } else {
          column.insertBefore(card.cardElement, addTaskBtn);
        }

        this.saveCardPosition(card);
      });

      // Кнопка "Add task"
      const addBtn = column.querySelector(".add-task");
      addBtn.addEventListener("click", () => {
        addBtn.style.display = "none";
        new Form(column);
      });

      // Загрузка карточек из localStorage
      this.loadCards(column);
    });
  }

  // Загрузка карточек из localStorage
  loadCards(column) {
    const columnId = column.dataset.columnId;
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards
      .filter((card) => card.columnId === columnId)
      .forEach((cardData) => {
        const card = new Card(cardData.text, cardData.columnId);
        column.insertBefore(
          card.cardElement,
          column.querySelector(".add-task"),
        );
      });
  }

  // Сохранение позиции карточки в localStorage
  saveCardPosition(card) {
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    const cardIndex = cards.findIndex((c) => c.text === card.text);

    if (cardIndex !== -1) {
      cards[cardIndex].columnId = card.columnId; // Обновляем колонку
    } else {
      cards.push({ text: card.text, columnId: card.columnId }); // Добавляем новую карточку
    }

    localStorage.setItem("cards", JSON.stringify(cards));
  }

  // Определение позиции для вставки карточки
  getDragAfterElement(column, y) {
    const draggableElements = [
      ...column.querySelectorAll(".task:not(.dragging)"),
    ];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > (closest?.offset || -Infinity)) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, null)?.element;
  }
}
