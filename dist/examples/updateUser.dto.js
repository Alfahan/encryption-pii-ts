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
exports.UpdateUserDto = void 0;
const index_1 = require("../index");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    index_1.default.DBColumn('name'),
    index_1.default.BidxCol('bidx_name'),
    index_1.default.TxtHeapTable('name_text_heap'),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    index_1.default.DBColumn('email'),
    index_1.default.BidxCol('bidx_email'),
    index_1.default.TxtHeapTable('email_text_heap'),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    index_1.default.DBColumn('address'),
    index_1.default.BidxCol('bidx_address'),
    index_1.default.TxtHeapTable('address_text_heap'),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    index_1.default.DBColumn('age'),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "age", void 0);
__decorate([
    index_1.default.DBColumn('password'),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
