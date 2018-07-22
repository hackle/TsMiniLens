function mapNullable (f, n?) { return n == null ? n : f(n); }

class Lens<T, TField> {
    constructor(public fields: any[]) {
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

    cast<TOther>(): Lens<T, TOther> { return new Lens<T, TOther>(this.fields); }    

    then<TField, TField1>(next: Lens<TField, TField1>) {
        return new Lens<T, TField1>([...this.fields, ...next.fields]);
    }
}

export type LensMaker<T> = {
    withPath(): Lens<T, T>;
    withPath<
        P1 extends keyof T
        >(
            p1: P1
        ): Lens<T, T[P1]>;

    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1]
        >(
            p1: P1, 
            p2: P2
        ): Lens<T, T[P1][P2]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2]
        >(
            p1: P1, 
            p2: P2,
            p3: P3
        ): Lens<T, T[P1][P2][P3]>;
};

export function lensFor<T>(): LensMaker<T> {
    return <any>{
        withPath(...ps: string[]) { return new Lens(ps); }
    };
}