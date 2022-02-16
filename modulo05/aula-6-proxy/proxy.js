"use strict";

const Event = require("events");
const event = new Event();
const eventName = "counter";
event.on(eventName, (msg) => console.log("couter updated", msg));

const myCounter = {
  counter: 0,
};
// myCounter is gonna be observed
const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] });
    target[propertyKey] = newValue;

    return true;
  },
  get: (object, prop) => {
    // console.log("called!", { object, prop });

    return object[prop];
  },
});

setInterval(function () {
  proxy.counter += 1;
  console.log("[3]: interval!");
  if (proxy.counter === 10) clearInterval(this);
}, 200);

setTimeout(() => {
  proxy.counter = 4;
  console.log("[2]: timeout!");
}, 100);

setImmediate(() => {
  console.log("[1]: setImediate", proxy.counter);
});

// executes right now, but is bad for node life cycle
process.nextTick(() => {
  proxy.counter = 2;
  console.log("[0]: nextTick");
});
