const openForm = document.querySelector(".open-form");
const openFormBtn = document.querySelector("#open-form");
const formNew = document.querySelector(".form");
const closeBtn = document.querySelector("#close-btn");
const rightBtn = document.querySelector("#right");
const leftBtn = document.querySelector("#left");
const montherSpan = document.querySelector("#month");
const yearSpan = document.querySelector("#year");
const dateSchedule = document.querySelector("#date-schedule");
const sendBtn = document.querySelector("#send-btn");
const description = document.querySelector("#description");
const gridContainer = document.querySelector(".grid-container");
const searchDate = document.querySelector("#search-date");
const searchBtn = document.querySelector("#search-btn");

// localStorage
const saveData = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getItens = () => {
    data = JSON.parse(localStorage.getItem("tasks") || "[]");
    return data;
};

let tasks = getItens();

// função de inicialização
const initialize = () => {
    const dateActualy = new Date();
    montherSpan.innerText = dateActualy.getMonth() + 1;
    yearSpan.innerText = dateActualy.getFullYear();
    const tasksFilter = dateEqual(tasks, montherSpan, yearSpan);
    insertAndRemoveElement(tasksFilter);
};

// Funções
const formatDate = (date) => {
    // formata a data recebida do input para o padrão 19/10/2000
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

// Adiciona um 0 se o mês for menor que 10
const formatMonth = (month) => {
    if (month < 10) {
        return `0${month}`;
    }

    return month;
};

// fecha o formulario
const closeForm = () => {
    formNew.classList.add("hide");
    openForm.style.opacity = 1;
    openFormBtn.removeAttribute("disabled");
    rightBtn.removeAttribute("disabled");
    leftBtn.removeAttribute("disabled");
};

// cria um id único para cada item
const createId = (tasks) => {
    const ids = [];
    if (tasks.length !== 0) {
        tasks.forEach((task) => {
            ids.push(task.id);
        });

        return Math.max(...ids) + 1;
    }

    ids.push(0);
    return ids[0];
};

const message = (msg) => {
    alert(msg);
};

// deleta o item desejado
const deleteTask = (id, element) => {
    tasks = tasks.filter((task) => task.id !== id);
    saveData(tasks);
    gridContainer.removeChild(element);
    message("Tarefa deletada com sucesso!");
    const taskFilter = dateEqual(tasks, montherSpan, yearSpan);
    if (taskFilter.length === 0) {
        createP(taskFilter);
    }
};

// cria um card no html
const createBox = (task) => {
    const box = document.createElement("div");
    box.classList.add("box");
    const dateP = document.createElement("p");
    dateP.innerText = task.date;
    box.appendChild(dateP);
    const descriptionP = document.createElement("p");
    descriptionP.innerText = task.description;
    box.appendChild(descriptionP);
    const button = document.createElement("button");
    button.id = "delete";
    button.innerHTML = '<i class="bi bi-x-lg"></i>';
    button.addEventListener("click", () => {
        const confirmDelete = confirm(
            "Tem certeza que deseja deletar essa tarefa?"
        );
        if (confirmDelete) {
            deleteTask(task.id, box);
        }
    });
    box.appendChild(button);
    return box;
};

// cria um parágrafo quando não existe tarefa
const createP = (tasks) => {
    if (tasks.length === 0) {
        const p = document.createElement("p");
        p.innerText = "Não há tarefa agendada para esse mês";
        gridContainer.appendChild(p);
        return;
    }
};

// insere um elemento no html
const insertBox = (tasks) => {
    createP(tasks);
    tasks.forEach((task) => {
        element = createBox(task);
        gridContainer.appendChild(element);
    });
};

// procura dentro da lista de tarefas a data corta o dia e compara com mes e ano
const dateEqual = (tasks, montherSpan, yearSpan) => {
    const montherYear = `${montherSpan.innerText}/${yearSpan.innerText}`;
    tasksFilter = tasks.filter((task) => task.date.slice(3) === montherYear);
    return tasksFilter;
};

// remove o elemnto do html
const removeElements = () => {
    elementos = gridContainer.childNodes;
    for (i = elementos.length - 1; i >= 0; i--) {
        gridContainer.removeChild(elementos[i]);
    }
};

// remove os elementos anteriores e adiciona novas
const insertAndRemoveElement = (tasks) => {
    removeElements();
    insertBox(tasks);
};

// função de pesquisa por data
const searchDateFunction = () => {
    if (!searchDate.value) {
        message("Por favor escolha uma data para pesquisar.");
        return;
    }
    const search = formatDate(searchDate.value);
    const filterTasks = tasks.filter((task) => task.date === search);
    insertAndRemoveElement(filterTasks);
    montherSpan.innerText = search.slice(3, 5);
    yearSpan.innerText = search.slice(6);
};

// eventos
searchBtn.addEventListener("click", () => {
    searchDateFunction();
});

searchDate.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchDateFunction();
    }
});

