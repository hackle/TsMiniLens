import { Lens, Mapped } from "./lens";

export type Level = 1 | 2 | 3 | 4 | 5;
export type IncrLevel<L extends Level> = L extends 1 ?
                        2 : L extends 2 ?
                        3 : L extends 3 ?
                        4 : L extends 4 ?
                        5 : never;
type LensOrMapped<TFrom, T, T1, L extends Level> = L extends 1 ? Lens<TFrom, T1> : Mapped<TFrom, T, T1, L>;

export type ChainedLensMaker<TFrom, T, L extends Level = 1> = {
    withPath(): LensOrMapped<TFrom, T, T, L>;
    withPath<
        P1 extends keyof T
        >(
            p1: P1
        ): LensOrMapped<TFrom, T, T[P1], L>;

    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1]
        >(
            p1: P1, 
            p2: P2
        ): LensOrMapped<TFrom, T, T[P1][P2], L>;
    
    withPath<
        P1 extends keyof T, 
        P2 extends keyof T[P1],
        P3 extends keyof T[P1][P2]
        >(
            p1: P1, 
            p2: P2,
            p3: P3
        ): LensOrMapped<TFrom, T, T[P1][P2][P3], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4][P5], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4][P5][P6], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4][P5][P6][P7], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4][P5][P6][P7][P8], L>;
    
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
        ): LensOrMapped<TFrom, T, T[P1][P2][P3][P4][P5][P6][P7][P8][P9], L>;
};

export type LensMaker<T> = ChainedLensMaker<T, T>;

export type ChainedLensMakerAlias<T1, T2> = { to: ChainedLensMaker<T1, T2>['withPath'] };
export type LensMakerAlias<T> = ChainedLensMakerAlias<T, T>;
export type PathMaker<T, T1, L extends Level> = ChainedLensMaker<T, T1, L>['withPath'];