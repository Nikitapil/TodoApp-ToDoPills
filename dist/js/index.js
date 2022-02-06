//открывание модальных окон
let todos = []
let notesData = []
const modalContainer = document.querySelector(".modal__container");
const todoContainer = document.querySelector(".todo__container");
const addButton = document.querySelector(".todo__addBtn");
const addModal = document.querySelector(".modal__add");
const addModalCancel = document.querySelector(".modal__cancel__addbtn");
const addItemBtn = document.querySelector(".modal__add__addbtn");
const eventCheckbox = document.querySelector('.modal__add__checkbox-input')
const todoDateInput = document.querySelector('.modal__add__date');
const deleteModal = document.querySelector(".modal__delete");
const delCancelBtn = document.querySelector(".modal__delete__cancelbtn");
const todoBlocks = document.querySelectorAll(".todo__block");
const editModal = document.querySelector(".modal__edit");
const aboutBtn = document.querySelector(".about__btn");
const aboutModal = document.querySelector(".modal__about");
const aboutCloseBtn = document.querySelector(".modal__about__closeBtn");
const instructionBtn = document.querySelector(".instruction__btn");
const instructionModal = document.querySelector(".modal__instruction");
const instructionCloseBtn = document.querySelector(
    ".modal__instruction__closeBtn"
);
const burgerMenu = document.querySelector(".burgermenu");
const navMenu = document.querySelector(".header_nav_list");
const header = document.querySelector(".header");
const searchBtn = document.querySelector(".todo__searchbutton");
const notesList = document.querySelector('.notes__list')
const renderNote = () => {
    notesList.innerHTML = ''
    notesData.forEach(note => {
        const newNote = document.createElement('li')
        newNote.id = note.id
        newNote.classList.add("notes__list__item")
        newNote.innerHTML = `<h3 class="notes__item__title">${note.title ? note.title : "Заметка"}</h3>
    <p class="notes__item__text">${note.body}</p>
    <button class="notes__del-btn"></button>
    `
        notesList.append(newNote)
    })
}
const showModal = (modal) => {
    modalContainer.classList.toggle("hidden");
    modal.classList.toggle("hidden");
}
const toggleHidden = (element) => {
    element.classList.toggle("hidden")
}
const renderTodo = () => {
    const blocks = {
        mainBlock: document.querySelector(".todo__main__content"),
        inprogressBlock: document.querySelector(".todo__inprogress__content"),
        doneBlock: document.querySelector(".todo__done__content"),
        trashBlock: document.querySelector(".todo__trash__content"),
    }
    Object.values(blocks).forEach(block => {
        block.innerHTML = ''
    })
    todos.forEach(todo => {
        const todoItem = document.createElement("div");
        todoItem.id = todo.id
        todoItem.draggable = true;
        todoItem.classList.add("todo__item");
        todoItem.innerHTML = `<h4 class="todo__item__header">${todo.title}</h4>
    <div class="todo__item__buttons">
        <button class="inprogress__button" title="В процессе"></button>
        <button class="delete__button" title="Удалить"></button>
        <button class="inmain__button" title="В невыполненные"></button>
        <button class="indone__button" title="В выполненные"></button>
    </div>
    <p class="todo__item__description">${todo.description}</p>
    <p class="todo__item__date">${todo.currentDate}</p>
    <button class="item__show"><span>Показать</span></button>`;
        blocks[todo.block].append(todoItem)
    })
}
//счетчики
const counters = () => {
    todoBlocks.forEach((item) => {
        const counter = item.querySelector(".todo__counter");
        const contentBlock = item.querySelector(".todo__content");
        counter.textContent = contentBlock.children.length.toString();
    });
}

const addItem = () => {
    const titleInput = document.querySelector(".todo__title__input");
    const descriptionInput = document.querySelector(".todo__comment__input");
    const data = new Date();
    const dataContent = data.getDate() + "." + (data.getMonth() + 1) + "." + data.getFullYear();
    const newTodo = new Todo(dataContent, titleInput.value, descriptionInput.value, 'mainBlock')
    todos.push(newTodo)
    renderTodo()
    if (eventCheckbox.checked) {
        if (titleInput.value && todoDateInput.value) {
            createNote(titleInput, todoDateInput)
        } else {
            alert('Чтобы добавить задачу в событие введите название и выберите дату')
            return
        }
    }
    showModal(addModal);
    titleInput.value = ""
    descriptionInput.value = ""
    localStorage.setItem("todos", JSON.stringify(todos));
    counters();
}
const changeBlock = (button, block) => {
    const item = button.closest(".todo__item");
    todos = todos.map(todo => {
        if (todo.id === item.id) {
            todo.block = block
        }
        return todo
    })
    item.remove()
    console.log(todos)
    renderTodo()
    localStorage.setItem("todos", JSON.stringify(todos));
    counters();
}

