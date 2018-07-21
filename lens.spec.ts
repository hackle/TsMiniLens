import { lensFor, LensMaker } from './lens';

interface Address { city: string; street: string };
interface Person { name: string; address: Address };
interface Company { title: string }
interface House { owner: Person | Company };

const lHouse2Street = lensFor<House>().with('owner').cast<Company>().then(lensFor<Company>().with('title'));

console.log('view through union type, company: ', lHouse2Street.view({ owner: { title: 'title foo' }}));
console.log('update through union type, company: ', lHouse2Street.set({ owner: { title: 'title foo' } }, 'title bar'));

// const lens4address = Lens.for<Person>().with("address", "street");
// const withAddress = { name: "foo", address: { city: "AKL", street: "sale" }};
// const noAddress: Person = { name: "foo", address: null };

// console.log("view street of no address", lens4address.view(noAddress));
// console.log("view street of with address", lens4address.view(withAddress));
// const lensAddress2Street = new Lens<Address, string>([ 'street' ]);
// console.log(
//     "set address.street from foo to bar",
//     lensAddress2Street.set1({ city: 'akl', street: 'foo' }, 'bar'), 
//     lensAddress2Street.set2({ city: 'akl', street: 'foo' }, 'bar'));

// var lensPerson2Street = new Lens<Person, string>([ 'address', 'street' ]);
// console.log(
//     "set person.address.street from foo to bar",
//     lensPerson2Street.set1({ name: 'name', address: { city: 'akl', street: 'foo' } }, 'bar'), 
//     lensPerson2Street.set2({ name: 'name', address: { city: 'akl', street: 'foo' } }, 'bar')
// );

// console.log(
//     "set person no address from foo to bar",
//     lensPerson2Street.set1({ name: 'name', address: null }, 'bar'), 
//     lensPerson2Street.set2({ name: 'name', address: null }, 'bar')
// );

// console.log(
//     "set person.address.street with null",
//     lensPerson2Street.set1(null, 'foo'),
//     lensPerson2Street.set2(null, 'foo')
// );

// console.log(lens4address.set1(withAddress, "queen"), lens4address.set2(withAddress, "queen"));
// console.log(lens4address.set1(noAddress, "queen"), noAddress);
// console.log(lens4address.set1(null, "queen"), null);

// const house: House = { owner: { name: 'foo', address: { city: 'Auckland', street: 'queen' }}};
// const addressL = Lens.for<House>().with('owner', 'address');
// const houseUpdated = addressL.set1(house, { city: 'Wellington', street: 'Cuba'});
// console.log(houseUpdated);

