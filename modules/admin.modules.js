const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");

class _admin {
    listAdmin = async () => {
        try {
            const list = await prisma.admin.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listAdmin module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addAdmin = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nip: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nip,
                    password: bcrypt.hashSync(body.nip, 10),
                    role: Role.ADMIN,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.admin.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nip: body.nip,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found",
                    };
                }
            }

            console.error("addAdmin module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _admin();
