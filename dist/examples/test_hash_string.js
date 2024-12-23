"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const data = 'TEST-PARTNER';
// hashString & to mask data string
console.log('email hash', index_1.default.hashString(data));
console.log('to mask', index_1.default.toMask(data));
