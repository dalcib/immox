/// <reference types="react" />
import { immerable } from 'immer';
declare class Person {
    [immerable]: boolean;
    firstName: string;
    surName: string;
    age: number;
    collection: number[];
    readonly sum: number;
    readonly average: number;
    readonly borned: number;
    readonly name: string;
    readonly even: number[];
    add(x: any): void;
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
    add(x: any): void;
};
export {};
