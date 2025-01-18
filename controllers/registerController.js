const bcrypt = require("bcrypt");

const usersController = require("../db/usersController");

const handleRegistration = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({message: "Username and password are required!"});
  if (await usersController.userExists(username, null)) return res.sendStatus(409);
  try {
    const hashedPwd = await bcrypt.hash(password.toString(), 10);
    const roles = { "User": 2001 };
    await usersController.insertUser(username, hashedPwd, roles, null);
    res.status(201).json({message: "User added."});
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
};

module.exports = { handleRegistration };