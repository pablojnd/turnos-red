# ADR-002: Adopción futura de JWT para autenticación

**Título**: Adopción futura de tokens JWT para autenticación y autorización

**Fecha**: 3 de octubre de 2026

**Estado**: Propuesto

**Contexto**:
La API actual no implementa autenticación ni autorización. Los endpoints son
públicos y los datos se consumen de forma abierta, lo cual es aceptable para la
etapa de desarrollo, pero al acercarse la integración con otros servicios y clientes
será necesario identificar y autorizar a quienes consumen la API.

**Decisión**:
En una etapa posterior se incorporarán tokens JWT para autenticar a los usuarios y
autorizar operaciones, protegiendo los recursos de TurnosRed y Medicos. Mientras
tanto la propuesta queda en estado Propuesto: no se implementa nada en esta fase,
ni se declara securityScheme en OpenAPI para no documentar funcionalidad inexistente.

**Consecuencias**:
- Se añadirá un mecanismo estándar de autenticación sin estado propio.
- Los clientes deberán enviar encabezados Authorization en las peticiones.
- Requerirá definir expiración, refresh tokens y punto de emisión.
- No afecta al comportamiento actual de la API.

**Alternativas consideradas**:
- API key simple: más fácil, pero no estándar y más difícil de rotar.
- OAuth2/OIDC externo: fuerte, pero más pesado para la escala del prototipo.
- Sesiones con cookies: más estado en servidor y peor ajuste a una API REST.

**Limitaciones**:
- Requiere almacenamiento seguro de secretos y rotación de claves.
- La revocación de tokens no es trivial sin lista de revocación.
- Al ser futura, su diseño definitivo queda sujeto a revisión.

**Impacto sobre el proyecto**:
No impacta el código actual. Define el camino previsto y permite a los consumidores
prepararse para la futura inclusión de credenciales en las peticiones.
