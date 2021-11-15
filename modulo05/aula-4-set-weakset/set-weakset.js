const assert = require("assert");

// usado na maioria das vezes para Listas de itens únicos
// used most times for lists with unique items

const arr1 = ["0", "1", "2"];
const arr2 = ["2", "0", "3"];
const arr3 = arr1.concat(arr2);

assert.deepStrictEqual(arr3.sort(), ["0", "0", "1", "2", "2", "3"]);

const set = new Set();

arr3.map((item) => set.add(item));

console.log(set);
assert.deepStrictEqual(Array.from(set), ["0", "1", "2", "3"]);

const setSpread = new Set([...arr1, ...arr2]);
assert.deepStrictEqual(Array.from(setSpread), ["0", "1", "2", "3"]);

console.log("set.keys", set.keys());
console.log("set.values", set.values()); // only exists because of map

assert.ok(set.has("3"));

// has in both arrays
const users1 = new Set(["user1", "user2", "user3"]);

const users2 = new Set(["user4", "user1", "user5"]);

const intersection = new Set([...users1].filter((user) => users2.has(user)));
console.log("intersection", intersection);
assert.deepStrictEqual(Array.from(intersection), ["user1"]);

const difference = new Set([...users1].filter((user) => !users2.has(user)));
console.log("difference", difference);
assert.deepStrictEqual(Array.from(difference), ["user2", "user3"]);

// weakSet
// same idea from set
// is not iterable
// oly work with keys as reference
// only has simple methods

const user01 = { id: "123" };
const user02 = { id: "321" };

const weakSet = new WeakSet([user01]);
weakSet.add(user02);
weakSet.delete(user01);
weakSet.has(user02);
