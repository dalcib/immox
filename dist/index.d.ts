import { Draft } from 'immer';
export declare function producer<T>(target: T, prop?: string | number | symbol, d?: PropertyDescriptor): any;
export declare function useImmox<S = any>(initialValue: S | (() => S)): [S, (f: (draft: Draft<S>) => void | S) => void];
export default useImmox;
declare type SetState = <S = any>(f: (draft: Draft<S>) => void | S) => void;
export { Draft, SetState };
