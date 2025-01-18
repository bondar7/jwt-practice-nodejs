const usersController = require("../db/usersController");

const getUsersCount = async (req, res, next) => {
  const usersCount = (await usersController.getAll()).length;
  res.status(200).json({usersCount: `Registered users: ${usersCount}`});
}
const getUserInfo = async (req, res, next) => {
  const id = req.user.id;
  const user = await usersController.getUserById(id);
  const userInfo = {
    id: user._id,
    username: user.username,
    roles: user.roles
  }
  res.status(200).json(userInfo);
  console.log("User info sent: ", userInfo);
  
}

module.exports = {getUsersCount, getUserInfo};