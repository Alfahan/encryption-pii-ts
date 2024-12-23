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
exports.buildBlindIndex = exports.searchContentFullText = exports.searchContents = exports.saveToHeap = exports.buildHeap = exports.validateEmail = exports.getLast8Characters = exports.split = void 0;
const hmac_1 = require("./hmac");
const types_1 = require("./types");
require("reflect-metadata");
const dotenv = require("dotenv");
const phone_1 = require("../validate/phone");
const nik_1 = require("../validate/nik");
const npwp_1 = require("../validate/npwp");
const config_1 = require("./config");
dotenv.config();
const getMetadata = (entity, key, metaKey) => {
    return Reflect.getMetadata(metaKey, entity, key);
};
const split = (value) => {
    let sep = ' ';
    const reg = '[a-zA-Z0-9]+';
    const regex = new RegExp(reg, 'g');
    if ((0, phone_1.isValidPhone)(value)) {
        const parsedPhone = (0, phone_1.parsePhone)(value);
        const phoneStr = (0, phone_1.phoneToString)(parsedPhone);
        sep = '-';
        value = phoneStr;
    }
    else if ((0, nik_1.isValidNIK)(value)) {
        const parseNik = (0, nik_1.parseNIK)(value);
        const nikStr = (0, nik_1.nikToString)(parseNik);
        sep = '.';
        value = nikStr;
    }
    else if ((0, npwp_1.isValidNPWP)(value)) {
        const parseNpwp = (0, npwp_1.parseNPWP)(value);
        const npwpStr = (0, npwp_1.npwpToString)(parseNpwp);
        sep = '.';
        value = npwpStr;
    }
    else if ((0, exports.validateEmail)(value)) {
        sep = '@';
    }
    const parts = value.split(sep);
    const result = parts.flatMap((part) => part.match(regex) || []);
    return result;
};
exports.split = split;
const getLast8Characters = (input) => {
    if (input.length <= 8) {
        return input;
    }
    return input.slice(-8);
};
exports.getLast8Characters = getLast8Characters;
const validateEmail = (email) => {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
};
exports.validateEmail = validateEmail;
const buildHeap = (value, typeHeap) => {
    const values = (0, exports.split)(value);
    const builder = new Set();
    const heaps = [];
    values.forEach((val) => {
        const valToLower = val.toLocaleLowerCase();
        const hash = (0, hmac_1.commonGenerateDigest)('SHA256', valToLower);
        const hash8LastChar = (0, exports.getLast8Characters)(hash);
        builder.add(hash8LastChar);
        heaps.push({
            content: valToLower,
            type: typeHeap,
            hash: hash8LastChar,
        });
    });
    return { str: Array.from(builder).join(''), heaps };
};
exports.buildHeap = buildHeap;
const saveToHeap = (textHeaps) => __awaiter(void 0, void 0, void 0, function* () {
    const dt = yield (0, config_1.dt_conf)();
    yield dt.transaction((entityManager) => __awaiter(void 0, void 0, void 0, function* () {
        // Group textHeaps by their type
        const textHeapsByType = textHeaps.reduce((acc, th) => {
            if (!acc[th.type]) {
                acc[th.type] = [];
            }
            acc[th.type].push(th);
            return acc;
        }, {});
        // Iterate over each group and perform the operations
        for (const type in textHeapsByType) {
            const group = textHeapsByType[type];
            // Extract all hashes from the current group
            const hashes = group.map((th) => th.hash);
            // Check existence of all hashes in one query
            const existQuery = `SELECT hash FROM ${type} WHERE hash = ANY($1)`;
            const existRes = yield entityManager.query(existQuery, [hashes]);
            // Create a Set of existing hashes for quick lookup
            const existingHashes = new Set(existRes.map((row) => row.hash));
            // Filter out textHeaps that already exist
            const newTextHeaps = group.filter((th) => !existingHashes.has(th.hash));
            if (newTextHeaps.length > 0) {
                // Prepare batch insert query
                const insertValues = [];
                const insertPlaceholders = [];
                newTextHeaps.forEach((th, index) => {
                    insertValues.push(th.content, th.hash);
                    insertPlaceholders.push(`($${2 * index + 1}, $${2 * index + 2})`);
                });
                const insertQuery = `INSERT INTO ${type} (content, hash) VALUES ${insertPlaceholders.join(', ')} ON CONFLICT DO NOTHING`;
                yield entityManager.query(insertQuery, insertValues);
            }
        }
    }));
});
exports.saveToHeap = saveToHeap;
// SearchContents
const searchContents = (table, args) => __awaiter(void 0, void 0, void 0, function* () {
    const dt = yield (0, config_1.dt_conf)();
    const query = `SELECT id, content, hash FROM ${table} WHERE content ILIKE '%' || $1 || '%'`;
    const parameters = [args.content.toLowerCase()];
    const result = yield dt.query(query, parameters);
    return result.map((row) => ({
        id: row.id,
        content: row.content,
        hash: row.hash,
    }));
});
exports.searchContents = searchContents;
// SearchContentFullText
const searchContentFullText = (table, args) => __awaiter(void 0, void 0, void 0, function* () {
    const dt = yield (0, config_1.dt_conf)();
    const lowerCaseContents = args.contents.map((content) => content.toLowerCase());
    const query = `SELECT id, content, hash FROM ${table} WHERE content = ANY($1::text[])`;
    const parameters = [lowerCaseContents];
    try {
        const result = yield dt.query(query, parameters);
        const sortedResult = args.contents
            .map((content) => {
            const row = result.find((row) => row.content.toLowerCase() === content.toLowerCase());
            return row
                ? {
                    id: row.id,
                    content: row.content,
                    hash: row.hash,
                }
                : null;
        })
            .filter(Boolean);
        return sortedResult;
    }
    catch (error) {
        console.error('Error executing searchContentFullText:', error);
        throw error;
    }
});
exports.searchContentFullText = searchContentFullText;
// buildBlindIndex
const buildBlindIndex = (entity) => __awaiter(void 0, void 0, void 0, function* () {
    const th = [];
    const result = {};
    for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
            const fieldName = getMetadata(entity, key, 'db');
            if (fieldName) {
                if (entity[key] instanceof types_1.AesCipher) {
                    let value = entity[key].To.toString();
                    let encryptWithAesBuf = entity[key].Value;
                    // assign encrypt to fieldName
                    result[fieldName] = encryptWithAesBuf;
                    const txtHeapTable = getMetadata(entity, key, 'txt_heap_table');
                    const fullTextSearch = getMetadata(entity, key, 'full_text_search');
                    if (txtHeapTable) {
                        const { str, heaps } = (0, exports.buildHeap)(value, txtHeapTable);
                        th.push(...heaps);
                        const bidxCol = getMetadata(entity, key, 'bidx_col');
                        if (bidxCol) {
                            result[bidxCol] = str;
                        }
                    }
                    else if (fullTextSearch) {
                        const digest = (0, hmac_1.commonGenerateDigest)('SHA256', value);
                        const field = getMetadata(entity, key, 'bidx_col');
                        if (field) {
                            result[field] = digest;
                        }
                    }
                }
            }
        }
    }
    yield (0, exports.saveToHeap)(th);
    return result;
});
exports.buildBlindIndex = buildBlindIndex;
