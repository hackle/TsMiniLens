import { lensFrom, L } from "../lens";

interface Address { city?: string; street: string; neighbor?: House };
interface Person { type: 'Person', name?: string; address: Address };
interface Company { type: 'Company', title: string }
interface House { owner: Person | Company };

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
        const lensPerson2Street = L<Person>().to('address', 'city');

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
            
            const withOwner = lensFrom<House>().to('owner').set(house, person);
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
        const lensGalore = L<House>().to('owner')
            .chain(L<Person>().to('address', 'neighbor', 'owner'))
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
        const lens4CompanyTitle = L<House>().to('owner', 'title');

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
        const lens4CompanyTitle = lensFrom<House>().to('owner', 'title');

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
});