import { L } from 'tsminilens';

interface Address { city?: string; street: string; neighbor?: House }
interface Person { type: 'Person', name?: string; address: Address }
interface Student extends Person { school: string }
interface Company { type: 'Company', title: string }
interface House { owner: Person | Company }

const isCompany = (c: Person | Company): c is Company => (c || <any>{}).type === 'Company';
const isPerson = (c:Person | Company): c is Person => (c || <any>{}).type === 'Person';
const duplicate = x => x + x;

describe('Mini Lens for TypeScript', () => {
    describe('Dumb, no path', () => {
        const dumbLens = L<string>().to();

        it('can view', () => {
            expect(dumbLens.view('foo')).toEqual('foo');
        });

        it('can set', () => {
            expect(dumbLens.set('foo', 'bar')).toEqual('bar');
        });

        it('can override', () => {
            expect(dumbLens.over('foo', duplicate)).toEqual('foofoo');
        });
    });

    describe('Through nested objects', () => {
        const lensPerson2Street = L<Person>().to('address', 'street');

        it('can view', () => {
            expect(lensPerson2Street.view({ address: { street: 'foo' }, type: 'Person' })).toEqual('foo');
        });

        it('view can short circuit null values', () => {
            expect(lensPerson2Street.view(null)).toBeNull();
            expect(lensPerson2Street.view({ address: null, type: 'Person' })).toBeNull();
        });

        it('can set', () => {
            const withAddress: Person = { address: { street: 'foo' }, type: 'Person' };
            const updated = lensPerson2Street.set(withAddress, 'bar');
            expect(lensPerson2Street.view(updated)).toEqual('bar');

            // but not reference equal
            expect(updated).not.toBe(withAddress);
        });

        it('set can short-circuit null values', () => {
            const noAddress: Person = { address: null, type: 'Person' };
            const updated = lensPerson2Street.set(noAddress, 'bar');
            expect(updated).toEqual(noAddress);

            // but not reference equal
            expect(updated).not.toBe(noAddress);
        });

        it('can override', () => {
            const withAddress: Person = { address: { street: 'foo' }, type: 'Person' };
            const updated = lensPerson2Street.over(withAddress, duplicate);
            expect(lensPerson2Street.view(updated)).toEqual('foofoo');

            // but not reference equal
            expect(updated).not.toBe(withAddress);
        });
    });

    describe('chain lens / cast through union type', () => {
        const lens4CompanyTitle = L<House>().to('owner')
            .castIf<Company>(isCompany)
            .chain(L<Company>().to('title'));

        it('can view', () => {            
            expect(lens4CompanyTitle.view({ owner: { title: 'title foo', type: 'Company' } })).toEqual('title foo');
        });

        it('can not view incorrect variant', () => {
            expect(lens4CompanyTitle.view({ owner: { name: 'foo', address: null, type: 'Person' } })).toBeUndefined();
        });

        it('can set', () => {
            const updated = lens4CompanyTitle.set({ owner: { title: 'title foo', type: 'Company' } }, 'title bar');
            expect(lens4CompanyTitle.view(updated)).toEqual('title bar');
        });

        it('can set on null value', () => {
            const house: House = { owner: undefined };
            const person: Person = { address: { street: 'queen' }, type: 'Person' };
            
            const withOwner = L<House>().to('owner').castIf(isPerson).set(house, person);
            expect(withOwner).toEqual({ owner: person });
        });
        
        it('can not set incorrect variant', () => {
            const notACompany = { name: 'foo', address: null, type: 'Person' };
            const withoutCompany = { owner: <any>notACompany };
            const updated = lens4CompanyTitle.set(withoutCompany, 'title bar');
            expect(updated).toEqual(withoutCompany);
        });
    });

    describe('chain and cast galore', () => {
        const lensGalore = L<House>().to('owner').castIf(isPerson)
            .chain(L<Person>().to('address', 'neighbor', 'owner').castIf(isCompany))
            .chain(L<Company>().to('title'));

        it('with valid data', () => {
            const nested: House = {
                owner: <Person>{
                    type: 'Person',
                    address: {
                        street: null,
                        neighbor: {
                            owner: {
                                type: 'Company',
                                title: 'bar'
                            }
                        }
                    }
                }
            };
            expect(lensGalore.view(nested)).toEqual('bar');
            expect(lensGalore.view(lensGalore.set(nested, 'bar'))).toEqual('bar');
        });

        it('with invalid data', () => {
            const nested: House = {
                owner: <Person>{
                    type: 'Person',
                    address: {
                        street: null
                    }
                }
            };
            expect(lensGalore.view(nested)).toBeUndefined();
            expect(lensGalore.view(lensGalore.set(nested, 'bar'))).toBeUndefined();
        });
    });

    describe('chain with path', () => {
        const lens4CompanyTitle = L<House>().to('owner')
            .castIf<Company>(isCompany)
            .then.to('title');

        it('can view', () => {            
            expect(lens4CompanyTitle.view({ owner: { title: 'title foo', type: 'Company' } })).toEqual('title foo');
        });

        it('can not view incorrect variant', () => {
            expect(lens4CompanyTitle.view({ owner: { name: 'foo', address: null, type: 'Person' } })).toBeUndefined();
        });

        it('can set', () => {
            const updated = lens4CompanyTitle.set({ owner: { title: 'title foo', type: 'Company' } }, 'title bar');
            expect(lens4CompanyTitle.view(updated)).toEqual('title bar');
        });
        
        it('can not set incorrect variant', () => {
            const notACompany = { name: 'foo', address: null, type: 'Person' };
            const withoutCompany = { owner: <any>notACompany };
            const updated = lens4CompanyTitle.set(withoutCompany, 'title bar');
            expect(updated).toEqual(withoutCompany);
        });
    });

    describe('chain with path -- aliased', () => {
        const lens4CompanyTitle = L<House>().to('owner')
            .castIf<Company>(isCompany)
            .then.to('title');

        it('can view', () => {            
            expect(lens4CompanyTitle.view({ owner: { title: 'title foo', type: 'Company' } })).toEqual('title foo');
        });

        it('can not view incorrect variant', () => {
            expect(lens4CompanyTitle.view({ owner: { name: 'foo', address: null, type: 'Person' } })).toBeUndefined();
        });

        it('can set', () => {
            const updated = lens4CompanyTitle.set({ owner: { title: 'title foo', type: 'Company' } }, 'title bar');
            expect(lens4CompanyTitle.view(updated)).toEqual('title bar');
        });
        
        it('can not set incorrect variant', () => {
            const notACompany = { name: 'foo', address: null, type: 'Person' };
            const withoutCompany = { owner: <any>notACompany };
            const updated = lens4CompanyTitle.set(withoutCompany, 'title bar');
            expect(updated).toEqual(withoutCompany);
        });
    });

    describe('work with arrays', () => {
        const l = L<string[]>().to(1);
        const strings = [ 'aaa', 'bbb', 'ccc' ];

        it('can view thru array', () => {
            const oneChar = l.view(strings);

            expect(oneChar).toEqual('bbb');
        })

        it('can set thru array', () => {
            const actual = l.set(strings, 'zzz');

            expect(actual).toEqual([ 'aaa', 'zzz', 'ccc' ]);
        })
    });

    describe('works with extended types', () => {
        const lStudentToName = L<Person>().to('name');
        const student : Student = { 'address': null, 'school': 'Snakebite', 'type': 'Person' };

        // this should compile
    });
});