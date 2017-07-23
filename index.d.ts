export interface Options {
    primitivesCacheLimit?: number;
}

export declare function memoize<F extends Function>(fn: F, options?: Options): F;

export default memoize;