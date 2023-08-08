function sendErrorByStatusCode(res, statusCode, message='') {
    const errorMessages = {
        200: "Richiesta eseguita correttamente",
      400: "Richiesta non valida",
      401: "Non autorizzato",
      403: "Accesso vietato",
      404: "Risorsa non trovata",
      500: "Errore nel server",
    }

  
    const errorMessage = errorMessages[statusCode] || "Errore sconosciuto";
    res.status(statusCode).json({ error: errorMessage, message });
  }
  
  module.exports = { sendErrorByStatusCode };
  