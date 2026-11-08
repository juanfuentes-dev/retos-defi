# Módulo 10 · Convierte esto en negocio (nivel 96 → 100)

Ya tienes un producto. Ahora, cómo venderlo **sin meter en problemas a tus clientes ni a ti**.

## 1. ¿Qué vendes exactamente?

No vendas "un bot". Vende **resultados**:

- "Tu negocio contesta WhatsApp en segundos, también a las 11 de la noche."
- "Tus clientes reciben recordatorio de cita y faltan menos."
- "Tu promo llega cada lunes a tus clientes sin que tú hagas nada."

### Clientes ideales para empezar

Negocios pequeños que reciben **muchas preguntas repetidas** por WhatsApp: academias y colegios, clínicas y dentistas, barberías y salones, ferreterías, restaurantes con pedidos, tiendas en Instagram, iglesias, agencias de viajes.

## 2. Paquetes (ejemplo de precios para empezar)

Los precios dependen de tu país y tu experiencia; estos son un punto de partida razonable para Centroamérica:

| Paquete | Incluye | Instalación | Mensual |
|---|---|---|---|
| **Básico** | Respuestas rápidas + IA con info del negocio, en la PC del cliente | $100–150 | $20–30 |
| **Pro** | Básico + plantillas + mensajes programados + 1 ajuste al mes | $200–300 | $40–60 |
| **Llave en mano** | Pro + mini PC incluida y configurada | $350–550 (incluye equipo) | $50–80 |

La **mensualidad** cubre: revisar que funcione, actualizar precios/promos en `negocio.md`, reconectar si se cae la sesión y mejorar respuestas. Ese ingreso recurrente es el verdadero negocio.

### Tus costos

- Tu tiempo de instalación (2–4 h al inicio, con práctica menos).
- Mini PC si la vendes incluida.
- Luz de la PC del cliente: una mini PC encendida 24/7 consume poco (aprox. 10–25 W).
- **Cero en tokens de IA**, que es tu ventaja frente a competidores que usan ChatGPT y cobran más caro por eso.

## 3. Proceso de instalación con un cliente (checklist)

1. **Entrevista (30 min):** productos, precios, horarios, preguntas que más le hacen, qué NO debe decir el bot.
2. Escribe su `conocimiento/negocio.md` y `data/respuestas.json`.
3. Crea sus plantillas (bienvenida, recordatorio, promo).
4. Instala Node, Ollama y el proyecto en su PC/mini PC (módulos 1, 2 y 9).
5. Escanea el QR con **el WhatsApp del negocio**.
6. **Prueba con 10 preguntas reales** frente al cliente.
7. Enséñale `!pausa`, `!activar` y que si él contesta a mano, el bot se calla.
8. Deja por escrito qué hace y qué no hace el bot (ver riesgos).

## 4. ⚠️ Riesgos que DEBES conocer (y explicar al cliente)

### Bloqueo del número
Este proyecto usa **whatsapp-web.js**, que se conecta como WhatsApp Web **sin permiso oficial de Meta**. Va contra los términos de servicio de WhatsApp. En la práctica, muchos lo usan para **responder** mensajes sin problemas, pero WhatsApp **puede bloquear** el número, sobre todo si:

- envía mensajes masivos a gente que no lo tiene agendado o no lo pidió,
- es un número recién creado que de pronto manda cientos de mensajes,
- muchos destinatarios lo reportan como spam.

**Cómo reducir el riesgo:** responder es más seguro que enviar; programados solo a clientes que aceptaron; pocos envíos al día en números nuevos; pausas entre mensajes (el bot ya las hace); nunca listas compradas.

### La alternativa oficial: WhatsApp Business Platform (Cloud API)
Para clientes más grandes o que no pueden arriesgar su número, lo correcto es la **API oficial de Meta**: no hay riesgo de bloqueo por usar un bot, pero requiere verificar la empresa, y Meta **cobra por los mensajes de plantilla** que el negocio inicia (marketing, recordatorios). Responder a clientes que escribieron primero, dentro de 24 horas, tiene costo bajo o nulo según las reglas vigentes de Meta (revísalas en su página de precios, cambian seguido).

La buena noticia: **la IA local sigue sirviendo igual**. Solo cambias la pieza de conexión (`src/index.js`) y sigues sin pagar tokens de IA. Ese es un buen "siguiente nivel" para ti cuando ya tengas clientes.

### Privacidad
Los mensajes de los clientes de tu cliente son datos personales. Ventaja de la IA local: **no se envían a ninguna empresa de IA**. Aun así: no copies conversaciones a tu PC, protege la `.sesion` y revisa la ley de protección de datos de tu país.

### Calidad de la IA
Un modelo de 3B–8B **se puede equivocar**. Por eso: información concreta en `negocio.md`, la regla de "si no sabes, deriva a un asesor", y que el dueño revise chats la primera semana. Nunca lo uses para dar diagnósticos médicos, asesoría legal o confirmar pagos.

## 5. Cómo conseguir tu primer cliente

1. **Úsalo en algo tuyo primero** (o de tu colegio, iglesia o un familiar). Un caso real vale más que cualquier anuncio.
2. Graba un video corto de 30 segundos: alguien escribe al bot y responde al instante.
3. Ofrécelo gratis 2 semanas a 3 negocios conocidos a cambio de un testimonio.
4. Con 3 testimonios, empieza a cobrar.

## 🏁 Examen final: ¿eres ninja?

Eres ninja si puedes, **sin mirar el curso**:

- [ ] Instalar todo en una computadora nueva
- [ ] Elegir el modelo según la RAM y explicar por qué no gasta tokens
- [ ] Escribir el `negocio.md` de un negocio en 20 minutos
- [ ] Crear plantillas y programar un mensaje diario y uno de una sola vez
- [ ] Conectar el servidor MCP a LM Studio o Claude Desktop
- [ ] Dejar el bot 24/7 con PM2
- [ ] Explicarle a un cliente el riesgo de bloqueo y la alternativa oficial

🥷 **Felicidades. Llegaste a 100.**
