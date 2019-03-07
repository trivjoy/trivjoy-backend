const controller = {
  getRoot: (req, res, next) => {
    res.status(200).send({
      message: 'Users'
    })
  },
  postRegister: (req, res, next) => {
    console.log(req.body)

    res.status(200).send({
      message: 'Register'
    })
  },
  postLogin: (req, res, next) => {
    res.status(200).send({
      message: 'Login'
    })
  }
}

module.exports = controller