const uid = () => {
    const head = Date.now().toString(36)
    const tail = Math.random().toString(36).substr(2)
    return head + tail
}

//подгрузка данных из localStarage
if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'))
    renderTodo()
    counters();
}

if (localStorage.getItem("noteList")) {
    notesData = JSON.parse(localStorage.getItem('noteList'))
    renderNote()
}
const eventsList = document.querySelector('.events__list')
if (localStorage.getItem("eventList")) {
    eventsList.innerHTML = localStorage.getItem("eventList");
    let eventItems = document.querySelectorAll('.events__list__item')
    eventItems.forEach((item) => {
        setCountDown(item)
        let timer = setInterval(() => setCountDown(item), 1000)
    })
}
// модальное окно для добавления элемента
addButton.addEventListener("click", () => showModal(addModal));
addModalCancel.addEventListener("click", () => showModal(addModal));
//Добавление задачи
addItemBtn.addEventListener("click", addItem);

class Todo {
    constructor(currentDate, title, description, block = 'mainBlock') {
        this.title = title
        this.description = description;
        this.currentDate = currentDate;
        this.block = block
        this.id = uid()
    }
}

//переброс элемента в в другие блоки
delCancelBtn.addEventListener("click", () => showModal(deleteModal));
todoContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("inprogress__button")) {
        changeBlock(event.target, 'inprogressBlock');
    } else if (event.target.classList.contains("inmain__button")) {
        changeBlock(event.target, 'mainBlock');
    } else if (event.target.classList.contains("indone__button")) {
        changeBlock(event.target, 'doneBlock');
    } else if (event.target.classList.contains("delete__button")) {
        if (
            event.target
                .closest(".todo__item")
                .parentElement.classList.contains("todo__trash__content")
        ) {
            showModal(deleteModal);
            const delBtn = document.querySelector(".modal__delete__deletebtn");
            delBtn.onclick = () => {
                const id = event.target.closest(".todo__item").id;
                todos = todos.filter(todo => todo.id !== id)
                renderTodo()
                localStorage.setItem("todos", JSON.stringify(todos));
                counters();
                showModal(deleteModal);
            };
        } else {
            changeBlock(event.target, 'trashBlock');
        }
    } else if (event.target.classList.contains("todo__clear")) {
        const id = event.target.closest(".todo__block").id;
        todos = todos.filter(todo => todo.block !== id)
        renderTodo()
        localStorage.setItem("todos", JSON.stringify(todos));
        counters();
    }
});


// drag'n'drop

todoBlocks.forEach((item) => {
    item.addEventListener("dragstart", (event) => {
        event.target.classList.add("dragnow");
    });
    item.addEventListener("dragend", (event) => {
        event.target.classList.remove("dragnow");
    });
    item.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
    item.addEventListener("drop", (event) => {
        event.preventDefault();
        const dragTodo = document.querySelector(".dragnow");
        todos = todos.map(todo => {
            if (todo.id === dragTodo.id) {
                todo.block = item.id
            }
            return todo
        })
        renderTodo()
        localStorage.setItem("todos", JSON.stringify(todos));
        counters();
    });
});


// открытие и редактирование задачи

todoContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("item__show")) {
        const itemTitle = event.target
            .closest(".todo__item")
            .querySelector(".todo__item__header").textContent;
        const itemdescription = event.target
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
        const cancelEditModal = document.querySelector(".modal__cancel__editbtn");
        cancelEditModal.addEventListener("click", () => showModal(editModal));
        const editBtn = document.querySelector(".modal__edit__editbtn");
        editBtn.onclick = () => {
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
            const cancelEditModal = document.querySelector(".modal__cancel__editbtn");
            cancelEditModal.addEventListener("click", () => showModal(editModal));
            const editHeaderInput = document.getElementById("edit__header");
            const editCommentInput = document.getElementById("edit__comment");
            const savelEditModal = document.querySelector(".modal__save__editbtn");
            savelEditModal.addEventListener("click", () => {
                const id = event.target
                    .closest(".todo__item").id
                todos = todos.map(todo => {
                    if (todo.id === id) {
                        todo.title = editHeaderInput.value;
                        todo.description = editCommentInput.value;
                    }
                    return todo
                })
                renderTodo()
                localStorage.setItem("todos", JSON.stringify(todos));
                showModal(editModal);
            });
        };
        showModal(editModal);
    }
});
// блок о проекте
aboutBtn.addEventListener("click", () => showModal(aboutModal));
aboutCloseBtn.addEventListener("click", () => showModal(aboutModal));
// блок инструкция
instructionBtn.addEventListener("click", () => showModal(instructionModal));
instructionCloseBtn.addEventListener("click", () =>
    showModal(instructionModal)
);
//бургер меню
header.addEventListener("click", (e) => {
    if (
        e.target.closest(".burgermenu") ||
        e.target.closest(".header_nav_list_item")
    ) {
        burgerMenu.classList.toggle("active");
        navMenu.classList.toggle("active");
        header.classList.toggle("active");
    }
});
//поиск по задачам

searchBtn.onclick = () => {
    const searchInput = document.querySelector(".todo__searchInput");
    const searchModal = document.querySelector(".modal__search");
    const allTasks = document.querySelectorAll(".todo__item");
    const searchModalStart = searchModal.innerHTML;
    const foundElement = Array.from(allTasks)
        .filter(
            (item) =>
                item
                    .querySelector(".todo__item__header")
                    .textContent.toLocaleLowerCase() ===
                searchInput.value.toLocaleLowerCase()
        )
        .map((item) => {
            const newElement = item.cloneNode(true);
            newElement
                .querySelectorAll("button")
                .forEach((button) => button.remove());
            return newElement;
        });
    if (foundElement.length > 0) {
        showModal(searchModal);
        searchModal.append(...foundElement);
    } else alert("Ничего не найдено");
    const searchCloseBtn = document.querySelector(".modal__search__closeBtn");
    searchCloseBtn.onclick = () => {
        searchModal.innerHTML = searchModalStart;
        showModal(searchModal);
    };
};
// калькулятор
const calcButtons = document.querySelector(".calc__buttons");
const calcScreen = document.querySelector(".calc__input");
const calcOutput = document.querySelector(".calc__output");
const modalCalc = document.querySelector(".modal__calc");
document.addEventListener("click", (e) => {
    if (e.target.closest(".calc__open")) {
        showModal(modalCalc);
    }
    if (e.target.closest(".modal__calc__closeBtn")) {
        showModal(modalCalc);
    }
});
calcButtons.addEventListener("click", (e) => {
    const targetEl = e.target;
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
        const calcResult = calcOutput.textContent.replace("%", "/100*");
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

class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
        this.id = uid()
    }
}


notes.addEventListener("click", (e) => {
    const targetEl = e.target;
    if (targetEl.closest(".notes__creator__newbtn") || targetEl.closest(".creator__cancel-btn")) {
        toggleHidden(notesAddBtn)
        toggleHidden(notesCreator)
    }
    if (targetEl.closest(".creator__save-btn")) {
        const notesTitleInput = document.querySelector('.creator__body__title')
        const notesTextInput = document.querySelector('.creator__body__text')
        const note = new Note(notesTitleInput.value, notesTextInput.value)
        notesData.push(note)
        renderNote()
        notesTitleInput.value = ""
        notesTextInput.value = ""
        toggleHidden(notesAddBtn)
        toggleHidden(notesCreator)
        localStorage.setItem("noteList", JSON.stringify(notesData))
    }
    if (targetEl.closest(".notes__del-btn")) {
        const id = targetEl.closest(".notes__list__item").id
        notesData = notesData.filter(note => note.id !== id)
        renderNote()
        localStorage.setItem("noteList", JSON.stringify(notesData))
    }
    if (targetEl.closest(".notes__list__item") && !targetEl.closest(".notes__del-btn")) {
        const currentNote = targetEl.closest(".notes__list__item")
        const notesEditorTitle = document.querySelector('.notes-editor__title')
        const notesEditorText = document.querySelector('.notes__editor__text')
        const notesEditorSave = document.querySelector('.notes-editor__savebtn')
        const notesEditorCancel = document.querySelector('.notes-editor__cancelbtn')
        notesEditorTitle.value = currentNote.querySelector(".notes__item__title").textContent
        notesEditorText.value = currentNote.querySelector(".notes__item__text").textContent
        showModal(modalEditor)
        notesEditorSave.onclick = () => {
            notesData = notesData.map(note => {
                if (note.id === currentNote.id) {
                    note.title = notesEditorTitle.value
                    note.body = notesEditorText.value
                }
                return note
            })
            renderNote()
            localStorage.setItem("noteList", JSON.stringify(notesData))
            showModal(modalEditor)
        }
        notesEditorCancel.onclick = function () {
            showModal(modalEditor)
        }
    }
});

