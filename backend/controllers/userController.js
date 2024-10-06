const userModel = require("../models/userModel");

exports.getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await userModel.find({
      ...keyword,
      _id: { $ne: req.user._id },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getData = async (req, res) => {
  try {
    const data = req.user;
    res.json({ data });
  } catch (error) {}
};
