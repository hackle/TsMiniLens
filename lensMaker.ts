import { SimpleLens } from "./lens";

/*
This is obscure indeed - help simplify!
Think THost and T as the same type being navigated.
They should only be different when we try to chain 2 lenses, one for THost and one for T.
See its usage in LensMaker<T>, as well as then() in lens.ts
*/
export type ObscureLensMaker<THost, T> = {
    withPath(): SimpleLens<THost, T>;
    withPath<
        P1 extends keyof T
        >(
            p1: P1
        ): SimpleLens<THost, T[P1]>;

    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1]
        >(
            p1: P1, 
            p2: P2
        ): SimpleLens<THost, T[P1][P2]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2]
        >(
            p1: P1, 
            p2: P2,
            p3: P3
        ): SimpleLens<THost, T[P1][P2][P3]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3]
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4
        ): SimpleLens<THost, T[P1][P2][P3][P4]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3],
        P5 extends keyof T[P1][P2][P3][P4],
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4,
            p5: P5
        ): SimpleLens<THost, T[P1][P2][P3][P4][P5]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3],
        P5 extends keyof T[P1][P2][P3][P4],
        P6 extends keyof T[P1][P2][P3][P4][P5],
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4,
            p5: P5,
            p6: P6
        ): SimpleLens<THost, T[P1][P2][P3][P4][P5][P6]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3],
        P5 extends keyof T[P1][P2][P3][P4],
        P6 extends keyof T[P1][P2][P3][P4][P5],
        P7 extends keyof T[P1][P2][P3][P4][P5][P6],
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4,
            p5: P5,
            p6: P6,
            p7: P7
        ): SimpleLens<THost, T[P1][P2][P3][P4][P5][P6][P7]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3],
        P5 extends keyof T[P1][P2][P3][P4],
        P6 extends keyof T[P1][P2][P3][P4][P5],
        P7 extends keyof T[P1][P2][P3][P4][P5][P6],
        P8 extends keyof T[P1][P2][P3][P4][P5][P6][P7],
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4,
            p5: P5,
            p6: P6,
            p7: P7,
            p8: P8,
        ): SimpleLens<THost, T[P1][P2][P3][P4][P5][P6][P7][P8]>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2],
        P4 extends keyof T[P1][P2][P3],
        P5 extends keyof T[P1][P2][P3][P4],
        P6 extends keyof T[P1][P2][P3][P4][P5],
        P7 extends keyof T[P1][P2][P3][P4][P5][P6],
        P8 extends keyof T[P1][P2][P3][P4][P5][P6][P7],
        P9 extends keyof T[P1][P2][P3][P4][P5][P6][P7][P8],
        >(
            p1: P1, 
            p2: P2,
            p3: P3,
            p4: P4,
            p5: P5,
            p6: P6,
            p7: P7,
            p8: P8,
            p9: P9,
        ): SimpleLens<THost, T[P1][P2][P3][P4][P5][P6][P7][P8][P9]>;
};

export type LensMaker<T> = ObscureLensMaker<T, T>;