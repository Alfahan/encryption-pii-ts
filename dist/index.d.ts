import { BidxCol, DBColumn, TxtHeapTable } from "./crypto-ts/lib/decorator";
import { AesCipher } from "./crypto-ts/lib/types";
declare const CryptoTs: {
    DBColumn: typeof DBColumn;
    BidxCol: typeof BidxCol;
    TxtHeapTable: typeof TxtHeapTable;
    encryptWithAes: (type: string, data: string | Buffer) => any;
    decryptWithAes: (type: string, data: string | Buffer) => string;
    buildBlindIndex: (dt: import("typeorm").DataSource, entity: any) => Promise<any>;
    searchContents: (datasource: import("typeorm").DataSource, table: string, args: import("./crypto-ts/lib/types").FindTextHeapByContentParams) => Promise<import("./crypto-ts/lib/types").FindTextHeapRow[]>;
    AesCipher: typeof AesCipher;
};
export default CryptoTs;
