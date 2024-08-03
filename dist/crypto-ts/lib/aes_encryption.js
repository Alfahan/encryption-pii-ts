"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptWithAes = exports.decryptWithAes = void 0;
const crypto_1 = require("crypto");
const buffer_1 = require("buffer");
const alg_1 = require("./alg");
const key_util_1 = require("./key_util");
const dotenv = require("dotenv");
const types_1 = require("./types");
dotenv.config();
/**
 * @param alg {string}
 * @return {{mode: *, ivLen: (number), expectedKeyLen: number}}
 */
const getMetaFromAlgorithm = (alg) => {
    const algSplited = alg.split('-');
    if (algSplited.length < 3) {
        throw new Error('Invalid AES algorithm format. Expected format: AES_<keyLength>_<mode>');
    }
    const keyLenInt = parseInt(algSplited[1], 10);
    let ivLen;
    switch (algSplited[2].toLowerCase()) {
        case 'cbc':
            ivLen = 16;
            break;
        case 'ocb':
            ivLen = 15; // Set to 15 for OCB mode, but can be adjusted as needed
            break;
        default:
            ivLen = 12; // Default IV length
            break;
    }
    return { expectedKeyLen: keyLenInt / 8, mode: algSplited[2], ivLen };
};
/**
 * Shim for difficult createCipheriv method
 *
 * @param algorithm
 * @param key
 * @param iv
 * @param options
 * @returns
 */
const createCipherivShim = (algorithm, key, iv, options) => {
    const cipher = (0, crypto_1.createCipheriv)(algorithm, key, iv, options);
    return cipher;
};
/**
 * Shim for difficult createCipheriv method
 *
 * @param algorithm
 * @param key
 * @param iv
 * @param options
 * @returns
 */
const createDecipherivShim = (algorithm, key, iv, options) => {
    const cipher = (0, crypto_1.createDecipheriv)(algorithm, key, iv, options);
    return cipher;
};
/**
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {Buffer}
 */
const decrypt = (alg, key, data) => {
    // Ensure data is a valid type
    if (typeof data !== 'object' && typeof data !== 'string') {
        throw new Error('Error: data param should be an object or string');
    }
    const metaAlg = getMetaFromAlgorithm(alg);
    // Validate key length
    if (key.length !== metaAlg.expectedKeyLen) {
        throw new Error(`Invalid key length, key length should be ${metaAlg.expectedKeyLen}`);
    }
    const keyBuf = buffer_1.Buffer.from(key, 'utf8'); // Adjusted to 'utf8' for standard string keys
    if (keyBuf.length !== metaAlg.expectedKeyLen) {
        throw new Error(`Invalid key length after conversion, expected ${metaAlg.expectedKeyLen} bytes but got ${keyBuf.length} bytes`);
    }
    // Convert data to a buffer if it's a string
    const encryptedBuffer = buffer_1.Buffer.isBuffer(data) ? data : buffer_1.Buffer.from(data, 'hex');
    if (encryptedBuffer.length < 16) {
        throw new Error('Invalid encrypted data');
    }
    // Extract IV (first 16 bytes) and the encrypted data
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedData = encryptedBuffer.slice(16);
    if (encryptedData.length % 16 !== 0) {
        throw new Error('Invalid encrypted data length');
    }
    // Create a decipher instance
    const decipher = (0, crypto_1.createDecipheriv)(alg, keyBuf, iv);
    // Decrypt the data
    const decryptedData = buffer_1.Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
    ]);
    // Remove PKCS#5 (PKCS#7) padding
    const unpaddedData = key_util_1.default.pkcs5UnPadding(decryptedData);
    // Convert decrypted buffer to string
    return unpaddedData.toString('utf-8');
};
const decryptWithAes = (type, data) => {
    const key = process.env.CRYPTO_AES_KEY;
    let decryptValue = null;
    switch (type) {
        case 'AES_128_CBC':
            decryptValue = decrypt(alg_1.default.AES_128_CBC, key, data);
            break;
        case 'AES_192_CBC':
            decryptValue = decrypt(alg_1.default.AES_192_CBC, key, data);
            break;
        case 'AES_256_CBC':
            decryptValue = decrypt(alg_1.default.AES_256_CBC, key, data);
            break;
        case 'AES_128_GCM':
            decryptValue = decrypt(alg_1.default.AES_128_GCM, key, data);
            break;
        case 'AES_192_GCM':
            decryptValue = decrypt(alg_1.default.AES_192_GCM, key, data);
            break;
        case 'AES_256_GCM':
            decryptValue = decrypt(alg_1.default.AES_256_GCM, key, data);
        case 'AES_128_CCM':
            decryptValue = decrypt(alg_1.default.AES_128_CCM, key, data);
        case 'AES_192_CCM':
            decryptValue = decrypt(alg_1.default.AES_192_CCM, key, data);
            break;
        case 'AES_256_CCM':
            decryptValue = decrypt(alg_1.default.AES_256_CCM, key, data);
            break;
        case 'AES_128_OCB':
            decryptValue = decrypt(alg_1.default.AES_128_OCB, key, data);
            break;
        case 'AES_192_OCB':
            decryptValue = decrypt(alg_1.default.AES_192_OCB, key, data);
            break;
        case 'AES_256_OCB':
            decryptValue = decrypt(alg_1.default.AES_256_OCB, key, data);
            break;
        default:
            throw new Error('Unsupported decryption type');
    }
    return decryptValue;
};
exports.decryptWithAes = decryptWithAes;
/**
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {{encrypted: string, nonce}}
 */
