# ADR-001: Uso de OpenAPI como estándar de documentación

**Título**: Adopción de Swagger/OpenAPI como documentación oficial de la API

**Fecha**: 3 de octubre de 2026

**Estado**: Aceptado

**Contexto**:
TurnosRed expone una API REST con los recursos Turno y Médico. La documentación vivía
solo en el README, lo que genera riesgo de drift: el código cambia y la documentación
queda obsoleta. Se necesita un contrato único, versionable y navegable que los clientes
externos puedan consultar.

**Decisión**:
Adoptar Swagger/OpenAPI 3.0 como estándar oficial mediante swagger-jsdoc y
swagger-ui-express. Las anotaciones JSDoc se colocan junto a las rutas reales
(src/routes/*.ts) y la especificación se sirve en /api-docs. El esquema OpenAPI
replica los esquemas de Zod (documento como string, enum de especialidades en
Title Case) y no declara esquemas de seguridad.

**Consecuencias**:
- Documentación interactiva y autogenerada desde el código fuente.
- Punto único de verdad del contrato REST.
- Doble mantenimiento: las anotaciones pueden salirse de sync si no se revisan en PR.
- Médicos y Turnos quedan descritos con los mismos códigos HTTP y formato de error.

**Alternativas consideradas**:
- Solo README con tablas estáticas: simple, pero no garantiza mantenibilidad.
- OpenAPI separado escrito a mano sin jsdoc: duplicación y propensión a drift.
- Otros formatos (API Blueprint, RAML): menos ecosistema en Node/Express.

**Limitaciones**:
- Requiere que los esquemas de Zod estén alineados a mano con components/schemas.
- swagger-jsdoc parsea YAML en JSDoc; sintaxis estricta, fácil de romper.
- No hay validador de contrato en CI todavía.

**Impacto sobre el proyecto**:
Mejora la integración con clientes. El informe técnico incorpora una matriz de
verificación contra código, Postman y Zod como salvaguarda inicial de consistencia.
