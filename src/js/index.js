//открывание модальных окон
let modalContainer = document.querySelector(".modal__container");
function showModal(modal) {
  modalContainer.classList.toggle("hidden");
  modal.classList.toggle("hidden");
}
let todoContainer = document.querySelector(".todo__container");
//подгрузка данных из localStarage
if (localStorage.getItem("elements")) {
  todoContainer.innerHTML = localStorage.getItem("elements");
}
// модальное окно для добавления элемента
let addButton = document.querySelector(".todo__addBtn");
let addModal = document.querySelector(".modal__add");
let addModalCancel = document.querySelector(".modal__cancel__addbtn");
addButton.addEventListener("click", () => showModal(addModal));
addModalCancel.addEventListener("click", () => showModal(addModal));
//Добавление задачи
let addItemBtn = document.querySelector(".modal__add__addbtn");
let titleInput = document.querySelector(".todo__title__input");
let descriptionInput = document.querySelector(".todo__comment__input");
let mainBlock = document.querySelector(".todo__main__content");
addItemBtn.addEventListener("click", addItem);
function addItem() {
  let todoItem = document.createElement("div");
  todoItem.draggable = true;
  let data = new Date();
  let dataContent =
    data.getDate() + "." + (data.getMonth() + 1) + "." + data.getFullYear();
  todoItem.classList.add("todo__item");
  todoItem.innerHTML = `<h4 class="todo__item__header">${titleInput.value}</h4>
    <div class="todo__item__buttons">
        <button class="inprogress__button" title="В процессе"></button>
        <button class="delete__button" title="Удалить"></button>
        <button class="inmain__button" title="В невыполненные"></button>
        <button class="indone__button" title="В выполненные"></button>
    </div>
    <p class="todo__item__description">${descriptionInput.value}</p>
    <p class="todo__item__date">${dataContent}</p>
    <button class="item__show"><span>Показать</span></button>`;
  mainBlock.append(todoItem);
  showModal(addModal);
  localStorage.setItem("elements", todoContainer.innerHTML);
  counters();
}
//переброс элемента в в другие блоки
let inprogressBlock = document.querySelector(".todo__inprogress__content");
let doneBlock = document.querySelector(".todo__done__content");
let trashBlock = document.querySelector(".todo__trash__content");
let deleteModal = document.querySelector(".modal__delete");
let delCancelBtn = document.querySelector(".modal__delete__cancelbtn");
delCancelBtn.addEventListener("click", () => showModal(deleteModal));
todoContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("inprogress__button")) {
    changeBlock(event.target, inprogressBlock);
  } else if (event.target.classList.contains("inmain__button")) {
    changeBlock(event.target, mainBlock);
  } else if (event.target.classList.contains("indone__button")) {
    changeBlock(event.target, doneBlock);
  } else if (event.target.classList.contains("delete__button")) {
    if (
      event.target
        .closest(".todo__item")
        .parentElement.classList.contains("todo__trash__content")
    ) {
      showModal(deleteModal);
      let delBtn = document.querySelector(".modal__delete__deletebtn");
      delBtn.onclick = function () {
        event.target.closest(".todo__item").remove();
        localStorage.setItem("elements", todoContainer.innerHTML);
        counters();
        showModal(deleteModal);
      };
    } else {
      changeBlock(event.target, trashBlock);
    }
  } else if (event.target.classList.contains("todo__clear")) {
    event.target
      .closest(".todo__block")
      .querySelector(".todo__content").innerHTML = "";
    localStorage.setItem("elements", todoContainer.innerHTML);
    counters();
  }
});

function changeBlock(button, block) {
  let item = button.closest(".todo__item");
  block.append(item);
  localStorage.setItem("elements", todoContainer.innerHTML);
  counters();
}
// drag'n'drop
let todoBlocks = document.querySelectorAll(".todo__block");

todoBlocks.forEach((item) => {
  item.addEventListener("dragstart", function (event) {
    event.target.classList.add("dragnow");
  });
  item.addEventListener("dragend", function (event) {
    event.target.classList.remove("dragnow");
  });
  item.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  item.addEventListener("drop", function (event) {
    event.preventDefault();
    let dragTodo = document.querySelector(".dragnow");
    if (dragTodo != null) {
      let contentBlock = item.querySelector(".todo__content");
      contentBlock.append(dragTodo);
    }
    counters();
  });
});
//счетчики
function counters() {
  todoBlocks.forEach((item) => {
    let counter = item.querySelector(".todo__counter");
    let contentBlock = item.querySelector(".todo__content");
    counter.textContent = contentBlock.children.length;
  });
}
counters();
// открытие и редактирование задачи
let editModal = document.querySelector(".modal__edit");

todoContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("item__show")) {
    let itemTitle = event.target
      .closest(".todo__item")
      .querySelector(".todo__item__header").textContent;
    let itemdescription = event.target
      .closest(".todo__item")
      .querySelector(".todo__item__description").textContent;
    editModal.innerHTML = `
    <h2>${itemTitle}</h2>
            <p>${itemdescription}</p>
            <div class="modal__edit__buttons">
                <button type="button" class="modal__edit__editbtn">Редактировать</button>
                <button type="button" class="modal__cancel__editbtn">Закрыть</button>
            </div>
    `;
    let cancelEditModal = document.querySelector(".modal__cancel__editbtn");
    cancelEditModal.addEventListener("click", () => showModal(editModal));
    let editBtn = document.querySelector(".modal__edit__editbtn");
    editBtn.onclick = function () {
      editModal.innerHTML = `
        <label for="edit__header">Название</label>
    <input type="text" value="${itemTitle}" id="edit__header">
    <label for="edit__comment">Описание</label>
            <textarea id="edit__comment">${itemdescription}</textarea>
            <div class="modal__edit__buttons">
                <button type="button" class="modal__save__editbtn">Сохранить</button>
                <button type="button" class="modal__cancel__editbtn">Закрыть</button>
            </div>
    `;
      let cancelEditModal = document.querySelector(".modal__cancel__editbtn");
      cancelEditModal.addEventListener("click", () => showModal(editModal));
      let editHeaderInput = document.getElementById("edit__header");
      let editCommentInput = document.getElementById("edit__comment");
      let savelEditModal = document.querySelector(".modal__save__editbtn");
      savelEditModal.addEventListener("click", function () {
        event.target
          .closest(".todo__item")
          .querySelector(".todo__item__header").textContent =
          editHeaderInput.value;
        event.target
          .closest(".todo__item")
          .querySelector(".todo__item__description").textContent =
          editCommentInput.value;
        localStorage.setItem("elements", todoContainer.innerHTML);
        showModal(editModal);
      });
    };
    showModal(editModal);
  }
});
// блок о проекте
let aboutBtn = document.querySelector(".about__btn");
let aboutModal = document.querySelector(".modal__about");
let aboutCloseBtn = document.querySelector(".modal__about__closeBtn");
aboutBtn.addEventListener("click", () => showModal(aboutModal));
aboutCloseBtn.addEventListener("click", () => showModal(aboutModal));
// блок инструкция
let instructionBtn = document.querySelector(".instruction__btn");
let instructionModal = document.querySelector(".modal__instruction");
let instructionCloseBtn = document.querySelector(
  ".modal__instruction__closeBtn"
);
instructionBtn.addEventListener("click", () => showModal(instructionModal));
instructionCloseBtn.addEventListener("click", () =>
  showModal(instructionModal)
);
//бургер меню
let burgerMenu = document.querySelector(".burgermenu");
let navMenu = document.querySelector(".header_nav_list");
let header = document.querySelector(".header");
header.addEventListener("click", function (e) {
  if (
    e.target.closest(".burgermenu") ||
    e.target.closest(".header_nav_list_item")
  ) {
    burgerMenu.classList.toggle("active");
    navMenu.classList.toggle("active");
    header.classList.toggle("active")
    console.log(e.target);
  }
});
//поиск по задачам
let searchBtn = document.querySelector(".todo__searchbutton");
let searchInput = document.querySelector(".todo__searchInput");
let searchModal = document.querySelector(".modal__search");
searchBtn.onclick = function () {
  let allTasks = document.querySelectorAll(".todo__item");
  let searchModalStart = searchModal.innerHTML;
  let foundElement = Array.from(allTasks)
    .filter(
      (item) =>
        item
          .querySelector(".todo__item__header")
          .textContent.toLocaleLowerCase() ==
        searchInput.value.toLocaleLowerCase()
    )
    .map((item) => {
      let newElement = item.cloneNode(true);
      newElement
        .querySelectorAll("button")
        .forEach((button) => button.remove());
      return newElement;
    });
  if (foundElement.length > 0) {
    showModal(searchModal);
    searchModal.append(...foundElement);
  } else alert("Ничего не найдено");
  let searchCloseBtn = document.querySelector(".modal__search__closeBtn");
  searchCloseBtn.onclick = function () {
    searchModal.innerHTML = searchModalStart;
    showModal(searchModal);
  };
};
