# Módulo 06 · Mensajes programados (nivel 68 → 78)

Que el bot envíe mensajes **solo**, a la hora que digas.

## 1. La fórmula

```
!programar NÚMEROS | CUÁNDO | QUÉ
```

- **NÚMEROS**: uno o varios separados por coma, con código de país: `50370001111, 50370002222`
- **CUÁNDO**: en español (tabla abajo)
- **QUÉ**: un texto, o `plantilla:nombre | variable=valor; otra=valor`

## 2. Cómo escribir el "cuándo"

| Escribes | Significa |
|---|---|
| `diario 08:00` o `todos los dias 8:00` | Todos los días a las 8 am |
| `lunes a viernes 7:30` | Días de semana |
| `fin de semana 9 am` | Sábado y domingo |
| `sabado 10:00` | Todos los sábados |
| `lunes, miercoles y viernes 6 pm` | Solo esos días |
| `2026-12-24 09:00` o `24/12/2026 9:00` | Una sola vez, ese día |
| `en 30 minutos` / `en 2 horas` / `en 1 dia` | Una sola vez, desde ahora |
| `cron 0 */2 * * *` | Avanzado: formato cron (cada 2 horas) |

Puedes usar 24 horas (`18:00`) o am/pm (`6 pm`, `6:30 pm`). Las tildes dan igual.

## 3. Ejemplos reales

**Buenos días diario a tu equipo:**
```
!programar 50370001111, 50370002222 | lunes a viernes 7:00 | plantilla:buenos_dias
```

**Recordatorio de cita una sola vez:**
```
!programar 50370003333 | 2026-12-23 09:00 | plantilla:recordatorio_cita | nombre=Ana; dia_cita=24 de diciembre; hora_cita=10:00 am
```

**Promo todos los lunes:**
```
!programar 50370004444 | lunes 10:00 | plantilla:promo_semana | promo=2x1 en cursos; vence=domingo
```

**Texto directo, en 5 minutos (para probar):**
```
!programar 50370001111 | en 5 minutos | {{saludo}}, esto es una prueba ⏰
```

El bot contesta con un **id** (por ejemplo `a1b2c3`). Guárdalo.

## 4. Ver y cancelar

```
!programados        → lista lo que está activo, con su id
!cancelar a1b2c3    → lo cancela
```

## 5. ¿Cómo funciona por dentro?

- `src/horario.js` traduce tu frase a un **cron** (`30 7 * * 1-5` = minuto 30, hora 7, lunes a viernes).
- `src/programador.js` usa la librería `node-cron` para disparar a esa hora, y revisa cada minuto los de "una sola vez".
- Todo se guarda en `data/programaciones.json`: si apagas la PC, al encender el bot se vuelven a activar. **Pero mientras la PC está apagada, no se envía nada** (ver módulo 9).
- Si envías a varios números, el bot espera de 4 a 10 segundos entre cada uno, para parecer humano.

## ⚠️ Regla de oro: no hagas spam

Programar mensajes a **personas que no te lo pidieron** es la forma más rápida de que WhatsApp bloquee el número. Envía solo a quienes aceptaron recibir tus mensajes, y empieza con pocos (10–20 al día) en un número nuevo.

## 🎯 Reto del módulo

1. Programa un mensaje `en 2 minutos` a tu otro teléfono y míralo llegar.
2. Programa uno repetido con plantilla y variables.
3. Lístalos con `!programados` y cancela uno.

→ [Módulo 07](07-comandos-y-api.md)
