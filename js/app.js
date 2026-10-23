(function () {
  const DURACION_AVISO_MS = 4000;
  const RETARDO_LIMPIEZA_URL_MS = 1000;

  let estado = cargarEstado();
  let equipoSeleccionado = estado.equipos[0].id;
  let temaFiltrado = 'Todos';
  let retoActivo = null;
  let resultadoActivo = null;
  let docenteDesbloqueado = false;
  let temporizadorAviso = null;

  // ---------- Utilidades de DOM (usan textContent, nunca innerHTML con datos) ----------

  function crear(etiqueta, propiedades = {}, hijos = []) {
    const nodo = document.createElement(etiqueta);
    Object.entries(propiedades).forEach(([clave, valor]) => {
      if (valor === false || valor === null || valor === undefined) return;
      if (clave === 'texto') nodo.textContent = valor;
      else if (clave === 'clase') nodo.className = valor;
      else if (clave.startsWith('on')) nodo.addEventListener(clave.slice(2), valor);
      else if (valor === true) nodo.setAttribute(clave, '');
      else nodo.setAttribute(clave, String(valor));
    });
    nodo.append(...hijos);
    return nodo;
  }

  function mostrarAviso(texto) {
    const aviso = document.getElementById('aviso');
    aviso.textContent = texto;
    aviso.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
      aviso.hidden = true;
    }, DURACION_AVISO_MS);
  }

  // ---------- Persistencia (localStorage con respaldo en memoria) ----------

  function cargarEstado() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CONFIG.clavePersistencia));
      if (LOGICA.esEstadoValido(guardado)) return guardado;
    } catch (error) {
      console.warn('No se pudo leer el progreso guardado.', error);
    }
    return LOGICA.crearEstado();
  }

  function guardarEstado() {
    try {
      localStorage.setItem(CONFIG.clavePersistencia, JSON.stringify(estado));
    } catch (error) {
      console.warn('No se pudo guardar el progreso.', error);
      mostrarAviso('No se pudo guardar el progreso en este navegador.');
    }
  }

  function aplicar(nuevoEstado) {
    estado = nuevoEstado;
    guardarEstado();
    renderizarTodo();
  }

  // ---------- Navegación ----------

  function cambiarVista(vista) {
    document.querySelectorAll('.navegacion button').forEach((boton) => {
      boton.setAttribute('aria-selected', String(boton.dataset.vista === vista));
    });
    document.querySelectorAll('.vista').forEach((seccion) => {
      seccion.hidden = seccion.id !== `vista-${vista}`;
    });
  }

  // ---------- Tablero ----------

  function tarjetaEquipo(equipo, posicion) {
    const progreso = LOGICA.progresoNivel(equipo.tokens);
    const relleno = crear('div', { clase: 'relleno' });
    relleno.style.width = `${progreso.porcentaje}%`;

    const textoSiguiente = progreso.siguiente
      ? `Siguiente nivel: ${progreso.siguiente.nombre} (${progreso.siguiente.tokensMinimos} tokens)`
      : 'Nivel máximo alcanzado';

    return crear('li', { clase: 'tarjeta-equipo' }, [
      crear('span', { clase: 'posicion', texto: `#${posicion}` }),
      crear('h2', { texto: equipo.nombre }),
      crear('p', { clase: 'nivel', texto: `Nivel ${progreso.nivel.numero}: ${progreso.nivel.nombre}` }),
      crear('p', { clase: 'tokens', texto: `${equipo.tokens} tokens · ${equipo.retosResueltos.length} retos resueltos` }),
      crear('div', { clase: 'barra' }, [relleno]),
      crear('small', { texto: textoSiguiente }),
    ]);
  }

  function renderizarTablero() {
    const ordenados = [...estado.equipos].sort((a, b) => b.tokens - a.tokens || a.id - b.id);
    document.getElementById('ranking').replaceChildren(
      ...ordenados.map((equipo, indice) => tarjetaEquipo(equipo, indice + 1))
    );
  }

  // ---------- Retos ----------

  function renderizarSelectorEquipo() {
    const selector = document.getElementById('selector-equipo');
    selector.replaceChildren(
      ...estado.equipos.map((equipo) => crear('option', { value: equipo.id, texto: equipo.nombre }))
    );
    selector.value = String(equipoSeleccionado);
  }

  function abrirReto(reto) {
    retoActivo = reto;
    resultadoActivo = null;
    renderizarRetos();
    document.getElementById('panel-reto').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cerrarReto() {
    retoActivo = null;
    resultadoActivo = null;
    renderizarRetos();
  }

  function responder(respuesta) {
    const { estado: siguiente, resultado } = LOGICA.responderReto(estado, equipoSeleccionado, retoActivo, respuesta);
    if (!resultado.ok) {
      mostrarAviso(resultado.error);
      return;
    }
    resultadoActivo = resultado;
    aplicar(siguiente);
  }

  function bloquePregunta(reto) {
    const botonCancelar = crear('button', { type: 'button', clase: 'secundario', texto: 'Cancelar', onclick: cerrarReto });

    if (reto.tipo === 'calculo') {
      const campo = crear('input', {
        type: 'text',
        inputmode: 'decimal',
        placeholder: 'Escribe un número',
        'aria-label': 'Tu respuesta numérica',
      });
      const botonResponder = crear('button', {
        type: 'button',
        texto: 'Responder',
        onclick: () => {
          const texto = campo.value.trim();
          if (texto === '') {
            mostrarAviso('Escribe una respuesta antes de enviar.');
            return;
          }
          responder(Number(texto.replace(',', '.')));
        },
      });
      return [crear('div', { clase: 'fila' }, [campo, botonResponder]), botonCancelar];
    }

    const opciones = reto.opciones.map((texto, indice) =>
      crear('button', { type: 'button', clase: 'opcion', texto, onclick: () => responder(indice) })
    );
    return [crear('div', { clase: 'opciones' }, opciones), botonCancelar];
  }

  function bloqueResultado(resultado) {
    const mensajeTokens = resultado.tokensGanados > 0
      ? `Ganan ${resultado.tokensGanados} tokens${resultado.primero ? ' (incluye bono por responder primero)' : ''}.`
      : 'No se ganan tokens en este intento.';

    const elementos = [
      crear('h3', { texto: resultado.correcto ? '¡Correcto!' : 'Incorrecto' }),
      crear('p', { texto: mensajeTokens }),
    ];
    if (resultado.subioNivel) {
      elementos.push(crear('p', {
        clase: 'subida',
        texto: `¡Subieron al nivel ${resultado.nivel.numero}: ${resultado.nivel.nombre}!`,
      }));
    }
    elementos.push(
      crear('p', { clase: 'explicacion', texto: retoActivo.explicacion }),
      crear('button', { type: 'button', texto: 'Cerrar', onclick: cerrarReto })
    );
    return elementos;
  }

  function renderizarPanelReto() {
    const panel = document.getElementById('panel-reto');
    if (!retoActivo) {
      panel.replaceChildren();
      return;
    }

    const cuerpo = resultadoActivo ? bloqueResultado(resultadoActivo) : bloquePregunta(retoActivo);
    panel.replaceChildren(
      crear('article', { clase: 'panel-reto' }, [
        crear('p', { clase: 'tema', texto: retoActivo.tema }),
        crear('h2', { texto: retoActivo.titulo }),
        crear('p', { clase: 'pregunta', texto: retoActivo.pregunta }),
        ...cuerpo,
      ])
    );
  }

  function textoEstadoReto(reto, equipo) {
    const primeroId = estado.primerosRespuestas[reto.id];
    const primero = primeroId ? LOGICA.buscarEquipo(estado, primeroId) : null;
    const base = equipo.retosResueltos.includes(reto.id) ? 'Ya respondido por este equipo' : 'Disponible';
    return primero ? `${base} · Primero: ${primero.nombre}` : base;
  }

  function tarjetaReto(reto, equipo) {
    const respondido = equipo.retosResueltos.includes(reto.id);
    return crear('li', {}, [
      crear('button', {
        type: 'button',
        clase: 'tarjeta-reto',
        disabled: respondido,
        onclick: () => abrirReto(reto),
      }, [
        crear('strong', { texto: reto.titulo }),
        crear('span', {
          texto: `${reto.tema} · ${'★'.repeat(reto.dificultad)} · ${CONFIG.tokensPorDificultad[reto.dificultad]} tokens`,
        }),
        crear('small', { texto: textoEstadoReto(reto, equipo) }),
      ]),
    ]);
  }

  function renderizarListaRetos() {
    const equipo = LOGICA.buscarEquipo(estado, equipoSeleccionado);
    const visibles = RETOS.filter((reto) => temaFiltrado === 'Todos' || reto.tema === temaFiltrado);
    document.getElementById('lista-retos').replaceChildren(
      ...visibles.map((reto) => tarjetaReto(reto, equipo))
    );
  }

  function renderizarRetos() {
    if (!LOGICA.buscarEquipo(estado, equipoSeleccionado)) {
      equipoSeleccionado = estado.equipos[0].id;
    }
    renderizarSelectorEquipo();
    renderizarPanelReto();
    renderizarListaRetos();
  }

  function poblarFiltroTemas() {
    const temas = [...new Set(RETOS.map((reto) => reto.tema))];
    const filtro = document.getElementById('filtro-tema');
    filtro.replaceChildren(
      ...['Todos', ...temas].map((tema) => crear('option', { value: tema, texto: tema }))
    );
  }

  // ---------- Docente ----------

  function formularioPin() {
    const campo = crear('input', {
      type: 'password',
      inputmode: 'numeric',
      autocomplete: 'off',
      placeholder: 'PIN del docente',
      'aria-label': 'PIN del docente',
    });
    return crear('form', {
      clase: 'formulario',
      onsubmit: (evento) => {
        evento.preventDefault();
        if (campo.value === CONFIG.pinDocente) {
          docenteDesbloqueado = true;
          renderizarDocente();
        } else {
          mostrarAviso('PIN incorrecto.');
        }
      },
    }, [campo, crear('button', { type: 'submit', texto: 'Entrar' })]);
  }

  function filaNombreEquipo(equipo) {
    const campo = crear('input', {
      type: 'text',
      maxlength: CONFIG.longitudMaximaNombre,
      value: equipo.nombre,
      'aria-label': `Nombre del equipo ${equipo.id}`,
    });
    const boton = crear('button', {
      type: 'button',
      texto: 'Guardar',
      onclick: () => {
        const resultado = LOGICA.renombrarEquipo(estado, equipo.id, campo.value);
        if (resultado.error) mostrarAviso(resultado.error);
        else aplicar(resultado.estado);
      },
    });
    return crear('div', { clase: 'fila' }, [campo, boton]);
  }

  function seccionEquipos() {
    return crear('section', { clase: 'bloque' }, [
      crear('h2', { texto: 'Equipos' }),
      ...estado.equipos.map(filaNombreEquipo),
    ]);
  }

  function seccionTokens() {
    const selector = crear('select', { 'aria-label': 'Equipo' },
      estado.equipos.map((equipo) => crear('option', { value: equipo.id, texto: equipo.nombre })));
    selector.value = String(equipoSeleccionado);

    const cantidad = crear('input', { type: 'number', step: '1', value: '10', 'aria-label': 'Cantidad de tokens' });
    const motivo = crear('input', {
      type: 'text',
      maxlength: CONFIG.longitudMaximaMotivo,
      placeholder: 'Motivo (ej. participación en clase)',
      'aria-label': 'Motivo',
    });

    const ajustar = (signo) => {
      const resultado = LOGICA.ajustarTokens(estado, Number(selector.value), signo * Number(cantidad.value), motivo.value);
      if (resultado.error) mostrarAviso(resultado.error);
      else aplicar(resultado.estado);
    };

    return crear('section', { clase: 'bloque' }, [
      crear('h2', { texto: 'Dar o quitar tokens' }),
      crear('div', { clase: 'fila' }, [selector, cantidad]),
      crear('div', { clase: 'fila' }, [motivo]),
      crear('div', { clase: 'fila' }, [
        crear('button', { type: 'button', texto: 'Dar tokens', onclick: () => ajustar(1) }),
        crear('button', { type: 'button', clase: 'secundario', texto: 'Quitar tokens', onclick: () => ajustar(-1) }),
      ]),
    ]);
  }

  function exportarRespaldo() {
    const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = crear('a', { href: url, download: 'respaldo-retos-defi.json' });
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), RETARDO_LIMPIEZA_URL_MS);
  }

  function importarRespaldo(archivo) {
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        if (!LOGICA.esEstadoValido(datos)) {
          mostrarAviso('El archivo no es un respaldo válido.');
          return;
        }
        if (confirm('Esto reemplaza el progreso actual. ¿Continuar?')) aplicar(datos);
      } catch (error) {
        console.warn('No se pudo leer el respaldo.', error);
        mostrarAviso('No se pudo leer el archivo.');
      }
    };
    lector.readAsText(archivo);
  }

  function reiniciarJuego() {
    if (!confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) return;
    retoActivo = null;
    resultadoActivo = null;
    equipoSeleccionado = 1;
    aplicar(LOGICA.crearEstado());
  }

  function seccionDatos() {
    const importador = crear('input', {
      type: 'file',
      accept: 'application/json',
      'aria-label': 'Importar respaldo',
      onchange: (evento) => {
        const archivo = evento.target.files[0];
        if (archivo) importarRespaldo(archivo);
      },
    });
    return crear('section', { clase: 'bloque' }, [
      crear('h2', { texto: 'Respaldo y reinicio' }),
      crear('div', { clase: 'fila' }, [
        crear('button', { type: 'button', texto: 'Exportar respaldo', onclick: exportarRespaldo }),
        importador,
      ]),
      crear('button', { type: 'button', clase: 'peligro', texto: 'Reiniciar juego', onclick: reiniciarJuego }),
    ]);
  }

  function renderizarDocente() {
    const contenedor = document.getElementById('contenido-docente');
    if (!docenteDesbloqueado) {
      contenedor.replaceChildren(formularioPin());
      return;
    }
    contenedor.replaceChildren(seccionEquipos(), seccionTokens(), seccionDatos());
  }

  // ---------- Ciclo principal ----------

  function renderizarTodo() {
    renderizarTablero();
    renderizarRetos();
    renderizarDocente();
  }

  function iniciar() {
    document.querySelectorAll('.navegacion button').forEach((boton) => {
      boton.addEventListener('click', () => cambiarVista(boton.dataset.vista));
    });
    document.getElementById('selector-equipo').addEventListener('change', (evento) => {
      equipoSeleccionado = Number(evento.target.value);
      retoActivo = null;
      resultadoActivo = null;
      renderizarRetos();
    });
    document.getElementById('filtro-tema').addEventListener('change', (evento) => {
      temaFiltrado = evento.target.value;
      renderizarListaRetos();
    });
    poblarFiltroTemas();
    renderizarTodo();
  }

  iniciar();
})();
