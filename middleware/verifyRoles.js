const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles]; // make array copy
    console.log(rolesArray);
    console.log(req.roles);
    const isAllowed = req.roles.map(role => rolesArray.includes(role)).find(value => value === true);
    if (!isAllowed) return res.sendStatus(401);
    next(); // let the route access
  }
}

module.exports = verifyRoles;
