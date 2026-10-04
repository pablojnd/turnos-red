# ADR-003: Uso de Nginx como proxy inverso

**Título**: Adopción de Nginx como proxy inverso frente a la API Node.js

**Fecha**: 3 de octubre de 2026

**Estado**: Aceptado

**Contexto**:
TurnosRed corre sobre Express en el puerto 3000. En un despliegue real hace falta un
punto de entrada único en el puerto 80, que centralice cabeceras, balanceo futuro y
aislamiento del puerto interno de la aplicación.

**Decisión**:
Configurar Nginx como proxy inverso (archivo nginx.conf en la raíz), conservando los
encabezados Host, X-Real-IP y X-Forwarded-For hacia la aplicación en
http://localhost:3000. Puede ejecutarse local o vía contenedor oficial con el
comando docker run.

**Consecuencias**:
- Todo el tráfico externo pasa por una sola puerta, lista para TLS y rate limiting.
- Simplifica el despliegue al exponer un único puerto estándar.
- Añade una capa más entre el cliente y la API; errores 5xx pueden venir de Nginx.
- Los logs de acceso de Nginx se suman a los de Morgan y Pino.

**Alternativas consideradas**:
- Servir directo con Express: menos control y rompe con las prácticas de producción.
- Confiar el balanceo a un PaaS/API gateway: acopla el proyecto a una plataforma.
- Traefik o Caddy: buena alternativa, pero Nginx es el estándar requerido.

**Limitaciones**:
- En este entorno no hay Docker ni Nginx instalados; la validación end-to-end queda
  pendiente de ejecutar en la máquina del servidor.
- La configuración es simple: no incluye TLS ni caché todavía.

**Impacto sobre el proyecto**:
El README incorporó la sección Despliegue y el ADR-004 registra los riesgos
complementarios asociados a la persistencia actual.
