const ApiError = require("../error/ApiError");
const { Orders, Managers } = require("../models/models");
const { sendOrder } = require("../API/index");

async function getLessBusyManager() {
  let allManagers = await Managers.findAll();
  if (allManagers.length) {
    const sortManagers = allManagers.sort(function (a, b) {
      return a.order_queue > b.order_queue ? 1 : -1;
    });
    return sortManagers[0];
  }
}

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { user_ID, product_list } = req.body;
      if (!user_ID || !product_list) {
        return next(
          res.json(ApiError.badRequest("Incorrect user_ID or product_list"))
        );
      }
      const freeManager = await getLessBusyManager();
      if (freeManager) {
        const now = Date.now();
        const newOrder = await Orders.create({
          add_time: now,
          user_ID,
          manager_ID: freeManager.id,
          manager_Telegramm_ID: freeManager.telegram_user_id,
          product_list,
        });
        freeManager.increment("order_queue", { by: 1 });
        const order_list = freeManager.order_list;
        order_list.push(newOrder);
        freeManager.update({
          order_list: order_list,
        });

        await sendOrder(newOrder);

        return res.json({
          id: newOrder.id,
          add_time: newOrder.add_time,
          user_ID: newOrder.user_ID,
          manager_ID: newOrder.manager_ID,
          manager_Telegramm_ID: newOrder.manager_Telegramm_ID,
          product_list: newOrder.product_list,
          order_status: newOrder.order_status,
        });
      }
      return res.json("Managers not found");
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getAll(req, res, next) {
    try {
      let orders = await Orders.findAll();
      if (orders.length) {
        return res.json(orders);
      }
      next(res.json(ApiError.badRequest("Orders not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Orders.findOne({
        where: {
          id,
        },
      });
      if (order) {
        return res.json(order);
      }
      next(res.json(ApiError.badRequest("Order not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async updateOne(req, res, next) {
    try {
      const { id } = req.params;
      let { status } = req.params;
      let starus = status.toString()
      if (starus == 'null') {
        status = null;
      }
      console.log(id,status );
      const order = await Orders.findOne({
        where: {
          id,
        },
      });
      if (order) {
        await order.update({
          order_status: status,
        })
        return res.json("Status change");
      }
      next(res.json(ApiError.badRequest("Order not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const oredr = await Orders.findOne({
        where: {
          id,
        },
      });
      if (oredr) {
        const manager = await Managers.findOne({
          where: { id: oredr.manager_ID },
        });
        if (manager) {
          const managerOrders = manager.order_list;
          const newOrder_list = managerOrders.filter(
            (item) => item.id !== oredr.id
          );

          manager.decrement("order_queue", { by: 1 });
          manager.update({
            order_list: newOrder_list,
          });

          Orders.destroy({
            where: {
              id: id,
            },
          });
          return res.status(200).json("Deleted successfully");
        }
        return res.status(404).json("Smthfing wrong");
      }
      return next(res.json(ApiError.badRequest("Wrong id")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new OrderController();
