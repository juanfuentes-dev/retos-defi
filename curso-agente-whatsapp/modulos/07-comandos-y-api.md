# Módulo 07 · Panel por comandos y API (nivel 78 → 85)

## 1. Tu "panel de control" es WhatsApp

Tienes dos formas de mandar comandos:

1. **Chat "Mensaje a ti mismo"** en el mismo WhatsApp donde está el bot (lo más cómodo).
2. **Desde otro teléfono**, si ese número está en `ADMIN_NUMERO` del `.env`. A cualquier otra persona que escriba `!algo`, el bot la trata como un cliente normal.

| Comando | Qué hace |
|---|---|
| `!ayuda` | Muestra todos los comandos |
| `!estado` | Si el bot está activo, cuántos programados y plantillas hay |
| `!pausa` / `!activar` | Apaga / prende las respuestas automáticas |
| `!enviar número \| texto` | Envía un mensaje ahora |
| `!plantillas`, `!plantilla`, `!verplantilla`, `!borrarplantilla` | Plantillas (módulo 5) |
| `!programar`, `!programados`, `!cancelar` | Programados (módulo 6) |

Los comandos viven en `src/comandos.js`. ¿Quieres uno nuevo? Copia un `case` y cámbialo. Por ejemplo, un `!precios` que mande tu lista de precios.

## 2. La API local (para cuando quieras un panel web)

Al encender, el bot abre `http://127.0.0.1:3001`. **Solo funciona desde tu propia PC** (127.0.0.1 = "esta computadora") y pide la clave `API_TOKEN` del `.env`.

Pruébala desde otra terminal (cambia `cambia-esta-clave` por tu clave):

```bash
# Ver plantillas
curl -H "Authorization: Bearer cambia-esta-clave" http://127.0.0.1:3001/plantillas

# Ver programados
curl -H "Authorization: Bearer cambia-esta-clave" http://127.0.0.1:3001/programaciones

# Enviar un mensaje
curl -X POST -H "Authorization: Bearer cambia-esta-clave" -H "Content-Type: application/json" ^
  -d "{\"numero\":\"50370001111\",\"texto\":\"Hola desde la API\"}" http://127.0.0.1:3001/enviar
```

(En Mac/Linux cambia el `^` del final de línea por `\`.)

| Ruta | Para qué |
|---|---|
| `GET /estado` | Estado del bot |
| `GET /plantillas` · `POST /plantillas` · `DELETE /plantillas/nombre` | Plantillas |
| `GET /programaciones` · `POST /programaciones` · `DELETE /programaciones/id` | Programados |
| `POST /enviar` | Enviar ahora |

Con esta API, cualquier otro programa puede usar tu bot: un panel web, una hoja de Google, n8n... y en el siguiente módulo, **otra IA a través de MCP**.

## 🎯 Reto del módulo

Crea un comando nuevo `!precios` en `src/comandos.js` que responda la lista de precios de tu negocio. Reinicia y pruébalo. → [Módulo 08](08-mcp.md)
