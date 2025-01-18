const User = require("../model/User");

const insertUser = async (username, pwd, roles, refreshToken) => {
  await User.create(
    {
      username: username,
      password: pwd,
      roles: {...roles},
      refreshToken: refreshToken
    }
  );
  console.log("User is saved.");
};

const userExists = async (username, refreshToken) => {
  if (username) { // search by username
    const array = await User.find({username: username});
    if (array.length > 0) return array[0]; 
    else return null;
  } else if (refreshToken) { // search by refresh token
    const array = await User.find({refreshToken: refreshToken});
    if (array.length > 0) return array[0]; 
    else return null;
  }
}

const getUserById = async (id) => {
  return await User.findById(id);
}
const getAll = async () => {
  return await User.find();
}

const updateRefreshToken = async (username, token) => {
  await User.updateOne({username: username}, {refreshToken: token});
  console.log("Refresh token updated in usersController.");
}

module.exports = {insertUser, userExists, updateRefreshToken, getUserById, getAll};