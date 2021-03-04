const http = require("http");
const CarService = require("./services/carService");

const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const defaultFactory = () => ({
  carService: new CarService({ cars: "./../database/cars.json" }),
});

class Api {
  constructor(depedencies = defaultFactory()) {
    this.carService = depedencies.carService;
  }

  generateRoutes() {
    return {
      "/rent:post": async (request, response) => {
        for await (const data of request) {
          try {
            const { customer, carCategory, numberOfDays } = JSON.parse(data);

            if (!customer || !carCategory || !numberOfDays) {
              throw new Error(
                "The parameters 'customer', 'carCategory' and 'numberOfDays' must be informed correctly."
              );
            }

            const result = await this.carService.rent(
              customer,
              carCategory,
              numberOfDays
            );

            response.writeHead(200, DEFAULT_HEADERS);

            response.write(JSON.stringify({ result }));
            response.end();
          } catch (error) {
            handleError(error, response);
          }
        }
      },
      "/calculateFinalPrice:post": async (request, response) => {
        for await (const data of request) {
          try {
            const { customer, carCategory, numberOfDays } = JSON.parse(data);

            if (!customer || !carCategory || !numberOfDays) {
              throw new Error(
                "The parameters 'customer', 'carCategory' and 'numberOfDays' must be informed correctly."
              );
            }

            const result = await this.carService.calculateFinalPrice(
              customer,
              carCategory,
              numberOfDays
            );

            response.writeHead(200, DEFAULT_HEADERS);

            response.write(JSON.stringify({ result }));
            response.end();
          } catch (error) {
            handleError(error, response);
          }
        }
      },
      "/getAvailableCar:post": async (request, response) => {
        for await (const data of request) {
          try {
            const carCategory = JSON.parse(data);

            if (!carCategory) {
              throw new Error(
                "The parameter 'carCategory' must be informed correctly."
              );
            }

            const result = await this.carService.getAvailableCar(carCategory);

            response.writeHead(200, DEFAULT_HEADERS);

            response.write(JSON.stringify({ result }));
            response.end();
          } catch (error) {
            handleError(error, response);
          }
        }
      },
      default: (request, response) => {
        response.write(JSON.stringify({ success: "Hello World!" }));
        return response.end();
      },
    };
  }

  handleError(error, response) {
    console.log("error", error);
    response.writeHead(500, DEFAULT_HEADERS);
    response.write(JSON.stringify({ error: "Deu Ruim!" }));
    response.end();
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;

    const routes = this.generateRoutes();
    const chosen = routes[routeKey] || routes.default;

    response.writeHead(200, DEFAULT_HEADERS);

    return chosen(request, response);
  }

  initialize(port = DEFAULT_PORT) {
    const app = http
      .createServer(this.handler.bind(this))
      .listen(port, (_) => console.log("app running at", port));

    return app;
  }
}

if (process.env.NODE_ENV !== "test") {
  const api = new Api();
  api.initialize();
}

module.exports = (dependencies) => new Api(dependencies);
