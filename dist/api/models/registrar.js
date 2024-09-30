"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});
const User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
exports.default = User;
