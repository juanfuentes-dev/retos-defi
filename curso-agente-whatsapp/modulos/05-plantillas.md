# Módulo 05 · Plantillas (nivel 60 → 68)

Una plantilla es un mensaje con huecos. Lo escribes una vez y lo usas mil veces.

```
Hola {{nombre}}, te recordamos tu cita el {{dia_cita}} a las {{hora_cita}} 📅
```

Al enviarlo, `{{nombre}}` se cambia por "Ana", etc.

## 1. Variables automáticas

Estas se llenan solas, sin que hagas nada:

| Variable | Ejemplo |
|---|---|
| `{{fecha}}` | 24/12/2026 |
| `{{hora}}` | 08:00 |
| `{{dia}}` | jueves |
| `{{saludo}}` | Buenos días / Buenas tardes / Buenas noches (según la hora) |

## 2. Crea plantillas desde tu WhatsApp

Con el bot encendido, abre el chat **"Mensaje a ti mismo"** (busca tu propio nombre en WhatsApp) y escribe:

```
!plantilla bienvenida | {{saludo}} {{nombre}} 👋 Gracias por escribirnos.
```

Respuesta: `✅ Plantilla bienvenida guardada.`

Otros comandos:

```
!plantillas                 → lista todas
!verplantilla bienvenida    → la muestra con una vista previa
!borrarplantilla bienvenida → la borra
```

## 3. ¿Dónde se guardan?

En `data/plantillas.json`. También puedes editarlas ahí directamente con VS Code (cuidado con las comillas y comas). El proyecto ya trae 4 de ejemplo: `bienvenida`, `recordatorio_cita`, `buenos_dias`, `promo_semana`.

## 4. Ideas de plantillas que venden

| Negocio | Plantilla |
|---|---|
| Clínica / barbería | Recordatorio de cita 24 h antes |
| Academia | "Mañana empieza tu curso de {{curso}}, trae {{material}}" |
| Tienda | Promo de la semana, llegada de producto nuevo |
| Cobranza | "{{nombre}}, tu cuota de {{monto}} vence el {{vence}}" |
| Iglesia / colegio | Avisos de actividades, versículo o frase del día |

## 🎯 Reto del módulo

Crea 3 plantillas para el negocio del módulo 4, cada una con al menos una variable propia y una automática. Revísalas con `!verplantilla`. → [Módulo 06](06-mensajes-programados.md)
