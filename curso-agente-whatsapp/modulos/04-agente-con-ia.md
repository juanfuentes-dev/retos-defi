# Módulo 04 · El agente con IA (nivel 45 → 60)

Ahora sí: el bot completo, que contesta como si fuera tu vendedor.

## 1. Enciéndelo

Asegúrate de que Ollama esté abierto y corre:

```bash
npm start
```

Escanea el QR (si ya lo hiciste en el módulo 3, entra directo). Debe decir:

```
✅ Bot listo usando el modelo "qwen2.5:3b" (ollama)
🔌 API local en http://127.0.0.1:3001
```

Desde otro teléfono escribe: *"Hola, ¿qué cursos tienen?"*. Verás que aparece "escribiendo..." y luego la respuesta.

## 2. El camino de cada mensaje

```
Llega un mensaje
  ├─ ¿Es de un grupo o un estado? → se ignora
  ├─ ¿Es un comando tuyo (!algo)? → se ejecuta (módulo 7)
  ├─ ¿El bot está en pausa o tú contestaste hace poco ese chat? → silencio
  ├─ ¿Coincide con una respuesta rápida? → contesta al instante (0 IA)
  └─ Si no → la IA local responde usando conocimiento/negocio.md
```

Mira `src/index.js`, evento `client.on('message', ...)`: ese es el orden exacto.

## 3. Enséñale tu negocio (lo más importante del curso)

La IA solo sabe lo que pongas en **`conocimiento/negocio.md`**. Ábrelo y cámbialo por tu negocio real. Estructura que funciona:

```markdown
# Quién eres
Eres "Nombre", asistente de NEGOCIO. Tono: amable, breve.

# Lo que vendemos
- Producto 1: precio, detalles
- Producto 2: precio, detalles

# Cómo comprar / pagar
...

# Datos útiles
Horario, dirección, envíos...

# Lo que NO debes hacer
- No inventes precios
- Si no sabes, di que un asesor responderá
```

Además, `src/ia.js` le agrega reglas fijas: responder corto, en español, no inventar. Reinicia el bot (`Ctrl + C` y `npm start`) cada vez que cambies este archivo.

### 💡 Trucos para que un modelo pequeño responda bien

1. **Datos concretos**, no párrafos largos. "Excel: $25, 4 sábados 8–11 am" es mejor que un texto bonito.
2. **Dile qué hacer cuando no sabe.** Si no, inventa.
3. **Pon ejemplos** de preguntas y respuestas ideales al final del archivo.
4. Archivo corto = respuestas más rápidas. Intenta que quepa en una página.

## 4. Respuestas rápidas: ahorra todavía más

Las preguntas que siempre se repiten no necesitan IA. Edita `data/respuestas.json`:

```json
{
  "palabras": ["horario", "a que hora", "abierto"],
  "respuesta": "🕘 Atendemos de lunes a viernes de 8:00 a 17:00."
}
```

Si el mensaje contiene cualquiera de esas palabras, contesta eso al instante. No importan mayúsculas ni tildes.

## 5. Memoria y "modo humano"

- **Memoria:** el bot recuerda los últimos `MAX_HISTORIAL` mensajes (10 por defecto) de cada chat, así entiende "¿y ese cuánto cuesta?". Se borra al reiniciar.
- **Modo humano:** si **tú** contestas a un cliente desde tu teléfono, el bot se calla en ese chat durante `SILENCIO_MINUTOS` (60 por defecto). Así no se pisan.
- **Pausa total:** escríbete `!pausa` en el chat "Mensaje a ti mismo" y deja de responder a todos. `!activar` para volver.

## 🎯 Reto del módulo

1. Escribe el `negocio.md` de un negocio real (el tuyo o de un conocido).
2. Agrega 3 respuestas rápidas.
3. Pídele a 3 amigos que le escriban al bot haciéndose pasar por clientes. Anota las respuestas malas y corrige `negocio.md`.

Repetir este ciclo es el trabajo real de "entrenar" un bot. → [Módulo 05](05-plantillas.md)
