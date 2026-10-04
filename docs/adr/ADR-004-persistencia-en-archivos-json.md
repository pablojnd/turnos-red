# ADR-004: Persistencia en archivos JSON

**Título**: Persistencia actual en archivos JSON y riesgos de concurrencia

**Fecha**: 3 de octubre de 2026

**Estado**: Aceptado

**Contexto**:
TurnosRed carga turnos, médicos y usuarios desde archivos JSON al arrancar y mantiene
el estado en memoria durante la ejecución. Aun así, el usuario registro de
autenticación persiste en data/usuarios.json y el resto de las entidades quedaría
dependiendo de escrituras completas para conservar cambios.

**Decisión**:
Aceptar la persistencia en JSON solo para la fase actual del prototipo, documentando
explícitamente sus riesgos y programando la migración a una base de datos
relacional o NoSQL en la siguiente etapa.

**Consecuencias**:
- Puede haber pérdida de datos si el proceso cae durante una escritura.
- No hay control de concurrencia: escrituras simultáneas pueden pisarse.
- No hay transacciones ni relaciones referenciales entre entidades.
- La lectura inicial es simple y suficiente para el volumen del prototipo.

**Alternativas consideradas**:
- SQLite: local, simple y sin servidor; primera opción sugerida para migrar.
- PostgreSQL/MySQL: robustas, con relaciones y concurrencia real.
- MongoDB: alternativa NoSQL si el esquema siguiera variando.

**Limitaciones**:
- Hoy no existe un endpoint de escritura sobre turnos/medicos que persista a archivo,
  así que el archivo solo refleja el estado inicial.
- Los datos en memoria se pierden al reiniciar.

**Impacto sobre el proyecto**:
Define el riesgo conocido para la auditoría previa al lanzamiento: antes de exponer
la API a tráfico real debe migrarse la persistencia a una base de datos, objetivo
que queda documentado para la fase siguiente.
