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
let searchInput = document.querySelector("#search-input");
let searchDiv = document.querySelector(".search-area");
let searchList = document.querySelector(".search-list");

let list = new List(mainUl);
list.getEmployees();

let searchResult = "";
let taskID = "";

//Search area
searchInput.addEventListener("click", (e) => {
  if (window.getComputedStyle(searchDiv).display !== "block") {
    searchList.innerHTML = "";
    if (localStorage.getItem("page") === "employee") {
      searchResult = new Search(localStorage.getItem("page"), searchList);
      searchResult.searchEmployees();
      searchDiv.style.display = "block";
      searchInput.addEventListener("input", (e) => {
        searchResult.filterData(e.target.value);
      });
    } else if (localStorage.getItem("page") === "task") {
      searchResult = new Search(localStorage.getItem("page"), searchList);
      searchResult.searchTasks();
      searchDiv.style.display = "block";
      searchInput.addEventListener("input", (e) => {
        searchResult.filterTasks(e.target.value);
      });
    }
  }
});

window.addEventListener("click", (e) => {
  if (window.getComputedStyle(searchDiv).display === "block") {
    if (e.target.getAttribute("data-s") !== "search") {
      searchDiv.style.display = "none";
      searchInput.value = "";
    }
  }
});

searchList.addEventListener("click", (e) => {
  let div = e.target.parentElement;
  if (localStorage.getItem("page") === "employee") {
    if (div.id === "pen") {
      db.collection("employees")
        .doc(div.parentElement.id)
        .get()
        .then((res) => {
          let data = res.data();

          let ts = data.date.toDate();
          let ts1 = new Date(ts);
          let d = ts1.getDate();
          let m = ts1.getMonth() + 1;
          let y = ts1.getFullYear();
          d = String(d).padStart(2, "0");
          m = String(m).padStart(2, "0");

          name.value = data.name;
          surname.value = data.surname;
          username.value = res.id;
          username.disabled = true;
          date.value = `${y}-${m}-${d}`;
          email.value = data.email;

          submitEmployee.innerHTML = "Update";
          submitEmployee.setAttribute("data", "update");
          submitEmployee.classList.remove("btn-success");
          submitEmployee.classList.add("btn-warning");
        })
        .catch((er) => {
          console.log(er);
        });
    } else if (div.id === "delete") {
      if (confirm("Are you sure you want to delete the employee?") == true) {
        db.collection("employees")
          .doc(div.parentElement.id)
          .delete()
          .then((res) => {
            console.log("Deleted");
            searchList.innerHTML = "";
            searchResult = new Search(localStorage.getItem("page"), searchList);
            searchResult.searchEmployees();
          })
          .catch((er) => {
            console.log(er);
          });
      }
    }
  } else if (localStorage.getItem("page") === "task") {
    if (div.id === "pen") {
      db.collection("tasks")
        .doc(div.parentElement.id)
        .get()
        .then((res) => {
          let data = res.data();
          taskID = div.parentElement.id;
          let ts = data.due_date.toDate();
          let ts1 = new Date(ts);
          let d = ts1.getDate();
          let m = ts1.getMonth() + 1;
          let y = ts1.getFullYear();
          d = String(d).padStart(2, "0");
          m = String(m).padStart(2, "0");

          title.value = data.title;
          description.value = data.description;
          assignee.value = data.assignee;
          assignee.disabled = true;
          dueDate.value = `${y}-${m}-${d}`;

          submitTask.innerHTML = "Update";
          submitTask.setAttribute("data", "update");
          submitTask.classList.remove("btn-success");
          submitTask.classList.add("btn-warning");
        })
        .catch((er) => {
          console.log(er);
        });
    } else if (div.id === "delete") {
      if (confirm("Are you sure you want to delete this task?") == true) {
        db.collection("tasks")
          .doc(div.parentElement.id)
          .delete()
          .then((res) => {
            searchList.innerHTML = "";
            searchResult = new Search(localStorage.getItem("page"), searchList);
            searchResult.searchTasks();

            let assigneeSpan = div.parentElement.querySelector("span");
            let taskTitle = div.parentElement.querySelector("h5");

            return db
              .collection("employees")
              .doc(assigneeSpan.innerHTML)
              .update({
                tasks: firebase.firestore.FieldValue.arrayRemove(
                  taskTitle.innerHTML
                ),
              })
              .then((res) => {
                //get data for that employee and update tasksLength
                return db
                  .collection("employees")
                  .doc(assigneeSpan.innerHTML)
                  .get();
              })
              .then((res) => {
                let data = res.data();
                let length = data.tasks.length;
                db.collection("employees").doc(res.id).update({
                  tasksLength: length,
                });
              });
          })
          .catch((er) => {
            console.log(er);
          });
      }
    }
  }
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

  if (submitTask.getAttribute("data") === "submit") {
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
  } else {
    newTask
      .updateTask(taskID)
      .then((res) => {
        formTask.reset();
        assignee.disabled = false;
        submitTask.innerHTML = "Submit";
        submitTask.setAttribute("data", "submit");
        submitTask.classList.remove("btn-warning");
        submitTask.classList.add("btn-success");
      })
      .catch((er) => {
        console.log(submitEmployee.innerHTML);
        console.log(er);
      });
  }
});

//Create an employee and update
submitEmployee.addEventListener("click", (e) => {
  e.preventDefault();

  let newEmpl = new Employee(
    name.value,
    surname.value,
    username.value,
    date.value,
    email.value
  );

  if (submitEmployee.getAttribute("data") === "submit") {
    newEmpl
      .addEmployee()
      .then(() => {
        formEmployee.reset();
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    newEmpl
      .updateEmployee()
      .then((res) => {
        formEmployee.reset();
        username.disabled = false;
        submitEmployee.innerHTML = "Submit";
        submitEmployee.setAttribute("data", "submit");
        submitEmployee.classList.remove("btn-warning");
        submitEmployee.classList.add("btn-success");
      })
      .catch((er) => {
        console.log(er);
      });
  }
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
    list.resetList();
    list.getEmployees();
  } else {
    search.classList.add("d-flex");
    formEmployee.reset();
    submitEmployee.classList.remove("btn-warning");
    submitEmployee.classList.add("btn-success");
    formTask.reset();
    submitTask.classList.remove("btn-warning");
    submitTask.classList.add("btn-success");
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
