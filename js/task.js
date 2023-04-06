class Task {
  constructor(title, desc, assign, date) {
    (this.title = title),
      (this.description = desc),
      (this.assignee = assign),
      (this.dueDate = date),
      (this.tasks = db.collection("tasks")),
      (this.employees = db.collection("employees"));
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get assignee() {
    return this._assignee;
  }

  get dueDate() {
    return this._dueDate;
  }

  set title(t) {
    this._title = t;
  }

  set description(d) {
    this._description = d;
  }

  set assignee(a) {
    this._assignee = a;
  }

  set dueDate(d) {
    this._dueDate = d;
  }

  async allAssignees() {
    const ass = [];
    await this.employees.get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        ass.push(doc.id);
      });
    });
    return ass;
  }

  checkAss(list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === this.assignee) {
        return true;
      }
    }
  }

  async addTask() {
    let ts = new Date(this.dueDate);

    let obj = {
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      due_date: firebase.firestore.Timestamp.fromDate(ts),
    };

    let response = await this.tasks.add(obj);
    return response;
  }

  //update task in assignee tasks list
  async updateTask() {
    let response = await this.employees.doc(this.assignee).update({
      tasks: firebase.firestore.FieldValue.arrayUnion(this.title),
    });

    return response;
  }

  async updateFullTask(taskID) {
    let ts = new Date(this.dueDate);

    let response = await this.employees.doc(taskID).update({
      title: this.title,
      description: this.description,
      due_date: firebase.firestore.Timestamp.fromDate(ts),
    });
    return response;
  }
}

export default Task;
