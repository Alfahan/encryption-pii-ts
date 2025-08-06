import CryptoTs from '../index';

const data = 'LEMBAGA KEBIJAKAN PENGADAAN BARANG/JASA PEMERINTAH (LKPP)';

// Encrypt
const encryptedHex = CryptoTs.encryptWithAes('AES_256_CBC', data);
console.log('Encrypted Data (Hex):', encryptedHex.Value.toString());

// Decrypt
const decryptedData = CryptoTs.decryptWithAes(
	'AES_256_CBC',
	Buffer.from(
		'd34ec05df32ed62be7aef38dedebecf72700ef86a1bdc80545dbf8ce74dc18464cde45ac744a45b386c199dc1c1490e4108c87e53d45cff93d4d0d02f2a0940eab85b9b7163f3b50f1f05cf86dbba7c5',
	),
	// 'd34ec05df32ed62be7aef38dedebecf72700ef86a1bdc80545dbf8ce74dc18464cde45ac744a45b386c199dc1c1490e4108c87e53d45cff93d4d0d02f2a0940eab85b9b7163f3b50f1f05cf86dbba7c5',
);
console.log('Decrypt Data:', decryptedData);

// const decryptedData = CryptoTs.decryptWithAes(
// 	'AES_256_CBC',
// 	'82333ad7a41935ea2c262ea201d125ad20636b4c5bd5619faae94bc42b7bcfdc21ff947a4605acd5a330fc4d413c642d2a7f349d36a889467c9e520e3e18f9532a96c38f19ca59079d7631faabfb4fc5',
// );

// console.log('Decrypt Data:', decryptedData);
