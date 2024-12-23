import { Buffer } from 'buffer';
export declare const decryptWithAes: (type: string, data: string | Buffer) => string;
export declare const encryptWithAes: (type: string, data: string | Buffer) => any;
export declare const hashString: (data: string) => string;
export declare const toMask: (data: string) => string;
