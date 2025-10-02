const express = require ("express");
const  connectDb  = require ("./db/db.js");
const dotenv = require ("dotenv");
const { globalErrorHandler, PERMISSIONS } = require ("./src/utils/index.js");
const  {authGuard}  = require ("./src/middlewares/index.js");
const cors = require ('cors')
const {adminRouter,authRouter,blogRouter,userRouter,
} = require ("./src/routes/index.js");
const  {Role}  = require ("./src/models/index.js");
const cookieParser = require ("cookie-parser");

// 
console.log({ adminRouter, authRouter, blogRouter, userRouter });

// 

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
]
const corsOptions = {
  origin:function(origin,callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null,true)
    }else{
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus:200,
  methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials:true,
}
// ====== Middlewares ======
dotenv.config({ path: "./.env" });
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true,limit:"2mb" }));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/v1/auth", authRouter);

// auth guard
app.use(authGuard);

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);


app.use(globalErrorHandler);
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connectDb();
    await init()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Something went wrong");
  }
})();

const init = async () => {
  let userRole = await Role.findOne({ roleValue: "user" });
  if (!userRole) {
    userRole = new Role({
      roleValue: "user",
      roleName: "User",
      roleDescription: "Normal User",
    });
    await userRole.save();
  }
  let adminRole = await Role.findOne({ roleValue: "admin" });
  if (!adminRole) {
    adminRole = new Role({
      roleValue: "admin",
      roleName: "Admin",
      roleDescription: "Admin Role",
    });
    await adminRole.save();
  }
};
