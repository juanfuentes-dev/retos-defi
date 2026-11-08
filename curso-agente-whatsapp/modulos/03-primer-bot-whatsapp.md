# Módulo 03 · Tu primer bot de WhatsApp (nivel 35 → 45)

Hoy conectamos WhatsApp con un bot "loro" que repite lo que le escriben. Sin IA todavía: primero aprendemos a conectarnos.

## 1. ¿Cómo se conecta?

Igual que WhatsApp Web: el bot abre un Chrome invisible, te muestra un **código QR** y tú lo escaneas desde el teléfono. Desde ese momento tu PC queda como un "dispositivo vinculado".

> 📵 **Usa un número de pruebas.** Consigue un chip barato o usa WhatsApp Business con otro número. Así, si algo sale mal mientras aprendes, tu número personal no corre riesgo.

## 2. Enciende el bot loro

```bash
npm run eco
```

Espera unos segundos y aparecerá un QR hecho de cuadritos en la terminal.

En el teléfono: **WhatsApp → ⋮ (o Configuración) → Dispositivos vinculados → Vincular un dispositivo** → apunta la cámara al QR.

Cuando diga `✅ Conectado`, pídele a alguien (o escríbete desde otro teléfono) **"hola"**. El bot responderá: `🦜 Dijiste: hola`.

Detenlo con `Ctrl + C`.

## 3. Entiende el código (son 20 líneas)

Abre `ejemplos/03-bot-eco.js`:

```js
client.on('qr', (qr) => qrcode.generate(qr, { small: true }));   // cuando hay QR, dibújalo
client.on('ready', () => console.log('✅ Conectado'));            // cuando conecta, avísame
client.on('message', async (msg) => {                              // cuando llega un mensaje...
  if (msg.from.endsWith('@g.us')) return;                          // ...si es de un grupo, ignóralo
  await msg.reply(`🦜 Dijiste: ${msg.body}`);                      // ...si no, contesta
});
```

La idea clave: **"cuando pase X, haz Y"**. Eso se llama un *evento*. Todo el bot está hecho de eventos así.

## 4. La carpeta `.sesion`

Después de escanear, aparece una carpeta `.sesion`. Guarda el "permiso" de tu WhatsApp para no escanear el QR cada vez.

- 🔒 **Es como la llave de tu WhatsApp. No la compartas ni la subas a internet** (ya está en `.gitignore` para que Git no la suba).
- Si quieres desconectar el bot: bórrala, o en el teléfono ve a *Dispositivos vinculados* y cierra esa sesión.

## 🎯 Reto del módulo

Cambia el texto del loro en `ejemplos/03-bot-eco.js` para que, si alguien escribe `precio`, conteste `Nuestros precios empiezan en $20`, y si no, siga repitiendo. Pista:

```js
if (msg.body.toLowerCase().includes('precio')) {
  return msg.reply('Nuestros precios empiezan en $20');
}
```

Acabas de crear una **respuesta rápida**. El bot final las tiene en `data/respuestas.json`. → [Módulo 04](04-agente-con-ia.md)
