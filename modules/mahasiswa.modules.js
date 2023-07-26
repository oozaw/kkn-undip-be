const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _mahasiswa {
  listMahasiswa = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        include: {
          mahasiswa_kecamatan: {
            select: {
              gelombang: {
                select: {
                  nama: true,
                },
              },
              kecamatan: {
                select: {
                  nama: true,
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          mahasiswa_kecamatan_active: {
            select: {
              kecamatan: {
                select: {
                  nama: true,
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          prodi: {
            select: {
              nama: true,
              fakultas: {
                select: {
                  nama: true,
                  singkatan: true,
                },
              },
            },
          },
        },
      });

      list.forEach((mhs) => {
        mhs.lokasi = "Belum mendaftar";
        mhs.gelombang = "Belum mendaftar";
        if (mhs.status == 1) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mahasiswa_kecamatan?.kecamatan?.nama}, ${mahasiswa_kecamatan?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        } else if (mhs.status === 2) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mhs.mahasiswa_kecamatan_active?.kecamatan?.nama}, ${mhs.mahasiswa_kecamatan_active?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        }

        delete mhs.mahasiswa_kecamatan;
        delete mhs.mahasiswa_kecamatan_active;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaUnregistered = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 0,
        },
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
                },
              },
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaUnregistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaRegistered = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 1,
        },
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
                },
              },
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaAccepted = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 2,
        },
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
                },
              },
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaAccepted module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaRegisteredByKecamatan = async (id_kecamatan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_kecamatan);

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

      const list = await prisma.mahasiswa_kecamatan.findMany({
        where: {
          id_kecamatan,
        },
        include: {
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  nama: true,
                  tema: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          mahasiswa: {
            include: {
              prodi: {
                select: {
                  nama: true,
                  fakultas: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          gelombang: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaAcceptedByKecamatan = async (id_kecamatan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_kecamatan);

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

      const list = await prisma.mahasiswa_kecamatan_active.findMany({
        where: {
          id_kecamatan,
        },
        include: {
          mahasiswa: true,
          kecamatan: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaDosen = async (id_user, id_kecamatan) => {
    try {
      const body = {
        id_user,
        id_kecamatan,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_kecamatan: Joi.number().required(),
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

      const checkDosen = await prisma.dosen.findUnique({
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

      const checkProposal = await prisma.proposal.findFirst({
        where: {
          id_dosen: checkDosen.id_dosen,
          id_kecamatan: body.id_kecamatan,
        },
        select: {
          status: true,
        },
      });

      if (!checkProposal) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (checkProposal.status !== 1) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan data is not approved",
        };
      }

      const list = await prisma.mahasiswa_kecamatan.findMany({
        where: {
          id_kecamatan: body.id_kecamatan,
        },
        include: {
          mahasiswa: {
            include: {
              prodi: {
                select: {
                  nama: true,
                  fakultas: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  nama: true,
                  tema: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
          gelombang: {
            select: {
              nama: true,
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getMahasiswa = async (id_mahasiswa) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_mahasiswa);

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

      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa,
        },
        select: {
          id_mahasiswa: true,
          id_prodi: true,
          nama: true,
          nim: true,
          prodi: {
            select: {
              fakultas: {
                select: {
                  id_fakultas: true,
                },
              },
            },
          },
        },
      });

      mahasiswa.id_fakultas = mahasiswa.prodi.fakultas.id_fakultas;
      delete mahasiswa.prodi;

      return {
        status: true,
        data: mahasiswa,
      };
    } catch (error) {
      console.error("getMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importMahasiswa = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["mahasiswa"],
        columnToKey: {
          B: "nama",
          C: "nim",
        },
      });

      for (let i = 0; i < result.mahasiswa.length; i++) {
        const e = result.mahasiswa[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nim),
          },
          select: {
            username: true,
          },
        });

        const checkMahasiswa = await prisma.mahasiswa.findUnique({
          where: {
            nim: String(e.nim),
          },
          select: {
            nim: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkUser.username,
          };
        } else if (checkMahasiswa) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkMahasiswa.nim,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nim),
            password: bcrypt.hashSync(String(e.nim), 10),
            role: Role.MAHASISWA,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.mahasiswa.create({
          data: {
            nama: e.nama,
            nim: String(e.nim),
            id_user: addUser.id_user,
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("importMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addMahasiswa = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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
          username: body.nim,
          password: bcrypt.hashSync(body.nim, 10),
          role: Role.MAHASISWA,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.mahasiswa.create({
        data: {
          nama: body.nama,
          nim: body.nim,
          id_user: addUser.id_user,
          id_prodi: body.prodi,
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

      console.error("addMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editMahasiswa = async (id_mahasiswa, body) => {
    try {
      body = {
        id_mahasiswa,
        ...body,
      };

      const schema = Joi.object({
        id_mahasiswa: Joi.number().required(),
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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

      const mhs = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
      });

      if (!mhs) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (mhs.nim != body.nim) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nim,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM sudah terdaftar",
          };
        }
      }

      await prisma.user.update({
        where: {
          username: mhs.nim,
        },
        data: {
          username: body.nim,
          password: bcrypt.hashSync(body.nim, 10),
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
        data: {
          nama: body.nama,
          nim: body.nim,
          id_prodi: body.prodi,
        },
      });

      return {
        status: true,
        code: 204,
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

      console.error("editMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteMahasiswa = async (id_mahasiswa) => {
    try {
      const checkMahasiswaRegistered =
        await prisma.mahasiswa_kecamatan_active.findFirst({
          where: {
            id_mahasiswa,
          },
        });

      if (checkMahasiswaRegistered) {
        return {
          status: false,
          code: 403,
          error: "Mahasiswa masih terdaftar di tema KKN",
        };
      }

      const mahasiswa = await prisma.mahasiswa.delete({
        where: {
          id_mahasiswa,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: mahasiswa.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  daftarLokasi = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_tema_halaman: Joi.number().required(),
        id_kecamatan: Joi.number().required(),
        id_gelombang: Joi.number().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
          status: true,
        },
      });

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: body.id_kecamatan,
        },
        select: {
          status: true,
        },
      });

      const checkGelombang = await prisma.gelombang.findUnique({
        where: {
          id_gelombang: body.id_gelombang,
        },
        select: {
          status: true,
          id_tema_halaman: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan.findFirst({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
            id_gelombang: body.id_gelombang,
          },
          select: {
            id_mahasiswa_kecamatan: true,
          },
        });

      if (!checkMahasiswa || !checkKecamatan || !checkGelombang) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (checkMahasiswa.status === 2 || checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Mahasiswa data is already registered",
        };
      } else if (checkGelombang.id_tema_halaman !== body.id_tema_halaman) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, data doesn't match",
        };
      } else if (!checkKecamatan.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan data is not approved",
        };
      } else if (!checkGelombang.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Gelombang data is not activated",
        };
      }

      await prisma.mahasiswa_kecamatan.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          id_kecamatan: body.id_kecamatan,
          id_gelombang: body.id_gelombang,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_user,
        },
        data: {
          status: 1,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("daftarLokasi module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePendaftaran = async (id_user, id_mahasiswa_kecamatan) => {
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

      const user = await prisma.user.findUnique({
        where: {
          id_user,
        },
      });

      const mahasiswaKecamatan = await prisma.mahasiswa_kecamatan.findUnique({
        where: {
          id_mahasiswa_kecamatan,
        },
      });

      if (!mahasiswaKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (user.role === Role.MAHASISWA && mahasiswaKecamatan.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Pendaftaran sudah disetujui",
        };
      }

      const nilai = await prisma.nilai.findFirst({
        where: {
          id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
        },
      });

      if (nilai) {
        await prisma.nilai.deleteMany({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      const laporan = await prisma.laporan.findFirst({
        where: {
          id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
        },
      });

      if (laporan) {
        await prisma.laporan.deleteMany({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      if (mahasiswaKecamatan.status == 1) {
        await prisma.mahasiswa_kecamatan_active.delete({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      await prisma.mahasiswa_kecamatan.delete({
        where: {
          id_mahasiswa_kecamatan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePendaftaran module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listLaporan = async (id_user, type) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_user);

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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      if (!checkMahasiswa) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      let list = [];
      if (type === "lrk") {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
          select: {
            id_laporan: true,
            id_mahasiswa: true,
            kategori: true,
            potensi: true,
            program: true,
            sasaran: true,
            metode: true,
            luaran: true,
            komentar: true,
            created_at: true,
          },
        });
      } else {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });
      }

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        kategori: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          kategori: body.kategori,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("editLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLPK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        pelaksanaan: Joi.string().required(),
        capaian: Joi.string().required(),
        hambatan: Joi.string().required(),
        kelanjutan: Joi.string().required(),
        metode: Joi.string().required(),
        dokumentasi: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      const checkLaporan = await prisma.laporan.findUnique({
        where: {
          id_laporan: body.id_laporan,
        },
      });

      if (!checkMahasiswaKecamatan || !checkLaporan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          pelaksanaan: body.pelaksanaan,
          capaian: body.capaian,
          hambatan: body.hambatan,
          kelanjutan: body.kelanjutan,
          metode: body.metode,
          dokumentasi: body.dokumentasi,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLPK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportase = async (id_user) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_user);

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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const list = await prisma.reportase.findMany({
        where: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReportase = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        kategori: Joi.number().required(),
        judul: Joi.string().required(),
        link_publikasi: Joi.string().required(),
        isi: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.reportase.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          kategori: body.kategori,
          judul: body.judul,
          link_publikasi: body.link_publikasi,
          isi: body.isi,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editReportase = async (id_user, id_reportase, body) => {
    try {
      body = {
        id_user,
        id_reportase,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_reportase: Joi.number().required(),
        id_tema: Joi.number().required(),
        judul: Joi.string().required(),
        link_publikasi: Joi.string().required(),
        isi: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.reportase.update({
        where: {
          id_reportase: body.id_reportase,
        },
        data: {
          judul: body.judul,
          link_publikasi: body.link_publikasi,
          isi: body.isi,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _mahasiswa();
