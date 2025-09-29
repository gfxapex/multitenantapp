const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;






// 
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Role = require("../src/models/role_model"); // path apne project ke hisaab se adjust karo

// dotenv.config();

// const seedDefaultRoles = async () => {
//   const roles = [
//     {
//       roleValue: "admin",
//       roleName: "Administrator",
//       roleDescription: "Full access to the system",
//       permission: [
//         "ADMIN.DELETE_BLOG",
//         "ADMIN.DELETE_USER",
//         "ADMIN.BAN_USER",
//         "ADMIN.ADD_PERMISSION_TO_USER",
//         "ADMIN.ADD_PERMISSION_TO_ROLE",
//         "ADMIN.DELETE_PERMISSION_FROM_USER",
//         "ADMIN.DELETE_PERMISSION_FROM_ROLE",
//         "ADMIN.ADD_ROLE_TO_USER",
//         "ADMIN.DELETE_ROLE_FROM_USER",
//         "ADMIN.CREATE_ROLE",
//       ],
//     },
//     {
//       roleValue: "user",
//       roleName: "Default User",
//       roleDescription: "Regular registered user",
//       permission: [
//         "USER.LOGOUT",
//         "USER.UPDATE",
//         "USER.CHANGE_PASSWORD",
//         "BLOG.CREATE",
//         "BLOG.UPDATE",
//         "BLOG.DELETE",
//       ],
//     },
//   ];

//   for (const role of roles) {
//     const exists = await Role.findOne({ roleValue: role.roleValue });
//     if (!exists) {
//       await Role.create(role);
//       console.log(`✅ Default role '${role.roleValue}' created`);
//     }
//   }
// };

// const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("✅ Successfully connected");

//     // ⬇️ seed function call karo yahin pe
//     await seedDefaultRoles();
//   } catch (error) {
//     console.error("❌ Error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDb;
