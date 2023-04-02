class List {
  constructor(list) {
    (this.list = list), (this.employees = db.collection("employees"));
  }

  get list() {
    return this._list;
  }

  set list(l) {
    this._list = l;
  }

  listItem(doc) {
    let data = doc.data();
    let cont = `<li id='${doc.id}' class='best-employees'>
                <p>${data.name} ${data.surname}</p>
                <p>${data.email}</p><span>Tasks: ${data.tasksLength}</span>
                </li>`;
    this.list.innerHTML += cont;
  }

  resetList() {
    this.list.innerHTML = "";
  }

  getEmployees() {
    this.employees
      .limit(3)
      .orderBy("tasksLength", "desc")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          let doc = change.doc;
          let type = change.type;
          console.log(type);
          if (type === "added") {
            this.listItem(doc);
          }
        });
      });
  }
}

export default List;
