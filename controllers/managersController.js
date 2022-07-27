const ApiError = require("../error/ApiError");
const { Managers, User } = require("../models/models");

class ManagerController {
  async createManager(req, res, next) {
    try {
      const { telephone_number } = req.body;
      if (!telephone_number) {
        return next(
          res.json(ApiError.badRequest("Incorrect telephone_number"))
        );
      }
      const user = await User.findOne({
        where: {
          telephone_number: telephone_number,
        },
      });
      if (!user) {
        return next(res.json(ApiError.internal("User not found")));
      }
      if (user.role === "ADMIN") {
        return next(res.json(ApiError.forbidden("Manager already exists")));
      }

      const manager = await Managers.create({
        telephone_number: user.telephone_number,
        telegram_user_id: user.telegram_user_id,
      });
      user.update({
        role: "ADMIN",
      });
      return res.json({
        id: manager.id,
        telephone_number: manager.telephone_number,
        telegram_user_id: manager.telegram_user_id,
        order_list: manager.order_list,
        order_queue: manager.order_queue,
      });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getAll(req, res, next) {
    try {
      let allManagers = await Managers.findAll();
      if (allManagers.length) {
        return res.json(allManagers);
      }
      next(res.json(ApiError.badRequest("Managers not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const manager = await Managers.findOne({
        where: {
          id,
        },
      });
      if (manager) {
        return res.json(manager);
      }
      next(res.json(ApiError.badRequest("Manager not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { telephone_number } = req.body;
      if (!telephone_number) {
        return next(
          res.json(ApiError.badRequest("Incorrect telephone_number"))
        );
      }
      const user = await User.findOne({
        where: {
          telephone_number: telephone_number,
        },
      });
      if (!user) {
        return next(res.json(ApiError.internal("User not found")));
      }
      if (user.role === "USER") {
        return next(res.json(ApiError.forbidden("User is not manager")));
      }
      user.update({
        role: "USER",
      });
      //active orders??
      Managers.destroy({
        where: {
          telephone_number: telephone_number,
        },
      });
      return res.status(200).json("Deleted successfully");
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getLessBusyManager(req, res, next) {
    try {
      let allManagers = await Managers.findAll();
      if (allManagers.length) {
        const sortManagers = allManagers.sort(function (a, b) {
          return a.order_queue > b.order_queue ? 1 : -1;
        });
        return res.json(sortManagers[0]);
      }
      next(res.json(ApiError.badRequest("Manager not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new ManagerController();
