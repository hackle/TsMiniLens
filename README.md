# TsMiniLens: Type-safe mini Lens for TypeScript

```
npm i tsminilens
```

A type-safe way to navigate through nested JSON objects. Writtin in TypeScript so enjoy intellisense and compiler errors!

Provides the usual functions such as ``view()``, ``set()`` and ``over()``.

Null values are short-circuited, thus avoiding the dreaded null reference errors.

Also supports navigating through union types - with type guards.

Immutability is supported with ``set()`` and ``over()``, after which the data structure is updated from leaf to root (but unrelated branches remain unchanged). (There must be a smarter way to put this so help me out!)

Bear in mind it's mini indeed - there is no support for navigating through arrays, Maps or other complex data types.

given

```TypeScript
interface Address { city?: string; street: string };
interface Person { name?: string; address: Address };

const lensPerson2Street = lensFor<Person>().withPath('address', 'street'); // this is type safe, e.g. 'street1' wont't compile
```

we have these assertions:

```TypeScript
// view()
expect(lensPerson2Street.view({ address: { street: 'foo' }})).toEqual('foo');

// null value is short-circuited
expect(lensPerson2Street.view({ address: null })).toBeNull();

// set()
const withAddress = { address: { street: 'foo' } };
const updated = lensPerson2Street.set(withAddress, 'bar');
expect(lensPerson2Street.view(updated)).toEqual('bar');

```

It's also possible to cast and chain lenses.

see **lens.spec.ts** for more examples.