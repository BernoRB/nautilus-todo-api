# Nautilus TODO API

**[Go to English version](./README.md)**

API REST para gestión de tareas con autenticación JWT. Desarrollada como prueba técnica para una posición backend Node.js.

## Stack

- **Runtime:** Node.js 18
- **Framework:** Express
- **Base de datos:** MongoDB
- **Autenticación:** JWT
- **Testing:** Jest + Supertest
- **Containerización:** Docker + Docker Compose

## Primeros Pasos

### Requisitos Previos

- Docker Desktop
- Git

### Instalación y Configuración
```bash
# Clonar repositorio
git clone https://github.com/BernoRB/nautilus-todo-api.git
cd nautilus-todo-api

# Construir e iniciar servicios
docker-compose up --build

# La API estará disponible en http://localhost:3000
```

Eso es todo. Docker maneja Node.js, MongoDB y todas las dependencias.

### Sin Docker (Alternativa)

Si prefieres ejecutar localmente:
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu URI de MongoDB y JWT secret

# Iniciar MongoDB (debe estar ejecutándose por separado)

# Ejecutar dev server
npm run dev
```

## Uso

### Documentación de la API

Documentación Swagger disponible en:
- **Swagger UI:** http://localhost:3000/api-docs

### Prueba Rápida
```bash
# Health check
curl http://localhost:3000/

# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Usar el token devuelto para las peticiones autenticadas
```

### Colección de Postman

Para probar facilmente, puedes importar la colección de Postman del directorio `/postman`

## Tests
```bash
# Ejecutar todos los tests
npm test

# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration
```

Los tests usan MongoDB Memory Server, no se necesita base de datos externa.

## Estructura del Proyecto
```
src/
├── config/         # Archivos de configuración (base de datos, swagger)
├── controllers/    # Manejadores de peticiones
├── middlewares/    # Middleware personalizado (auth, manejo de errores)
├── models/         # Esquemas Mongoose
├── routes/         # Definiciones de rutas
├── services/       # Capa de lógica de negocio
├── utils/          # Utilidades (JWT)
└── validators/     # Reglas de validación de entrada

tests/
├── unit/           # Tests unitarios
└── integration/    # Tests de integración
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login de usuario

### Tareas (Protegidas por auth)
- `GET /api/tasks` - Listar todas las tareas (permite filtrar por `?completed=true|false`)
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks/:taskNumber` - Obtener tarea específica
- `PATCH /api/tasks/:taskNumber` - Actualizar tarea (ej marcar completada)
- `DELETE /api/tasks/:taskNumber` - Eliminar tarea

Todos los endpoints de tasks requieren header `Authorization: Bearer <token>`.

## Algunas Decisiones Técnicas

### Capa de Servicios
Lógica de negocio separada del manejo HTTP. Los controllers se mantienen enfocados en request/response, mientras los services contienen lógica de dominio. Esta separación mejora la testabilidad (los services se pueden testear sin mockear HTTP) y la mantenibilidad (responsabilidades claras).

### Numeración de Tareas
Las tareas usan `taskNumber` auto-incremental (1, 2, 3...) en lugar de ObjectIds de MongoDB para URLs amigables. Cada usuario tiene numeración independiente.

### Docker
Un solo comando para ejecutar todo el stack sin instalar Node.js o MongoDB localmente.

## Variables de Entorno

Variables requeridas (ver `.env.example`):
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/nautilus-todo-api
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
```

**Nota:** Al usar Docker, las variables de entorno están preconfiguradas en `docker-compose.yml` para desarrollo. Para despliegue en producción, actualizar estos valores con credenciales seguras.

## Comandos Docker
```bash
# Iniciar servicios
docker-compose up

# Reconstruir después de cambios en dependencias
docker-compose up --build

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f api
```