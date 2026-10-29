// Base de Conocimiento para Bordados Sacuanjoche
// Sistema Inteligente de Recomendación basado en Frames y Reglas

export const knowledgeBase = {
  // Frames para productos
  productFrames: {
    blusa_tradicional: {
      slots: {
        tipo: { value: 'prenda', type: 'categoria' },
        estilo: { value: 'tradicional', type: 'estilo' },
        tecnica: { value: 'bordado_a_mano', type: 'tecnica' },
        materiales: { value: ['hilo_de_algodon', 'hilo_de_seda'], type: 'multivalor' },
        complejidad: { value: 'media-alta', type: 'complejidad' },
        temporada: { value: ['todo_el_año', 'fiestas_tradicionales'], type: 'multivalor' },
        ocasiones: { value: ['fiestas_tradicionales', 'celebraciones', 'uso_diario'], type: 'multivalor' },
        rango_precio: { min: 800, max: 1500, type: 'precio' },
        personalizable: { value: true, type: 'boolean' },
        tiempo_elaboracion: { value: '7-15 días', type: 'texto' }
      }
    },
    accesorios: {
      slots: {
        tipo: { value: 'accesorio', type: 'categoria' },
        estilo: { value: 'artesanal', type: 'estilo' },
        tecnica: { value: 'bordado_detallado', type: 'tecnica' },
        materiales: { value: ['hilo_de_algodon', 'lentejuelas'], type: 'multivalor' },
        complejidad: { value: 'media', type: 'complejidad' },
        temporada: { value: ['todo_el_año'], type: 'multivalor' },
        ocasiones: { value: ['regalo', 'complemento', 'fiesta'], type: 'multivalor' },
        rango_precio: { min: 250, max: 600, type: 'precio' },
        personalizable: { value: true, type: 'boolean' },
        tiempo_elaboracion: { value: '3-7 días', type: 'texto' }
      }
    },
    articulo_decorativo: {
      slots: {
        tipo: { value: 'decorativo', type: 'categoria' },
        estilo: { value: 'floral_tradicional', type: 'estilo' },
        tecnica: { value: 'bordado_punto_cruz', type: 'tecnica' },
        materiales: { value: ['hilo_de_algodon', 'tela_lino'], type: 'multivalor' },
        complejidad: { value: 'alta', type: 'complejidad' },
        temporada: { value: ['todo_el_año'], type: 'multivalor' },
        ocasiones: { value: ['regalo', 'decoracion_hogar', 'coleccion'], type: 'multivalor' },
        rango_precio: { min: 1000, max: 2500, type: 'precio' },
        personalizable: { value: true, type: 'boolean' },
        tiempo_elaboracion: { value: '10-20 días', type: 'texto' }
      }
    }
  },

  // Frames para perfil de cliente
  clientFrames: {
    profile: {
      slots: {
        ocasion: { value: null, type: 'select' },
        estilo_preferido: { value: null, type: 'select' },
        presupuesto_min: { value: 0, type: 'numero' },
        presupuesto_max: { value: 2000, type: 'numero' },
        colores_preferidos: { value: [], type: 'multivalor' },
        genero: { value: null, type: 'select' },
        edad_rango: { value: null, type: 'select' },
        uso: { value: null, type: 'select' }
      }
    }
  },

  // Reglas de inferencia
  reglas: [
    {
      id: 1,
      nombre: 'Fiesta tradicional femenina',
      condicion: {
        ocasion: ['fiestas_tradicionales', 'boda_tradicional'],
        genero: 'femenino'
      },
      accion: {
        recomendar: ['blusa_tradicional'],
        prioridad: 10,
        razon: 'Para fiestas tradicionales femeninas, las blusas bordadas a mano son ideales por su elegancia y autenticidad cultural.'
      }
    },
    {
      id: 2,
      nombre: 'Regalo económico',
      condicion: {
        presupuesto_max: { '<=': 600 },
        ocasion: ['regalo']
      },
      accion: {
        recomendar: ['accesorios'],
        prioridad: 9,
        razon: 'Con ese presupuesto, los accesorios bordados son perfectos para regalo, bonitos y accesibles.'
      }
    },
    {
      id: 3,
      nombre: 'Decoración hogar',
      condicion: {
        uso: ['decoracion', 'hogar'],
        ocasion: ['decoracion_hogar']
      },
      accion: {
        recomendar: ['articulo_decorativo'],
        prioridad: 10,
        razon: 'Los artículos decorativos bordados añaden un toque artesanal único a cualquier espacio del hogar.'
      }
    },
    {
      id: 4,
      nombre: 'Coleccionista',
      condicion: {
        ocasion: ['coleccion'],
        presupuesto_min: { '>=': 1000 }
      },
      accion: {
        recomendar: ['articulo_decorativo', 'blusa_tradicional'],
        prioridad: 8,
        razon: 'Para coleccionistas, recomendamos piezas con mayor complejidad y detalles únicos.'
      }
    },
    {
      id: 5,
      nombre: 'Uso diario o prenda de vestir',
      condicion: {
        uso: ['prenda_vestir'],
        genero: 'femenino'
      },
      accion: {
        recomendar: ['accesorios', 'blusa_tradicional'],
        prioridad: 7,
        razon: 'Para uso diario, recomendamos piezas versátiles y cómodas que se adapten a cualquier ocasión.'
      }
    },
    {
      id: 6,
      nombre: 'Regalo con presupuesto medio',
      condicion: {
        ocasion: ['regalo'],
        presupuesto_max: { '<=': 1000 }
      },
      accion: {
        recomendar: ['accesorios'],
        prioridad: 8,
        razon: 'Los accesorios y piezas bordadas son un regalo artesanal único que se adapta a tu presupuesto.'
      }
    },
    {
      id: 7,
      nombre: 'Ocasión de uso diario',
      condicion: {
        ocasion: ['uso_diario']
      },
      accion: {
        recomendar: ['accesorios', 'blusa_tradicional'],
        prioridad: 6,
        razon: 'Para el día a día conviene una pieza versátil, cómoda y con acabados resistentes.'
      }
    }
  ],

  // Preguntas del asistente
  preguntas: [
    {
      id: 1,
      pregunta: '¿Para qué ocasión necesitas el bordado?',
      tipo: 'select',
      opciones: [
        { value: 'fiestas_tradicionales', label: 'Fiestas tradicionales' },
        { value: 'boda_tradicional', label: 'Boda tradicional' },
        { value: 'regalo', label: 'Regalo' },
        { value: 'decoracion_hogar', label: 'Decoración del hogar' },
        { value: 'coleccion', label: 'Para colección' },
        { value: 'uso_diario', label: 'Uso diario' },
        { value: 'otro', label: 'Otro' }
      ],
      campo: 'ocasion'
    },
    {
      id: 2,
      pregunta: '¿Para quién es el bordado?',
      tipo: 'select',
      opciones: [
        { value: 'femenino', label: 'Mujer/Dama' },
        { value: 'masculino', label: 'Hombre/Caballero' },
        { value: 'unisex', label: 'Unisex' },
        { value: 'infantil', label: 'Niño/a' }
      ],
      campo: 'genero'
    },
    {
      id: 3,
      pregunta: '¿Qué tipo de uso buscas?',
      tipo: 'select',
      opciones: [
        { value: 'prenda_vestir', label: 'Prenda para vestir' },
        { value: 'accesorio', label: 'Accesorio' },
        { value: 'decoracion', label: 'Decoración' },
        { value: 'regalo', label: 'Regalo' }
      ],
      campo: 'uso'
    },
    {
      id: 4,
      pregunta: '¿Cuál es tu rango de presupuesto aproximado (en córdobas)?',
      tipo: 'range',
      campo_min: 'presupuesto_min',
      campo_max: 'presupuesto_max',
      min: 0,
      max: 3000,
      step: 50
    },
    {
      id: 5,
      pregunta: '¿Qué colores prefieres?',
      tipo: 'multiselect',
      opciones: [
        { value: 'rojo', label: 'Rojo' },
        { value: 'azul', label: 'Azul' },
        { value: 'verde', label: 'Verde' },
        { value: 'amarillo', label: 'Amarillo' },
        { value: 'negro', label: 'Negro' },
        { value: 'blanco', label: 'Blanco' },
        { value: 'multicolor', label: 'Multicolor' }
      ],
      campo: 'colores_preferidos'
    }
  ]
};

export default knowledgeBase;
