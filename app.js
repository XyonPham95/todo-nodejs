const fs = require("fs");
const chalk = require("chalk");
const yargs = require("yargs");

function loadData() {
  try {
    const buffer = fs.readFileSync("database.json");
    const data = buffer.toString();
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
    return [];
  }
}

function saveData(todo) {
  let data = loadData();
  data.push(todo);
  fs.writeFileSync("database.json", JSON.stringify(data));
}

function addTodo(todoBody, todoComplete) {
  let todos = loadData();
  let todoId;
  if (todos.length === 0) {
    todoId = 1;
  } else {
    todoId = todos[todos.length - 1].id + 1;
  }

  console.log(chalk.bold.yellow("New To-do:"));
  console.log(
    chalk.bold.whiteBright("ID:"),
    todoId,
    chalk.bold.cyanBright("\nTODO:"),
    todoBody,
    chalk.bold.magentaBright("\nCOMPLETE:"),
    todoComplete
  );
  saveData({ id: todoId, todo: todoBody, complete: todoComplete });
}

function deleteTodo(id) {
  const todos = loadData().filter((item) => item.id !== id);
  const dataJSON = JSON.stringify(todos);
  fs.writeFileSync("database.json", dataJSON);
  console.log("delete done", todos);
}

function toggleTodo(id) {
  let todos = loadData();

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].status = !todos[i].status;
    }
  }

  console.log(" toggle done", todos);
  fs.writeFileSync("database.json", JSON.stringify(todos));
}

yargs.command({
  command: "add",
  describe: "Add a new todo",
  builder: {
    id: {
      describe: "Todo id",
      demandOption: false,
      type: "number",
    },
    todo: {
      describe: "Todo content",
      demandOption: true,
      type: "string",
    },
    complete: {
      describe: "Todo status",
      demandOption: false,
      type: "boolean",
      default: false,
    },
  },
  handler: function ({ todo, complete }) {
    addTodo(todo, complete);
  },
});

yargs.command({
  command: "list",
  describe: "list some todos",
  builder: {
    id: {
      describe: "todo id",
      type: "number",
      demandOption: false,
    },
    complete: {
      describe: "todo complete",
      type: "boolean",
      demandOption: false,
      default: "all",
    },
  },
  handler: function (args) {
    console.log(chalk.bgBlackBright.bold.yellow(args.complete));
    const todos = loadData();
    for (let { id, todo, complete } of todos) {
      if (args.complete === "all") {
        if (complete === true) {
          complete = "done";
          console.log(id, todo, chalk.green(complete));
        } else if ((complete = "undone")) {
          console.log(id, todo, chalk.red(complete));
        }
      } else if (args.complete === "done");
      if (complete == true) {
        complete = "done";
        console.log(id, todo, complete);
      } else if (args.complete === "undone") {
        if (complete == false) {
          complete = "undone";
          console.log(console.log(id, todo, complete));
        }
      }
    }
  },
});

yargs.command({
  command: "delete",
  describe: "delete todo",
  builder: {
    id: {
      describe: "todo id",
      demandOption: true,
      type: "number",
    },
  },
  handler: function (argv) {
    deleteTodo(argv.id);
  },
});

yargs.command({
  command: "toggle",
  describe: "change status of todo",
  builder: {
    id: {
      describe: "id of todo",
      demandOption: true,
      type: "number",
    },
  },
  handler: function (argv) {
    toggleTodo(argv.id);
  },
});

yargs.parse();
