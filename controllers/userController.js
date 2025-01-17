const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
}

const getUsersCount = (req, res, next) => {
  let usersCount = usersDB.users.length;
  res.status(200).json({data: `Registered users: ${usersCount}`});
}
const getUserInfo = (req, res, next) => {
  const info = req.user;
  res.status(200).json({data: info.username});
}

module.exports = {getUsersCount, getUserInfo};