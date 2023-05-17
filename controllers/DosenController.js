const { Router } = require("express");
const modules = require("../modules/dosen.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyAdmin,
    verifyDosen,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listDosen());
});

app.post(
    "/proposal",
    userSession,
    verifyDosen,
    upload.single("file"),
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.addProposal(req.file, req.user.id, req.body)
        );
    }
);

app.put(
    "/mahasiswa/acc/:id_mahasiswa_kecamatan",
    userSession,
    verifyDosen,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accMahasiswa(
                req.user.id,
                Number(req.params.id_mahasiswa_kecamatan)
            )
        );
    }
);

app.put(
    "/mahasiswa/dec/:id_mahasiswa_kecamatan",
    userSession,
    verifyDosen,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decMahasiswa(
                req.user.id,
                Number(req.params.id_mahasiswa_kecamatan)
            )
        );
    }
);

module.exports = app;
