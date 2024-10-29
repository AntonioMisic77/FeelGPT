import bcrypt from "bcrypt";
import createError from "http-errors";

import { prisma } from "@/db";
import { jwtSign } from "@/lib/jwt";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  PostLoginVendorValidator,
  PostRegisterVendorValidator,
} from "./auth.validator";

export const postRegisterVendor = createEndpoint(
  PostRegisterVendorValidator,
  async (req, res) => {
    const { userInfo, businessInfo } = req.body;
    const { cnic, ...restUserInfo } = userInfo;
    const {
      availabilities,
      foodServices,
      paymentServices,
      ...restBusinessInfo
    } = businessInfo;

    const doesUserExist = await prisma.vendor.findFirst({
      where: {
        cnic,
      },
    });
    if (doesUserExist) throw createError(400, "Vendor already exists");

    // TODO: Fix this
    const zone = await prisma.zone.findFirst();
    if (!zone) throw createError(400, "No zones available");

    const user = await prisma.user.create({
      data: {
        ...restUserInfo,
        Vendor: {
          create: {
            cnic,
            business: {
              create: {
                ...restBusinessInfo,
                availabilities: {
                  create: availabilities,
                },
                foodServices: {
                  create: foodServices,
                },
                paymentServices: {
                  create: paymentServices,
                },
              },
            },
            zoneId: zone.id,
          },
        },
      },
      include: {
        Vendor: {
          include: {
            business: {
              include: {
                availabilities: true,
                foodServices: true,
                paymentServices: true,
              },
            },
          },
        },
      },
    });

    const token = jwtSign({
      id: user.id,
    });
    const { password:notUsed, ...restUser } = user;

    res.json({
      result: {token, user:restUser},
    });
  }
);

export const postLoginVendor = createEndpoint(
  PostLoginVendorValidator,
  async (req, res) => {
    const { cnic, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        Vendor: {
          cnic,
        },
      },
      include: {
        Vendor: {
          include: {
            business: {
              include: {
                availabilities: true,
                foodServices: true,
                paymentServices: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw createError(400, "Invalid CNIC/password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError(400, "Invalid CNIC/password");
    const token = jwtSign({
      id: user.id,
    });

    const { password:notUsed, ...restUser } = user;
    res.json({
      result: {token,user: restUser},
    });
  }
);


export const getVendorMe = createEndpoint({},async (req,res)=>{
  const {user} = getUserInfo(req);
  const fetchedUser = await prisma.user.findUnique({
    where:{
      id:user.id
    },
    include:{
      Vendor: {
        include: {
          business: {
            include: {
              availabilities: true,
              foodServices: true,
              paymentServices: true,
            },
          },
        },
      },
    }
  }
  )
  if(!fetchedUser) throw  createError(404,"User not found");
  const {password:notUsed,...rest} = fetchedUser;
  res.json({
    result:rest
  })
})
