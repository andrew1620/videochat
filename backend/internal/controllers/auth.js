const { users } = require("../../data/db/users");
const createAnswer = require("../../utils/answer");
const checkUsername = require("../../utils/checkUsername");

module.exports.login = (req, res) => {
  if (!req.body.name)
    return res.status(401).json(createAnswer("Name is required"));
  if (!checkUsername(req.body.name))
    return res.status(401).send(createAnswer("Name is invalid"));

  try {
    const addedUser = users.addUser(req.body.name);
    return res.status(200).json(createAnswer(null, addedUser));
  } catch (err) {
    return res.status(500).send(createAnswer(err.message));
  }
};