openForm.addEventListener("click", () => {
    formNew.classList.remove("hide");
    openForm.style.opacity = 0;
    openFormBtn.setAttribute("disabled", "");
    rightBtn.setAttribute("disabled", "");
    leftBtn.setAttribute("disabled", "");
});

closeBtn.addEventListener("click", () => {
    closeForm();
    dateSchedule.value = "";
    description.value = "";
});

rightBtn.addEventListener("click", () => {
    let monthValue = +montherSpan.innerText;
    let yearValue = +yearSpan.innerText;
    if (monthValue >= 12) {
        monthValue = 1;
        yearValue += 1;
        yearSpan.innerText = yearValue;
        montherSpan.innerText = formatMonth(monthValue);
        tasksFilter = dateEqual(tasks, montherSpan, yearSpan);
        insertAndRemoveElement(tasksFilter);
        searchDate.value = "";
        return;
    }
    monthValue += 1;
    montherSpan.innerText = formatMonth(monthValue);
    tasks_teste = dateEqual(tasks, montherSpan, yearSpan);
    insertAndRemoveElement(tasksFilter);
    searchDate.value = "";
});

leftBtn.addEventListener("click", () => {
    let monthValue = +montherSpan.innerText;
    let yearValue = +yearSpan.innerText;
    if (monthValue <= 1) {
        monthValue = 12;
        yearValue -= 1;
        yearSpan.innerText = yearValue;
        montherSpan.innerText = formatMonth(monthValue);
        montherSpan.innerText = formatMonth(monthValue);
        tasksFilter = dateEqual(tasks, montherSpan, yearSpan);
        insertAndRemoveElement(tasksFilter);
        searchDate.value = "";
        return;
    }
    monthValue -= 1;
    montherSpan.innerText = formatMonth(monthValue);
    tasksFilter = dateEqual(tasks, montherSpan, yearSpan);
    insertAndRemoveElement(tasksFilter);
    searchDate.value = "";
});

sendBtn.addEventListener("click", () => {
    if (!dateSchedule.value) {
        message("Por favor a data é obrigatória.");
        return;
    }

    if (!description.value) {
        message("Por favor a descrição é obrigatória");
        return;
    }

    const obj = {
        id: createId(tasks),
        date: formatDate(dateSchedule.value),
        description: description.value,
    };

    const monthYear = `${montherSpan.innerText}/${yearSpan.innerText}`;

    dateSchedule.value = "";
    description.value = "";

    tasks.push(obj);
    saveData(tasks);
    closeForm();
    message("Compromisso agendado com sucesso.");
    if (obj.date.slice(3) !== monthYear) return;
    p = gridContainer.children[0];
    if (p.innerHTML === "Não há tarefa agendada para esse mês") {
        gridContainer.removeChild(p);
    }
    element = createBox(obj);
    gridContainer.appendChild(element);
});

initialize();
