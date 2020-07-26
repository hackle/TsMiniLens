import { LensMaker, ChainedLensMaker, ChainedLensMakerAlias, LensMakerAlias } from "./lensMaker";

function mapNullable (f, n) { return n == null ? n : f(n); }

export abstract class Lens<T, TField> {
    set<Tx extends T = T>(obj: Tx, val: TField): Tx {
        return this.over(obj, _ => val);
    }

    castIf<TField1 extends TField>(
        predicate: (o: TField) => o is TField1
    ): Lens<T, TField1> {
        return castIf(this, predicate);
    }

    chain<TField1>(
        lens1: Lens<TField, TField1>
    ): Lens<T, TField1> {
        return chain(this, lens1);
    }

    /*
    chain lenses in a slightly more fluent way than chain()
    */
    get then(): ChainedLensMaker<T, TField> & ChainedLensMakerAlias<T, TField> {
      return <any>{
            withPath: (...ps: string[]) => chain(this, new SimpleLens(ps)),
            to: (...ps: string[]) => chain(this, new SimpleLens(ps)),
        };
    }

    abstract view(obj: T): TField;
    abstract over<Tx extends T = T>(obj: Tx, func: (val: TField) => TField): Tx;
}

export class SimpleLens<T, TField> extends Lens<T, TField> {
    constructor(
        private fields: string[]
    ) {
        super();
    }

    view(obj: T): TField {
        return this.fields.reduce((st, cur) => mapNullable(_ => st[cur], st), obj);
    }

    set<Tx extends T = T>(obj: Tx, val: TField): Tx {
        return this.over(obj, _ => val);
    }

    over<Tx extends T = T>(obj: Tx, func: (val: TField) => TField): Tx {
        const setArrayAware = (o, fld, val) => o instanceof Array
            ? o.map((v, idx) => idx === fld ? val : v)
            : { ...o, [fld]: val };

        return this.fields.reduceRight(
            (st, cur) => next => mapNullable(_ => setArrayAware(next, cur, st(next[cur])), next),
            func
        )(obj as any);
    }
}

export class CastLens<T, TField, TField1 extends TField> extends Lens<T, TField1> {
    constructor (
        private inner: Lens<T, TField>,
        private predicate: (o: TField) => o is TField1
    ) { 
        super();
    }

    view(obj: T): TField1 {
        return mapNullable(
            v => this.predicate(v) ? v : undefined,
            this.inner.view(obj)
        );
    }

    set<Tx extends T = T>(obj: Tx, val: TField1): Tx {
        return this.over(obj, _ => val);
    }

    over<Tx extends T = T>(obj: Tx, func: (val: TField1) => TField1): Tx {
        // over/set should allow acting on null, or null prevents set / override from happening
        // because it won't satisfy the predicate 
        return this.inner.over(obj, v => null == v || this.predicate(v) ? func(v as any) : v);
    }
}

export class ChainedLens<TRoot, TField, TField1> extends Lens<TRoot, TField1> {
    constructor (
        private inner1: Lens<TRoot, TField>,
        private inner2: Lens<TField, TField1>
    ) { 
        super();
    }

    view(obj: TRoot): TField1 {
        return mapNullable(v => this.inner2.view(v), this.inner1.view(obj));
    }

    set<Tx extends TRoot = TRoot>(obj: Tx, val: TField1): Tx {
        return this.over(obj, _ => val);
    }

    over<Tx extends TRoot = TRoot>(obj: Tx, func: (val: TField1) => TField1): Tx {
        return this.inner1.over(obj, fld => this.inner2.over(fld, func));
    }
}

export function chain<T, TField, TField1>(
        lens1: Lens<T, TField>,
        lens2: Lens<TField, TField1>
): ChainedLens<T, TField, TField1> {
    return new ChainedLens(lens1, lens2);
}

export function lensFor<T>(): LensMaker<T> {
    return <any>{
        withPath(...ps: string[]) { return new SimpleLens(ps); }
    };
}

// alias for lensFor<T>().withPath()
export function lensFrom<T>(): LensMakerAlias<T> {
    return { to: lensFor<T>().withPath };
}

// an even terser alias
export function L<T>(): LensMakerAlias<T> { return lensFrom<T>(); }

export function castIf<T, TField, TField1 extends TField>(
    lens: Lens<T, TField>, 
    predicate: (o: TField) => o is TField1
): Lens<T, TField1> {
    return new CastLens<T, TField, TField1>(lens, predicate);
}