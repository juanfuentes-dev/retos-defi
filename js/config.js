(function (raiz) {
  const CONFIG = {
    clavePersistencia: 'retos-defi-progreso-v1',
    pinDocente: '1234',
    equiposIniciales: 6,
    tokensPorDificultad: { 1: 10, 2: 20, 3: 30 },
    bonoPrimeroEnResponder: 10,
    longitudMaximaNombre: 30,
    longitudMaximaMotivo: 80,
    niveles: [
      { numero: 1, nombre: 'Novato', tokensMinimos: 0 },
      { numero: 2, nombre: 'Explorador', tokensMinimos: 60 },
      { numero: 3, nombre: 'Validador', tokensMinimos: 150 },
      { numero: 4, nombre: 'Minero', tokensMinimos: 250 },
      { numero: 5, nombre: 'Arquitecto DeFi', tokensMinimos: 400 },
    ],
  };

  if (typeof module !== 'undefined') module.exports = CONFIG;
  else raiz.CONFIG = CONFIG;
})(typeof window !== 'undefined' ? window : globalThis);
