import { decryptWithAes, encryptWithAes} from "./crypto-ts/lib/aes_encryption";
import { BidxCol, DBColumn, TxtHeapTable } from "./crypto-ts/lib/decorator";
import { buildBlindIndex, searchContentFullText, searchContents, split } from "./crypto-ts/lib/query";
import { AesCipher } from "./crypto-ts/lib/types";

const CryptoTs = {
    DBColumn,
    BidxCol,
    TxtHeapTable,
    encryptWithAes,
    decryptWithAes,
	buildBlindIndex,
	searchContents,
	searchContentFullText,
	split,
	AesCipher
};

export default CryptoTs;
