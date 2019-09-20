import { Lens } from "./lens";

type ValueOrFunc<T> = T | ((t: T) => T);
class SetSequentially<Tfrom> {
    private setters: ((m: Tfrom) => Tfrom)[] = [];

    thenWith<Tto>(l: Lens<Tfrom, Tto>, v: ValueOrFunc<Tto>): SetSequentially<Tfrom> {
        this.setters.push(m => v instanceof Function ? l.over(m, v) : l.set(m, v));

        return this;
    }

    apply(m: Tfrom): Tfrom {
        return this.setters.reduce((m1, f) => f(m1), m);
    }
}

export function setSequentially<Tfrom, Tto>(l: Lens<Tfrom, Tto>, v: ValueOrFunc<Tto>) : SetSequentially<Tfrom> {
    return new SetSequentially<Tfrom>().thenWith(l, v);
}