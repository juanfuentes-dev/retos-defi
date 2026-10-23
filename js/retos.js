(function (raiz) {
  // Para agregar un reto: copia un bloque, cambia el id (único) y ajusta los campos.
  // tipo 'opcion': respuesta = índice de la opción correcta (empieza en 0).
  // tipo 'calculo': respuesta = número exacto; tolerancia = diferencia aceptada.
  const RETOS = [
    {
      id: 'blockchain-1',
      tema: 'Blockchain',
      titulo: 'Cadena de bloques',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Qué hace que una blockchain sea difícil de alterar?',
      opciones: [
        'Cada bloque guarda el hash del bloque anterior',
        'Todos los datos están cifrados en un solo servidor',
        'Solo el banco central puede escribir bloques',
        'Los bloques se borran cada 24 horas',
      ],
      respuesta: 0,
      explicacion:
        'Cada bloque contiene el hash del anterior. Si alguien modifica un bloque, su hash cambia y rompe el enlace con todos los siguientes.',
    },
    {
      id: 'blockchain-2',
      tema: 'Blockchain',
      titulo: 'Nodos de la red',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: 'En una red descentralizada, ¿qué es un nodo?',
      opciones: [
        'Una copia del registro que valida las transacciones',
        'Un tipo especial de token',
        'Un contrato firmado con un banco',
        'Una wallet que no puede recibir fondos',
      ],
      respuesta: 0,
      explicacion:
        'Cada nodo mantiene una copia de la blockchain y verifica las transacciones. Por eso no depende de una sola autoridad central.',
    },
    {
      id: 'bitcoin-1',
      tema: 'Bitcoin',
      titulo: 'Suministro de Bitcoin',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Cuál es el suministro máximo de Bitcoin?',
      opciones: ['21 millones', '100 millones', 'Es ilimitado', '1.000 millones'],
      respuesta: 0,
      explicacion:
        'El protocolo de Bitcoin fija un máximo de 21 millones de monedas, lo que lo hace escaso por diseño.',
    },
    {
      id: 'bitcoin-2',
      tema: 'Bitcoin',
      titulo: 'Minería',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: '¿Qué es la minería en Bitcoin?',
      opciones: [
        'Resolver un problema criptográfico (proof of work) para agregar bloques y recibir una recompensa',
        'Extraer oro de las computadoras',
        'Comprar bitcoins a un banco',
        'Crear tokens dentro de un contrato inteligente',
      ],
      respuesta: 0,
      explicacion:
        'Los mineros compiten para encontrar un hash válido. El ganador agrega el bloque y recibe las monedas nuevas y las comisiones.',
    },
    {
      id: 'contratos-1',
      tema: 'Smart contracts',
      titulo: 'Qué es un smart contract',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Qué es un smart contract?',
      opciones: [
        'Código que se ejecuta solo en la blockchain cuando se cumplen condiciones',
        'Un contrato en PDF guardado en una nube',
        'Una conversación con un abogado',
        'Una wallet protegida con contraseña',
      ],
      respuesta: 0,
      explicacion:
        'Un smart contract es un programa desplegado en la blockchain. Se ejecuta de forma automática cuando se cumplen sus reglas, sin intermediarios.',
    },
    {
      id: 'contratos-2',
      tema: 'Smart contracts',
      titulo: 'Contratos inmutables',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: '¿Por qué un smart contract desplegado es difícil de modificar?',
      opciones: [
        'Su código queda registrado en la blockchain; cambiarlo requiere un nuevo despliegue o patrones de actualización',
        'Porque la ley lo prohíbe',
        'Porque se borra al cerrar el navegador',
        'Porque solo funciona en Windows',
      ],
      respuesta: 0,
      explicacion:
        'Una vez desplegado, el código no se edita como un archivo normal. Por eso se diseñan mecanismos de actualización y auditorías antes de publicar.',
    },
    {
      id: 'tokens-1',
      tema: 'Tokens',
      titulo: 'Moneda nativa vs. token',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Qué diferencia hay entre una moneda nativa (como BTC) y un token?',
      opciones: [
        'Un token se crea sobre una blockchain que ya existe; la moneda nativa es de la propia red',
        'Son exactamente lo mismo',
        'El token siempre vale más',
        'El token no necesita ninguna blockchain',
      ],
      respuesta: 0,
      explicacion:
        'BTC es la moneda nativa de Bitcoin. Un token (por ejemplo, de Ethereum) es un activo creado mediante un smart contract sobre otra red.',
    },
    {
      id: 'tokens-2',
      tema: 'Tokens',
      titulo: 'Estándar ERC-20',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: '¿Qué es un token ERC-20?',
      opciones: [
        'Un estándar de tokens fungibles en Ethereum: cada unidad es igual a las demás',
        'Un tipo de NFT con arte único',
        'Una wallet de hardware',
        'Una red de pagos bancarios',
      ],
      respuesta: 0,
      explicacion:
        'ERC-20 define funciones comunes (saldo, transferencia, aprobación). Como las unidades son intercambiables, sirve para monedas, puntos o acciones tokenizadas.',
    },
    {
      id: 'wallets-1',
      tema: 'Wallets',
      titulo: 'Qué guarda una wallet',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Qué guarda realmente una wallet cripto?',
      opciones: [
        'Las monedas, que viven dentro de la wallet',
        'Las claves privadas que permiten firmar transacciones',
        'Un archivo con tus fotos',
        'Un préstamo bancario',
      ],
      respuesta: 1,
      explicacion:
        'Las monedas están registradas en la blockchain. La wallet guarda las claves privadas que demuestran que tienes derecho a moverlas.',
    },
    {
      id: 'wallets-2',
      tema: 'Wallets',
      titulo: 'Frase semilla',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: 'Una frase semilla (seed phrase) de 12 palabras sirve para...',
      opciones: [
        'Recuperar la wallet y sus claves; quien la tenga puede controlar los fondos',
        'Iniciar sesión en tu banco',
        'Pagar las comisiones de la red',
        'Verificar tu edad',
      ],
      respuesta: 0,
      explicacion:
        'Quien conoce la frase semilla controla los fondos. Nunca debe compartirse ni guardarse en línea.',
    },
    {
      id: 'defi-1',
      tema: 'DeFi',
      titulo: 'Qué es DeFi',
      dificultad: 1,
      tipo: 'opcion',
      pregunta: '¿Qué significa DeFi?',
      opciones: [
        'Finanzas descentralizadas: servicios financieros sin intermediarios tradicionales',
        'Un banco digital estatal',
        'Un fondo de inversión tradicional',
        'Una app bancaria con sucursales físicas',
      ],
      respuesta: 0,
      explicacion:
        'DeFi ofrece préstamos, intercambios e inversiones mediante smart contracts, sin que una institución central los controle.',
    },
    {
      id: 'defi-2',
      tema: 'DeFi',
      titulo: 'Pools de liquidez',
      dificultad: 2,
      tipo: 'opcion',
      pregunta: '¿Qué es un pool de liquidez en un exchange descentralizado (DEX)?',
      opciones: [
        'Un fondo de tokens aportado por usuarios que permite intercambiar sin libro de órdenes',
        'Una piscina pública de agua',
        'Un préstamo sin garantía de un banco',
        'Un token que paga intereses sin ningún riesgo',
      ],
      respuesta: 0,
      explicacion:
        'Los usuarios depositan pares de tokens en un contrato y el precio se calcula con una fórmula. Quienes aportan reciben una parte de las comisiones.',
    },
    {
      id: 'defi-3',
      tema: 'DeFi',
      titulo: 'Riesgo del proveedor de liquidez',
      dificultad: 3,
      tipo: 'opcion',
      pregunta: '¿Cuál es el principal riesgo de un proveedor de liquidez?',
      opciones: [
        'La pérdida impermanente: los precios de los tokens del pool cambian entre sí',
        'Que el banco congele la cuenta',
        'Pagar impuestos sobre el saldo',
        'Que la red Bitcoin se detenga',
      ],
      respuesta: 0,
      explicacion:
        'Si el precio de un token se aleja del otro, el pool rebalancea automáticamente y el valor retirado puede ser menor que si solo hubieras mantenido los tokens.',
    },
    {
      id: 'prestamos-1',
      tema: 'Préstamos DeFi',
      titulo: 'Sobrecolateralización',
      dificultad: 2,
      tipo: 'opcion',
      pregunta:
        'En un préstamo DeFi sobrecolateralizado, ¿por qué el prestatario deposita más valor del que pide?',
      opciones: [
        'Para proteger al prestamista si la garantía pierde valor',
        'Porque los intereses se pagan por adelantado',
        'Porque la ley lo exige',
        'Para recibir tokens de gobernanza gratis',
      ],
      respuesta: 0,
      explicacion:
        'Como no hay un banco que evalúe al cliente, el exceso de garantía cubre al prestamista ante caídas de precio.',
    },
    {
      id: 'prestamos-2',
      tema: 'Préstamos DeFi',
      titulo: 'Precio de liquidación',
      dificultad: 3,
      tipo: 'calculo',
      pregunta:
        'Depositas 1 ETH como garantía cuando vale 2.000 $. Pides prestados 1.000 $ con un colateral mínimo de 150%. ¿A qué precio de ETH (en $) empezaría la liquidación?',
      respuesta: 1500,
      tolerancia: 1,
      explicacion:
        'La garantía vale 1 × P. La liquidación ocurre cuando 1 × P / 1.000 < 1,5, es decir, cuando P < 1.500 $.',
    },
    {
      id: 'prestamos-3',
      tema: 'Préstamos DeFi',
      titulo: 'Garantía mínima',
      dificultad: 3,
      tipo: 'calculo',
      pregunta:
        'Tienes una deuda de 500 USDC y el protocolo exige un colateral mínimo de 130%. ¿Cuántos dólares de garantía necesitas depositar como mínimo?',
      respuesta: 650,
      tolerancia: 0,
      explicacion: '500 × 1,30 = 650 $ de garantía mínima.',
    },
  ];

  if (typeof module !== 'undefined') module.exports = RETOS;
  else raiz.RETOS = RETOS;
})(typeof window !== 'undefined' ? window : globalThis);
