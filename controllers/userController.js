const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
}

const getUsersCount = (req, res, next) => {
  let usersCount = usersDB.users.length;
  res.status(200).json({message: `Registered users: ${usersCount}`});
}
const getUserInfo = (req, res, next) => {
  res.status(200).json(req.user);
}

module.exports = {getUsersCount, getUserInfo};