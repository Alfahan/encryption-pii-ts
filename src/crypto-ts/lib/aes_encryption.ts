import {
	CipherCCMOptions,
	DecipherGCM,
	DecipherCCM,
	DecipherOCB,
	createDecipheriv,
	createCipheriv,
} from 'crypto';
import { Buffer } from 'buffer';
import algorithms from './alg';
import keyUtil from './key_util';
import * as dotenv from 'dotenv';
import { AesCipher } from './types';
import { commonGenerateDigest } from './hmac';
import key_util from './key_util';

dotenv.config();

interface AlgorithmMeta {
	mode: string;
	ivLen: number;
	expectedKeyLen: number;
}

const DEFAULT_AUTH_TAG_LENGTH = 16;
const SUPPORTED_AUTH_TAG_MODES = ['gcm', 'ccm', 'ocb', 'chacha20-poly1305'];

/**
 * @param alg {string}
 * @return {{mode: *, ivLen: (number), expectedKeyLen: number}}
 */
const getMetaFromAlgorithm = (alg: string): AlgorithmMeta => {
	const algSplited = alg.split('-');
	if (algSplited.length < 3) {
		throw new Error(
			'Invalid AES algorithm format. Expected format: AES_<keyLength>_<mode>',
		);
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
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {string}
 */
// const decrypt = (alg: string, key: string, data: string | Buffer): string => {
// 	// Ensure data is a valid type
// 	if (typeof data !== 'object' && typeof data !== 'string') {
// 		throw new Error('Error: data param should be an object or string');
// 	}
// 	const metaAlg = getMetaFromAlgorithm(alg);
// 	// Validate key length
// 	if (key.length !== metaAlg.expectedKeyLen) {
// 		throw new Error(
// 			`Invalid key length, key length should be ${metaAlg.expectedKeyLen}`,
// 		);
// 	}
// 	const keyBuf = Buffer.from(key);
// 	if (keyBuf.length !== metaAlg.expectedKeyLen) {
// 		throw new Error(
// 			`Invalid key length after conversion, expected ${metaAlg.expectedKeyLen} bytes but got ${keyBuf.length} bytes`,
// 		);
// 	}
// 	// Convert data to a buffer if it's a string
// 	const encryptedBuffer = Buffer.from(data.toString(), 'hex');

// 	// For non-authenticated modes (CBC)
// 	if (encryptedBuffer.length < metaAlg.ivLen) {
// 		throw new Error('Invalid encrypted data: too short');
// 	}
// 	// Extract IV and encrypted data
// 	// const iv = encryptedBuffer.subarray(0, metaAlg.ivLen);
// 	// const encryptedData = encryptedBuffer.subarray(metaAlg.ivLen);
// 	// if (encryptedData.length === 0) {
// 	// 	throw new Error('Invalid encrypted data: no data to decrypt');
// 	// }

// 	const iv = encryptedBuffer.slice(0, 16);
// 	const encryptedData = encryptedBuffer.slice(16);

// 	// Create decipher instance
// 	const decipher = createDecipheriv(alg, keyBuf, iv);
// 	// Decrypt the data
// 	let decryptedData = Buffer.concat([
// 		decipher.update(encryptedData),
// 		decipher.final(),
// 	]);
// 	const unpadded = key_util.pkcs5UnPadding(decryptedData);
// 	return unpadded.toString('utf8');
// };

const decrypt = (alg: string, key: string, data: string | Buffer): string => {
	// Ensure data is a valid type
	if (typeof data !== 'object' && typeof data !== 'string') {
		throw new Error('Error: data param should be an object or string');
	}

	const metaAlg = getMetaFromAlgorithm(alg);

	// Validate key length
	if (key.length !== metaAlg.expectedKeyLen) {
		throw new Error(
			`Invalid key length, key length should be ${metaAlg.expectedKeyLen}`,
		);
	}

	const keyBuf = Buffer.from(key);

	if (keyBuf.length !== metaAlg.expectedKeyLen) {
		throw new Error(
			`Invalid key length after conversion, expected ${metaAlg.expectedKeyLen} bytes but got ${keyBuf.length} bytes`,
		);
	}

	// Convert data to a buffer if it's a string
	const encryptedBufferTemp = Buffer.isBuffer(data)
		? data
		: Buffer.from(data, 'hex');

	const asciiEncodedString = encryptedBufferTemp.toString('ascii');

	const encryptedBuffer = Buffer.from(asciiEncodedString, 'hex');

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
	const decipher = createDecipheriv(alg, keyBuf, iv);

	// Decrypt the data
	let decryptedData = Buffer.concat([
		decipher.update(encryptedData),
		decipher.final(),
	]);

	// Remove PKCS#5 (PKCS#7) padding
	const decryptData = keyUtil.pkcs5UnPadding(decryptedData);

	// Convert decrypted buffer to string
	return decryptData.toString('utf-8');
};

// const decrypt = (alg: string, key: string, data: string | Buffer): string => {
// 	// Ensure data is a valid type
// 	if (typeof data !== 'object' && typeof data !== 'string') {
// 		throw new Error('Error: data param should be an object or string');
// 	}

// 	const metaAlg = getMetaFromAlgorithm(alg);

// 	// Validate key length
// 	if (key.length !== metaAlg.expectedKeyLen) {
// 		throw new Error(
// 			`Invalid key length, key length should be ${metaAlg.expectedKeyLen}`,
// 		);
// 	}

// 	const keyBuf = Buffer.from(key);

// 	if (keyBuf.length !== metaAlg.expectedKeyLen) {
// 		throw new Error(
// 			`Invalid key length after conversion, expected ${metaAlg.expectedKeyLen} bytes but got ${keyBuf.length} bytes`,
// 		);
// 	}

// 	// Convert data to a buffer if it's a string
// 	// const encryptedBufferTemp = Buffer.from(data.toString(), 'hex');

// 	const encryptedBuffer = Buffer.from(data.toString(), 'hex');

// 	if (encryptedBuffer.length < 16) {
// 		throw new Error('Invalid encrypted data');
// 	}

// 	// Extract IV (first 16 bytes) and the encrypted data
// 	const iv = encryptedBuffer.slice(0, 16);
// 	const encryptedData = encryptedBuffer.slice(16);

// 	if (encryptedData.length % 16 !== 0) {
// 		throw new Error('Invalid encrypted data length');
// 	}

// 	// Create a decipher instance
// 	const decipher = createDecipheriv(alg, keyBuf, iv);

// 	// Decrypt the data
// 	let decryptedData = Buffer.concat([
// 		decipher.update(encryptedData),
// 		decipher.final(),
// 	]);

// 	// Remove PKCS#5 (PKCS#7) padding
// 	decryptedData = Buffer.from(keyUtil.pkcs7Unpadding(decryptedData));

// 	// Convert decrypted buffer to string
// 	return decryptedData.toString('utf-8');
// };

export const decryptWithAes = (type: string, data: string | Buffer): string => {
	const key = process.env.CRYPTO_AES_KEY;
	let decryptValue: string = null;
	switch (type) {
		case 'AES_128_CBC':
			decryptValue = decrypt(algorithms.AES_128_CBC, key, data);
			break;
		case 'AES_192_CBC':
			decryptValue = decrypt(algorithms.AES_192_CBC, key, data);
			break;
		case 'AES_256_CBC':
			decryptValue = decrypt(algorithms.AES_256_CBC, key, data);
			break;
		case 'AES_128_GCM':
			decryptValue = decrypt(algorithms.AES_128_GCM, key, data);
			break;
		case 'AES_192_GCM':
			decryptValue = decrypt(algorithms.AES_192_GCM, key, data);
			break;
		case 'AES_256_GCM':
			decryptValue = decrypt(algorithms.AES_256_GCM, key, data);
			break;
		case 'AES_128_CCM':
			decryptValue = decrypt(algorithms.AES_128_CCM, key, data);
			break;
		case 'AES_192_CCM':
			decryptValue = decrypt(algorithms.AES_192_CCM, key, data);
			break;
		case 'AES_256_CCM':
			decryptValue = decrypt(algorithms.AES_256_CCM, key, data);
			break;
		case 'AES_128_OCB':
			decryptValue = decrypt(algorithms.AES_128_OCB, key, data);
			break;
		case 'AES_192_OCB':
			decryptValue = decrypt(algorithms.AES_192_OCB, key, data);
			break;
		case 'AES_256_OCB':
			decryptValue = decrypt(algorithms.AES_256_OCB, key, data);
			break;
		default:
			throw new Error('Unsupported decryption type');
	}

	return decryptValue;
};

/**
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {{encrypted: string, nonce}}
 */
const encrypt = (alg: string, key: string, data: string | Buffer): Buffer => {
	const metaAlg = getMetaFromAlgorithm(alg);

	// Validate key length
	if (key.length !== metaAlg.expectedKeyLen) {
		throw new Error(
			`Invalid key length, key length should be ${metaAlg.expectedKeyLen}`,
		);
	}

	const keyBuf = Buffer.from(key);

	if (keyBuf.length !== metaAlg.expectedKeyLen) {
		throw new Error(
			`Invalid key length after conversion, expected ${metaAlg.expectedKeyLen} bytes but got ${keyBuf.length} bytes`,
		);
	}

	// Apply PKCS#5 (PKCS#7) padding
	const paddedData = keyUtil.pkcs5Padding(Buffer.from(data.toString('hex')));

	// Generate a random IV of 16 bytes (for AES)
	const iv = keyUtil.generateRandomIV(metaAlg.ivLen);
	const ivBuf = Buffer.from(iv, 'hex');

	// Create cipher instance
	const cipher = createCipheriv(alg, keyBuf, ivBuf);

	// Encrypt the padded data
	const encryptedData = Buffer.concat([
		ivBuf,
		cipher.update(paddedData),
		cipher.final(),
	]);

	// Return the result as a Buffer
	return Buffer.from(encryptedData.toString('hex'));
};

export const encryptWithAes = (type: string, data: string | Buffer): any => {
	const key = process.env.CRYPTO_AES_KEY;
	let encryptedValue: Buffer = null;
	switch (type) {
		case 'AES_128_CBC':
			encryptedValue = encrypt(algorithms.AES_128_CBC, key, data);
			break;
		case 'AES_192_CBC':
			encryptedValue = encrypt(algorithms.AES_192_CBC, key, data);
			break;
		case 'AES_256_CBC':
			encryptedValue = encrypt(algorithms.AES_256_CBC, key, data);
			break;
		case 'AES_128_GCM':
			encryptedValue = encrypt(algorithms.AES_128_GCM, key, data);
			break;
		case 'AES_192_GCM':
			encryptedValue = encrypt(algorithms.AES_192_GCM, key, data);
			break;
		case 'AES_256_GCM':
			encryptedValue = encrypt(algorithms.AES_256_GCM, key, data);
			break;
		case 'AES_128_CCM':
			encryptedValue = encrypt(algorithms.AES_128_CCM, key, data);
			break;
		case 'AES_192_CCM':
			encryptedValue = encrypt(algorithms.AES_192_CCM, key, data);
			break;
		case 'AES_256_CCM':
			encryptedValue = encrypt(algorithms.AES_256_CCM, key, data);
			break;
		case 'AES_128_OCB':
			encryptedValue = encrypt(algorithms.AES_128_OCB, key, data);
			break;
		case 'AES_192_OCB':
			encryptedValue = encrypt(algorithms.AES_192_OCB, key, data);
			break;
		case 'AES_256_OCB':
			encryptedValue = encrypt(algorithms.AES_256_OCB, key, data);
			break;
		default:
			throw new Error('Unsupported encryption type');
	}

	let cipher = new AesCipher();
	cipher.Value = encryptedValue;
	cipher.To = data.toString();

	return cipher;
};

export const hashString = (data: string): string => {
	return commonGenerateDigest('SHA256', data);
};

export const toMask = (data: string): string => {
	if (typeof data === 'string') {
		return data
			.split('')
			.map((char, index) => {
				if (index < 3 || index >= data.length - 3) {
					return char;
				}
				return '*';
			})
			.join('');
	}
	return '';
};
