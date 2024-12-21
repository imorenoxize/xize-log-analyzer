# XIZE Log Analyzer

Microservicio para analizar archivos de log de gran tamaño, detectar errores basados en patrones y notificar por correo.  
Además, se provee un endpoint de `/login` para autenticación vía JWT y un endpoint `/api/analyze` para subir y analizar los logs.

---

## Características Principales

1. **Análisis de Logs**  
   - Detecta patrones de error usando expresiones regulares (configurables en `src/utils/errorPatterns.js`).  
   - Manejo de archivos grandes mediante **streaming** (no se cargan en memoria completa).  

2. **Autenticación JWT**  
   - Endpoint `/api/login` para autenticar con usuario y contraseña (definidos en variables de entorno).  
   - Protege las rutas privadas con un header `xize_analyzer_token`.

3. **Encriptación AES-256**  
   - Puede **desencriptar** el log si viene encriptado (opcional).  
   - Vuelve a **encriptar** el archivo al guardarlo localmente (o en S3, si se habilitara en el futuro).

4. **Notificaciones**  
   - Envía **un email** por archivo con errores (no uno por cada error).  
   - Se puede extender para envío de SMS o a otro endpoint.

5. **Almacenamiento Local Simulado**  
   - Por defecto, guarda los logs con errores en `src/logs/error-logs`.  
   - Si se requiere usar AWS S3, se puede reactivar `s3Service.js` y configurar las credenciales.

6. **Configuración Flexible**  
   - Variables de entorno en `.env` (ver sección "Variables de Entorno" abajo).  
   - Tamaño máximo del log ajustable con `MAX_LOG_SIZE_MB`.  
   - Ajustes de Docker para producción.

---

## Requisitos Previos

- **Node.js 22** (o compatible).
- **npm** o **yarn**.
- **Docker** (opcional si deseas contenedor).

---

## Instalación y Ejecución

1. **Clonar o Crear el Proyecto**  
   ```bash
   git clone https://github.com/<tu-org>/xize-log-analyzer.git
   cd xize-log-analyzer
   ```

2. **Instalar Dependencias**  
   ```bash
   npm install
   ```
   Esto instalará las librerías definidas en `package.json`.

3. **Copiar `.env.example` a `.env`**  
   ```bash
   cp .env.example .env
   ```
   Luego, edita `.env` con tus valores. Asegúrate de que `ENCRYPTION_KEY` tenga 32 caracteres si usas AES-256.

4. **Iniciar el Servicio (Modo Desarrollo)**  
   ```bash
   npm run dev
   ```
   Asumiendo que tengas un script "dev" que use `nodemon`. De lo contrario:
   ```bash
   npm start
   ```
   El servicio se levantará en `http://localhost:3000`.

5. **Login**  
   - Endpoint: `POST /api/login`
   - Body JSON:
     ```json
     {
       "username": "admin",
       "password": "secret123"
     }
     ```
   - Si coincide con `ADMIN_USER` y `ADMIN_PASS` de tu `.env`, obtendrás un JWT en la respuesta.

6. **Probar Análisis de un Log**  
   - Endpoint: `POST /api/analyze`
   - Headers:
     - `Content-Type: application/json`
     - `xize_analyzer_token: <JWT_obtenido>`
   - Body (ejemplo):
     ```json
     {
       "log": "BASE64_DEL_LOG",
       "isBase64": true,
       "isEncrypted": false,
       "return": true
     }
     ```
   - Si se encuentran errores, se guardará un archivo en `src/logs/error-logs/<fecha>_<uuid>.log.enc` (encriptado) y se enviará un correo a los destinatarios de `NOTIFICATION_EMAILS`.

---

## Variables de Entorno

A continuación, la explicación de cada variable en `.env.example`. Ajusta según tu entorno:

```makefile
PORT=3000
# Puerto en el que escuchará la aplicación (p.e. 3000).

NODE_ENV=development
# Entorno de ejecución: development, production, etc.

MAX_LOG_SIZE_MB=256
# Tamaño máximo en MB para los logs que se aceptarán vía POST.
# Internamente usado por bodyParser.json({ limit: ... }) o express.json({ limit: ... }).

JWT_SECRET=supersecret_jwt_key
# Llave secreta para firmar y validar tokens JWT (en /api/login y auth.js).

S3_BUCKET_NAME=xize-logs-bucket
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY
AWS_DEFAULT_REGION=us-east-1
# Credenciales de AWS.
# Opcional si deseas realmente subir a S3. Si no las usas, puedes dejarlas vacías o no definirlas (y usar almacenamiento local con localStorageService.js).

EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=user@example.com
EMAIL_SMTP_PASS=password
NOTIFICATION_EMAILS=dest1@example.com,dest2@example.com
# Configuración SMTP para enviar correos.
# NOTIFICATION_EMAILS: Lista separada por comas de destinatarios a quienes notificar cuando se detecten errores.

ENCRYPTION_KEY=EstaEsUnaLlaveDe32BytesDeLargoParaAES
# Clave AES-256 de 32 caracteres.
# Usada para encriptar/desencriptar logs (encryptionService.js).

ADMIN_USER=admin
ADMIN_PASS=secret123
# Credenciales para el endpoint /api/login.
# Combínalas con JWT_SECRET para permitir el acceso a /api/analyze.
```

---

## Flujo General

1. **Autenticación**:
   - El cliente obtiene un JWT con `POST /api/login` y pasando username/password (definidos en `.env`).

2. **Análisis de Logs**:
   - Envía un log a `POST /api/analyze` con el header `xize_analyzer_token: <JWT>`.
   - El microservicio decodifica y (si aplica) desencripta el contenido.
   - Guarda temporalmente el log y lo procesa por stream para detectar errores.
   - Si hay errores, encripta el log completo y lo guarda en `src/logs/error-logs` (simulando S3), además de enviar un solo correo a `NOTIFICATION_EMAILS`.

3. **Respuesta**:
   - Si en el body se define `"return": true`, se devuelve un JSON con `status: "ok"` y los nombres de los errores encontrados.
   - En caso contrario, se devuelve `204 No Content`.

---

## Uso con Docker

1. **Construir Imagen**  
   ```bash
   docker build -t xize-log-analyzer:latest .
   ```

2. **Ejecutar Contenedor**  
   ```bash
   docker run -d -p 3000:3000 --env-file .env xize-log-analyzer:latest
   ```
   El microservicio estará disponible en `http://localhost:3000`.

---

## Limpieza de Archivos Locales

- Cuando se detectan errores, se crea un archivo en `src/logs/error-logs/...`.
- Si deseas eliminar estos archivos tras cierto tiempo o una vez procesados, puedes hacerlo manualmente o programar un script.
- Para evitar llenar el disco, se sugiere algún cron o job que limpie archivos antiguos.
