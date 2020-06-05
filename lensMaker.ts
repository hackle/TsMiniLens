import { Lens } from "./lens";

// key of
type K<T> = T extends Array<infer U> ? keyof T | '[]' : keyof T;

// field of
type F<T, K> = K extends keyof T ? T[K] : never;

// element of
type E<T, I extends K<T>> = T extends Array<infer U> ? 
                                        I extends '[]' ? U : F<T, I> : 
                                    F<T, I>;

export type ChainedLensMaker<TFrom, T> = {
    withPath(): Lens<TFrom, T>;
    withPath<
        P1 extends K<T>
        >(
            p1: P1
        ): Lens<TFrom, E<T, P1>>;

    withPath<
        P1 extends K<T>, 
        P2 extends K<E<T, P1>>
        >(
            p1: P1, 
            p2: P2
        ): Lens<TFrom, E<E<T, P1>, P2>>;
    
    withPath<
        P1 extends K<T>, 
        P2 extends K<E<T, P1>>,
        P3 extends K<E<E<T, P1>, P2>>
        >(
            p1: P1, 
            p2: P2,
            p3: P3
        ): Lens<TFrom, E<E<E<T, P1>, P2>, P3>>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4]>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4][P5]>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4][P5][P6]>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4][P5][P6][P7]>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4][P5][P6][P7][P8]>;
    
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
        ): Lens<TFrom, T[P1][P2][P3][P4][P5][P6][P7][P8][P9]>;
};

export type LensMaker<T> = ChainedLensMaker<T, T>;

export type ChainedLensMakerAlias<T1, T2> = { to: ChainedLensMaker<T1, T2>['withPath'] };
export type LensMakerAlias<T> = ChainedLensMakerAlias<T, T>;