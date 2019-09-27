export declare function useImmox<State extends object>(initialState: State): (State | ((f: (draft: import("immer").Draft<State>) => void | State) => void))[];
export default useImmox;
