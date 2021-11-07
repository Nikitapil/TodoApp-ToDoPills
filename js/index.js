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
const notesList = document.querySelector('.notes__list')
// localStorage.setItem("noteList", notesList.innerHTML)
if (localStorage.getItem("noteList")) {
  notesList.innerHTML = localStorage.getItem("noteList");
}
const eventsList = document.querySelector('.events__list')
if (localStorage.getItem("eventList")) {
  eventsList.innerHTML = localStorage.getItem("eventList");
  let eventItems = document.querySelectorAll('.events__list__item')
  eventItems.forEach ((item)=> {
    setCountDown (item)
    let timer = setInterval(() => setCountDown (item), 1000)
  })
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
const eventCheckbox = document.querySelector('.modal__add__checkbox-input')
const todoDateInput = document.querySelector('.modal__add__date')
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
  if (eventCheckbox.checked) {
    if (titleInput.value && todoDateInput.value) {
      createNote(titleInput, todoDateInput)
    }
    else {
      alert('Чтобы добавить задачу в событие введите название и выберите дату')
      return
    }
  }
  mainBlock.append(todoItem);
  showModal(addModal);
  titleInput.value = ""
  descriptionInput.value =""
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
    header.classList.toggle("active");
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
// калькулятор
const calcButtons = document.querySelector(".calc__buttons");
const calcScreen = document.querySelector(".calc__input");
const calcOutput = document.querySelector(".calc__output");
const modalCalc = document.querySelector(".modal__calc");
document.addEventListener("click", function (e) {
  if (e.target.closest(".calc__open")) {
    showModal(modalCalc);
  }
  if (e.target.closest(".modal__calc__closeBtn")) {
    showModal(modalCalc);
  }
});
calcButtons.addEventListener("click", function (e) {
  let targetEl = e.target;
  if (targetEl.closest(".calc__btn")) {
    calcScreen.value += targetEl.value;
    calcOutput.textContent += targetEl.value;
  }
  if (targetEl.closest(".calc__delall")) {
    calcOutput.textContent = calcOutput.textContent.slice(0, -1);
    calcScreen.value = calcScreen.value.slice(0, -1);
  }
  if (targetEl.closest(".calc__del")) {
    calcScreen.value = "";
    calcOutput.textContent = "";
  }
  if (targetEl.closest(".calc__funcbtn")) {
    const funcBtnArr = Array.from(
      document.querySelectorAll(".calc__funcbtn")
    ).map((item) => item.value);
    let finalSymbol = calcOutput.textContent[calcOutput.textContent.length - 1];
    console.log(funcBtnArr.includes(finalSymbol));
    if (funcBtnArr.includes(finalSymbol)) {
      calcOutput.textContent = calcOutput.textContent.slice(0, -1);
      calcOutput.textContent += targetEl.value;
      calcScreen.value = "";
    } else if (calcOutput.textContent == "") {
      return;
    } else {
      calcOutput.textContent += targetEl.value;
      calcScreen.value = "";
    }
  }
  if (targetEl.closest(".calc__ebtn")) {
    let calcResult = calcOutput.textContent.replace("%", "/100*");
    if (calcScreen.value.includes(".")) {
      calcScreen.value = eval(calcResult).toFixed(5);
    } else {
      calcScreen.value = eval(calcResult);
    }
    calcOutput.textContent = calcScreen.value;
  }
});
// заметки
const notes = document.querySelector(".notes");
const notesAddBtn = document.querySelector('.notes__creator__newbtn')
const notesCreator = document.querySelector('.notes__creator__body')
const modalEditor = document.querySelector('.modal__notes-editor')
notes.addEventListener("click", function (e) {
  let targetEl = e.target;
  if (targetEl.closest(".notes__creator__newbtn") || targetEl.closest(".creator__cancel-btn")) {
    toggleHidden(notesAddBtn)
    toggleHidden(notesCreator)
  }
  if (targetEl.closest(".creator__save-btn")) {
    const notesTitleInput = document.querySelector('.creator__body__title')
    const notesTextInput = document.querySelector('.creator__body__text')
    let newNote = document.createElement('li')
    newNote.classList.add("notes__list__item")
    newNote.innerHTML = `<h3 class="notes__item__title">${notesTitleInput.value ? notesTitleInput.value: "Заметка"}</h3>
    <p class="notes__item__text">${notesTextInput.value}</p>
    <button class="notes__del-btn"></button>
    `
    notesList.append(newNote)
    notesTitleInput.value = ""
    notesTextInput.value = ""
    toggleHidden(notesAddBtn)
    toggleHidden(notesCreator)
    localStorage.setItem("noteList", notesList.innerHTML)
  }
  if (targetEl.closest(".notes__del-btn")) {
    targetEl.closest(".notes__list__item").remove()
    localStorage.setItem("noteList", notesList.innerHTML)
  }
  if (targetEl.closest(".notes__list__item") && !targetEl.closest(".notes__del-btn")) {
    let currentNote = targetEl.closest(".notes__list__item")
    const notesEditorTitle = document.querySelector('.notes-editor__title')
    const notesEditorText = document.querySelector('.notes__editor__text')
    const notesEditorSave = document.querySelector('.notes-editor__savebtn')
    const notesEditorCancel = document.querySelector('.notes-editor__cancelbtn')
    notesEditorTitle.value = currentNote.querySelector(".notes__item__title").textContent
    notesEditorText.value = currentNote.querySelector(".notes__item__text").textContent
    showModal(modalEditor)
    notesEditorSave.onclick = function () {
      currentNote.querySelector(".notes__item__title").textContent = notesEditorTitle.value
      currentNote.querySelector(".notes__item__text").textContent = notesEditorText.value
      notesList.prepend(currentNote)
      localStorage.setItem("noteList", notesList.innerHTML)
      showModal(modalEditor)
    }
    notesEditorCancel.onclick = function () {
      showModal(modalEditor)
    }
  }
});
function toggleHidden(element) {
element.classList.toggle("hidden")
}
// События
const events = document.querySelector('.events')
const eventsAddbtn = document.querySelector('.events__creator__newbtn')
const eventsCreator = document.querySelector('.events__creator__body')
const dateOptions = {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }
events.addEventListener('click', function (e) {
  let targetEl = e.target;
  if (targetEl.closest(".events__creator__newbtn") || targetEl.closest(".events__cancel-btn")){
    toggleHidden(eventsAddbtn) 
    toggleHidden(eventsCreator)
  }
  if (targetEl.closest(".events__save-btn")) {
    const eventsTitleInput = document.querySelector('.events__creator__title')
    const eventsDateInput = document.querySelector('.events__creator__date')
    if (eventsTitleInput.value && eventsDateInput.value) {
      createNote(eventsTitleInput, eventsDateInput)
    }
    else {
      alert('Заполнены не все поля')
    }
  }
  if (targetEl.closest(".events__del-btn")) {
    targetEl.closest('.events__list__item').remove()
    localStorage.setItem('eventList', eventsList.innerHTML)
  }
})
function createNote (titleInput, dateInput) {

  let newEvent = document.createElement('li')
  newEvent.classList.add("events__list__item")
  newEvent.setAttribute('data-date', new Date(dateInput.value))
  newEvent.innerHTML = `<h3 class="events__item__title">${titleInput.value}</h3>
  <p class="events__item__text">${new Date(dateInput.value).toLocaleDateString('ru-RU', dateOptions)}</p>
  <p class="events__item__countdown"></p>
  <button class="events__del-btn"></button>`
  setCountDown (newEvent)
  let timer = setInterval(() => setCountDown (newEvent), 1000)
  eventsList.append(newEvent)
  titleInput.value = ""
  dateInput.value = ""
  toggleHidden(eventsAddbtn) 
    toggleHidden(eventsCreator)
    localStorage.setItem('eventList', eventsList.innerHTML)
}
function setCountDown (element) {
  let countDownOutput = element.querySelector('.events__item__countdown')
  let today = new Date()
  let endday = new Date (element.dataset.date)
  if (endday>today) {
  today = Math.floor((endday - today) / 1000);
  let secDown = today % 60;
  today = Math.floor(today / 60);
  let minDown = today % 60;
  today = Math.floor(today / 60);
  let hDown = today % 24;
  today = Math.floor(today / 24);
  countDownOutput.textContent = "До события:  " +
  today +
  " Дней " +
  hDown +
  " Часов " +
  minDown +
  " минут "+
  secDown +
  "секунд"
  }
  else {
    countDownOutput.textContent = 'Завершено'
    countDownOutput.style.color = 'red'
  }
}
// кнопка прокрутки
const scrollbtn = document.querySelector('.scroll-btn')
document.addEventListener('scroll', function () {
  const scrollbtn = document.querySelector('.scroll-btn')
  if (window.pageYOffset > 0) {
    scrollbtn.classList.remove('hidden')
    scrollbtn.addEventListener('click', function () {
      window.scrollTo({
        top:0,
        behavior: "smooth"
      })
    })
  }
  else {
    scrollbtn.classList.add('hidden')
  }
})
// часы
const timeSelect = document.querySelector('.clock__timezoes')
const timeOutput = document.querySelector('.time-output')
const loader = document.querySelector('.loader')
async function getTimeZones() {
  let response = await fetch('https://worldtimeapi.org/api/timezone')
  if (response.ok) {
    let timeZones = await response.json()
    timeZones.map((item)=> {
      let timeZ = new Option(item, item)
      timeSelect.append(timeZ)
    })
  }
}
getTimeZones()
/* let timeUrl = 'http://worldtimeapi.org/api/Europe/London' */
async function getTime () {
  let url = ''
  if (timeSelect.value) {
    url = `https://worldtimeapi.org/api/${timeSelect.value}`
  }
  else {
    url = `https://worldtimeapi.org/api/ip`
  }
  let response = await fetch(url)
  if (response.ok) {
    let timeObj = await response.json()
    let time = new Date(timeObj.datetime).toLocaleString('ru-Ru',{
      timeZone: timeObj.timezone,
      hour: 'numeric', 
      minute: 'numeric'
    })
    timeOutput.textContent = time
    console.log(time);
    console.log(timeObj);
    let refresher = setTimeout(getTime , 30000)
  }
  else {
    timeOutput.textContent = new Date().toLocaleString('ru-Ru',{
      timeZone: timeObj.timezone,
      hour: 'numeric', 
      minute: 'numeric'
    })
  }
  loader.style.display = 'none'
}
getTime ()
timeSelect.addEventListener('change', function(){
  loader.style.display = 'block'
  getTime()
})