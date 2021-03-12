import database from "./../database.json";
import Person from "./person.js";
import TerminalController from "./terminalController.js";

const DEFAULT_LANG = "pt-BR";
const STOP_TERM_SHORTCUT = ":q";

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

async function mainLoop() {
  try {
    const answer = await terminalController.question(
      "ID | VEHICLE | KM | FROM | TO\n"
    );

    if (answer === STOP_TERM_SHORTCUT) {
      terminalController.closeTerminal();
      console.log("Process finished!");
      return;
    }

    const person = Person.generateInstanceFromString(answer);
    console.log(person.formatted(DEFAULT_LANG));
    return mainLoop();
  } catch (error) {
    console.error("DEU RUIM**", error);
    return mainLoop();
  }
}

await mainLoop();

// 2 Carro,Bike 599000000 2021-03-01 2021-03-12
