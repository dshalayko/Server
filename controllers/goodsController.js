const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { Goods } = require("../models/models");
const ApiError = require("../error/ApiError");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

class GoodsController {
  async create(req, res, next) {
    try {
      let { name, price, type, catalog_id } = req.body;
      const { img } = req.files;
      const fileExtension = img.name.split(".").pop().toLowerCase();
      const fileName = "goods_" + uuid.v4() + "." + fileExtension;
      await img.mv(path.resolve(__dirname, "..", "static", fileName));
      const link = process.env.REACT_APP_API_URL + fileName;
      let thumbnailLink = "";
      const now = Date.now();
      if (type == "vid") {
        const filePath = path.resolve(__dirname, "..", "static", fileName);
        const name2 = "thumbnail_" + fileName.split(".").shift();
        thumbnailLink = process.env.REACT_APP_API_URL + name2 + ".png";
        await new ffmpeg(filePath).takeScreenshots(
          {
            filename: name2,
            count: 1,
            timemarks: ["1"],
          },
          path.resolve(__dirname, "..", "static")
        );
      }

      // let data = [
      //   { quantity: 1, amount: 20 },
      //   { quantity: 50, amount: 18 },
      //   { quantity: 150, amount: 16 },
      //   { quantity: 250, amount: 15 },
      // ];
      const product = await Goods.create({
        name,
        price,
        catalog_id:catalog_id,
        addTime: now,
        type,
        src: link,
        fileName: fileName,
        thumbnail: thumbnailLink,
      });
      return res.json(product);
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getProducts(req, res, next) {
    try {
      const { id } = req.params;
      const goods = await Goods.findAll({
        where: {
          catalog_id:id,
        },
      });
      if (goods) {
        return res.json(goods);
      }
      next(res.json(ApiError.badRequest("Item not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getAll(req, res, next) {
    try {
      let goods = await Goods.findAll();

      if (goods.length) {
        const tmp = { goods: goods.reverse() };
        return res.json(tmp);
      }
      next(res.json(ApiError.badRequest("Items not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Goods.findOne({
        where: {
          id,
        },
      });
      if (product) {
        return res.json(product);
      }
      next(res.json(ApiError.badRequest("Item not found")));
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const findProduct = await Goods.findOne({
        where: {
          id,
        },
      });
      if (findProduct) {
        const imgPath = path.resolve(
          __dirname,
          "..",
          "static",
          findProduct.fileName
        );
        fs.unlinkSync(imgPath);
        if (findProduct.type === "vid") {
          const thumbnailPath = path.resolve(
            __dirname,
            "..",
            "static",
            "thumbnail_" + findProduct.fileName.split(".").shift() + ".png"
          );
          fs.unlinkSync(thumbnailPath);
        }

        Goods.destroy({
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
}

module.exports = new GoodsController();
