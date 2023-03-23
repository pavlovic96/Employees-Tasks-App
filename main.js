import Employee from "./employee.js";
import Task from "./task.js";

let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let date = document.querySelector("#date-of-birth");
let email = document.querySelector("#email");
let submitEmployee = document.querySelector("#add-employee");
let formEmployee = document.querySelector("#form-employee");

let title = document.querySelector("#title");
let description = document.querySelector("#description");
let assignee = document.querySelector("#assignee");
let dueDate = document.querySelector("#due-date");
let submitTask = document.querySelector("#add-task");
let formTask = document.querySelector("#form-task");

submitTask.addEventListener("click", (e) => {
  e.preventDefault();

  let newTask = new Task(
    title.value,
    description.value,
    assignee.value,
    dueDate.value
  );

  newTask
    .addTask()
    .then((res) => {
      console.log(res);
      formTask.reset();
    })
    .catch((er) => {
      console.log(er);
    });
});

submitEmployee.addEventListener("click", (e) => {
  e.preventDefault();

  let newEmpl = new Employee(
    name.value,
    surname.value,
    date.value,
    email.value
  );

  newEmpl
    .addEmployee()
    .then((res) => {
      console.log(res);
      formEmployee.reset();
    })
    .catch((er) => {
      console.log(er);
    });
  console.log(date.value);
});

let ul = document.querySelector(".nav");
let sections = document.querySelectorAll("section");

if (localStorage.getItem("page")) {
  sections.forEach((section) => {
    section.style.display = "none";
  });

  sections.forEach((section) => {
    if (section.getAttribute("id") === localStorage.getItem("page")) {
      section.style.display = "block";
    }
  });
}

ul.addEventListener("click", (e) => {
  let li = e.target;
  console.log(li.getAttribute("data"));
  sections.forEach((section) => {
    section.style.display = "none";
  });

  sections.forEach((section) => {
    if (section.getAttribute("id") === li.getAttribute("data")) {
      section.style.display = "block";
      localStorage.setItem("page", li.getAttribute("data"));
    }
  });
});