// События
const events = document.querySelector('.events')
const eventsAddbtn = document.querySelector('.events__creator__newbtn')
const eventsCreator = document.querySelector('.events__creator__body')
const dateOptions = {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
events.addEventListener('click', function (e) {
    let targetEl = e.target;
    if (targetEl.closest(".events__creator__newbtn") || targetEl.closest(".events__cancel-btn")) {
        toggleHidden(eventsAddbtn)
        toggleHidden(eventsCreator)
    }
    if (targetEl.closest(".events__save-btn")) {
        const eventsTitleInput = document.querySelector('.events__creator__title')
        const eventsDateInput = document.querySelector('.events__creator__date')
        if (eventsTitleInput.value && eventsDateInput.value) {
            createNote(eventsTitleInput, eventsDateInput)
        } else {
            alert('Заполнены не все поля')
        }
    }
    if (targetEl.closest(".events__del-btn")) {
        targetEl.closest('.events__list__item').remove()
        localStorage.setItem('eventList', eventsList.innerHTML)
    }
})


function createNote(titleInput, dateInput) {

    let newEvent = document.createElement('li')
    newEvent.classList.add("events__list__item")
    newEvent.setAttribute('data-date', new Date(dateInput.value))
    newEvent.innerHTML = `<h3 class="events__item__title">${titleInput.value}</h3>
  <p class="events__item__text">${new Date(dateInput.value).toLocaleDateString('ru-RU', dateOptions)}</p>
  <p class="events__item__countdown"></p>
  <button class="events__del-btn"></button>`
    setCountDown(newEvent)
    let timer = setInterval(() => setCountDown(newEvent), 1000)
    eventsList.append(newEvent)
    titleInput.value = ""
    dateInput.value = ""
    toggleHidden(eventsAddbtn)
    toggleHidden(eventsCreator)
    localStorage.setItem('eventList', eventsList.innerHTML)
}

function setCountDown(element) {
    let countDownOutput = element.querySelector('.events__item__countdown')
    let today = new Date()
    let endday = new Date(element.dataset.date)
    if (endday > today) {
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
            " минут " +
            secDown + " " +
            "секунд"
    } else {
        countDownOutput.textContent = 'Завершено'
        countDownOutput.style.color = 'red'
    }
}

// кнопка прокрутки
document.addEventListener('scroll', function () {
    const scrollbtn = document.querySelector('.scroll-btn')
    if (window.pageYOffset > 0) {
        scrollbtn.classList.remove('hidden')
        scrollbtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    } else {
        scrollbtn.classList.add('hidden')
    }
})
// часы
const timeSelect = document.querySelector('.clock__timezoes')
const timeOutput = document.querySelector('.time-output')
const loader = document.querySelector('.loader')

async function getTimeZones() {
    try {
        let response = await fetch('https://worldtimeapi.org/api/timezone')
        if (response.ok) {
            let timeZones = await response.json()
            timeZones.map((item) => {
                let timeZ = new Option(item, item)
                timeSelect.append(timeZ)
            })
        }
    } catch (e) {
        timeSelect.remove()
    }
}

getTimeZones()

async function getTime() {
    let url = ''
    if (timeSelect.value) {
        url = `https://worldtimeapi.org/api/${timeSelect.value}`
    } else {
        url = `https://worldtimeapi.org/api/ip`
    }
    try {
        let response = await fetch(url)
        if (response.ok) {
            let timeObj = await response.json()
            let time = new Date(timeObj.datetime).toLocaleString('ru-Ru', {
                timeZone: timeObj.timezone,
                hour: 'numeric',
                minute: 'numeric'
            })
            timeOutput.textContent = time
            console.log(time);
            console.log(timeObj);
            let refresher = setTimeout(getTime, 30000)
        }
    } catch (e) {
        timeOutput.textContent = new Date().toLocaleString('ru-Ru', {
            hour: 'numeric',
            minute: 'numeric'
        })
    }
    loader.style.display = 'none'
}

getTime()
timeSelect.addEventListener('change', function () {
    loader.style.display = 'block'
    getTime()
})
