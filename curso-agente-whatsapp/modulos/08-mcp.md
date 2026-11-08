# Módulo 08 · MCP: dale manos a la IA (nivel 85 → 92)

Hasta ahora **tú** das las órdenes con comandos. Con MCP, se las das a una IA en lenguaje normal:

> "Prográmale a Ana (50370003333) un recordatorio de su cita para mañana a las 9 con la plantilla de citas, su cita es a las 10"

…y la IA decide sola qué herramienta usar y con qué datos.

## 1. Repaso: ¿qué es MCP?

Un **estándar** para conectar IAs con herramientas. Tiene dos lados:

- **Servidor MCP**: ofrece herramientas. → El nuestro: `src/mcp-servidor.js`.
- **Cliente MCP**: una app de IA que las usa. → LM Studio, Claude Desktop, Cursor, VS Code...

Nuestro servidor ofrece 6 herramientas:

| Herramienta | Qué hace |
|---|---|
| `enviar_whatsapp` | Envía un mensaje ya |
| `programar_mensaje` | Programa (con texto o plantilla) |
| `listar_programados` | Lista programados |
| `cancelar_programado` | Cancela uno |
| `listar_plantillas` | Lista plantillas |
| `guardar_plantilla` | Crea o cambia una plantilla |

Por dentro, cada herramienta llama a la API local del módulo 7. **Por eso el bot (`npm start`) debe estar corriendo.**

## 2. Opción 100 % local y gratis: LM Studio

1. Instala **LM Studio** (https://lmstudio.ai).
2. Descarga un modelo que sepa usar herramientas: **Qwen 2.5 7B Instruct** o **Qwen3 8B** (los de 3B se confunden más).
3. En LM Studio, pestaña **Program → Install → Edit mcp.json**, y pega esto (cambia la ruta y la clave):

```json
{
  "mcpServers": {
    "whatsapp-local": {
      "command": "node",
      "args": ["C:/Users/TU_USUARIO/Documents/retos-defi/curso-agente-whatsapp/proyecto/src/mcp-servidor.js"],
      "env": { "API_PUERTO": "3001", "API_TOKEN": "cambia-esta-clave" }
    }
  }
}
```

En Mac la ruta es como `/Users/TU_USUARIO/Documents/retos-defi/...`. Usa `/` en vez de `\` también en Windows.

4. Abre un chat nuevo en LM Studio, activa la herramienta `whatsapp-local` y escribe:
   > "¿Qué plantillas tengo?"
   > "Programa la plantilla buenos_dias para 50370001111 de lunes a viernes a las 7"

LM Studio te pedirá permiso antes de usar cada herramienta. Acepta y mira el resultado en tu WhatsApp.

## 3. Opción con Claude Desktop (más inteligente, usa tu plan de Claude)

Claude Desktop también es cliente MCP. *Configuración → Desarrollador → Editar configuración* y pega el mismo bloque `mcpServers` en `claude_desktop_config.json`. Reinicia Claude Desktop.

> 💡 Nota sobre "no gastar tokens": aquí **las respuestas a tus clientes siguen saliendo de la IA local** (Ollama). Claude solo se usa cuando **tú** le pides algo de administración, que son pocos mensajes. Es una buena mezcla: lo masivo, gratis; lo difícil, con una IA potente.

## 4. Mira el código del servidor

Abre `src/mcp-servidor.js`. Cada herramienta tiene 3 partes:

```js
servidor.registerTool('enviar_whatsapp', {
  description: 'Envía un mensaje de WhatsApp...',        // 1. Qué hace (la IA lee esto para decidir)
  inputSchema: { numero: z.string(), texto: z.string() } // 2. Qué datos necesita
}, comoTexto(({ numero, texto }) =>                       // 3. Qué hace de verdad
  api('POST', '/enviar', { numero, texto })));
```

La **descripción** es clave: es lo único que la IA sabe de la herramienta. Escríbela clara y con ejemplos.

## 🎯 Reto del módulo

Agrega una herramienta `estado_bot` que llame a `GET /estado`. Pista: copia `listar_plantillas` y cambia nombre, descripción y ruta. Pruébala preguntándole a LM Studio "¿el bot está activo?". → [Módulo 09](09-encendido-24-7.md)
