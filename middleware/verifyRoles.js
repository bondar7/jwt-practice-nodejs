const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user.roles) return res.sendStatus(403);
    const rolesArray = [...allowedRoles]; // make array copy
    console.log(rolesArray);
    console.log(req.user.roles);
    const isAllowed = req.user.roles.map(role => {
      if (role) return rolesArray.includes(role);
    }).find(value => value === true);
    if (!isAllowed) return res.sendStatus(403);
    next(); // let the route access
  }
}

module.exports = verifyRoles;
