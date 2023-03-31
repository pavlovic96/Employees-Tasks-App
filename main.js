import Employee from "./employee.js";
import Task from "./task.js";
import List from "./list.js";
import Search from "./search.js";

let mainUl = document.querySelector("#main-list");

let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let username = document.querySelector("#username");
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
let searchBtn = document.querySelector("#search-btn");
let searchInput = document.querySelector("#search-input");
let searchDiv = document.querySelector(".search-area");
let searchList = document.querySelector(".search-list");
let closeSearch = document.querySelector(".close");

let list = new List(mainUl);

list.getEmployees();

//Search area
searchInput.addEventListener("focus", (e) => {
  searchList.innerHTML = "";
  if (localStorage.getItem("page") === "employee") {
    let searchResult = new Search(localStorage.getItem("page"), searchList);
    searchResult.searchEmployees();
    searchDiv.style.display = "block";
    searchInput.addEventListener("input", (e) => {
      searchResult.filterData(e.target.value);
    });
  } else {
    console.log("Task");
  }
});

closeSearch.addEventListener("click", () => {
  searchDiv.style.display = "none";
});

//Create a task
submitTask.addEventListener("click", (e) => {
  e.preventDefault();

  let newTask = new Task(
    title.value,
    description.value,
    assignee.value,
    dueDate.value
  );

  //Adding task to an assignee
  newTask
    .addTask()
    .then(() => {
      formTask.reset();
      return newTask.updateTask();
    })
    .then(() => {
      //get data for that employee and update tasksLength
      return db.collection("employees").doc(newTask.assignee).get();
    })
    .then((res) => {
      let data = res.data();
      let length = data.tasks.length;
      db.collection("employees").doc(res.id).update({
        tasksLength: length,
      });
    })
    .then(() => {
      console.log("Everything updated");
      list.resetList();
      list.getEmployees();
    })
    .catch((er) => {
      console.log(er);
    });
});

//Create an employee
submitEmployee.addEventListener("click", (e) => {
  e.preventDefault();

  let newEmpl = new Employee(
    name.value,
    surname.value,
    username.value,
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

//Navbar

let ul = document.querySelector(".navbar-nav");
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".nav-link");
let search = document.querySelector(".find");

if (localStorage.getItem("page")) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  search.classList.remove();

  if (localStorage.getItem("page") === "home-page") {
    search.classList.add("d-none");
  } else {
    search.classList.add("d-flex");
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
  searchDiv.style.display = "none";
  searchList.innerHTML = "";
  search.classList.remove("d-flex");
  search.classList.remove("d-none");

  if (a.getAttribute("data") === "home-page") {
    search.classList.add("d-none");
  } else {
    search.classList.add("d-flex");
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
