const checkUsername = (name) => {
  return !!name.match(/^[а-яА-Я-a-zA-Z][а-яА-Я0-9-a-zA-Z0-9-_.]{1,20}$/);
};

module.exports = checkUsername;