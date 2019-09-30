/// <reference types="react" />
declare class Person {
    firstName: string;
    surName: string;
    age: number;
    collection: number[];
    readonly sum: number;
    readonly average: number;
    readonly borned: number;
    readonly name: string;
    readonly even: number[];
    add(): void;
}
export declare const initPerson: Person;
export declare function Example(): JSX.Element;
export declare const objPerson: {
    firstName: string;
    surName: string;
    age: number;
    collection: number[];
    readonly sum: number;
    readonly average: number;
    readonly borned: number;
    readonly name: string;
    readonly even: number[];
    add(): void;
};
export {};
