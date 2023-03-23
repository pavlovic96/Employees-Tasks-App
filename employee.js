class Employee {
  constructor(name, surname, dateOfBirth, email) {
    (this.name = name), (this.surname = surname), (this.date = dateOfBirth);
    (this.email = email),
      (this.employees = db.collection("employees")),
      (this.tasks = []);
  }

  get name() {
    return this._name;
  }

  get surname() {
    return this._surname;
  }

  get date() {
    return this._date;
  }

  get email() {
    return this._email;
  }

  set name(n) {
    if (n.length > 0) {
      this._name = n;
    }
  }

  set surname(s) {
    if (s.length > 0) {
      this._surname = s;
    }
  }

  set date(d) {
    this._date = d;
  }

  set email(e) {
    this._email = e;
  }

  async addEmployee() {
    let ts = new Date(this.date);

    let obj = {
      name: this.name,
      surname: this.surname,
      date: firebase.firestore.Timestamp.fromDate(ts),
      email: this.email,
      tasks: this.tasks,
    };
    let response = await this.employees.add(obj);
    return response;
  }
}

export default Employee;
