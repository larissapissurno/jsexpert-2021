export default class Person {
  constructor({ id, vehicles, kmTraveled, from, to }) {
    this.id = id;
    this.vehicles = vehicles;
    this.kmTraveled = kmTraveled;
    this.from = from;
    this.to = to;
  }
}
