# Módulo 02 · IA gratis en tu PC con Ollama (nivel 20 → 35)

## 1. Instala Ollama

1. Ve a **https://ollama.com** → **Download** → elige tu sistema.
2. Instálalo. En Windows y Mac queda corriendo en segundo plano (icono de llama 🦙 junto al reloj).
3. Abre una terminal nueva y comprueba:

```bash
ollama --version
```

## 2. Descarga tu primer modelo: Qwen

```bash
ollama pull qwen2.5:3b
```

Pesa unos 2 GB. Espera a que llegue a 100 %.

### ¿Qué modelo elijo?

| Tu PC | Modelo recomendado | Comando |
|---|---|---|
| 8 GB RAM | Qwen 2.5 3B (rápido, buen español) | `ollama pull qwen2.5:3b` |
| 8 GB RAM | Llama 3.2 3B o Gemma 3 4B (alternativas) | `ollama pull llama3.2:3b` / `ollama pull gemma3:4b` |
| 16 GB RAM | Qwen 2.5 7B (más listo) | `ollama pull qwen2.5:7b` |
| 16 GB RAM | Qwen 3 8B (piensa antes de responder) | `ollama pull qwen3:8b` |

> El número con "B" son los *miles de millones de parámetros*: más grande = más inteligente pero más lento y pesado. Puedes ver todos en https://ollama.com/search.

## 3. Platica con la IA en la terminal

```bash
ollama run qwen2.5:3b
```

Escríbele: `Hola, explícame qué es un token en una oración`. Para salir escribe `/bye`.

🎉 Eso que acaba de responder **salió de tu computadora**. Desconecta el internet y vuelve a probar: sigue funcionando.

## 4. Cómo la usa nuestro bot (la API de Ollama)

Ollama abre una "ventanilla" en tu PC en `http://127.0.0.1:11434`. Nuestro bot le manda la conversación y recibe la respuesta. Puedes probarlo tú mismo:

```bash
curl http://127.0.0.1:11434/api/chat -d "{\"model\":\"qwen2.5:3b\",\"stream\":false,\"messages\":[{\"role\":\"user\",\"content\":\"Hola\"}]}"
```

Esto es exactamente lo que hace `src/ia.js`. Ábrelo en VS Code y busca la línea con `fetch(`: ahí está.

## 5. Prueba la IA con la información del negocio

Revisa que en `.env` estén:

```
IA_TIPO=ollama
IA_URL=http://127.0.0.1:11434
MODELO=qwen2.5:3b
```

Y corre:

```bash
npm run probar-ia
```

El bot le pregunta *"¿Cuánto cuesta el curso de Excel y cuándo es?"* y la IA debe responder **$25, 4 sábados de 8 a 11**. ¿Cómo lo sabe? Porque lee el archivo `conocimiento/negocio.md`. En el módulo 4 lo cambias por tu negocio.

Fíjate en el tiempo que tardó. Menos de 15 segundos está bien para WhatsApp.

## 6. Otras IAs locales (alternativas a Ollama)

Nuestro bot también funciona con cualquier programa que imite la API de OpenAI:

- **LM Studio** (https://lmstudio.ai): tiene ventanas y botones, ideal si no te gusta la terminal. Descarga un modelo, ve a la pestaña *Developer* → *Start Server*. Luego en `.env`:
  ```
  IA_TIPO=openai
  IA_URL=http://127.0.0.1:1234
  MODELO=qwen2.5-7b-instruct     # el nombre exacto que muestra LM Studio
  ```
- **Jan**, **llama.cpp**, **GPT4All**: igual, con `IA_TIPO=openai` y su dirección.

## 🎯 Reto del módulo

1. Descarga **dos** modelos distintos (por ejemplo `qwen2.5:3b` y `gemma3:4b`).
2. Corre `npm run probar-ia` con cada uno (cambiando `MODELO` en `.env`).
3. Anota cuál respondió mejor y cuál más rápido. Ese es tu modelo.

→ [Módulo 03](03-primer-bot-whatsapp.md)
