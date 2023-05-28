const { Router } = require("express");
const modules = require("../modules/gelombang.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get(
  "/mahasiswa/:id_tema/:id_halaman/:id_mahasiswa",
  userSession,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listGelombangMahasiswa(
        Number(req.params.id_tema),
        Number(req.params.id_halaman),
        Number(req.params.id_mahasiswa)
      )
    );
  }
);

app.get("/:id_tema/:id_halaman", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listGelombang(
      Number(req.params.id_tema),
      Number(req.params.id_halaman)
    )
  );
});

module.exports = app;
