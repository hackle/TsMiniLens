import { LensMaker, ObscureLensMaker } from "./lensMaker";

function mapNullable (f, n) { return n == null ? n : f(n); }

export abstract class Lens<T, TField> {
    set(obj: T, val: TField): T {
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
    get then(): ObscureLensMaker<T, TField> {
        return <any>{
            withPath: (...ps: string[]) => chain(this, new SimpleLens(ps))
        };
    }

    abstract view(obj: T): TField;
    abstract over(obj: T, func: (val: TField) => TField): T;
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

    set(obj: T, val: TField): T {
        return this.over(obj, _ => val);
    }

    over(obj: T, func: (val: TField) => TField): T {
        return this.fields.reduceRight(
            (st, cur) => next => mapNullable(_ => ({ ...next, [cur]: st(next[cur]) }), next),
            func
        )(obj);
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

    set(obj: T, val: TField1): T {
        return this.over(obj, _ => val);
    }

    over(obj: T, func: (val: TField1) => TField1): T {
        return this.inner.over(obj, v => this.predicate(v) ? func(v) : v);
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

    set(obj: TRoot, val: TField1): TRoot {
        return this.over(obj, _ => val);
    }

    over(obj: TRoot, func: (val: TField1) => TField1): TRoot {
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

export function castIf<T, TField, TField1 extends TField>(
    lens: Lens<T, TField>, 
    predicate: (o: TField) => o is TField1
): Lens<T, TField1> {
    return new CastLens<T, TField, TField1>(lens, predicate);
}