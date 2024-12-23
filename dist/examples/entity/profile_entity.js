"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
// entity.ts
const types_1 = require("../../crypto-ts/lib/types");
const index_1 = require("../../index");
const typeorm_1 = require("typeorm");
let Profile = class Profile {
};
exports.Profile = Profile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    index_1.default.DBColumn('id'),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('bytea'),
    index_1.default.DBColumn('name'),
    index_1.default.BidxCol('name_bidx'),
    index_1.default.FullTextSearch(true),
    __metadata("design:type", types_1.AesCipher)
], Profile.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Profile.prototype, "name_bidx", void 0);
__decorate([
    (0, typeorm_1.Column)('bytea'),
    index_1.default.DBColumn('email'),
    index_1.default.BidxCol('email_bidx'),
    index_1.default.TxtHeapTable('email_text_heap'),
    __metadata("design:type", types_1.AesCipher)
], Profile.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Profile.prototype, "email_bidx", void 0);
__decorate([
    (0, typeorm_1.Column)('bytea'),
    index_1.default.DBColumn('phone'),
    index_1.default.BidxCol('phone_bidx'),
    index_1.default.TxtHeapTable('phone_text_heap'),
    __metadata("design:type", Buffer)
], Profile.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Profile.prototype, "phone_bidx", void 0);
exports.Profile = Profile = __decorate([
    (0, typeorm_1.Entity)('profile')
], Profile);
