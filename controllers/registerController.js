const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
};

const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const path = require("path");

const handleRegistration = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({message: "Username and password are required!"});
  const dublicate = usersDB.users.find(user => user.username === username);
  if (dublicate) return res.sendStatus(409); // Conflict
  try {
    const hashedPwd = await bcrypt.hash(password.toString(), 10);
    const currentUser = {
       username, 
       roles: { "User": 2001 },
       password: hashedPwd };
    usersDB.setUsers([...usersDB.users, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(usersDB.users));
    console.log(usersDB.users);
    res.status(201).json({message: "User added."});
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
};

module.exports = { handleRegistration };