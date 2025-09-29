const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleValue: { type: String, required: true, unique: true },
    roleName: { type: String, required: true },
    roleDescription: { type: String },
    permission: [{ type: String }],
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
