# TsMiniLens: Type-safe mini Lens for TypeScript

```
npm i tsminilens
```

A type-safe and idiomatic way to navigate through nested JSON objects. Written in TypeScript so enjoy intellisense and compiler errors! (instead of null reference errors at run time).

![demo](./demo.gif)

## Use cases

### Given
```TypeScript
interface Address { city?: string; street: string };
interface Person { name?: string; address: Address };

const lensPerson2Street = lensFrom<Person>().to('address', 'street');

// since 1.1.13
const lensPerson2Street = L<Person>().to('address', 'street');
```

### view() to navigate safely

UPDATE: for viewing only, [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) would be a better solution. Lens is more useful for updating / modifying data, see below.

We all know the dreaded null reference exception (Law of demeter applies)

```TypeScript
const street = person.address.street; // error if address is null!
```

with lens this never happens, in the following case, if address is null then view() returns null instead of erroring out

```TypeScript
const street = lensPerson2Street.view(person); // safe!
```

### set() or over() to update easily

If immutability is a concern, then updating a nested data structure can be tedious.
```TypeScript
const updatedPerson = {
    ...person,
    address: {
        ...person.address,
        street: 'new street'
    }
};
// imagine more nesting! :(
```

with ``set()`` this becomes a breeze. It does a CoW (Copy on Write) to support immutability.
```
const personRelocated = lensPerson2Street.set(person, 'new street');
```
Note ``personRelocated`` is a different object than ``person``, or, ``person !== personRelocated``.

``over()`` is handy if we are to modify (but not replace) the current street,
```
const updatedPerson = lensPerson2Street.over(person, street => 'Level 2' + street);
```
Quiz: how to implement ``set()`` in terms of ``over()``?

### chain() and castIf()

It's also possible to chain lenses with ``lens1.chain(lens2)`` or more fluently, ``lens1.then.to('level1', 'level2')``

``lens.castIf(typeGuard)`` supports navigating through union types safely with type guards.

### arrays

Operations on arrays are supported as arrays work similar to objects.

```TypeScript
lensFrom<string[]>().to(1).view([ 'aaa', 'bbb', 'ccc' ]);
// 'bbb'
```

## Caveats

Copy-on-write is implemented with the spread operator, e.g. `{ ...foo, bar: baz }`. This works for plain objects and arrays, but is not safe for complex types such as Map, Set, or class etc.

There are friendly requests to add support for `view` / `set` of array elements. The challenge is to not to disrupt the current interfaces too much so my guess it will be work in progress for a (long) while. In the mean time, it's practical to operate on arrays with the likes of `map` / `filter` (as one would normally do) over `set` / `view`.

## Remember it's mini
Bear in mind it's mini indeed - there is absolutely no parity with lens proper as in Haskell.