import UnitOfWork from "./services/UnitOfWork";

class RateController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getRating = async (req, res) => {
    try {
      const { ratings } = await this.unit.Account.getById(
        req.user.accountId
      ).populate({
        path: "ratings",
        match: {
          product: req.query.id,
        },
        select: "rating",
      });
      return res.status(200).json(ratings[0]);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  ratingProduct = async (req, res) => {
    const productId = req.query.id;
    const { accountId } = req.user;
    let increment = 0,
      count = 0;
    try {
      const prevRate = await this.unit.Rate.getOne({
        product: productId,
        account: accountId,
      });

      const update = await this.unit.Rate.updateOne(
        { product: productId, account: accountId },
        { ...req.body, product: productId, account: accountId },
        {
          upsert: true,
          new: true,
        }
      );
      if (prevRate) increment = update.rating - prevRate.rating;
      else {
        await this.unit.Account.updateById(accountId, {
          $push: { ratings: update._id },
        });
        increment = update.rating;
        count = 1;
      }
      this.unit.Product.getById(productId)
        .select(["avgRating", "rateCount"])
        .exec(async (err, doc) => {
          await this.unit.Product.updateById(productId, {
            $inc: {
              rateCount: count,
            },
            avgRating:
              (doc.avgRating * doc.rateCount + increment) /
              (doc.rateCount + count),
          });
        });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}

export default new RateController();
