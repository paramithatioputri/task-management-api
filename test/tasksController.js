const expect = require("chai").expect;
const mongoose = require("mongoose");
const Task = require("../models/task");
const TaskController = require("../controllers/tasks");
const sinon = require('sinon');

describe("Tasks Controller", () => {
  before((done) => {
    mongoose
      .connect(
        "mongodb+srv://paramitha:Xyr0bkq3HrsW5ZUT@cluster0.mecuh.mongodb.net/test-tasks"
      )
      .then(() => {
        const task1 = new Task({
          title: "Task 1",
          description: "This is task 1",
          status: "completed",
          _id: "78bf3ca53d1c9d4f1e40a456",
        });

        return task1.save();
      })
      .then(() => {
        const task2 = new Task({
          title: "Task 2",
          description: "This is task 2",
          status: "completed",
          _id: "78bf3ca53d1c9d4f1e40a477",
        });

        return task2.save();
      })
      .then(() => {
        const task3 = new Task({
          title: "Task 3",
          description: "This is task 3",
          status: "pending",
          _id: "78bf3ca53d1c9d4f1e40a478",
        });

        return task3.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  after((done) => {
    Task.deleteMany({})
      .then(() => {
        mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  it("should get all tasks", (done) => {
    const req = {
      query: {
        status: "",
        sortBy: "asc",
      },
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function () {},
    };

    TaskController.getTasks(req, res, () => {})
      .then((tasks) => {
        expect(tasks).to.have.length(3);
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  it.skip("should throw an error with code 500 if accessing the database fails when get all tasks", (done) => {
    sinon.stub(Task, 'find');
    Task.find.throws();
    const req = {
      query: {
        status: "",
        sortBy: "asc",
      },
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function () {},
    };

    TaskController.getTasks(req, res, () => {})
      .then((res) => {
        expect(res).to.have.an('error');
        expect(res).to.have.property('statusCode', 500);
      })
      .then(() => {
        done();
      })
      .catch(done);
    Task.find.restore();
  });

  it("should get a single task", (done) => {
    const req = {
      params: {
        taskId: "78bf3ca53d1c9d4f1e40a478",
      },
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function () {},
    };

    TaskController.getTask(req, res, () => {})
      .then((task) => {
        expect(task).to.have.property("status", "pending");
        expect(task).to.have.property("title", "Task 3");
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  it("should create new task", (done) => {
    const req = {
      body: {
        title: "Task 4",
        description: "This is task 4",
        status: "pending",
      },
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function () {},
    };

    TaskController.createTask(req, res, () => {})
      .then((taskSaved) => {
        expect(taskSaved).to.have.property("status", "pending");
        expect(taskSaved).to.have.property("title", "Task 4");
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  it("should update task", (done) => {
    const req = {
      params: {
        taskId: "78bf3ca53d1c9d4f1e40a478",
      },
      body: {
        title: "Task 3.1",
        description: "This is task 3.1",
        status: "completed",
      },
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function () {},
    };

    TaskController.updateTask(req, res, () => {})
      .then((taskSaved) => {
        expect(taskSaved).to.have.property("status", "completed");
        expect(taskSaved).to.have.property("title", "Task 3.1");
        expect(taskSaved).to.have.property("description", "This is task 3.1");
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  it("should delete task", (done) => {
    const req = {
      params: {
        taskId: "78bf3ca53d1c9d4f1e40a478",
      },
    };

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function () {},
    };

    TaskController.deleteTask(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(204);
      })
      .then(() => {
        done();
      })
      .catch(done);
  });
});
