# Módulo 01 · Prepara tu computadora (nivel 10 → 20)

## 1. Revisa tu computadora

- **Windows**: Inicio → Configuración → Sistema → Información → mira "RAM instalada".
- **Mac**:  → Acerca de esta Mac → "Memoria".

| RAM | Qué puedes usar |
|---|---|
| 8 GB | Modelos pequeños (3B). Funciona, responde en 5–15 segundos |
| 16 GB | Modelos medianos (7B–8B). Respuestas más inteligentes |
| 32 GB o tarjeta gráfica NVIDIA | Modelos grandes y rápidos |

Las Mac con chip M1/M2/M3/M4 van muy bien con IA local.

## 2. Abre la terminal

- **Windows**: tecla Windows → escribe `PowerShell` → Enter.
- **Mac**: Cmd + Espacio → escribe `Terminal` → Enter.

Tres comandos que vas a usar siempre:

| Comando | Qué hace |
|---|---|
| `cd nombre` | Entrar a una carpeta (`cd ..` para salir) |
| `dir` (Windows) / `ls` (Mac) | Ver qué hay en la carpeta |
| `Ctrl + C` | Detener el programa que está corriendo |

## 3. Instala Node.js

1. Ve a **https://nodejs.org** y descarga la versión que dice **LTS**.
2. Instálalo con "Siguiente, Siguiente, Finalizar".
3. **Cierra y abre de nuevo la terminal** y escribe:

```bash
node --version
```

Debe salir algo como `v22.x.x` o mayor (mínimo v20.6). Si sale "no se reconoce el comando", reinicia la computadora.

## 4. Instala un editor de texto: VS Code

Descárgalo de **https://code.visualstudio.com**. Con él vas a abrir y editar los archivos del proyecto (es como Word, pero para código). Bonus: trae una terminal adentro (menú *Terminal → Nueva terminal*).

## 5. Descarga el proyecto

**Opción fácil (sin Git):** en GitHub, entra al repositorio, botón verde **Code → Download ZIP**. Descomprímelo en `Documentos`.

**Opción con Git:** instala Git de https://git-scm.com y luego:

```bash
cd Documents
git clone https://github.com/juanfuentes-dev/retos-defi.git
```

## 6. Instala las piezas del bot

Entra a la carpeta del proyecto y deja que npm descargue todo (tarda unos minutos la primera vez, porque baja un navegador Chrome interno que usa WhatsApp Web):

```bash
cd Documents/retos-defi/curso-agente-whatsapp/proyecto
npm install
```

Al final debe decir algo como `added 279 packages`. Las advertencias amarillas (`warn`) son normales.

## 7. Crea tu archivo de configuración

```bash
# Windows
copy .env.ejemplo .env
# Mac / Linux
cp .env.ejemplo .env
```

Abre la carpeta `proyecto` en VS Code (*Archivo → Abrir carpeta*), abre `.env` y cambia **por ahora solo** esta línea con tu número (código de país + número, sin `+` ni espacios):

```
ADMIN_NUMERO=50370000000
```

## 8. Prueba que todo quedó bien

```bash
npm test
```

Debes ver `# pass 7` y `# fail 0`. Esto prueba la lógica del bot (horarios, plantillas, comandos) sin necesitar WhatsApp ni IA.

## 🎯 Reto del módulo

Toma captura de `node --version` y de `npm test` con `pass 7`. Ya tienes el taller listo. → [Módulo 02](02-ia-local-ollama.md)
