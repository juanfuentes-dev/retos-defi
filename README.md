# Retos DeFi

Micro app por equipos para aprender **blockchain, Bitcoin, smart contracts, tokens, wallets y finanzas descentralizadas (DeFi y préstamos DeFi)**.

Seis equipos compiten respondiendo retos. Cada respuesta correcta da tokens, el primer equipo que acierta un reto recibe un bono, y los equipos suben de nivel al alcanzar cierto número de tokens. El docente también puede dar o quitar tokens por participación.

No necesita servidor ni instalación: es una página estática (HTML, CSS y JavaScript).

## Uso en clase

- **Tablero**: ranking de equipos, nivel y progreso. Ideal para proyectar.
- **Retos**: elige el equipo que responde, filtra por tema y abre un reto. Cada equipo solo puede responder cada reto una vez.
- **Docente**: PIN de acceso (por defecto `1234`, ver abajo). Permite renombrar equipos, dar o quitar tokens con motivo, exportar/importar un respaldo y reiniciar el juego.

Reglas por defecto (en `js/config.js`):

| Concepto | Valor |
|---|---|
| Tokens por reto | 10 (dificultad 1), 20 (dificultad 2), 30 (dificultad 3) |
| Bono al primero en acertar | +10 tokens |
| Niveles | Novato (0), Explorador (60), Validador (150), Minero (250), Arquitecto DeFi (400) |

## Importante sobre el progreso

El progreso se guarda en el **navegador** donde se juega (localStorage). Eso significa:

- Si el juego se proyecta desde un solo computador, todos los equipos juegan ahí y el docente controla los tokens desde la pestaña **Docente**.
- Si cada equipo abre el link en su propio dispositivo, cada uno tendrá su propio progreso y **no se compartirá entre equipos**. Para eso haría falta un backend compartido (por ejemplo Firebase o Supabase), que no está incluido.
- Use **Exportar respaldo** periódicamente para no perder el progreso.

El PIN del docente es solo para evitar cambios accidentales de los alumnos. Como todo es del lado del cliente, no es seguridad real.

## Ejecutar en local

Abra `index.html` con doble clic, o sirva la carpeta con cualquier servidor estático.

Pruebas de la lógica del juego (requiere Node.js):

```bash
npm test
```

## Personalizar

- **Retos**: edite `js/retos.js`. Copie un bloque, cambie el `id` (debe ser único) y ajuste `tipo` (`'opcion'` o `'calculo'`), `respuesta`, `explicacion`, etc.
- **Reglas y niveles**: edite `js/config.js`.
- **PIN del docente**: cambie `pinDocente` en `js/config.js`.
- Después de cambiar retos o reglas, ejecute `npm test`.

## Publicar en GitHub Pages

1. Cree un repositorio nuevo en GitHub (por ejemplo `retos-defi`).
2. Desde esta carpeta:

```bash
git init
git add .
git commit -m "feat: juego de retos DeFi por equipos"
git branch -M main
git remote add origin https://github.com/USUARIO/retos-defi.git
git push -u origin main
```

3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. En uno o dos minutos el sitio estará en `https://USUARIO.github.io/retos-defi/`. Comparta ese link con los equipos.

## Estructura

```
index.html        Página principal (tablero, retos, docente)
css/estilos.css   Estilos
js/config.js      Reglas, niveles y PIN
js/retos.js       Banco de retos
js/logica.js      Lógica pura del juego (tokens, niveles, respuestas)
js/app.js         Interfaz y persistencia
tests/            Pruebas de lógica y de los retos
```
