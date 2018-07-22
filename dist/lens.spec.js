"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lens_1 = require("./lens");
;
;
;
const duplicate = x => x + x;
describe('Mini Lens for TypeScript', () => {
    describe('Dumb, no path', () => {
        const dumbLens = lens_1.lensFor().withPath();
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
        const lensPerson2Street = lens_1.lensFor().withPath('address', 'street');
        it('can view', () => {
            expect(lensPerson2Street.view({ address: { street: 'foo' } })).toEqual('foo');
        });
        it('view can short circuit null values', () => {
            expect(lensPerson2Street.view(null)).toBeNull();
            expect(lensPerson2Street.view({ address: null })).toBeNull();
        });
        it('can set', () => {
            const withAddress = { address: { street: 'foo' } };
            const updated = lensPerson2Street.set(withAddress, 'bar');
            expect(lensPerson2Street.view(updated)).toEqual('bar');
            // but not reference equal
            expect(updated).not.toBe(withAddress);
        });
        it('set can short-circuit null values', () => {
            const noAddress = { address: null };
            const updated = lensPerson2Street.set(noAddress, 'bar');
            expect(updated).toEqual(noAddress);
            // but not reference equal
            expect(updated).not.toBe(noAddress);
        });
        it('can override', () => {
            const withAddress = { address: { street: 'foo' } };
            const updated = lensPerson2Street.over(withAddress, duplicate);
            expect(lensPerson2Street.view(updated)).toEqual('foofoo');
            // but not reference equal
            expect(updated).not.toBe(withAddress);
        });
    });
    describe('cast union type', () => {
        const lens4CompanyTitle = lens_1.lensFor().withPath('owner').cast().then(lens_1.lensFor().withPath('title'));
        it('can view', () => {
            expect(lens4CompanyTitle.view({ owner: { title: 'title foo' } })).toEqual('title foo');
        });
        it('can not view incorrect variant', () => {
            expect(lens4CompanyTitle.view({ owner: { name: 'foo', address: null } })).toBeUndefined();
        });
        it('can set', () => {
            const updated = lens4CompanyTitle.set({ owner: { title: 'title foo' } }, 'title bar');
            expect(lens4CompanyTitle.view(updated)).toEqual('title bar');
        });
        xit('can not set incorrect variant', () => {
            const withoutCompany = { owner: { name: 'foo', address: null } };
            const updated = lens4CompanyTitle.set(withoutCompany, 'title bar');
            expect(updated).toEqual(withoutCompany);
        });
    });
});
