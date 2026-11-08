# 🥷 Curso: Tu Agente de WhatsApp con IA Local — de 0 a Ninja

Vas a construir, **en tu propia computadora**, un asistente que:

- 💬 **Contesta WhatsApp solo**, con inteligencia artificial que corre en tu PC (Qwen, Llama, Gemma...). **No pagas tokens** a OpenAI ni a nadie.
- ⚡ Responde al instante preguntas frecuentes (horario, dirección...) sin siquiera usar la IA.
- 📝 Usa **plantillas** con huecos como `{{nombre}}` o `{{fecha}}`.
- ⏰ **Programa mensajes**: todos los días a las 8:00, de lunes a viernes, solo los sábados, una sola vez el 24 de diciembre...
- 🙋 Se calla solo cuando **tú** contestas a mano a un cliente.
- 📱 Se controla **desde tu propio WhatsApp** con comandos como `!programar`.
- 🧩 Trae un **servidor MCP**, para que otra IA (LM Studio, Claude Desktop, Cursor) pueda manejar tu WhatsApp hablándole en español.

No necesitas saber programar. Cada módulo explica qué es cada cosa, qué escribir y qué debes ver en pantalla.

> El código completo y probado está en [`proyecto/`](proyecto/). En los módulos lo vas a ir encendiendo pieza por pieza.

---

## 🗺️ La ruta (de 0 a 100)

| Nivel | Módulo | Lo que logras | Tiempo |
|---|---|---|---|
| 0 → 10 | [00 · Bienvenida y conceptos](modulos/00-bienvenida.md) | Entiendes qué es IA, token, modelo local, bot y MCP | 20 min |
| 10 → 20 | [01 · Prepara tu computadora](modulos/01-preparar-computadora.md) | Node.js, editor y el proyecto instalados | 40 min |
| 20 → 35 | [02 · IA gratis en tu PC con Ollama](modulos/02-ia-local-ollama.md) | Qwen respondiendo en tu computadora | 40 min |
| 35 → 45 | [03 · Tu primer bot de WhatsApp](modulos/03-primer-bot-whatsapp.md) | Un bot "loro" conectado a tu WhatsApp | 30 min |
| 45 → 60 | [04 · El agente con IA](modulos/04-agente-con-ia.md) | El bot contesta como vendedor de tu negocio | 1 h |
| 60 → 68 | [05 · Plantillas](modulos/05-plantillas.md) | Mensajes reutilizables con variables | 30 min |
| 68 → 78 | [06 · Mensajes programados](modulos/06-mensajes-programados.md) | Envíos automáticos por día y hora | 45 min |
| 78 → 85 | [07 · Panel por comandos y API](modulos/07-comandos-y-api.md) | Controlas todo desde el celular | 30 min |
| 85 → 92 | [08 · MCP: dale manos a la IA](modulos/08-mcp.md) | Otra IA usa tu WhatsApp como herramienta | 45 min |
| 92 → 96 | [09 · Encendido 24/7](modulos/09-encendido-24-7.md) | El bot vive solo y se reinicia si falla | 30 min |
| 96 → 100 | [10 · Convierte esto en negocio](modulos/10-negocio.md) | Qué vender, cuánto cobrar y riesgos | 1 h |
| 🆘 | [11 · Problemas comunes](modulos/11-problemas-comunes.md) | Soluciones a los errores típicos | — |

**Total: unas 7 horas** repartidas como quieras. Haz un módulo por día y en dos semanas tienes un producto.

## ✅ Lo que necesitas

- Una computadora con **8 GB de RAM o más** (Windows 10/11, Mac o Linux). Con 16 GB va mucho mejor.
- Internet (solo para descargar cosas y para que WhatsApp funcione).
- Un celular con WhatsApp. **Recomendado:** un chip/número aparte para pruebas (ver módulo 10, sección riesgos).

## 🧠 Cómo funciona por dentro (vista rápida)

```
 Cliente escribe ──▶ WhatsApp ──▶ Tu PC (bot en Node.js)
                                     │
                    ¿Es un comando tuyo (!algo)?  ──sí──▶ ejecuta (programar, plantillas...)
                                     │no
                    ¿Respuesta rápida (horario...)? ─sí──▶ contesta al instante (0 IA)
                                     │no
                    IA local (Ollama + Qwen) ──▶ responde con la info de tu negocio
                                     │
 Programador (reloj) ── a la hora indicada ──▶ envía plantillas/mensajes
 Servidor MCP ── deja que otra IA use todo lo anterior como herramientas
```
