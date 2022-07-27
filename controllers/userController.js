require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const generateJwt = (
  id,
  telephone_number,
  role,
  verification,
  telegram_user_id
) => {
  return jwt.sign(
    {
      id,
      telephone_number,
      role,
      verification,
      telegram_user_id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};
class UserController {
  async registration(req, res, next) {
    try {
      const { telephone_number, password, telegram_user_id, role } = req.body;
      if (!telephone_number || !password || !telegram_user_id) {
        return next(
          res.json(
            ApiError.badRequest(
              "Incorrect telephone_number/password/telegram_user_id"
            )
          )
        );
      }
      const candidate = await User.findOne({
        where: {
          telephone_number,
        },
      });
      if (candidate) {
        return next(res.json(ApiError.badRequest("User already exists")));
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const { img } = req.files;
      let fileExtension = img.name.split(".").pop().toLowerCase();
      const fileName =
        "user_" + `${telephone_number}_` + uuid.v4() + "." + fileExtension;
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const link = process.env.REACT_APP_API_URL + fileName;
      const user = await User.create({
        telephone_number,
        password: hashPassword,
        telegram_user_id,
        role,
        file_name: fileName,
        src: link,
      });
      const token = generateJwt(
        user.id,
        user.telephone_number,
        user.role,
        user.verification,
        user.telegram_user_id
      );
      return res.json({
        token,
        userTgID: telegram_user_id,
      });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async checkLogin(req, res, next) {
    try {
      const { telephone_number } = req.body;
      const user = await User.findOne({
        where: {
          telephone_number,
        },
      });
      if (user) {
        return next(res.json(ApiError.forbidden("User already exists")));
      }
      return res.status(200).send({ status: 200, message: "Empty" });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async login(req, res, next) {
    try {
      const { telephone_number, password } = req.body;
      const user = await User.findOne({
        where: {
          telephone_number,
        },
      });
      if (!user) {
        return next(res.json(ApiError.internal("User not found")));
      }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(res.json(ApiError.internal("Invalid password")));
      }

      const token = generateJwt(
        user.id,
        user.telephone_number,
        user.role,
        user.verification,
        user.telegram_user_id
      );
      return res.json({
        token,
        userTgID: user.telegram_user_id,
      });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.telephone_number,
        req.user.role,
        req.user.verification,
        req.user.telegram_user_id
      );
      return res.json({
        token,
      });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getAll(req, res, next) {
    try {
      let users = await User.findAll();
      if (users.length) {
        return res.json(users);
      }
      next(res.json(ApiError.badRequest("Users not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (user) {
        return res.json(user);
      }
      next(res.json(ApiError.badRequest("User not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.findOne({
        where: {
          id,
        },
      });
      if (findUser) {
        if (!findUser.verification) {
          const imgPath = path.resolve(
            __dirname,
            "..",
            "static",
            findUser.file_name
          );
          fs.unlinkSync(imgPath);
        }
        User.destroy({
          where: {
            id: id,
          },
        });
        return res.status(200).json("Deleted successfully");
      }
      return next(res.json(ApiError.badRequest("Wrong id")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async verificateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (user) {
        user.update({
          verification: true,
        });
        let imgPath = path.resolve(__dirname, "..", "static", user.file_name);
        fs.unlinkSync(imgPath);
        res.status(200).json("Successfully verified");
      }
      next(res.json(ApiError.badRequest("User not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getUnverifiedUsers(req, res, next) {
    try {
      let users = await User.findAll();
      if (users.length) {
        const sortUsers = users.filter((el) => {
          if (!el.verification) {
            return el;
          }
        });
        return res.json(sortUsers);
      }
      next(res.json(ApiError.badRequest("Users not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new UserController();
