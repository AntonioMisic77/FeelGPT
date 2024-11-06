/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { UsersGender, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const rootAdminUserId = "acba5b7d-a95c-454a-993a-cc178a8cfc69";
const subAdminUserId = "2d364c6d-84e5-4e80-b5b0-5ca35f176168";
const vendorUserId = "a9a3b94b-6975-4d0d-94fe-38d82d4a7f85";
const vendorId = "977851d7-0a2c-46f8-8887-deab10704467";
const businessId = "ee90a432-e036-4648-a9ec-a682feaaaa4a";
const consumer1UserId = "ba6165dd-c64e-42ac-9f11-8ff803fb95b5";
const consumer2UserId = "1ae0052e-d53d-4f46-8da0-15249de54e6f";

const menuCategoryId = "2af671ef-79e9-4908-86d9-c4e25b6d5cbd";
const menuItemId = "f41946c0-4406-403b-b95f-6af9d4a4afe3";
const simplePostId = "346d8a18-c912-4871-913a-8cee28e77e02";
const reviewPostId = "d5906775-4af0-409d-b37c-47fbb1772f6f";
const dealId = "b2559dfe-ad60-4933-bffb-75deb858277e";

const seed = async () => {
  const rootAdmin = await prisma.rootAdmin.create({
    data: {
      user: {
        create: {
          id: rootAdminUserId,
          firstName: "Admin",
          lastName: "1",
          password: bcrypt.hashSync("test@123", 12),
          phoneNumber: "1234567890",
          gender: UsersGender.MALE,
        },
      },
      email: "rootadmin1@gmail.com",
    },
  });
  console.log("Root Admin created");

  const subAdmin = await prisma.subAdmin.create({
    data: {
      user: {
        create: {
          id: subAdminUserId,
          firstName: "SubAdmin",
          lastName: "1",
          password: bcrypt.hashSync("test@123", 12),
          phoneNumber: "1234567890",
          gender: UsersGender.MALE,
        },
      },
      email: "subadmin1@gmail.com",
      rootAdmin: { connect: { id: rootAdmin.id } },
    },
  });
  console.log("Sub Admin created");

  const zone = await prisma.zone.create({
    data: {
      name: "Zone 1",
      rootAdmin: { connect: { id: rootAdmin.id } },
      subAdmin: { connect: { id: subAdmin.id } },
    },
  });
  console.log("Zone created");

  const consumer = await prisma.user.create({
    data: {
      id: consumer1UserId,
      password: bcrypt.hashSync("test@123", 12),
      firstName: "consumer",
      lastName: "1",
      phoneNumber: "03121541289",
      gender: "MALE",
      Consumer: {
        create: {
          email: "consumer1@gmail.com",
          username: "consumer1",
          managedBy: subAdmin.id,
        },
      },
    },
  });
  console.log("Consumer 1 created");

  await prisma.user.create({
    data: {
      id: consumer2UserId,
      password: bcrypt.hashSync("test@123", 12),
      firstName: "consumer",
      lastName: "2",
      phoneNumber: "03121541289",
      gender: "MALE",
      Consumer: {
        create: {
          email: "consumer2@gmail.com",
          username: "consumer2",
          managedBy: subAdmin.id,
        },
      },
    },
  });
  console.log("Consumer 2 created");

  const vendor = await prisma.user.create({
    data: {
      id: vendorUserId,
      firstName: "vendor",
      lastName: "1",
      phoneNumber: "03121541289",
      gender: "MALE",
      password: bcrypt.hashSync("test@123", 12),
      Vendor: {
        create: {
          id: vendorId,
          cnic: "11111-1111111-1",
          business: {
            create: {
              id: businessId,
              name: "Asian Wok",
              country: "Pakistan",
              province: "Punjab",
              city: "Islamabad",
              descriptiveAddress: "Building 123, Street#1",
              phoneNumber: "03211541289",
              latitude: 33.6844,
              longitude: 66.6844,
              availabilities: {
                create: [
                  {
                    day: "MONDAY",
                    opensAt: "09:00 am",
                    closesAt: "05:00 pm",
                  },
                  {
                    day: "FRIDAY",
                    opensAt: "09:00 am",
                    closesAt: "07:00 pm",
                  },
                ],
              },
              foodServices: {
                create: [
                  {
                    type: "DINE_IN",
                  },
                  {
                    type: "DELIVERY",
                  },
                ],
              },
              paymentServices: {
                create: [
                  {
                    type: "CASH",
                  },
                  {
                    type: "EASY_PAISA",
                  },
                ],
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
          business: true,
        },
      },
    },
  });
  console.log("Vendor created");

  const menuCategory = await prisma.menuCategory.create({
    data: {
      id: menuCategoryId,
      name: "Fast Food",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      businessId: vendor.Vendor!.business!.id,
    },
  });
  console.log("Menu Category created");

  const menuItem = await prisma.menuItem.create({
    data: {
      id: menuItemId,
      name: "Pizza",
      price: "799.8",
      description: "Tasty",
      imageUrl:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      menuCategoryId: menuCategory.id,
    },
  });
  console.log("Menu Item created");

  await prisma.post.create({
    data: {
      id: simplePostId,
      caption: "Very Good Burger",
      createdBy: vendor.id,
      postMedia: {
        create: [
          {
            url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800",
            type: "IMAGE",
          },
        ],
      },
    },
  });
  console.log("Post created for consumer");

  await prisma.post.create({
    data: {
      id: reviewPostId,
      caption: "Very Good Burger",
      createdBy: consumer.id,
      postMedia: {
        create: [
          {
            url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800",
            type: "IMAGE",
          },
        ],
      },
      review: {
        create: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          businessId: vendor.Vendor!.business!.id,
          rating: 4,
          itemsReviewed: {
            create: [
              {
                menuItemId: menuItem.id,
                rating: 5,
              },
            ],
          },
        },
      },
    },
  });
  console.log("Review Post created for consumer");

  await prisma.deal.create({
    data: {
      id: dealId,
      name: "Deal 1",
      description: "Gucci Deal",
      price: 799.8,
      dealItems: {
        create: [
          {
            menuItemId: menuItem.id,
            quantity: 1,
          },
        ],
      },
      imageUrl:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      businessId: vendor.Vendor!.business!.id,
    },
  });
  console.log("Deal created for vendor");
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
