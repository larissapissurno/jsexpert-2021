const assert = require('assert');

// --keys
const uniqueKey = Symbol('userName'); // Symbol creates a unique key in memory reference level.
const user = {};

user['userName'] = 'value for normal Objects'
user[uniqueKey] = 'value for Symbol'

// console.log('getting normal Objects =>', user.userName);
// always unique at memory addres level.
// console.log('getting a Symbol =>', user[Symbol('userName')]);
// console.log('getting a Symbol =>', user[uniqueKey]);

assert.deepStrictEqual(user.userName, 'value for normal Objects')

// always unique at memory addres level.
assert.deepStrictEqual(user[Symbol('userName')], undefined)
assert.deepStrictEqual(user[uniqueKey], 'value for Symbol')

// console.log('symbols', Object.getOwnPropertySymbols(user));
// console.log('symbols', Object.getOwnPropertySymbols(user)[0]);
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey)

// byPass - bad practice (don't exists in node codebase)
user[Symbol.for('password')] = 123
assert.deepStrictEqual(user[Symbol.for('password')], 123)
// --keys

// Well Known Symbols
const obj = {
  // iterators
  [Symbol.iterator]: () => ({
    items: ['c', 'b', 'a'],
    next() {
      return {
        done: this.items.length === 0,
        value: this.items.pop()
      }
    }
  })
}

// for (const item of obj) {
//     console.log('item', item);
// }

assert.deepStrictEqual([...obj], ['a', 'b', 'c'])

const kItems = Symbol('kItems')
class MyDate {
  constructor(...args) {
    this[kItems] = args.map(arg => new Date(...arg))
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== 'string') throw new TypeError();

    const items = this[kItems]
                    .map(item =>
                          new Intl
                                .DateTimeFormat('pt-BR', {month: 'long', day: '2-digit', year: 'numeric'})
                                .format(item)
                    )
    return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction'}).format(items);
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (const item of this[kItems]) {
      await timeout(100)
      yield item.toISOString()
    }
  }

  get [Symbol.toStringTag]() {
    return 'WHAT?!';
  }
}

const myDate = new MyDate(
  [2020, 0, 13],
  [2014, 0, 01]
)

const expectedDates = [
  new Date(2020, 0, 13),
  new Date(2014, 0, 01),
]

assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object WHAT?!]')
assert.throws(() => myDate + 1, TypeError)

// explicit coercion to calls toPrimitive
assert.deepStrictEqual(String(myDate), '13 de janeiro de 2020 e 01 de janeiro de 2014');

// implementing the iterator!
assert.deepStrictEqual([...myDate], expectedDates)

// ;(async() => {
//   for await(const item of myDate) {
//     console.log('asyncIterator =>', item); 
//   }
// })()

;(async() => {
  // calls Symbol.iterator
  const dates = await Promise.all([...myDate])
  assert.deepStrictEqual(dates, expectedDates)

  // calls Sybol.asyncIterator
  const datesArray = [];
  for await (const date of myDate) {
    datesArray.push(date);
  }

  const expectedDatesInISOString = expectedDates.map(item =>
    item.toISOString());
  
  assert.deepStrictEqual(datesArray, expectedDatesInISOString)
})()