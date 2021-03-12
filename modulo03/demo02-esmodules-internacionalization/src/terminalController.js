import Draftlog from "draftlog";
import chalk from "chalk";
import chalkTable from "chalk-table";

import readLine from "readline";
import Person from "./person.js";
import database from "./../database.json";

export default class TerminalController {
  constructor() {
    this.print = {};
    this.data = {};
    this.terminal = {};
  }

  initializeTerminal(database, language) {
    Draftlog(console).addLineListener(process.stdin);

    this.terminal = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.initializeTable(database, language);
  }

  initializeTable(database, language) {
    const data = database.map((item) => new Person(item).formatted(language));
    const table = chalkTable(this.getTableOptions(), data);
    this.print = console.draft(table);
    this.data = data;
  }

  question(msg = "") {
    return new Promise((resolve) => this.terminal.question(msg, resolve));
  }

  closeTerminal() {
    this.terminal.close();
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan("ID") },
        { field: "vehicles", name: chalk.magenta("Vehicles") },
        { field: "kmTraveled", name: chalk.white("Km Traveled") },
        { field: "from", name: chalk.yellow("From") },
        { field: "to", name: chalk.yellow("To") },
      ],
    };
  }
}
