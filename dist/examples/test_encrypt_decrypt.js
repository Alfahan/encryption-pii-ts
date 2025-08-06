"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const data = 'ARDIAN TELKOM FABD 漢字😀';
// Encrypt
const encryptedHex = index_1.default.encryptWithAes('AES_256_CBC', data);
// console.log('Encrypted Data (Hex):', encryptedHex.Value.toString());
// Decrypt
const decryptedData = index_1.default.decryptWithAes('AES_256_CBC', 
// '6f42b202d20cd981704c8e04183d9a0e973bd3c62835bc41349894409f064cc93abbd4b0a331b9370df888162902197d',
// '9e1b6475ba75b3cc406ed3ee9810194a5bd72870720508bf7fc913d176e80ddb42c0d4604dc419ebe6c98e0696472a655c1edef4e3b85c80a13d792fc91b58a2b37aa831056fba021280b65675cc0567',
'd34ec05df32ed62be7aef38dedebecf72700ef86a1bdc80545dbf8ce74dc18464cde45ac744a45b386c199dc1c1490e4108c87e53d45cff93d4d0d02f2a0940eab85b9b7163f3b50f1f05cf86dbba7c5');
console.log(decryptedData);
// const decryptedData = CryptoTs.decryptWithAes(
// 	'AES_256_CBC',
// 	'82333ad7a41935ea2c262ea201d125ad20636b4c5bd5619faae94bc42b7bcfdc21ff947a4605acd5a330fc4d413c642d2a7f349d36a889467c9e520e3e18f9532a96c38f19ca59079d7631faabfb4fc5',
// );
// console.log('Decrypt Data:', decryptedData);
