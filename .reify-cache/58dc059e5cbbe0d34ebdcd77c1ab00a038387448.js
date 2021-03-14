"use strict";var mocha;module.link("mocha",{default(v){mocha=v}},0);var chai;module.link("chai",{default(v){chai=v}},1);var Person;module.link("./../src/person.js",{default(v){Person=v}},2);
const { describe, it } = mocha;

const { expect } = chai;



describe("Person", () => {
  it("should return a person instance from a string", () => {
    const person = Person.generateInstanceFromString(
      "1 Bike,Carro 20000 2021-01-03 2021-10-03"
    );
    const expected = {
      id: "1",
      vehicles: ["Bike", "Carro"],
      kmTraveled: "20000",
      from: "2021-01-03",
      to: "2021-10-03",
    };

    expect(person).to.be.deep.equal(expected);
  });

  it("should format values", () => {
    const person = new Person({
      id: "1",
      vehicles: ["Bike", "Carro"],
      kmTraveled: "20000",
      from: "2021-03-03",
      to: "2021-03-10",
    });

    const result = person.formatted("pt-BR");

    const expected = {
      id: 1,
      vehicles: "Bike e Carro",
      kmTraveled: "20.000 km",
      from: "03 de março de 2021",
      to: "10 de março de 2021",
    };

    expect(result).to.be.deep.equal(expected);
  });
});
