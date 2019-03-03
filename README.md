# TsMiniLens: Type-safe mini Lens for TypeScript

```
npm i tsminilens
```

A type-safe and idiomatic way to navigate through nested JSON objects. Writtin in TypeScript so enjoy intellisense and compiler errors! (instead of null reference errors at run time).

## Use cases

### Given
```TypeScript
interface Address { city?: string; street: string };
interface Person { name?: string; address: Address };

const lensPerson2Street = lensFor<Person>().withPath('address', 'street'); // this is type safe, e.g. 'street1' wont't compile

// or since version 1.1.6
const lensPerson2Street = lensFrom<Person>().to('address', 'street');

```

### view() to navigate safely

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

It's also possible to chain lenses with ``lens1.chain(lens1)`` or more fluently, ``lens.then.withPath('level1', 'level2')``

``lens.castIf(typeGuard)`` supports navigating through union types safely with type guards.

## Remember it's mini
Bear in mind it's mini indeed - there is absolutely no parity with lens proper in Haskell.