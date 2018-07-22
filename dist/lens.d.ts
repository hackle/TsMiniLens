export declare class Lens<T, TField> {
    fields: any[];
    constructor(fields: any[]);
    view(obj: T): TField;
    set(obj: T, val: TField): T;
    over(obj: T, func: (val: TField) => TField): T;
    cast<TOther>(): Lens<T, TOther>;
    then<TField, TField1>(next: Lens<TField, TField1>): Lens<T, TField1>;
}
export declare type LensMaker<T> = {
    withPath(): Lens<T, T>;
    withPath<P1 extends keyof T>(p1: P1): Lens<T, T[P1]>;
    withPath<P1 extends keyof T, P2 extends keyof T[P1]>(p1: P1, p2: P2): Lens<T, T[P1][P2]>;
    withPath<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(p1: P1, p2: P2, p3: P3): Lens<T, T[P1][P2][P3]>;
};
export declare function lensFor<T>(): LensMaker<T>;
