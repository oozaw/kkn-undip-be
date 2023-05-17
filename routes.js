const AuthController = require("./controllers/AuthController");
const SuperAdminController = require("./controllers/SuperAdminController");
const AdminController = require("./controllers/AdminController");
const DosenController = require("./controllers/DosenController");
const ProposalController = require("./controllers/ProposalController");
const BappedaController = require("./controllers/BappedaController");
const WilayahController = require("./controllers/WilayahController");
const MahasiswaController = require("./controllers/MahasiswaController");
const LrkController = require("./controllers/LrkController");
const LpkController = require("./controllers/LpkController");
const ReviewerController = require("./controllers/ReviewerController");
const TemaController = require("./controllers/TemaController");

const _routes = [
    ["/login", AuthController],
    ["/superadmin", SuperAdminController],
    ["/admin", AdminController],
    ["/dosen", DosenController],
    ["/proposal", ProposalController],
    ["/bappeda", BappedaController],
    ["/wilayah", WilayahController],
    ["/mahasiswa", MahasiswaController],
    ["/lrk", LrkController],
    ["/lpk", LpkController],
    ["/reviewer", ReviewerController],
    ["/tema", TemaController],
];

const routes = (app) => {
    _routes.forEach((route) => {
        const [url, controller] = route;
        app.use(`${url}`, controller);
    });
};

module.exports = routes;
