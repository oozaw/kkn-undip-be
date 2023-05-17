const { prisma } = require("../helpers/database");
const { uploadDrive } = require("../helpers/upload");
const Joi = require("joi");

require("dotenv").config();

class _dosen {
    listDosen = async () => {
        try {
            const list = await prisma.dosen.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listDosen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addProposal = async (file, id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_kecamatan: Joi.number().required(),
                id_gelombang: Joi.number().required(),
                proposal: Joi.string().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkDosen = await prisma.dosen.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_dosen: true,
                },
            });

            if (!checkDosen) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: Number(body.id_kecamatan),
                },
                select: {
                    status: true,
                },
            });

            const checkGelombang = await prisma.gelombang.findUnique({
                where: {
                    id_gelombang: Number(body.id_gelombang),
                },
                select: {
                    status: true,
                },
            });

            if (!checkGelombang.status) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Gelombang data is not activated",
                };
            }

            if (checkKecamatan.status !== 1) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Kecamatan data is not approved",
                };
            }

            const fileDrive = await uploadDrive(
                file,
                process.env.PROPOSAL_FOLDER_ID
            );

            await prisma.proposal.create({
                data: {
                    id_dosen: checkDosen.id_dosen,
                    id_kecamatan: Number(body.id_kecamatan),
                    id_gelombang: Number(body.id_gelombang),
                    proposal: body.proposal,
                    status: 0,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addProposal module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_kecamatan,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_kecamatan: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkDosen = await prisma.dosen.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_dosen: true,
                },
            });

            if (!checkDosen) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkMahasiswaKecamatan =
                await prisma.mahasiswa_kecamatan.findUnique({
                    where: {
                        id_mahasiswa_kecamatan,
                    },
                    select: {
                        id_kecamatan: true,
                    },
                });

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
                },
                select: {
                    proposal: {
                        where: {
                            status: 1,
                        },
                        select: {
                            id_dosen: true,
                        },
                    },
                },
            });

            if (
                !checkKecamatan.proposal.some(
                    (i) => i.id_dosen === checkDosen.id_dosen
                )
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_kecamatan.update({
                where: {
                    id_mahasiswa_kecamatan,
                },
                data: {
                    status: 1,
                },
            });
            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("accMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_kecamatan,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_kecamatan: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkDosen = await prisma.dosen.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_dosen: true,
                },
            });

            if (!checkDosen) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkMahasiswaKecamatan =
                await prisma.mahasiswa_kecamatan.findUnique({
                    where: {
                        id_mahasiswa_kecamatan,
                    },
                    select: {
                        id_kecamatan: true,
                    },
                });

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
                },
                select: {
                    proposal: {
                        where: {
                            status: 1,
                        },
                        select: {
                            id_dosen: true,
                        },
                    },
                },
            });

            if (
                !checkKecamatan.proposal.some(
                    (i) => i.id_dosen === checkDosen.id_dosen
                )
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_kecamatan.update({
                where: {
                    id_mahasiswa_kecamatan,
                },
                data: {
                    status: -1,
                },
            });
            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("decMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _dosen();
