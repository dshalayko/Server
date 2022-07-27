const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const { Catalog, Goods} = require("../models/models");
const ApiError = require("../error/ApiError");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

class CatalogController {
  async create(req, res, next) {
    try {
      const name_tmp = req.body['name']
      // console.log(req.body['name'])
      // let {name} = req.body[name];
      let {name} = req.body;
      // console.log(name)
      const { img } = req.files;
      const fileExtension = img.name.split(".").pop().toLowerCase();
      const fileName = "catalog_" + uuid.v4() + "." + fileExtension;
      await img.mv(path.resolve(__dirname, "..", "static", fileName));
      const link = process.env.REACT_APP_API_URL + fileName;
      let thumbnailLink = "";
      const now = Date.now();

      // let data = [
      //   { quantity: 1, amount: 20 },
      //   { quantity: 50, amount: 18 },
      //   { quantity: 150, amount: 16 },
      //   { quantity: 250, amount: 15 },
      // ];

      const catalog = await Catalog.create({
        name : name,
        img: link,
        src: link,
        fileName: fileName,
        thumbnail: fileName,
      });
      return res.json(catalog);
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }

  async getAll(req, res, next) {
    try {
      let catalogs = await Catalog.findAll();
      console.log(catalogs)
      if (catalogs.length) {
        const tmp = { catalogs: catalogs.reverse() };
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

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const findCatalog = await Catalog.findOne({
        where: {
          id,
        },
      });
      if (findCatalog) {
        const imgPath = path.resolve(
          __dirname,
          "..",
          "static",
            findCatalog.fileName
        );
        fs.unlinkSync(imgPath);


        Catalog.destroy({
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

module.exports = new CatalogController();
