const controller = {
  getRoot: (req, res, next) => {
    res.status(200).send({
      message: "Users"
    });
  }
};

module.exports = controller;
