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
    let ts = new Date(this.dueDate);

    let obj = {
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      due_date: firebase.firestore.Timestamp.fromDate(ts),
    };

    let response = await this.employees.doc(this.assignee).update({
      tasks: firebase.firestore.FieldValue.arrayUnion(obj),
    });

    return response;
  }

  async updateFullTask(taskID) {
    let ts = new Date(this.dueDate);

    let obj = {
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      due_date: firebase.firestore.Timestamp.fromDate(ts),
    };

    let response = await this.employees.doc(taskID).update(obj);
    return response;
  }
}

export default Task;
