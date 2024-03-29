"use strict";

const {
  watch,
  promises: { readFile },
} = require("fs");

class File {
  watch(event, filename) {
    console.log("this", this);
    console.log("arguments", Array.prototype.slice.call(arguments));
    this.showContent(filename);
  }

  async showContent(filename) {
    console.log(await (await readFile(filename)).toString());
  }
}

// watch(__filename, async (event, filename) => {
// console.log(await (await readFile(filename)).toString());
// });

const file = new File();

// dessa forma ele ignora o 'this' da classe File
// e herda o 'this' do watch abaixo
// watch(__filename, file.watch);

// uma alternativa para não herdar o this da função que está chamando
// é utilizar uma arrow function
// mas fica feio...
// watch(__filename, (event, filename) => file.watch(event, filename));

// uma forma de deixar explícito qual contexto deve ser considerado
// é o bind, ele retorna uma função com o 'this' que se mantém de file
// watch(__filename, file.watch.bind(file));

file.watch.call(
  { showContent: () => console.log("call: hey sinon!") },
  null,
  __filename
);

file.watch.apply({ showContent: () => console.log("call: hey sinon!") }, [
  null,
  __filename,
]);
