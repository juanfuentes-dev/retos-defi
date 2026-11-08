# Proyecto: agente-whatsapp-local

Código del curso. Instrucciones paso a paso en [`../modulos`](../modulos/00-bienvenida.md).

## Arranque rápido (si ya sabes)

```bash
ollama pull qwen2.5:3b
npm install
cp .env.ejemplo .env      # Windows: copy .env.ejemplo .env  → luego edítalo
npm run probar-ia         # prueba la IA local
npm start                 # escanea el QR
npm test                  # pruebas de la lógica (no necesita WhatsApp)
```

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `src/index.js` | Arranca todo y conecta WhatsApp |
| `src/ia.js` | Habla con Ollama o LM Studio |
| `src/respuestas.js` | Respuestas rápidas sin IA (`data/respuestas.json`) |
| `src/memoria.js` | Memoria corta por chat y "modo humano" |
| `src/plantillas.js` | Plantillas con `{{variables}}` (`data/plantillas.json`) |
| `src/horario.js` | Entiende "lunes a viernes 7:30", "2026-12-24 09:00"... |
| `src/programador.js` | Envía los mensajes programados (`data/programaciones.json`) |
| `src/comandos.js` | Comandos `!programar`, `!plantilla`... |
| `src/api.js` | API local en `127.0.0.1:3001` |
| `src/mcp-servidor.js` | Servidor MCP con 6 herramientas |
| `conocimiento/negocio.md` | **Lo que la IA sabe de tu negocio** (edítalo) |
