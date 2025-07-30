import CryptoTs from '../index';

const data = 'LEMBAGA KEBIJAKAN PENGADAAN BARANG/JASA PEMERINTAH (LKPP)';

// Encrypt
const encryptedHex = CryptoTs.encryptWithAes('AES_256_CBC', data);
console.log('Encrypted Data (Hex):', encryptedHex.Value.toString());

// Decrypt
const decryptedData = CryptoTs.decryptWithAes(
	'AES_256_CBC',
	'a2d85256a0ec7cef518801e51c66a3c05efd6a3507d02c9fe89eff05f0de7fe611596be2d2d1152f1d86cdc34c17d2b749b00b46927243faa9130efc26d84a6982ad5fb42a7011ce5969446b7c1d7362',
);
console.log('Decrypt Data:', decryptedData);

// const decryptedData = CryptoTs.decryptWithAes(
// 	'AES_256_CBC',
// 	'82333ad7a41935ea2c262ea201d125ad20636b4c5bd5619faae94bc42b7bcfdc21ff947a4605acd5a330fc4d413c642d2a7f349d36a889467c9e520e3e18f9532a96c38f19ca59079d7631faabfb4fc5',
// );

// console.log('Decrypt Data:', decryptedData);
