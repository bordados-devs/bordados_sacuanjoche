import knowledgeBase from '../../utils/knowledge/knowledgeBase';
import { BUSINESS_NAME, WHATSAPP_NUMBER, buildWhatsAppUrl } from '../../config/contact';

const formatMoney = (value) => `C$${(Number(value) || 0).toFixed(2)}`;

const formatValue = (value) => {
  if (value === undefined || value === null || value === '') return 'No especificado';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatList = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 'No especificado';
  return values.map(formatValue).join(', ');
};

const labelForOption = (campo, value) => {
  const question = knowledgeBase.preguntas.find((item) => item.campo === campo);
  const option = question?.opciones?.find((item) => item.value === value);
  return option?.label || formatValue(value);
};

const frameValue = (recommendation, slotName, fallback = 'No especificado') => {
  const slot = recommendation?.frame?.slots?.[slotName];
  if (!slot) return fallback;
  return slot.value ?? fallback;
};

const framePrice = (recommendation) => {
  const range = recommendation?.frame?.slots?.rango_precio;
  if (!range) return 'Por cotizar';
  return `${formatMoney(range.min)} - ${formatMoney(range.max)}`;
};

const toAbsoluteUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  return url;
};

const buildQuoteId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IA-${datePart}-${randomPart}`;
};

/**
 * Construye la información completa de la cotización que se enviará
 * por WhatsApp y que también se dibujará en la imagen resumen.
 */
export const buildQuotation = ({
  userProfile = {},
  recommendations = [],
  selectedRecommendation = null,
  catalogProducts = [],
}) => {
  const quoteRecommendations = selectedRecommendation
    ? [selectedRecommendation]
    : recommendations;

  return {
    id: buildQuoteId(),
    createdAt: new Date(),
    userProfile,
    recommendations: quoteRecommendations,
    catalogProducts,
  };
};

export const buildWhatsAppMessage = (quote) => {
  const { id, createdAt, userProfile, recommendations } = quote;
  const lines = [];

  lines.push('*RECOMENDADO POR IA*');
  lines.push(`*${BUSINESS_NAME}*`);
  lines.push('_Cotización generada por el Recomendador Inteligente_');
  lines.push('');
  lines.push(`*Código de cotización:* ${id}`);
  lines.push(`*Fecha:* ${createdAt.toLocaleString('es-ES')}`);
  lines.push('');
  lines.push('-'.repeat(32));
  lines.push('');
  lines.push('*PERFIL DEL CLIENTE*');
  lines.push(`- Ocasión: ${labelForOption('ocasion', userProfile.ocasion)}`);
  lines.push(`- Para: ${labelForOption('genero', userProfile.genero)}`);
  lines.push(`- Uso: ${labelForOption('uso', userProfile.uso)}`);
  lines.push(
    `- Presupuesto: ${formatMoney(userProfile.presupuesto_min)} - ${formatMoney(
      userProfile.presupuesto_max
    )}`
  );
  lines.push(`- Colores preferidos: ${formatList(userProfile.colores_preferidos)}`);
  lines.push('');

  recommendations.forEach((recommendation, index) => {
    const products = Array.isArray(recommendation.productos) ? recommendation.productos : [];

    lines.push('-'.repeat(32));
    lines.push('');
    lines.push(`*RECOMENDACIÓN ${index + 1}: ${recommendation.tipoLabel}*`);
    lines.push(`- Motivo: ${recommendation.razon}`);
    lines.push(`- Técnica sugerida: ${formatValue(frameValue(recommendation, 'tecnica'))}`);
    lines.push(
      `- Materiales: ${formatList(frameValue(recommendation, 'materiales', []))}`
    );
    lines.push(`- Complejidad: ${formatValue(frameValue(recommendation, 'complejidad'))}`);
    lines.push(
      `- Tiempo de elaboración: ${formatValue(frameValue(recommendation, 'tiempo_elaboracion'))}`
    );
    lines.push(`- Rango de precio: ${framePrice(recommendation)}`);

    if (products.length > 0) {
      lines.push('');
      lines.push('*PRODUCTOS DEL CATÁLOGO RELACIONADOS:*');
      products.forEach((product, productIndex) => {
        lines.push(`*${productIndex + 1}. ${product.title}*`);
        lines.push(`   Precio: ${formatMoney(product.price)}`);
        lines.push(`   Colores: ${formatList(product.colors)}`);
        lines.push(
          `   Disponibilidad: ${
            product.stock > 0 ? `${product.stock} unidad(es) en stock` : 'Agotado / por encargo'
          }`
        );
        const imageUrl = toAbsoluteUrl(product.images?.[0]);
        if (imageUrl) lines.push(`   Imagen: ${imageUrl}`);
        lines.push('');
      });
    } else {
      lines.push('');
      lines.push('*No hay un producto exacto en el catálogo.*');
      lines.push('Se requiere elaboración personalizada según este perfil.');
      lines.push('');
    }
  });

  lines.push('-'.repeat(32));
  lines.push('');
  lines.push('*SOLICITUD:* Quiero una cotización para esta recomendación de IA.');
  lines.push('Adjunto la imagen resumen generada automáticamente.');
  lines.push('');
  lines.push('¡Gracias! Quedo atento(a) a su respuesta.');

  return lines.join('\n');
};

export const openWhatsAppQuotation = (quote) => {
  const url = buildWhatsAppUrl(buildWhatsAppMessage(quote));

  if (typeof window === 'undefined') return url;

  const popup = window.open(url, '_blank');
  if (!popup) {
    window.location.href = url;
  }

  return url;
};

// ---------------------------------------------------------------------------
// Imagen resumen de la cotización (para adjuntarla en WhatsApp)
// ---------------------------------------------------------------------------

const CANVAS_WIDTH = 1080;
const SIDE_PADDING = 64;
const CONTENT_WIDTH = CANVAS_WIDTH - SIDE_PADDING * 2;
const HEADER_HEIGHT = 230;
const FOOTER_HEIGHT = 110;

const wrapText = (context, text, maxWidth) => {
  const paragraphs = String(text).split('\n');
  const lines = [];

  paragraphs.forEach((paragraph) => {
    if (paragraph === '') {
      lines.push('');
      return;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
  });

  return lines;
};

const buildImageBlocks = (quote) => {
  const blocks = [];
  const { id, createdAt, userProfile, recommendations } = quote;

  const addText = (text, options = {}) => {
    blocks.push({
      text,
      font: options.font || '400 26px Arial',
      color: options.color || '#2D2926',
      lineHeight: options.lineHeight || 36,
      marginTop: options.marginTop || 0,
      marginBottom: options.marginBottom || 0,
      align: options.align || 'left',
      maxWidth: options.maxWidth || CONTENT_WIDTH,
    });
  };

  const addDivider = (marginTop = 26, marginBottom = 26) => {
    blocks.push({
      divider: true,
      marginTop,
      marginBottom,
    });
  };

  addText('COTIZACIÓN PERSONALIZADA', {
    font: '700 40px Arial',
    color: '#2D2926',
    lineHeight: 48,
    marginBottom: 8,
  });
  addText('Generada por el Recomendador IA', {
    font: '400 26px Arial',
    color: '#8B5E3C',
    lineHeight: 34,
    marginBottom: 18,
  });
  addText(`Código: ${id}`, {
    font: '600 24px Arial',
    color: '#424242',
    lineHeight: 32,
  });
  addText(`Fecha: ${createdAt.toLocaleString('es-ES')}`, {
    font: '400 24px Arial',
    color: '#424242',
    lineHeight: 32,
    marginBottom: 8,
  });

  addDivider();

  addText('PERFIL DEL CLIENTE', {
    font: '700 28px Arial',
    color: '#8B5E3C',
    lineHeight: 36,
    marginBottom: 10,
  });
  addText(`Ocasión: ${labelForOption('ocasion', userProfile.ocasion)}`, { marginBottom: 4 });
  addText(`Para: ${labelForOption('genero', userProfile.genero)}`, { marginBottom: 4 });
  addText(`Uso: ${labelForOption('uso', userProfile.uso)}`, { marginBottom: 4 });
  addText(
    `Presupuesto: ${formatMoney(userProfile.presupuesto_min)} - ${formatMoney(
      userProfile.presupuesto_max
    )}`,
    { marginBottom: 4 }
  );
  addText(`Colores preferidos: ${formatList(userProfile.colores_preferidos)}`, {
    marginBottom: 4,
  });

  recommendations.forEach((recommendation, index) => {
    addDivider();
    addText(`RECOMENDACIÓN ${index + 1}`, {
      font: '700 28px Arial',
      color: '#8B5E3C',
      lineHeight: 36,
      marginBottom: 6,
    });
    addText(recommendation.tipoLabel, {
      font: '700 30px Arial',
      color: '#2D2926',
      lineHeight: 40,
      marginBottom: 10,
    });
    addText(`Motivo: ${recommendation.razon}`, { marginBottom: 10 });
    addText(`Técnica: ${formatValue(frameValue(recommendation, 'tecnica'))}`, {
      marginBottom: 4,
    });
    addText(`Materiales: ${formatList(frameValue(recommendation, 'materiales', []))}`, {
      marginBottom: 4,
    });
    addText(`Complejidad: ${formatValue(frameValue(recommendation, 'complejidad'))}`, {
      marginBottom: 4,
    });
    addText(
      `Tiempo de elaboración: ${formatValue(frameValue(recommendation, 'tiempo_elaboracion'))}`,
      { marginBottom: 4 }
    );
    addText(`Rango de precio: ${framePrice(recommendation)}`, { marginBottom: 10 });

    const products = Array.isArray(recommendation.productos) ? recommendation.productos : [];

    if (products.length > 0) {
      addText('Productos del catálogo relacionados:', {
        font: '600 26px Arial',
        color: '#2E7D32',
        lineHeight: 34,
        marginBottom: 6,
      });
      products.forEach((product) => {
        addText(
          `• ${product.title} — ${formatMoney(product.price)} | Colores: ${formatList(
            product.colors
          )} | Stock: ${product.stock > 0 ? product.stock : 'por encargo'}`,
          { font: '400 24px Arial', lineHeight: 32, marginBottom: 4 }
        );
      });
    } else {
      addText('No hay un producto exacto en el catálogo. Se elaborará de forma personalizada.', {
        font: '600 24px Arial',
        color: '#B26A00',
        lineHeight: 32,
        marginBottom: 4,
      });
    }
  });

  return blocks;
};

const roundRect = (context, x, y, width, height, radius) => {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
};

export const generateQuotationImage = (quote) =>
  new Promise((resolve, reject) => {
    try {
      const measureCanvas = document.createElement('canvas');
      const measureContext = measureCanvas.getContext('2d');
      const blocks = buildImageBlocks(quote);

      let contentHeight = 0;
      const measuredBlocks = blocks.map((block) => {
        if (block.divider) {
          const height = block.marginTop + block.marginBottom + 2;
          contentHeight += height;
          return { ...block, height };
        }

        measureContext.font = block.font;
        const lines = wrapText(measureContext, block.text, block.maxWidth);
        const height =
          block.marginTop + block.marginBottom + Math.max(lines.length, 1) * block.lineHeight;
        contentHeight += height;
        return { ...block, lines, height };
      });

      const contentTop = HEADER_HEIGHT + 50;
      const canvasHeight = contentTop + contentHeight + FOOTER_HEIGHT + 50;
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = canvasHeight;

      const context = canvas.getContext('2d');
      context.textBaseline = 'top';

      // Fondo crema
      context.fillStyle = '#FFF9E6';
      context.fillRect(0, 0, CANVAS_WIDTH, canvasHeight);

      // Encabezado
      const headerGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
      headerGradient.addColorStop(0, '#8B5E3C');
      headerGradient.addColorStop(1, '#A67C52');
      context.fillStyle = headerGradient;
      context.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);

      context.fillStyle = '#FFFFFF';
      context.font = '700 46px Arial';
      context.fillText(BUSINESS_NAME, SIDE_PADDING, 58);
      context.font = '400 28px Arial';
      context.fillStyle = '#FFF1CC';
      context.fillText('Bordados artesanales hechos con amor', SIDE_PADDING, 120);

      const badgeText = 'RECOMENDADO POR IA';
      context.font = '700 26px Arial';
      const badgeWidth = context.measureText(badgeText).width + 44;
      context.fillStyle = '#FFC107';
      roundRect(context, SIDE_PADDING, 160, badgeWidth, 46, 23);
      context.fill();
      context.fillStyle = '#2D2926';
      context.fillText(badgeText, SIDE_PADDING + 22, 169);

      // Contenido
      let y = contentTop;

      measuredBlocks.forEach((block) => {
        if (block.divider) {
          y += block.marginTop;
          context.strokeStyle = '#E1D2C1';
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(SIDE_PADDING, y);
          context.lineTo(CANVAS_WIDTH - SIDE_PADDING, y);
          context.stroke();
          y += block.marginBottom;
          return;
        }

        y += block.marginTop;
        context.font = block.font;
        context.fillStyle = block.color;
        context.textAlign = block.align === 'center' ? 'center' : 'left';

        const drawX = block.align === 'center' ? CANVAS_WIDTH / 2 : SIDE_PADDING;
        block.lines.forEach((line) => {
          context.fillText(line, drawX, y);
          y += block.lineHeight;
        });

        y += block.marginBottom;
      });

      // Pie de página
      context.fillStyle = '#2D2926';
      context.fillRect(0, canvasHeight - FOOTER_HEIGHT, CANVAS_WIDTH, FOOTER_HEIGHT);
      context.fillStyle = '#FFF9E6';
      context.font = '600 24px Arial';
      context.textAlign = 'center';
      context.fillText(
        `WhatsApp: +${WHATSAPP_NUMBER}  •  ${BUSINESS_NAME}`,
        CANVAS_WIDTH / 2,
        canvasHeight - FOOTER_HEIGHT + 40
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar la imagen de la cotización.'));
          return;
        }

        const fileName = `cotizacion-ia-${quote.id}.png`;
        const file =
          typeof File !== 'undefined'
            ? new File([blob], fileName, { type: 'image/png' })
            : null;

        resolve({ blob, file, fileName });
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });

export const downloadBlob = (blob, fileName) => {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadQuotationImage = async (quote) => {
  const { blob, fileName } = await generateQuotationImage(quote);
  downloadBlob(blob, fileName);
  return fileName;
};

/**
 * En móviles compatibles abre la hoja de compartir con la imagen y el texto.
 * En escritorio (o navegadores sin Web Share) descarga la imagen resumen.
 */
export const shareQuotationImage = async (quote) => {
  const { file, fileName, blob } = await generateQuotationImage(quote);
  const message = buildWhatsAppMessage(quote);

  if (
    file &&
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
      title: 'Cotización Bordados Sacuanjoche',
      text: message,
    });
    return { shared: true, downloaded: false, fileName };
  }

  downloadBlob(blob, fileName);
  return { shared: false, downloaded: true, fileName };
};
