// the reflect main goal, is ensure the objects security and semantics
"use strict";

const assert = require("assert");

// ---- apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue;
  },
};

// a problem that may happen (rare)
// Function.prototype.apply = () => {
//   throw new TypeError("Oops!");
// };

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// this one can happen!
myObj.add.apply = function () {
  throw new TypeError("Oh nooooo!!!");
};
assert.throws(() => myObj.add.apply({}, []), {
  name: "TypeError",
  message: "Oh nooooo!!!",
});

// using reflect
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result, 260);
// ---- apply

// ---- defineProperty

// semantic manners
function MyDate() {}

// thats very ugly! it's a object modifying a function
// (under the hoods, all things are objects)
Object.defineProperty(MyDate, "withObject", { value: () => "Hey there!" });

// now it makes more sense
Reflect.defineProperty(MyDate, "withReflection", { value: () => "Hey dude!" });

assert.deepStrictEqual(MyDate.withObject(), "Hey there!");
assert.deepStrictEqual(MyDate.withReflection(), "Hey dude!");
// ---- defineProperty

// ---- deleteProperty
const withDelete = { user: "Larissa" };
// imperformatic, always avoid
delete withDelete.user;

assert.deepStrictEqual(withDelete.hasOwnProperty("user"), false);

const withReflection = { user: "Larissa Pissurno" };
Reflect.deleteProperty(withReflection, "user");

assert.deepStrictEqual(withReflection.hasOwnProperty("user"), false);
// ---- deleteProperty

// ---- get

// we should do a get only on reference instances
assert.deepStrictEqual((1)["userName"], undefined);

// with reflection, an exception is gonna be thrown
assert.throws(() => Reflect.get(1, "userName"), TypeError);
// ---- get

// ---- has
assert.ok("superman" in { superman: "" });
assert.ok(Reflect.has({ batman: "" }, "batman"));
// ---- has

// ---- ownKeys
const user = Symbol("user");
const myObj2 = {
  id: 1,
  [Symbol.for("password")]: 123,
  [user]: "larissapissurno",
};

// With the object methods, we have to do 2 requests
const objectKeys = [
  ...Object.getOwnPropertyNames(myObj2),
  ...Object.getOwnPropertySymbols(myObj2),
];

console.log("objectKeys", objectKeys);

assert.deepStrictEqual(objectKeys, ["id", Symbol.for("password"), user]);

// with reflection, we just need to call once method to show all properties and symbols
assert.deepStrictEqual(Reflect.ownKeys(myObj2), [
  "id",
  Symbol.for("password"),
  user,
]);
