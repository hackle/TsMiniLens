# TsMiniLens
A mini Lens for TypeScript

Minimalistic functions to help with viewing / updating nested data structures.

Null values are short-circuited, thus avoiding null reference errors.

Immutability is supported with ``set()``, after which the data structure is updated from leaf to root (but not unrelated branches). (There must be a smarter way to put this so help me out!)

given

```TypeScript
interface Address { city?: string; street: string };
interface Person { name?: string; address: Address };

const lensPerson2Street = lensFor<Person>().withPath('address', 'street');
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

see **lens.spec.ts** for more examples.