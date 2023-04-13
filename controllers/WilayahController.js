const { Router } = require("express");
const modules = require("../modules/wilayah.modules");
const response = require("../helpers/response");
const { userSession, verifyBappeda } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyBappeda, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addKecamatan(req.user.id, req.body)
    );
});

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listKabupaten());
});

app.get("/:id_kabupaten", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listKecamatan(Number(req.params.id_kabupaten))
    );
});

module.exports = app;