const encrypt = (alg, key, data) => {
    const metaAlg = getMetaFromAlgorithm(alg);
    console.log(key.length, metaAlg);
    if (key.length !== metaAlg.expectedKeyLen) {
        throw new Error(`invalid key length, key length should be ${metaAlg.expectedKeyLen}`);
    }
    const plainDataPadded = key_util_1.default.pkcs5Padding(buffer_1.Buffer.from(data));
    // Generate random IV (initialization vector)
    const iv = buffer_1.Buffer.alloc(16); // 16 bytes for AES block size
    key_util_1.default.generateRandIV(iv);
    const keyB = buffer_1.Buffer.from(key);
    // Create cipher instance
    const cipher = (0, crypto_1.createCipheriv)(alg, keyB, iv);
    // Encrypt the padded data
    const encrypted = buffer_1.Buffer.concat([
        cipher.update(plainDataPadded),
        cipher.final(),
    ]);
    // Concatenate IV and encrypted data into one buffer
    const resultBuffer = buffer_1.Buffer.concat([iv, encrypted]);
    return resultBuffer;
};
const encryptWithAes = (type, data) => {
    const key = process.env.CRYPTO_AES_KEY;
    let encryptedValue = null;
    switch (type) {
        case 'AES_128_CBC':
            encryptedValue = encrypt(alg_1.default.AES_128_CBC, key, data);
            break;
        case 'AES_192_CBC':
            encryptedValue = encrypt(alg_1.default.AES_192_CBC, key, data);
            break;
        case 'AES_256_CBC':
            encryptedValue = encrypt(alg_1.default.AES_256_CBC, key, data);
            break;
        case 'AES_128_GCM':
            encryptedValue = encrypt(alg_1.default.AES_128_GCM, key, data);
            break;
        case 'AES_192_GCM':
            encryptedValue = encrypt(alg_1.default.AES_192_GCM, key, data);
            break;
        case 'AES_256_GCM':
            encryptedValue = encrypt(alg_1.default.AES_256_GCM, key, data);
            break;
        case 'AES_128_CCM':
            encryptedValue = encrypt(alg_1.default.AES_128_CCM, key, data);
            break;
        case 'AES_192_CCM':
            encryptedValue = encrypt(alg_1.default.AES_192_CCM, key, data);
            break;
        case 'AES_256_CCM':
            encryptedValue = encrypt(alg_1.default.AES_256_CCM, key, data);
            break;
        case 'AES_128_OCB':
            encryptedValue = encrypt(alg_1.default.AES_128_OCB, key, data);
            break;
        case 'AES_192_OCB':
            encryptedValue = encrypt(alg_1.default.AES_192_OCB, key, data);
            break;
        case 'AES_256_OCB':
            encryptedValue = encrypt(alg_1.default.AES_256_OCB, key, data);
            break;
        default:
            throw new Error('Unsupported encryption type');
    }
    let cipher = new types_1.AesCipher();
    cipher.Value = encryptedValue;
    cipher.To = data.toString();
    return cipher;
};
exports.encryptWithAes = encryptWithAes;
