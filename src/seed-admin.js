import bcrypt from "bcrypt";
import { connectDB } from "./db.js";
import { UserModel } from "./models/user.model.js";

await connectDB();
const email = "admin@test.com";
const exist = await UserModel.findOne({ email });
if (!exist) {
  const hash = bcrypt.hashSync("admin123", 10);
  await UserModel.create({
    first_name: "Admin",
    last_name: "Root",
    email,
    age: 99,
    password: hash,
    role: "admin",
  });
  console.log("Admin creado:", email, "pass: admin123");
} else {
  console.log("Admin ya existe");
}
process.exit(0);
