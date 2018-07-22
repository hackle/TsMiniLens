"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapNullable(f, n) { return n == null ? n : f(n); }
class Lens {
    constructor(fields) {
        this.fields = fields;
    }
    view(obj) {
        return this.fields.reduce((st, cur) => mapNullable(_ => st[cur], st), obj);
    }
    set(obj, val) {
        return this.over(obj, _ => val);
    }
    over(obj, func) {
        return this.fields.reduceRight((st, cur) => next => mapNullable(_ => (Object.assign({}, next, { [cur]: st(next[cur]) })), next), func)(obj);
    }
    cast() { return new Lens(this.fields); }
    then(next) {
        return new Lens([...this.fields, ...next.fields]);
    }
}
exports.Lens = Lens;
function lensFor() {
    return {
        withPath(...ps) { return new Lens(ps); }
    };
}
exports.lensFor = lensFor;
