# TurnosRed

Backend simple realizado para la **Actividad 1 de Integraciones web**. Usa Node.js, TypeScript, Express, EventEmitter y Socket.IO.

## Requisitos previos

- Node.js 22 LTS
- NVM
- npm

## Instalación

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

Servidor: `http://localhost:3000`

Cliente de eventos: `http://localhost:3000/socket-test.html`

## Variables de entorno

| Variable    | Descripción             | Ejemplo              |
| ----------- | ----------------------- | -------------------- |
| `PORT`      | Puerto HTTP             | `3000`               |
| `DATA_FILE` | Ruta al JSON de entrada | `./data/turnos.json` |

## Scripts npm

| Script               | Uso                                    |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Ejecuta el servidor en modo desarrollo |
| `npm start`          | Ejecuta el servidor                    |
| `npm run build`      | Compila TypeScript a `dist/`           |
| `npm run start:prod` | Ejecuta el código compilado            |
| `npm run lint`       | Revisa el código con ESLint            |
| `npm run format`     | Aplica Prettier                        |

## Estructura

```text
src/
├── controllers/   # Respuestas HTTP
├── events/        # EventEmitter interno
├── models/        # Interfaces Turno y TurnoCrudo
├── routes/        # Rutas Express
├── services/      # Lectura JSON y CRUD
├── utils/         # Normalización y ejemplo callbacks
└── server.ts      # Express + HTTP + Socket.IO

data/turnos.json
public/socket-test.html
```

## Normalización

Al iniciar, el servidor lee `turnos.json` con `node:fs/promises` y `async/await`. Los registros se convierten al modelo `Turno`:

- `id` a número entero positivo.
- `documento` a string.
- `paciente` sin espacios sobrantes.
- fecha `DD/MM/YYYY` a `YYYY-MM-DD`.
- hora con `.` a `:`.
- `confirmado` a booleano.

Los registros inválidos se descartan y se informa por consola la cantidad aceptada y rechazada.

## Endpoints REST

| Método | Ruta          | Acción                   |
| ------ | ------------- | ------------------------ |
| GET    | `/turnos`     | Obtener todos los turnos |
| GET    | `/turnos/:id` | Obtener un turno por ID  |
| POST   | `/turnos`     | Crear un turno           |
| PUT    | `/turnos/:id` | Actualizar un turno      |
| DELETE | `/turnos/:id` | Eliminar un turno        |

Ejemplo para `POST /turnos`:

```json
{
  "id": "103",
  "paciente": "Ana Pérez",
  "documento": 30111111,
  "especialidad": "CLÍNICA MÉDICA",
  "fecha": "28/08/2026",
  "hora": "09.30",
  "confirmado": "si",
  "observaciones": "Control"
}
```

## Eventos

Eventos internos con `EventEmitter`:

- `turno:creado`
- `turno:actualizado`
- `turno:eliminado`

Eventos enviados por Socket.IO:

- `turno:nuevo`
- `turno:actualizado`
- `turno:eliminado`

Para comprobarlos, abrir `http://localhost:3000/socket-test.html` y luego crea, actualiza o elimina un turno.