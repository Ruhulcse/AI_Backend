const hash = require("../helpers/password_hash");
const userModel = require("../models/User");
const { ErrorHandler } = require("../utils/error");
const { jwt } = require("my-helpmates");
require("dotenv").config();

const secret_key = process.env.SECRET_KEY;

module.exports.createUser = async (req, res, next) => {
  const { body, user } = req;
  if (body.password) {
    const hashPass = await hash.new(body.password);
    body.password = hashPass;
  }
  body.role = "admin";

  try {
    const isExist = await userModel.findOne({ email: body.email });
    if (isExist) {
      throw new ErrorHandler("User is already existed.", 409);
    }
    const newUser = await userModel.create(body);
    let token = "";
    const payload = {
      id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status,
      exp: Math.floor(Date.now() / 100) + 60 * 60,
    };
    token = await jwt.encode(secret_key, payload);

    res.send({
      status: true,
      data: { token, name: newUser.name, id: user._id },
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    if (page) delete req.query.page;
    if (limit) delete req.query.limit;

    const users = await userModel
      .find(req.query)
      .select({ password: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    res.send({
      status: true,
      data: users,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await userModel
      .findOne({ _id: params.id })
      .select({ password: 0 })

    if (!user) {
      throw new ErrorHandler("User not found.", 404);
    }

    res.send({
      status: true,
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.updateUserById = async (req, res, next) => {
  const { body, params } = req;
  if (body.created_by) delete body.created_by;
  try {
    const user = await userModel.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });
    if (!user) {
      throw new ErrorHandler("User not found.", 404);
    }
    res.send({
      status: true,
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.deleteUserById = async (req, res, next) => {
  try {
    const { params } = req;
    await userModel.findOneAndDelete({ _id: params.id });

    res.send({
      status: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { body } = req;
  try {
    const user = await userModel.findOne({
      email: body.email,
      status: { $ne: false },
    });
    if (!user) {
      throw new ErrorHandler("User unauthorized!.", 401);
    }
    const verifyPass = await hash.verify(req.body.password, user.password);
    if (!verifyPass) {
      throw new ErrorHandler("User info invalid!.", 400);
    }
    let token = "";
    if (user) {
      const payload = {
        id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        exp: Math.floor(Date.now() / 100) + 60 * 60,
      };
      token = await jwt.encode(secret_key, payload);
    }
    res.send({
      status: true,
      data: { token, name: user.name, role: user.role },
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// module.exports.forgotPassword = async (req, res, next) => {
//     try {
//         const {body} = req;
//         const user = await userModel.findOne({email: body.email}).select({password: 0});
//         if (!user) {
//             throw new ErrorHandler("User with this email not exists.", 400);
//         }
//         const payload = {
//             id: user._id,
//             name: user.name,
//             role: user.role,
//             company: user.company,
//             status: user.status,
//             exp: Math.floor(Date.now() / 100) + (60 * 60)
//         };
//         const token = await jwt.encode(secret_key, payload);
//         let mailOptions = {
//             from: 'myemail@gmail.com',
//             to: body.email,
//             subject: `The subject goes here`,
//             html: `<h2>Please click on given link to reset your password.</h2>
//                     <p>${process.env.CLIENT_BASE_URL}/reset-password/${token}</p>`,
//         };
//         const updateUser = await userModel.updateOne({resetLink: token}, {new: true});
//         if (!updateUser) {
//             throw new ErrorHandler("Reset password link error.", 400);
//         } else {
//             let mailInfo = await sendMail(mailOptions);
//             if (!mailInfo) {
//                 throw new ErrorHandler("Mail send failed.", 500);
//             }
//             res.send({
//                 status: true,
//                 message: 'Mail send successfully.'
//             })
//         }
//     } catch (err) {
// console.log(err.message);
//         next(err)
//     }
// };

// module.exports.resetPassword = async (req, res, next) => {
//     try {
//         const {new_password, confirm_password, reset_link} = req.body;
//         if (new_password !== confirm_password) {
//             throw new ErrorHandler("Password not match!.", 400);
//         }
//         const hashPass = await hash.new(req.body.new_password);
//         if (reset_link) {
//             const tokenData = await jwt.decode(secret_key, reset_link);
//             if (!tokenData) {
//                 throw new ErrorHandler("Invalid reset token!.", 400);
//             }
//             let user = await userModel.findOneAndUpdate({
//                 _id: tokenData.id,
//                 company: tokenData.company
//             }, {password: hashPass}, {new: true});
//             if (!user) {
//                 throw new ErrorHandler("User not found.", 404);
//             }
//             res.send({
//                 status: true,
//                 message: 'Password reset successfully.'
//             })
//         }
//     } catch (err) {
// console.log(err.message);
//         next(err)
//     }
// };
