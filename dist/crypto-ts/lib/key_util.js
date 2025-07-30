"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const buffer_1 = require("buffer");
const KEY_SIZE_1KB = 1 << 10; // 1024
const KEY_SIZE_2KB = 1 << 11; // 2048
const KEY_SIZE_4KB = 1 << 12; // 4096
const HMAC_MINIMUM_KEY_SIZE = 8;
const AES_128_KEY_SIZE = 16;
const AES_192_KEY_SIZE = 24;
const AES_256_KEY_SIZE = 32;
const MIN_CUSTOM_KEY_LEN = 32;
const IV_SIZE = 12;
/**
 * @param size {number}
 * @return {string}
 */
const generateRandomIV = (size = IV_SIZE) => {
    const buf = buffer_1.Buffer.alloc(size);
    return (0, crypto_1.randomFillSync)(buf).toString('hex');
};
/**
 * Validate & check key input must be greater than minimum custom key length
 * @param key {any}
 * @return {void | Error}
 */
const checkKeyInput = (key) => {
    if (key.length < MIN_CUSTOM_KEY_LEN) {
        throw new Error(`key cannot be less than ${MIN_CUSTOM_KEY_LEN}`);
    }
};
function pkcs5Padding(plainText) {
    const blockSize = 16; // AES block size is 32 bytes
    const padding = blockSize - (plainText.length % blockSize);
    const padBuff = buffer_1.Buffer.alloc(padding, padding);
    return buffer_1.Buffer.concat([plainText, padBuff]);
}
function pkcs7Unpadding(plainText) {
    const padding = plainText[plainText.length - 1];
    return plainText.slice(0, plainText.length - padding);
}
function pkcs5UnPadding(src) {
    const length = src.length;
    const unpadding = src[length - 1];
    let newLength = unpadding - length;
    // Ensure newLength is positive by taking its absolute value
    newLength = Math.abs(newLength);
    return src.slice(0, newLength);
}
exports.default = {
    checkKeyInput,
    generateRandomIV,
    pkcs5Padding,
    pkcs5UnPadding,
    pkcs7Unpadding,
    KEY_SIZE_1KB,
    KEY_SIZE_2KB,
    KEY_SIZE_4KB,
    HMAC_MINIMUM_KEY_SIZE,
    AES_128_KEY_SIZE,
    AES_192_KEY_SIZE,
    AES_256_KEY_SIZE,
};
