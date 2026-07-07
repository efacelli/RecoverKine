# RECOVER - Centro de Rehabilitacion y Readaptacion Fisica

Aplicacion web para la gestion de pacientes, sesiones de kinesiologia e historial de acciones.

## Estructura

```
recover/
├── Backend/    Node.js + Express + Prisma + Neon PostgreSQL + JWT
└── Frontend/   React + Vite + Tailwind CSS + shadcn/ui + Lucide React
```

## 1. Backend

### 1.1 Instalar dependencias

```bash
cd Backend
npm install
```

### 1.2 Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

- `DATABASE_URL`: cadena de conexion de tu base de datos en Neon (https://console.neon.tech). Se obtiene desde el dashboard del proyecto, pestana "Connection Details". Debe incluir `?sslmode=require`.
- `JWT_SECRET`: una cadena larga y aleatoria (podes generarla con `openssl rand -base64 32`).
- `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`: credenciales del unico usuario del sistema que se creara al correr el seed.

### 1.3 Crear las tablas en Neon (migraciones)

```bash
npx prisma migrate dev --name init
```

Esto genera las tablas `admins`, `patients`, `session_movements` y `history_logs` en tu base de Neon.

### 1.4 Crear el usuario administrador

```bash
npm run seed
```

Esto crea el unico usuario de login (usuario/contrasena) usando bcrypt para encriptar la contrasena, con los valores definidos en `.env`.

### 1.5 Levantar el servidor

```bash
npm run dev
```

El backend queda disponible en `http://localhost:4000`. Podes verificar que funciona entrando a `http://localhost:4000/api/health`.

## 2. Frontend

### 2.1 Instalar dependencias

```bash
cd Frontend
npm install
```

### 2.2 Configurar variables de entorno

```bash
cp .env.example .env
```

Por defecto apunta a `http://localhost:4000/api`. Cambialo si desplegas el backend en otra URL.

### 2.3 Levantar la app

```bash
npm run dev
```

Abrir `http://localhost:5173`. Vas a ingresar con el usuario/contrasena del seed, luego elegir "Ignacio" o "Juan" y ya podras usar el sistema completo.

## 3. Flujo de uso

1. **Login** con usuario y contrasena (JWT).
2. **Seleccion de operador**: Ignacio o Juan. Todas las acciones quedan registradas a ese nombre.
3. **Dashboard**: tarjetas estadisticas clicables que filtran la tabla de pacientes.
4. **Tabla de pacientes**: alta, edicion, +/- de sesiones, renovacion de autorizacion, generador de recordatorio (copia al portapapeles) y eliminacion (con confirmacion).
5. **Validacion de sesion del mismo dia**: si ya se desconto una sesion hoy para ese paciente, aparece un dialogo de advertencia en rojo antes de permitir un segundo descuento.
6. **Deshacer**: disponible unos segundos despues de sumar/descontar una sesion.
7. **Historial**: registro completo de todas las acciones, filtrable por paciente, usuario y fecha.
8. **Exportar a Excel**: descarga un `.xlsx` con todos los pacientes.
9. **Modo oscuro**: boton en el navbar, se guarda la preferencia en el navegador.

## 4. Despliegue

- **Backend**: se puede desplegar en Railway, Render, Fly.io, o cualquier servicio que soporte Node.js. Recorda correr `npx prisma migrate deploy` en el primer despliegue.
- **Frontend**: se puede desplegar en Vercel o Netlify. Configura `VITE_API_URL` apuntando a la URL publica del backend.
- **Base de datos**: Neon PostgreSQL (ya serverless, no requiere configuracion adicional de infraestructura).

## 5. Notas de seguridad

- Las contrasenas se almacenan con `bcrypt` (nunca en texto plano).
- Las sesiones nunca pueden quedar en negativo (validado en el backend).
- Los pacientes nunca se eliminan automaticamente: al completar sus sesiones pasan a estado "Tratamiento completado".
- Todas las rutas de pacientes, sesiones e historial requieren un token JWT valido y el header `X-Operador` (Ignacio o Juan).
