import User from "../models/UserModel.js";
import config from "../config/config.js";
import bcryptJs from "bcryptjs";
import Jwt from "jsonwebtoken";

export const signupController = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(401).json({
        status: false,
        message: "CONFIRM PASSWORD NOT MATCHED!",
        data: "",
      });
    }
    let loginBody = {};
    if (email) loginBody.email = email;
    if (password) {
      const hash = await bcryptJs.hash(password, 12);
      loginBody.password = hash;
    }

    const alreadyLoggedIn = await User.findOne({ email: email });

    if (alreadyLoggedIn) {
      return res.status(406).json({
        status: false,
        message: "YOU ALREADY HAVE AN ACCOUNT!",
        data: "",
      });
    }

    const createUser = await User.create(loginBody);

    return res.status(200).json({
      status: true,
      message: "ACCOUNT CREATED!",
      data: { id: createUser._id },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      isDeleted: false,
    });

    if (!user) {
      return res.status(406).json({
        status: false,
        message: "USER NOT FOUND!",
        data: "",
      });
    }
    const matchedPassword = await bcryptJs.compare(password, user.password);

    if (!matchedPassword) {
      return res
        .status(406)
        .json({ status: false, message: "INVALID PASSWORD!", data: "" });
    }

    const token = Jwt.sign({ userId: user._id }, config.JWT_ACTIVATE, {
      expiresIn: "7d",
    });

    const loginDetails = { ...user._doc };

    delete loginDetails.password;
    delete loginDetails.exptime;

    return res.status(200).json({
      status: true,
      message: "WELCOME...!",
      data: {
        token: token,
        loginDetails,
      },
    });
  } catch (error) {
    next(err);
  }
};

export const passwordChangeController = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const id = req.userId;
    const user = await User.findById(id);
    if (!user)
      return res.status(406).json({
        status: false,
        message: "USER NOT FOUND!",
        data: [],
      });
    const matchedPassword = await bcryptJs.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(406).json({
        status: false,
        message: "INVALID PASSWORD!",
        data: [],
      });
    }
    const hashedPassword = await bcryptJs.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      status: true,
      message: "PASSWORD CHANGED SUCCESSFULLY!",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
