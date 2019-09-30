import { Draft } from 'immer';
export declare function useImmox<S = any>(initialValue: S | (() => S)): [S, (f: (draft: Draft<S>) => void | S) => void];
export default useImmox;
