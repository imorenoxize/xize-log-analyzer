// Patrones de error típicos a buscar.
// Podríamos hacerlo más complejo, con regex, etc.
module.exports = [
    {
      name: "WSDL Load Error",
      pattern: /ERROR:\s+Parsing WSDL:.*failed to load external entity/i
    },
    {
      name: "Financiamiento Error",
      pattern: /no es sujeto de financiamiento/i
    },
    {
      name: "Registro Prev",
      pattern: /Persona sin registro previo/i
    },
    // Añade más patrones típicos de microservicios
    {
      name: "Timeout",
      pattern: /ETIMEDOUT|TimeoutException|Request timed out/i
    },
    {
      name: "Database Error",
      pattern: /SQLSTATE|database is locked|failed to connect/i
    }
  ];
  