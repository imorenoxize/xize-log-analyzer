# XIZE Log Analyzer

Microservicio para **analizar archivos de log** (incluso de gran tamaño), **detectar errores** basados en patrones de expresión regular, **encriptarlos** (opcional) y **enviar notificaciones** por email cuando se detectan errores. También incluye autenticación vía **JWT** para proteger el endpoint principal.

---

## Características Principales

1. **Análisis de logs grandes**  
   - Manejo de archivos potencialmente muy grandes usando Node.js (con posibilidad de streaming para no consumir demasiada memoria).  
   - Búsqueda de **patrones de error** configurables (por defecto, WSDL Load Error, Timeout, Database Error, etc.).  

2. **Autenticación JWT**  
   - Endpoint `/api/login` para autenticar con credenciales definidas en `.env`.  
   - Las peticiones protegidas requieren el header `xize_analyzer_token` con un token válido.

3. **Encriptación AES-256**  
   - Los logs pueden venir **encriptados** y se desencriptan antes del análisis.  
   - Opcionalmente se vuelven a encriptar antes de almacenarlos localmente.

4. **Notificaciones por Email**  
   - Si se detectan errores, se envía **un solo** correo con el resumen de lo encontrado.  
   - Se pueden configurar uno o varios destinatarios con `NOTIFICATION_EMAILS`.

5. **Almacenamiento Local**  
   - Los logs con errores se almacenan en `src/logs/error-logs/` (simulando S3).  
   - Cuando tengas credenciales AWS, puedes cambiar a `s3Service.js` para subir a un bucket real.

6. **Configuración Flexible**  
   - Todas las variables de entorno se definen en `.env` (ver sección “Variables de Entorno” más abajo).  
   - Ejecución con Node.js localmente o dentro de contenedores Docker.

---

## Requisitos Previos

- **Node.js 22** o superior (descargar desde [Node.js official site](https://nodejs.org)).
- **npm** (instalado junto con Node.js).
- **Git** (opcional, para clonar el repositorio).
- **Editor de texto** o IDE (VS Code recomendado).
- (Opcional) **Docker** si deseas empaquetar y correr todo en un contenedor.