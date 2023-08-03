
  
function idCheck(idParam) {
  return function (req, res, next) {
    const paramValue = req.params[idParam].trim();
    if (paramValue === "") {
      return res.status(400).json({ error: `Parametro ${idParam} mancante` });
    }

    const parsedValue = parseInt(paramValue);
    if (isNaN(parsedValue)) {
      return res.status(400).json({ error: `Parametro ${idParam} deve essere un numero` });
    }

    next();
  };
}

module.exports = idCheck;
  