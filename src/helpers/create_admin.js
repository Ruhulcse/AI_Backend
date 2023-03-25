const User = require("../models/User");
const hash = require("./password_hash");

//create user
(async () => {
  const admin = await User.findOne({ email: "admin@gmail.com" });
  if (!admin) {
    const hashPass = await hash.new("123456");
    const userInfo = {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPass,
      role: "admin",
      status: true,
    };
    const user = await User.create(userInfo);

    if (user) {
      console.log("admin user created");
      return;
    } else {
      console.log("admin user create failed!!");
      return;
    }
  }

  console.log("admin already exists");
  return;
})();
