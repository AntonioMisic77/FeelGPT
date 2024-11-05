import haversineDistance from "haversine-distance";
import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  GetSearchConsumerValidator,
  GetSearchBusinessValidator,
  GetSearchItemValidator,
  GetNearbyBusinessesValidator,
  GetConsumerByUserIdValidator,
  GetVendorByUserIdValidator,
} from "./search.validator";

export const getSearchConsumersPosts = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);
  const followedUsers = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    select: {
      following: {
        select: {
          id: true,
          Vendor: {
            select: {
              id: true,
              business: {
                select: {
                  name: true,
                  aggregateRating: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const followedConsumerUserIds = followedUsers
    .filter((fc) => !fc.following.Vendor)
    .map((fc) => fc.following.id);

  followedConsumerUserIds.push(user.id);

  const followingConsumerPosts = await prisma.post.findMany({
    where: {
      createdBy: {
        notIn: followedConsumerUserIds,
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          avatarUrl: true,
          lastName: true,
          Vendor: {
            select: {
              id: true,
              business: {
                select: {
                  name: true,
                  aggregateRating: true,
                },
              },
            },
          },
          _count: {
            select: {
              followings: true,
            },
          },
        },
      },
      review: {
        select: {
          businessId: true,
          postId: true,
          id: true,
          rating: true,
          itemsReviewed: {
            select: {
              rating: true,
              menuItem: {
                select: {
                  id: true,
                  menuCategoryId: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                  price: true,
                  aggregateRating: true,
                },
              },
            },
          },
          business: true,
        },
      },
      postMedia: true,
      postLikes: {
        where: {
          likedBy: user.id,
        },
      },
      _count: {
        select: {
          postComments: true,
          postLikes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    result: followingConsumerPosts,
  });
});

export const getSearchBusinessesPosts = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);
  const followedUsers = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    select: {
      following: {
        select: {
          id: true,
          Consumer: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  const followedVendorUserIds = followedUsers
    .filter((fc) => !fc.following.Consumer)
    .map((fc) => fc.following.id);

  followedVendorUserIds.push(user.id);
  const followingConsumerPosts = await prisma.post.findMany({
    where: {
      createdBy: {
        notIn: followedVendorUserIds,
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          avatarUrl: true,
          lastName: true,
          Vendor: {
            select: {
              id: true,
              business: {
                select: {
                  name: true,
                  aggregateRating: true,
                },
              },
            },
          },
          _count: {
            select: {
              followings: true,
            },
          },
        },
      },
      review: {
        select: {
          businessId: true,
          postId: true,
          id: true,
          rating: true,
          itemsReviewed: {
            select: {
              rating: true,
              menuItem: {
                select: {
                  id: true,
                  menuCategoryId: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                  price: true,
                  aggregateRating: true,
                },
              },
            },
          },
          business: true,
        },
      },
      postMedia: true,
      postLikes: {
        where: {
          likedBy: user.id,
        },
      },
      _count: {
        select: {
          postComments: true,
          postLikes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    result: followingConsumerPosts,
  });
});

export const getSearchConsumers = createEndpoint(
  GetSearchConsumerValidator,
  async (req, res) => {
    const { name } = req.query;
    const { user } = getUserInfo(req);
    let consumers;
    if (name) {
      consumers = await prisma.consumer.findMany({
        where: {
          OR: [
            {
              user: {
                firstName: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                lastName: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        include: {
          user: true,
        },
      });
    } else {
      const followedConsumers = await prisma.follow.findMany({
        where: {
          followerId: user.id,
        },
        select: {
          followingId: true,
        },
      });
      const followedConsumerUserIds = followedConsumers.map(
        (fc) => fc.followingId
      );
      followedConsumerUserIds.push(user.id);
      consumers = await prisma.consumer.findMany({
        where: {
          NOT: {
            userId: {
              in: followedConsumerUserIds,
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              avatarUrl: true,
              lastName: true,
              _count: {
                select: {
                  followings: true,
                },
              },
            },
          },
        },
      });
    }
    res.json({
      result: consumers,
    });
  }
);

export const getSearchBusinesses = createEndpoint(
  GetSearchBusinessValidator,
  async (req, res) => {
    const { name, latitude, longitude } = req.query;
    const { user } = getUserInfo(req);

    if (name) {
      const businesses = await prisma.business.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  avatarUrl: true,
                  lastName: true,
                  gender: true,
                },
              },
              business: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          aggregateRating: "desc",
        },
      });

      const businessesWithDistance = businesses.map((business) => {
        const distanceInMeters = haversineDistance(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          { latitude: latitude!, longitude: longitude! },
          {
            latitude: Number(business.latitude),
            longitude: Number(business.longitude),
          }
        );
        return {
          ...business,
          distanceInKm: (distanceInMeters / 1000).toFixed(2),
        };
      });
      res.json({
        result: businessesWithDistance,
      });
    } else {
      const followedVendors = await prisma.follow.findMany({
        where: {
          followerId: user.id,
        },
        include: {
          following: {
            select: {
              Vendor: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      const followedVendorIds = followedVendors
        .map((fv) => fv.following.Vendor?.id)
        .filter((id) => id !== undefined) as string[];
      const businesses = await prisma.business.findMany({
        where: {
          NOT: {
            vendorId: {
              in: followedVendorIds,
            },
          },
        },
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  avatarUrl: true,
                  lastName: true,
                  _count: {
                    select: {
                      followings: true,
                    },
                  },
                },
              },
              business: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      res.json({
        result: businesses,
      });
    }
  }
);

export const getNearbyBusinesses = createEndpoint(
  GetNearbyBusinessesValidator,
  async (req, res) => {
    const { radiusInKm, latitude, longitude } = req.query;
    const radiusInMeters = radiusInKm * 1000;

    const businesses = await prisma.business.findMany({
      include: {
        vendor: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    const nearbyBusinesses = businesses.filter((business) => {
      const distance = haversineDistance(
        { latitude, longitude },
        {
          latitude: Number(business.latitude),
          longitude: Number(business.longitude),
        }
      );
      return distance <= radiusInMeters;
    });

    res.json({
      result: nearbyBusinesses,
    });
  }
);

export const getConsumerByUserId = createEndpoint(
  GetConsumerByUserIdValidator,
  async (req, res) => {
    const { userId } = req.params;
    const { user: loggedInUser } = getUserInfo(req);

    const consumer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Consumer: true,
        followings: {
          where: {
            followerId: loggedInUser.id,
          },
        },
        _count: {
          select: {
            followings: true,
            follows: true,
          },
        },
      },
    });

    if (!consumer || !consumer.Consumer)
      throw createError(404, "Consumer not found");

    const { password, ...restConsumer } = consumer;

    res.json({
      result: restConsumer,
    });
  }
);

export const getVendorByUserId = createEndpoint(
  GetVendorByUserIdValidator,
  async (req, res) => {
    const { userId } = req.params;
    const { user: loggedInUser } = getUserInfo(req);

    const vendor = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        followings: {
          where: {
            followerId: loggedInUser.id,
          },
        },
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
        _count: {
          select: {
            followings: true,
          },
        },
      },
    });

    if (!vendor || !vendor.Vendor) throw createError(404, "Vendor not found");

    const { password, ...restVendor } = vendor;

    res.json({
      result: restVendor,
    });
  }
);

export const getSearchItems = createEndpoint(
  GetSearchItemValidator,
  async (req, res) => {
    const { name, latitude, longitude } = req.query;
    const { user } = getUserInfo(req);

    if (name) {
      const menuItems = await prisma.menuItem.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          menuCategory: {
            include: {
              business: {
                include: {
                  vendor: {
                    include: {
                      user: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          aggregateRating: "desc",
        },
      });

      const menuItemsWithDistance = menuItems.map((item) => {
        const distanceInMeters = haversineDistance(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          { latitude: latitude!, longitude: longitude! },
          {
            latitude: Number(item.menuCategory.business.latitude),
            longitude: Number(item.menuCategory.business.longitude),
          }
        );
        return {
          id: item.id,
          name: item.name,
          businessUserId: item.menuCategory.business.vendor.user.id,
          imageUrl: item.imageUrl,
          aggregateRating: item.aggregateRating,
          distanceInKm: (distanceInMeters / 1000).toFixed(2),
        };
      });
      res.json({
        result: menuItemsWithDistance,
      });
    } else {
      const followedUsers = await prisma.follow.findMany({
        where: {
          followerId: user.id,
        },
        select: {
          following: {
            select: {
              id: true,
              Consumer: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      const followedVendorUserIds = followedUsers
        .filter((fc) => !fc.following.Consumer)
        .map((fc) => fc.following.id);

      const followingMenuItems = await prisma.menuItem.findMany({
        where: {
          menuCategory: {
            business: {
              vendor: {
                userId: {
                  notIn: followedVendorUserIds,
                },
              },
            },
          },
        },
        include: {
          menuCategory: {
            include: {
              business: {
                include: {
                  vendor: {
                    include: {
                      user: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const menuItemsWithDistance = followingMenuItems.map((item) => {
        const distanceInMeters = haversineDistance(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          { latitude: latitude!, longitude: longitude! },
          {
            latitude: Number(item.menuCategory.business.latitude),
            longitude: Number(item.menuCategory.business.longitude),
          }
        );
        return {
          id: item.id,
          name: item.name,
          businessUserId: item.menuCategory.business.vendor.user.id,
          imageUrl: item.imageUrl,
          aggregateRating: item.aggregateRating,
          distanceInKm: (distanceInMeters / 1000).toFixed(2),
        };
      });
      res.json({
        result: menuItemsWithDistance,
      });
    }
  }
);

export const getSearchItemsPosts = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);
  const followedUsers = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    select: {
      following: {
        select: {
          id: true,
          Consumer: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  const followedVendorUserIds = followedUsers
    .filter((fc) => !fc.following.Consumer)
    .map((fc) => fc.following.id);

  const followingMenuItems = await prisma.menuItem.findMany({
    where: {
      menuCategory: {
        business: {
          vendor: {
            userId: {
              notIn: followedVendorUserIds,
            },
          },
        },
      },
    },
    include: {
      menuCategory: {
        include: {
          business: {
            include: {
              vendor: {
                include: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // map the menu items to include only menu item details and vendor userID
  const menuItems = followingMenuItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    price: item.price,
    aggregateRating: item.aggregateRating,
    menuCategoryId: item.menuCategoryId,
    businessUserId: item.menuCategory.business.vendor.user.id,
  }));

  res.json({
    result: menuItems,
  });
});
