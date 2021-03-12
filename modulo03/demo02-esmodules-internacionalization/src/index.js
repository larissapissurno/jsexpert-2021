import Draftlog from "draftlog";
import chalk from "chalk";
import chalkTable from "chalk-table";
import readLine from "readline";

import database from "./../database.json";
import Person from "./person.js";

Draftlog(console).addLineListener(process.stdin);

const DEFAULT_LANG = "pt-BR";
const options = {
  leftPad: 2,
  columns: [
    { field: "id", name: chalk.cyan("ID") },
    { field: "vehicles", name: chalk.magenta("Vehicles") },
    { field: "kmTraveled", name: chalk.white("Km Traveled") },
    { field: "from", name: chalk.yellow("From") },
    { field: "to", name: chalk.yellow("To") },
  ],
};

const table = chalkTable(
  options,
  database.map((item) => new Person(item).formatted(DEFAULT_LANG))
);
const print = console.draft(table);

const terminal = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// terminal.question("Qual é o seu nome?", (msg) => {
//   console.log("msg", msg.toString());
// });
// setInterval(() => {
//   database.push({
//     id: Date.now(),
//     vehicles: ["Test" + Date.now()],
//   });

//   const table = chalkTable(options, database);
//   print(table);
// }, 400);
