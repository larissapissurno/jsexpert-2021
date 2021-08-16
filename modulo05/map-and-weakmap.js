const assert = require('assert');
const myMap = new Map();

// the key could be anything
myMap
  .set(1, 'one')
  .set('Larissa', { text: 'Esta é a Lari'})
  .set(true, () => 'Qualquer coisa')

// using a constructor
const myMapWithConstructor = new Map([
  ['1', 'str1'],
  [1, 'num1'],
  [true, 'bool1']
]);

// console.log('myMap', myMap);
// console.log('myMap.get(1) => ', myMap.get(1));

// testing
assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('Larissa'), { text: 'Esta é a Lari'});
assert.deepStrictEqual(myMap.get(true)(), 'Qualquer coisa');

// Em Objects a chave só pode ser string ou symbol (number são coergidos para string)
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: 'LarissaPissurno' });

// console.log('get', myMap.get(onlyReferenceWorks));

assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: 'LarissaPissurno' });

// utilities
// - to discover the map size
assert.deepStrictEqual(myMap.size, 4);

// - to verify if a item is inside the object
// if item.key === undefined, the item doesn't exists
// if() does a coercion to boolen and returns false
// The right way with Object is ({ name: "Larissa" }).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWorks));


// to remove an item from a object
// delete item.id
// has a bad performance to JavaScript
assert.ok(myMap.delete(onlyReferenceWorks));

// Isn't possible to iterate in Objects directly
// we have to transform using Object.entries(item)

assert.deepStrictEqual(JSON.stringify([...myMap]), '[[1,"one"],["Larissa",{"text":"Esta é a Lari"}],[true,null]]')

// for (const [key, value] of myMap) {
//   console.log({ key, value });
// }

// Object is insecure because depending on the key name, can replace some default behavior
// ({ }).toString() === '[object Object]'
// ({toString: () => 'Hey' }).toString() === 'Hey'

// qualquer chave pode colidir, com as propriedades herdadas do objeto, como
// constructor, toString, valueOf e etc; 

const actor = {
  name: 'Xuxa da Silva',
  toString: 'Queen: Xuxa da Silva'
}

// there isn't key name restrictions
myMap.set(actor);

assert.ok(myMap.has(actor))
assert.throws(() => myMap.get(actor).toString, TypeError)

// There is no way to clean an Object without reassign it
myMap.clear();
assert.deepStrictEqual([...myMap.keys()], []);

// --- WeekMap

// Pode ser coletado após perder as referências
// usado em casos beeem específicos

// tem a maioria dos benefícios do Map
// MAS: não é iterável
// mais leve e preve leak memory, pq depois que as instancias saem da memoria, tudo é limpo

const weakMap = new WeakMap();
const hero = {name: 'Tempest'}

weakMap.set(hero)
weakMap.get(hero)
weakMap.delete(hero)
weakMap.has(hero)


