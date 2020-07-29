const createAnswer = (errorMessage = null, data = null) => {
  return { errorMessage, data }
}

module.exports = createAnswer;