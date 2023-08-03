function checkString(stringParam) {
    return function (req, res, next) {
      if (req.params[stringParam].trim() === "") {
        return res.status(400).json({ error: `Parametro ${stringParam} mancante`   });
      }
      next();
    };
  }
  
  module.exports = checkString;
  