# Módulo 11 · Problemas comunes 🆘

| Síntoma | Causa probable | Solución |
|---|---|---|
| `node no se reconoce como comando` | Node no instalado o terminal vieja | Instala Node LTS, cierra y abre la terminal, o reinicia la PC |
| `--env-file=.env: not found` | No creaste el `.env` | `copy .env.ejemplo .env` (Windows) / `cp .env.ejemplo .env` |
| `fetch failed` / `ECONNREFUSED 11434` | Ollama no está abierto | Abre Ollama (o `ollama serve` en otra terminal) |
| `La IA respondió con error 404 ... model not found` | El modelo de `.env` no está descargado | `ollama list` para ver los que tienes; `ollama pull qwen2.5:3b` |
| La IA tarda más de 30 s | Modelo muy grande para tu PC | Usa uno más chico (`qwen2.5:3b`), cierra Chrome y otros programas |
| La IA inventa precios | `negocio.md` poco claro | Datos concretos y la regla "si no sabes, deriva a un asesor" |
| El QR no aparece | Primera descarga de Chrome interno incompleta | Borra `node_modules`, corre `npm install` de nuevo |
| El QR aparece cada vez | Se borró `.sesion` o cerraste la sesión en el teléfono | Escanéalo de nuevo; no borres `.sesion` |
| `auth_failure` / se desconecta | WhatsApp cerró la sesión | Borra `.sesion`, `npm start` y escanea otra vez |
| El bot no responde a nadie | Está en `!pausa`, o tú contestaste hace poco ese chat | `!activar`; espera `SILENCIO_MINUTOS` o bájalo en `.env` |
| Los comandos `!` no hacen nada | Los mandas desde un número que no es `ADMIN_NUMERO` | Usa "Mensaje a ti mismo" o corrige `ADMIN_NUMERO` (código de país, sin +) |
| `El número ... no tiene WhatsApp` | Número mal escrito | Código de país + número, sin espacios: `50370001111` |
| Un programado no salió | La PC estaba apagada o dormida | Ver módulo 9 (sin suspensión, PM2) |
| El servidor MCP dice "¿Está corriendo el bot?" | El bot no está encendido o la clave no coincide | `npm start` y que `API_TOKEN` sea igual en `.env` y en `mcp.json` |
| Después de actualizar, WhatsApp no conecta | WhatsApp Web cambió y la librería necesita actualización | `npm install whatsapp-web.js@latest` |

## Ver qué está pasando

Todo lo que hace el bot sale en la terminal (o en `pm2 logs`):

- 💬 mensaje que llegó · 🤖 lo que respondió la IA · 📤 programado enviado · ❌ errores

Copia el error completo y búscalo en Google o pégaselo a una IA: casi siempre alguien ya lo resolvió.
