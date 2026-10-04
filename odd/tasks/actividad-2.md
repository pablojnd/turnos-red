# Feature: actividad-2

## Objective

Cumplir la consigna de Actividad 2 (API-2.md) sobre TurnosRed con la máxima simplicidad.

## Why

Trabajo práctico "Integraciones web – Actividad 2": Zod, recurso Médico, errores estándar, filtros, Postman, README.

## Scope

- Middleware de validación con Zod y formato de error uniforme
- CRUD /medicos
- Filtros por query params en /turnos y /medicos
- DELETE 204, estructura en inglés con src/schemas
- Colección Postman JSON y README actualizado

## Tasks

- [x] T1: zod + schemas + middleware validate + errorResponse
- [x] T2: Recurso Médico completo (modelo, service, controller, routes, data)
- [x] T3: Turno: medicoId, filtros, DELETE 204, errores estándar
- [x] T4: Verificar lint/tsc/prettier + smoke test
- [x] T5: Postman collection + README

## Checks

lint: npx eslint . --ext .ts | build: npx tsc | format: npx prettier --write .

## Progress

Completado T1-T5: zod, schemas, medico CRUD, filtros, errores estandar, DELETE 204, Postman, README.
