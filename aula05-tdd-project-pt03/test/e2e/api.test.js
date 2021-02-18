const { describe, it } = require("mocha");
const { expect } = require("chai");
const request = require("supertest");
const sinon = require("sinon");

const CarService = require("./../../src/services/carService");
const SERVER_TEST_PORT = 4000;

const mocks = {
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCar: require("./../mocks/valid-car.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
};

describe("API Suite test", () => {
  let app = {};
  let sandbox = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  before(() => {
    const api = require("./../../src/api");
    const carService = new CarService({
      cars: "./../../database/cars.json",
    });
    const instance = api({ carService });

    app = {
      instance,
      server: instance.initialize(SERVER_TEST_PORT),
    };
  });

  describe("/calculateFinalPrice:post", () => {
    it("given a carCategory, customer and numerOfDays it should calculate final amount in real", async () => {
      const customer = {
        ...mocks.validCustomer,
        age: 50,
      };
      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
      };
      const numberOfDays = 5;

      const body = {
        customer,
        carCategory,
        numberOfDays,
      };

      const expected = {
        result: app.instance.carService.currencyFormat.format(244.4),
      };

      const response = await request(app.server)
        .post("/calculateFinalPrice")
        .send(body)
        .expect(200);

      expect(response.body).to.be.deep.equal(expected);
    });

    // it("given no carCategory, customer and numerOfDays it should return HTTP 500 status", async () => {
    //   const customer = {
    //     ...mocks.validCustomer,
    //     age: 50,
    //   };

    //   const numberOfDays = 5;

    //   const body = {
    //     customer,
    //     carCategory: null,
    //     numberOfDays,
    //   };

    //   const expected = {
    //     result: app.instance.carService.currencyFormat.format(244.4),
    //   };

    //   const response = await request(app.server)
    //     .post("/calculateFinalPrice")
    //     .send(body)
    //     .expect(200);

    //   expect(response.body).to.be.deep.equal({ error: "Deu Ruim!" });
    // });

    // it("given no parameters, must throw a error", async () => {
    //   const body = {
    //     customer: null,
    //     carCategory: null,
    //     numberOfDays: null,
    //   };

    //   const response = await request(app.server)
    //     .post("/calculateFinalPrice")
    //     .send(body)
    //     .expect(500);

    //   expect(response.body).to.be.deep.equal({ error: "Deu Ruim!" });
    // });
  });

  describe("/getAvailableCar:get", () => {
    it("given a carCategory it should return an available car", async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.carCategory,
        carIds: [car.id],
      };

      sandbox
        .stub(
          app.instance.carService.carRepository,
          app.instance.carService.carRepository.find.name
        )
        .resolves(car);

      const expected = {
        result: car,
      };

      const response = await request(app.server)
        .post("/getAvailableCar")
        .send(carCategory)
        .expect(200);

      expect(response.body).to.be.deep.equal(expected);
    });
  });

  describe("/rent:post", () => {
    it("given a customer and a car category is should return a transaction receipt", async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      };

      const customer = {
        ...mocks.validCustomer,
        age: 20,
      };

      const numberOfDays = 5;

      // age: 20, tax: 1.1, categoryPrice: 37.6
      // 37.6 * 1.1 = 41.36 * 5 days = 206.8
      const expectedAmount = app.instance.carService.currencyFormat.format(
        206.8
      );
      const dueDate = "10 de novembro de 2020";

      const body = {
        customer,
        carCategory,
        numberOfDays,
      };

      const now = new Date(2020, 10, 5);
      sandbox.useFakeTimers(now.getTime());

      sandbox
        .stub(
          app.instance.carService.carRepository,
          app.instance.carService.carRepository.find.name
        )
        .resolves(car);

      const expected = {
        result: {
          customer,
          car,
          amount: expectedAmount,
          dueDate,
        },
      };

      const response = await request(app.server)
        .post("/rent")
        .send(body)
        .expect(200);

      expect(JSON.stringify(response.body)).to.be.deep.equal(
        JSON.stringify(expected)
      );
    });
  });

  // describe("/rent", () => {
  //   it("should request the rent page and return HTTP status 200", async () => {
  //     const customer = mocks.validCustomer;
  //     const car = mocks.validCar;
  //     const carCategory = {
  //       ...mocks.carCategory,
  //       carIds: [car.id],
  //     };
  //     const numberOfDays = 5;

  //     const expectedTransaction = new Transaction({
  //       customer,
  //       dueDate: "10 de janeiro de 2020",
  //       car,
  //       amount: 10,
  //     });

  //     sandbox
  //       .stub(carService, carService.rent.name)
  //       .returns(expectedTransaction);

  //     const response = await request(api)
  //       .post("/rent")
  //       .send({
  //         customer,
  //         carCategory,
  //         numberOfDays,
  //       })
  //       .expect(200);

  //     // expect(response.body).to.be.deep.equal(expectedTransaction);
  //   });
  // });
});
