# Farmacia – Node.js + Sequelize + PostgreSQL + JWT

## Requisitos
Node.js 18+ y PostgreSQL en ejecución.

## Pasos
1. `npm install`
2. Configura `.env` con las credenciales de PostgreSQL y `JWT_SECRET`. Para proveedores como Render, usa `DATABASE_URL` con la URL de conexión completa, o configura `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS` y `DB_NAME` con el host externo; SSL se activa automáticamente para hosts `*.render.com`. Para otros servidores que requieran SSL, configura `DB_SSL=true`.
3. Con conexión local, asegúrate de que el usuario tenga permiso para crear bases de datos (`CREATEDB`). Con `DATABASE_URL`, la base debe existir previamente.
4. `npm run seed`  → crea las tablas, las relaciones e inserta datos. El modo de conexión local también crea `bd_Farmacia` si no existe.
5. `npm start`     → abre http://localhost:3000

## Usuarios de prueba
El formulario de registro permite elegir entre `administrador`, `moderador` y `usuario`; al iniciar sesión, el menú y la barra de navegación muestran las opciones correspondientes al rol. Esta selección pública es adecuada para una demostración académica; en una aplicación real, no se debe permitir que una persona se asigne privilegios de administrador.

Las cuentas de prueba de abajo se crean al ejecutar `npm run seed`. Ese comando recrea las tablas y borra sus datos actuales; no lo ejecutes en una base con datos que quieras conservar.

| Rol | Correo | Contraseña |
|---|---|---|
| administrador | admin@farmacia.com | Admin123 |
| moderador | moderador@farmacia.com | Moder123 |
| usuario | usuario@farmacia.com | Usuario123 |

## Permisos
| Acción | usuario | moderador | administrador |
|---|---|---|---|
| Ver medicamentos | ✔ | ✔ | ✔ |
| Crear / editar medicamentos y categorías | ✘ | ✔ | ✔ |
| Eliminar medicamentos y categorías | ✘ | ✘ | ✔ |
| Gestionar usuarios y roles | ✘ | ✘ | ✔ |

## API
- POST /api/auth/register · POST /api/auth/login · GET /api/auth/me
- CRUD /api/categorias y /api/medicamentos (header `Authorization: Bearer <token>`)
- GET/PUT/DELETE /api/usuarios (solo administrador)
