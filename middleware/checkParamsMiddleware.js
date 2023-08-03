function checkParams(param1 = '',param3='', param2 = '') {
    return function(req, res, next) {
      const primaryID = req.params[param1];
      const fk_id = req.params[param2];
  
      if (!primaryID && param1 !== '') {
        return res.status(400).json({ error: `${param1} mancante` });
      }
  
      if (!fk_id && param2 !== '') {
        return res.status(400).json({ error: `${param2} mancante` });
      }
  
      if (param1 !== '' && isNaN(primaryID)) {
        return res.status(400).json({ error: `${param1} deve essere un numero` });
      }
  
      if (param2 !== '' && isNaN(fk_id)) {
        return res.status(400).json({ error: `${param2} deve essere un numero` });
      }
  
      // Se i parametri sono corretti, passa al prossimo middleware o alla route
      next();
    };
  }
  
  module.exports = checkParams;
  