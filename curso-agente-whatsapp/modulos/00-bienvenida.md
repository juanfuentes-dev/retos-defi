# Módulo 00 · Bienvenida y conceptos (nivel 0 → 10)

Antes de tocar nada, vamos a entender las palabras que vas a escuchar todo el curso. Sin esto, todo lo demás parece magia.

## 1. ¿Qué es una IA como ChatGPT o Claude?

Es un programa que leyó muchísimo texto y aprendió a **continuar conversaciones**. Le das un mensaje y te devuelve una respuesta. A ese programa se le llama **modelo de lenguaje** (en inglés *LLM*).

## 2. ¿Qué es un "token" y por qué cuesta dinero?

Las IAs no leen letras, leen pedacitos de palabras llamados **tokens**. Más o menos:

> 1 token ≈ ¾ de palabra. Una respuesta de WhatsApp típica ≈ 50–150 tokens.

Cuando usas la IA de una empresa (OpenAI, Anthropic, Google) **a través de su API**, te cobran por cada token que entra y sale. Un bot que contesta cientos de mensajes al día, todos los días, termina sumando una factura mensual.

## 3. ¿Qué es un "modelo local" y por qué es gratis?

Algunas empresas regalan sus modelos para que los descargues: **Qwen** (de Alibaba), **Llama** (de Meta), **Gemma** (de Google), **Mistral**, **DeepSeek**... Se descargan una vez (2 a 5 GB) y corren **en tu computadora**.

- ✅ No pagas por token: puedes mandar un millón de mensajes.
- ✅ Los mensajes de tus clientes no salen de tu PC hacia ninguna empresa de IA.
- ⚠️ "Gratis" no significa "sin costo": gasta luz y necesita una PC decente encendida.
- ⚠️ Son **menos inteligentes** que los modelos grandes de pago. Para contestar preguntas de un negocio (precios, horarios, inscripciones) son suficientes, **si les das buena información**. Para razonamientos complicados, no tanto.

Para correr esos modelos usaremos **Ollama**, un programa gratuito que los descarga y los ejecuta con un solo comando.

## 4. ¿Qué es un bot de WhatsApp?

Un programa que **se conecta a tu WhatsApp** como si fuera WhatsApp Web (el del QR en la computadora), lee los mensajes que llegan y contesta solo. Usaremos una librería llamada **whatsapp-web.js**.

> ⚠️ Esta forma de conectarse **no es oficial**. WhatsApp puede bloquear números que mandan spam o se portan como robots. En el módulo 10 vemos cómo reducir ese riesgo y cuál es la alternativa oficial para clientes grandes.

## 5. ¿Qué es MCP? (el nombre del curso original)

**MCP = Model Context Protocol**. Es un "enchufe universal" para que una IA pueda usar herramientas.

Piensa en el cargador USB-C: cualquier teléfono se conecta a cualquier cargador. Con MCP, cualquier app de IA compatible (Claude Desktop, LM Studio, Cursor...) se conecta a cualquier "herramienta" que hable MCP. Nosotros vamos a crear una herramienta MCP que diga: *"puedo enviar WhatsApp, programar mensajes y manejar plantillas"*. Así podrás decirle a una IA: *"prográmale a Juan un recordatorio todos los lunes a las 7"* y ella lo hará.

## 6. Otras palabras que verás

| Palabra | Qué significa en este curso |
|---|---|
| **Terminal** | Ventana negra donde escribes comandos (en Windows: "PowerShell" o "Símbolo del sistema") |
| **Node.js** | El programa que hace funcionar nuestro bot (está escrito en JavaScript) |
| **npm** | Viene con Node.js; descarga las piezas (librerías) que usa el bot |
| **Carpeta del proyecto** | `curso-agente-whatsapp/proyecto`, donde vive el bot |
| **`.env`** | Archivo con tu configuración (tu número, el modelo, claves) |
| **Prompt** | Las instrucciones que le das a la IA ("eres Sofi, vendes cursos de...") |
| **API** | Una "ventanilla" para que dos programas se hablen entre sí |
| **Cron** | Forma de decirle a la computadora "haz esto a tal hora" |

## 🎯 Reto del módulo

Escribe en un papel, con tus palabras:
1. ¿Por qué un modelo local no cobra tokens?
2. ¿Qué cosa NO es gratis aunque uses un modelo local?
3. ¿Para qué sirve MCP?

Si puedes contestar las 3, pasa al [Módulo 01 →](01-preparar-computadora.md)
