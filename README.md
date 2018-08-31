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
```

### view() to navigate safely

We all know the dreaded null reference exception (Law of demeter applies)

```TypeScript
const address = person.address.street; // error if address is null!
```

with lens this never happens, in the following case, if address is null then view() returns null instead of erroring out

```TypeScript
const address = lensPerson2Street.view(person); // safe!
```

### set() or over() to update easily

If immutability is a concern, then updating a nested data structure can be tedious.
```TypeScript
const updatedPerson = {
    ...person,
    address: {
        ...person.address,
    }
};
// imagine more nesting! :(
```

with ``set()`` this becomes a breeze
```
const personWithNewAddress = lensPerson2Street.set(person, 'new street');
```
Note with ``set()``, the result ``personWithNewAddress`` is a new object, or, ``person !== personWithNewAddress``.

``over()`` is handy if we are to append to the current address,
```
const updatedPerson = lensPerson2Street.over(person, oldAddress => 'Level 2' + oldAddress);
```
### chain() and castIf()

It's also possible to chain lenses with ``lens.chain(anotherLens)`` or more fluently, ``lens.then.withPath('level1', 'level2')``

``lens.castIf(typeGuard)`` supports navigating through union types - with type guards.

Bear in mind it's mini indeed - there is no support for navigating through arrays, Maps or other complex data types.
