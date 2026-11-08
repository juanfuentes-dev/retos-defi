# Módulo 09 · Encendido 24/7 (nivel 92 → 96)

Un bot que se apaga cuando cierras la terminal no sirve para un negocio. Vamos a dejarlo vivo solo.

## 1. ¿En qué computadora vive?

| Opción | Pros | Contras |
|---|---|---|
| Tu laptop | Gratis, ya la tienes | Si la cierras o la llevas, el bot muere |
| PC de escritorio vieja (8 GB+) | Barata, siempre en el mismo lugar | Consume más luz |
| **Mini PC** (tipo N100, 16 GB RAM) | Pequeña, gasta poca luz (10–25 W), ideal para clientes | Hay que comprarla (aprox. $150–300) |
| Mac mini M-series | Rapidísima con IA local | Más cara |

Para un negocio, lo profesional es una **mini PC dedicada** solo al bot.

## 2. Que la PC no se duerma

- **Windows**: Configuración → Sistema → Inicio/apagado y suspensión → "Suspender" en **Nunca**.
- **Mac**: Configuración → Batería/Energía → evitar suspensión automática.
- Activa que se encienda sola si se va la luz (opción en el BIOS: *Restore on AC power loss*), si tu PC la tiene.

## 3. PM2: el "guardaespaldas" del bot

PM2 mantiene el bot corriendo y lo reinicia si se cae.

```bash
npm install -g pm2
cd Documents/retos-defi/curso-agente-whatsapp/proyecto
pm2 start src/index.js --name bot-whatsapp --node-args="--env-file=.env"
pm2 save
```

Comandos útiles:

```bash
pm2 status            # ver si está vivo
pm2 logs bot-whatsapp # ver lo que está pasando (Ctrl+C para salir)
pm2 restart bot-whatsapp
pm2 stop bot-whatsapp
```

> La primera vez, corre `npm start` normal para escanear el QR. Después ya puedes usar PM2.

### Que arranque al encender la PC

- **Mac / Linux**: `pm2 startup` y copia-pega el comando que te muestra.
- **Windows**: `npm install -g pm2-windows-startup` y luego `pm2-startup install`.

Ollama ya arranca solo con el sistema en Windows y Mac.

## 4. Respaldos

Copia una vez por semana a una USB o a Google Drive:

- `data/` (plantillas, respuestas, programados)
- `conocimiento/` (lo que sabe la IA)
- `.env` (tu configuración — guárdalo en un lugar privado)

**No** respaldes `.sesion` en la nube: es la llave de tu WhatsApp.

## 5. Revisión diaria (2 minutos)

1. `pm2 status` → ¿dice `online`?
2. Escríbete `!estado`.
3. Lee `pm2 logs` buscando ❌.

## 🎯 Reto del módulo

Deja el bot con PM2, reinicia la computadora y comprueba que vuelve a contestar solo. → [Módulo 10](10-negocio.md)
