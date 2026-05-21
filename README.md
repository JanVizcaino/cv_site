# cv_site

Mini CV interactivo full stack desplegado con CI/CD automatizado en una Raspberry Pi. El usuario puede consultar los datos del CV almacenados en MariaDB a través de una API REST, con el frontend servido desde cualquier host y las imágenes optimizadas mediante ImageKit.

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18 | UI basada en componentes |
| Tailwind CSS | 3 | Estilos utilitarios |
| Vite | 6 | Bundler y servidor de desarrollo |

### Backend

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 20 (Alpine) | Runtime del servidor |
| Express | 5 | Framework HTTP y enrutamiento |
| mysql2 | 3 | Conector MySQL/MariaDB con soporte de Promises |
| dotenv | 17 | Gestión de variables de entorno |
| MariaDB | 10.11 | Base de datos relacional |

### DevOps e Infraestructura

| Tecnología | Rol |
|---|---|
| Docker | Contenerización del backend y la base de datos |
| Docker Bridge Network (`cv-net`) | Red interna para comunicación entre contenedores |
| Jenkins (en Docker) | Servidor CI/CD |
| GitHub Webhooks | Disparo automático del pipeline en cada `git push` |
| ngrok | Túnel público para exponer la API (puerto 3000) |
| ImageKit | CDN para servir imágenes optimizadas en WebP |

---

## Estructura del proyecto

```
cv_site/
├── api/                        # Backend Node.js + Express
│   ├── db/
│   │   ├── mariadb.js          # Pool de conexión a MariaDB
│   │   ├── postgres.js         # Pool de conexión a PostgreSQL (alternativo)
│   │   └── init.sql            # Script de inicialización de la base de datos
│   ├── routes/
│   │   └── cv.js               # Rutas de la API (/api/cv)
│   ├── server.js               # Punto de entrada del servidor
│   ├── Dockerfile              # Imagen de la API
│   ├── Jenkinsfile             # Pipeline CI/CD
│   ├── .env                    # Variables de entorno (no versionado)
│   └── package.json
│
└── frontend/                   # Frontend React + Tailwind + Vite
    ├── src/
    │   ├── components/
    │   │   ├── CVCard.jsx       # Tarjeta principal del CV
    │   │   ├── DBSelector.jsx   # Selector de base de datos activa
    │   │   └── Modal.jsx        # Modal de información adicional
    │   ├── pages/
    │   │   └── Home.jsx
    │   ├── App.jsx              # Componente raíz
    │   └── main.jsx             # Punto de entrada React
    └── package.json
```

---

## Flujo de CI/CD

El pipeline conecta un `git push` en GitHub con el despliegue automático en la Raspberry Pi siguiendo estos pasos:

```
Developer  →  git push  →  GitHub
                              │
                              │  Webhook (HTTP POST)
                              ▼
                         Jenkins (Docker)
                              │
                    ┌─────────┴──────────┐
                    │   Jenkinsfile      │
                    │                   │
                    │  1. checkout scm  │
                    │  2. cv-net        │
                    │  3. cv-mariadb    │
                    │  4. cv-api        │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Raspberry Pi    │
                    │                   │
                    │  cv-mariadb:3306  │
                    │  cv-api:3000      │──── ngrok ────► Internet
                    └───────────────────┘
```

### Etapas del Jenkinsfile

1. **Descargar código** — `checkout scm` clona la rama activa del repositorio en el workspace de Jenkins.

2. **Preparar red Docker** — crea la red bridge `cv-net` (`docker network create cv-net || true`). El `|| true` evita que el pipeline falle si la red ya existe de una ejecución anterior.

3. **Levantar MariaDB** — elimina el contenedor previo y arranca `mariadb:10.11` con un volumen persistente (`mariadb_data`) y el script `init.sql` montado en `/docker-entrypoint-initdb.d/`. Espera activamente con `mysqladmin ping` antes de continuar para garantizar que la base de datos está lista.

4. **Construir y desplegar API** — ejecuta `docker build` sobre el `Dockerfile` de `/api` (imagen `node:20-alpine`) y lanza el contenedor `cv-api-container` en la red `cv-net`, pasándole las credenciales de MariaDB como variables de entorno y exponiendo el puerto `3000`.

---

## Levantar el proyecto en local

### Requisitos previos

- Node.js >= 20
- Docker y Docker Compose (o Docker Engine)
- Una instancia de MariaDB accesible

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd cv_site
```

### 2. Backend

```bash
cd api
cp .env.example .env   # ajusta las variables de entorno
npm install
npm run dev            # inicia con nodemon en http://localhost:3000
```

Variables de entorno requeridas en `api/.env`:

```env
MARIADB_HOST=localhost
MARIADB_USER=cv_user
MARIADB_PASSWORD=password
MARIADB_DATABASE=cv_db
MARIADB_PORT=3306
PORT=3000
```

### 3. Base de datos (con Docker)

```bash
docker run -d \
  --name cv-mariadb \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=cv_db \
  -e MYSQL_USER=cv_user \
  -e MYSQL_PASSWORD=password \
  -v mariadb_data:/var/lib/mysql \
  -v $(pwd)/api/db/init.sql:/docker-entrypoint-initdb.d/init.sql \
  mariadb:10.11
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev   # inicia Vite en http://localhost:5173
```

> **Nota:** el frontend apunta por defecto al endpoint de ngrok definido en `src/App.jsx`. Para desarrollo local, sustituye la URL base por `http://localhost:3000`.

---

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/cv` | Devuelve los datos del CV. Admite `?db=mariadb` |

---

## Imágenes y CDN

Las imágenes se sirven a través de **ImageKit** con transformaciones on-the-fly:

```
https://ik.imagekit.io/<id>/<imagen>.png?tr=w-300,h-300,f-webp,q-80
```

Esto elimina la necesidad de almacenar imágenes en el servidor y garantiza formato WebP con compresión optimizada en cada petición.
