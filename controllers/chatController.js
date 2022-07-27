const ApiError = require("../error/ApiError");
const { sendChatData } = require("../API/index");

// const temp = {
//   productName: "string",
//   productPrice: "number",
//   userID: "string",
//   managerID: 379085521,
// };

class GoodsController {
  async getData(req, res, next) {
    try {
      const data = req.body;

      data.managerID = 379085521;

      const botResponse = await sendChatData(data);
      console.log(botResponse);

      return res.json(data);
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new GoodsController();
