const checkUsername = (rule, value, callback) => {
  if (!value)
    return callback('Имя обязательно')
  const isCorrect = !!value.match(/^[а-яА-Я-a-zA-Z][а-яА-Я0-9-a-zA-Z0-9-_.]{1,20}$/)
  if (!isCorrect)
    return callback('Имя должно быть 2-20 символов и начинаться с буквы')
}

export default checkUsername;