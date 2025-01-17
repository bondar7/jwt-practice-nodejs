const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
}

const getUsersCount = (req, res, next) => {
  let usersCount = usersDB.users.length;
  res.status(200).json({data: `Registered users: ${usersCount}`});
}
const getUserInfo = (req, res, next) => {
  const username = req.username;
  res.status(200).json({data: username});
}

module.exports = {getUsersCount, getUserInfo};