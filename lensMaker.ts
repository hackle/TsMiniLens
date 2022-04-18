import { Lens } from "./lens";

type KeyOf<T> = T extends infer A 
    ? (A extends any ? keyof A : never)
    : never;
type KeyType = string | number | symbol;

type ValOf<T, K> = 
    K extends KeyType
    ? T extends infer T1 
        ? T1 extends { [k in K]?: infer V }
            ? V
            : T1 extends Array<infer V>
                ? K extends number
                    ? V
                    : never
                : never
        : never
    : never;

// const e1: string[] extends { [1]: any } ? true : false = 

type ValOfPath<T, Ks extends KeyType[] = []> =
    Ks extends [infer K1, ...infer Kr]
    ? Kr extends KeyType[]
        ? ValOf<T, K1> extends never    // this short-circuits as soon as never is hit
            ? T
            : ValOfPath<ValOf<T, K1>, Kr>
        : never
    : T;

// the manual recursion could be replaced with another recursive type
export type ChainedLensMaker<TFrom, TField = TFrom> = {
    withPath<
        P1 extends KeyOf<ValOfPath<TField, []>> = never, 
        P2 extends KeyOf<ValOfPath<TField, [P1]>> = never,
        P3 extends KeyOf<ValOfPath<TField, [P1, P2]>> = never,
        P4 extends KeyOf<ValOfPath<TField, [P1, P2, P3]>> = never,
        P5 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4]>> = never,
        P6 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5]>> = never,
        P7 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6]>> = never,
        P8 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7]>> = never,
        P9 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8]>> = never,
        P10 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9]>> = never,
        P11 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10]>> = never,
        P12 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11]>> = never,
        P13 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12]>> = never,
        P14 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13]>> = never,
        P15 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14]>> = never,
        P16 extends KeyOf<ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15]>> = never,
        >(
            p1?: P1, 
            p2?: P2,
            p3?: P3,
            p4?: P4,
            p5?: P5,
            p6?: P6,
            p7?: P7,
            p8?: P8,
            p9?: P9,
            p10?: P10,
            p11?: P11,
            p12?: P12,
            p13?: P13,
            p14?: P14,
            p15?: P15,
            p16?: P16,
        ): Lens<TFrom, ValOfPath<TField, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16]>>;
};

export type LensMaker<T> = ChainedLensMaker<T>;

export type ChainedLensMakerAlias<T1, TField = T1> = { to: ChainedLensMaker<T1, TField>['withPath'] };
export type LensMakerAlias<T, TField = T> = ChainedLensMakerAlias<T, TField>;