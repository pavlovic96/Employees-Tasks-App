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

let ul = document.querySelector(".navbar-nav");
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".nav-link");
let search = document.querySelector(".find");

if (localStorage.getItem("page")) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  search.classList.remove("d-flex");
  search.classList.remove("d-none");

  if (localStorage.getItem("page") === "home-page") {
    search.classList.add("d-none");
    console.log(search);
  } else {
    search.classList.add("d-flex");
    console.log(search);
  }

  navLinks.forEach((link) => {
    if (link.getAttribute("data") === localStorage.getItem("page")) {
      link.classList.add("active");
    }
  });

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
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  let a = e.target;
  a.classList.add("active");

  search.classList.remove("d-flex");
  search.classList.remove("d-none");

  if (a.getAttribute("data") === "home-page") {
    search.classList.add("d-none");
    console.log(search);
  } else {
    search.classList.add("d-flex");
    console.log(search);
  }

  sections.forEach((section) => {
    section.style.display = "none";
  });

  sections.forEach((section) => {
    if (section.getAttribute("id") === a.getAttribute("data")) {
      section.style.display = "block";
      localStorage.setItem("page", a.getAttribute("data"));
    }
  });
});
