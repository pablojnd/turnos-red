# Feature: actividad-4

## Objective
Cumplir Actividad 4: JWT, errores centralizados, Morgan+Pino, Jest+Supertest (+60% cov. services), Nginx, docs y ADRs.

## Tasks
- [ ] T1: JWT auth (registro/login/verificarToken, usuarios en data/usuarios.json)
- [ ] T2: Error middleware centralizado + códigos de dominio, asyncHandler
- [ ] T3: Morgan + Pino con nivel por env
- [ ] T4: Jest+Supertest: unitarias, integración, E2E, cobertura >=60% services
- [ ] T5: nginx.conf + ADR-003 + ADR-004 + ADR-002 actualizado
- [ ] T6: README (Autenticación, Pruebas, Despliegue, IA) + .env.example
- [ ] T7: Postman: auth + Authorization en escrituras
- [ ] T8: Informe Actividad 4 + verificación final

## Checks
npx tsc | npm run lint | npm run format | npm test
