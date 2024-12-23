"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const index_1 = require("../index");
const profile_entity_1 = require("./entity/profile_entity");
const aes_encryption_1 = require("../crypto-ts/lib/aes_encryption");
const config_1 = require("../crypto-ts/lib/config");
// Example usage
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const dt = yield (0, config_1.dt_conf)();
    const profile = new profile_entity_1.Profile();
    profile.name = (0, aes_encryption_1.encryptWithAes)('AES_256_CBC', 'Dyaksa Rahadia');
    profile.email = (0, aes_encryption_1.encryptWithAes)('AES_256_CBC', 'dyaksa.rahadian@gmail.com');
    profile.phone = (0, aes_encryption_1.encryptWithAes)('AES_256_CBC', '0899361449');
    const blindIdx = yield index_1.default.buildBlindIndex(profile);
    console.log(blindIdx);
    // Create an SQL query for insertion
    const query = `
        INSERT INTO "profile" 
        (name, name_bidx, email, email_bidx, phone, phone_bidx) 
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
        blindIdx.name,
        blindIdx.name_bidx,
        blindIdx.email,
        blindIdx.email_bidx,
        blindIdx.phone,
        blindIdx.phone_bidx,
    ];
    yield dt.query(query, values);
    console.log('User has been saved:', profile);
    yield dt.destroy();
});
main().catch((error) => console.log('Error:', error));
