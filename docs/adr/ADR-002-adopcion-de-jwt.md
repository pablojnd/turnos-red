# ADR-002: Adopción de JWT para autenticación y autorización

**Título**: Adopción de tokens JWT para autenticar y autorizar el acceso a la API

**Fecha**: 3 de octubre de 2026

**Estado**: Aceptado

**Contexto**:
En la etapa anterior la API era pública y no distinguía quién consumía cada operación.
En la Actividad 4 se exigió un mecanismo formal de autenticación y autorización, por
lo que se incorporó JWT en los recursos Turno y Médico.

**Decisión**:
Implementar autenticación con POST /auth/registro y POST /auth/login, contraseñas
hasheadas con bcryptjs y tokens JWT firmados con JWT_SECRET (variable de entorno,
vigencia 2 horas). El payload incluye el id del usuario y su rol. El middleware
verificarToken extrae Bearer <token>, valida firma y vigencia, y responde 401 con
los códigos AUTH_TOKEN_MISSING o AUTH_TOKEN_INVALID. Las operaciones de escritura
(POST, PUT, DELETE) de /turnos y /medicos quedaron protegidas; los GET siguen públicos.

**Consecuencias**:
- Los clientes deben crear su sesión y enviar el header Authorization en cada escritura.
- El servidor no guarda sesiones; no hay estado de login en memoria.
- Sin refresh tokens ni lista de revocación en esta etapa.
- Los 401 se registran con Pino para auditoría de intentos fallidos.

**Alternativas consideradas**:
- API key simple: más fácil, pero sin expiración ni trazabilidad de usuario.
- OAuth2/OIDC externo: robusto pero desproporcionado para el prototipo.
- Sesiones con cookies: estado en servidor y peor ajuste a una API REST.

**Limitaciones**:
- La rotación de JWT_SECRET invalida todos los tokens vigentes.
- No hay revocación selectiva de tokens antes de su expiración.
- El rol viene en el JWT; cambios de rol no se reflejan hasta renovar sesión.

**Impacto sobre el proyecto**:
Supera la limitación de AS-280 publicar endpoints de escritura; OpenAPI se actualizó
con bearerAuth y security en las operaciones protegidas, y ADR-003/004 extienden las
decisiones de despliegue. Se mantuvo retrocompatibilidad en las lecturas GET.
