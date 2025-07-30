import { Buffer } from 'buffer';
declare function pkcs5Padding(plainText: Buffer): Buffer;
declare function pkcs7Unpadding(plainText: Buffer): Buffer;
declare function pkcs5UnPadding(src: Buffer): Buffer;
declare const _default: {
    checkKeyInput: (key: any) => void | Error;
    generateRandomIV: (size?: number) => any;
    pkcs5Padding: typeof pkcs5Padding;
    pkcs5UnPadding: typeof pkcs5UnPadding;
    pkcs7Unpadding: typeof pkcs7Unpadding;
    KEY_SIZE_1KB: number;
    KEY_SIZE_2KB: number;
    KEY_SIZE_4KB: number;
    HMAC_MINIMUM_KEY_SIZE: number;
    AES_128_KEY_SIZE: number;
    AES_192_KEY_SIZE: number;
    AES_256_KEY_SIZE: number;
};
export default _default;
