class Search {
  constructor(page, ul) {
    this.page = page;
    this.ul = ul;
    this.employees = db.collection("employees");
    this.listOfEmployees = [];
    this.tasks = db.collection("tasks");
    this.listOfTasks = [];
  }

  get page() {
    return this._page;
  }

  get ul() {
    return this._ul;
  }

  set page(p) {
    this._page = p;
  }

  set ul(u) {
    this._ul = u;
  }

  setDate(data) {
    let ts = data.due_date.toDate();
    let date = new Date(ts);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = String(day).padStart(2, "0");
    month = String(month).padStart(2, "0");

    return `${day}/${month}/${year}`;
  }

  tasksList(doc) {
    let data = doc.data();

    let listItem = document.createElement("li");
    listItem.id = doc.id;
    listItem.innerHTML = `
            <h5>${data.title}</h5>
            <p>Assignee: ${data.assignee}</p>
            <p>Due date: ${this.setDate(data)}</p>
            <div id="pen">
              <img src='img/pen.svg'>
            </div>
            <div id="delete">
              <img src='img/delete.svg'>
            </div>
    `;

    this.ul.append(listItem);
    this.listOfTasks.push(listItem);
  }

  empList(doc) {
    let data = doc.data();

    let listItem = document.createElement("li");
    listItem.id = doc.id;
    listItem.innerHTML = `
            <h5>${data.name} ${data.surname} </h5><span>${data.email}</span>
            <p>Number of tasks: ${data.tasksLength}</p>
            <div id="pen">
              <img src='img/pen.svg'>
            </div>
            <div id="delete">
              <img src='img/delete.svg'>
            </div>
    `;

    this.ul.append(listItem);
    this.listOfEmployees.push(listItem);
  }

  searchEmployees() {
    this.employees.orderBy("name").onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        let doc = change.doc;
        this.empList(doc);
      });
    });
  }

  searchTasks() {
    this.tasks.orderBy("title").onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        let doc = change.doc;
        this.tasksList(doc);
      });
    });
  }

  filterData(inputValue) {
    this.listOfEmployees.forEach((item) => {
      if (item.innerText.toLowerCase().includes(inputValue.toLowerCase())) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  }

  filterTasks(inputValue) {
    this.listOfTasks.forEach((item) => {
      if (item.innerText.toLowerCase().includes(inputValue.toLowerCase())) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  }
}

export default Search;
