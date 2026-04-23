// lib/pdf-generator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CotizacionData {
  folio: string;
  fecha: Date;
  cliente: {
    nombre: string;
    correo: string;
    telefono: string;
  };
  vehiculo: {
    nombre: string;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
  };
  financiamiento: {
    enganche: number;
    porcentajeEng: string;
    plazoMeses: number;
    tasaAnual: number;
    montoFinanciar: number;
    mensualidad: number;
    totalPagar: number;
    interesesTotal: number;
  };
}

export function generarPDFCotizacion(data: CotizacionData) {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(18, 18, 22);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Logo / nombre
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TUXCAR', 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Concesionaria Multimarca', 15, 26);
  doc.text('Tuxtla Gutiérrez, Chiapas · 961 123 4567', 15, 30);

  // Folio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('COTIZACIÓN', pageWidth - 15, 15, { align: 'right' });
  doc.setFontSize(14);
  doc.text(data.folio, pageWidth - 15, 22, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(data.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
    pageWidth - 15, 28, { align: 'right' });

  // ── DATOS DEL CLIENTE ─────────────────────────────────────────────────────
  let y = 50;
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CLIENTE', 15, y);

  y += 6;
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(data.cliente.nombre, 15, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(data.cliente.correo, 15, y);
  if (data.cliente.telefono) {
    y += 4;
    doc.text(data.cliente.telefono, 15, y);
  }

  // Vigencia al lado derecho
  const vigencia = new Date(data.fecha.getTime() + 14 * 24 * 60 * 60 * 1000);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VIGENCIA', pageWidth - 15, 50, { align: 'right' });

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(vigencia.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
    pageWidth - 15, 56, { align: 'right' });

  // ── VEHÍCULO ──────────────────────────────────────────────────────────────
  y = 80;
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VEHÍCULO', 15, y);

  y += 6;
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(data.vehiculo.nombre, 15, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`${data.vehiculo.marca} · ${data.vehiculo.modelo} · ${data.vehiculo.anio}`, 15, y);

  // Precio
  y += 10;
  doc.setDrawColor(230, 230, 230);
  doc.line(15, y, pageWidth - 15, y);

  y += 8;
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Precio de lista', 15, y);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`$${data.vehiculo.precio.toLocaleString('es-MX')} MXN`, pageWidth - 15, y, { align: 'right' });

  // ── DESGLOSE FINANCIERO ───────────────────────────────────────────────────
  y += 15;
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PLAN DE FINANCIAMIENTO', 15, y);

  y += 8;
  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 90, textColor: [80, 80, 80] },
      1: { halign: 'right', fontStyle: 'bold', textColor: [30, 30, 30] },
    },
    body: [
      ['Enganche', `$${data.financiamiento.enganche.toLocaleString('es-MX')} (${data.financiamiento.porcentajeEng}%)`],
      ['Monto a financiar', `$${data.financiamiento.montoFinanciar.toLocaleString('es-MX')}`],
      ['Plazo', `${data.financiamiento.plazoMeses} meses`],
      ['Tasa anual', `${data.financiamiento.tasaAnual}%`],
      ['Intereses totales', `$${Math.round(data.financiamiento.interesesTotal).toLocaleString('es-MX')}`],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  // ── TOTALES DESTACADOS ────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 249);
  doc.rect(15, y, pageWidth - 30, 28, 'F');

  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('MENSUALIDAD ESTIMADA', 20, y + 8);
  doc.setTextColor(20, 83, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`$${Math.round(data.financiamiento.mensualidad).toLocaleString('es-MX')}`, 20, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`/mes por ${data.financiamiento.plazoMeses} meses`, 20, y + 23);

  // Total a pagar
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('TOTAL A PAGAR', pageWidth - 20, y + 8, { align: 'right' });
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`$${Math.round(data.financiamiento.totalPagar).toLocaleString('es-MX')}`, pageWidth - 20, y + 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('MXN', pageWidth - 20, y + 23, { align: 'right' });

  // ── DISCLAIMER ─────────────────────────────────────────────────────────────
  y += 35;
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const disclaimer = 'Esta cotización es referencial y está sujeta a la aprobación del crédito por parte de la institución financiera. Las tasas y condiciones pueden variar según el perfil crediticio del solicitante. La vigencia de esta cotización es de 14 días naturales a partir de la fecha de emisión.';
  const splitText = doc.splitTextToSize(disclaimer, pageWidth - 30);
  doc.text(splitText, 15, y);

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  doc.setDrawColor(230, 230, 230);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Tuxcar — Plataforma de Venta de Vehículos Multimarcas', 15, pageHeight - 13);
  doc.text('ventas@tuxcar.com', 15, pageHeight - 9);
  doc.text('Página 1 de 1', pageWidth - 15, pageHeight - 13, { align: 'right' });
  doc.text(`Generado el ${data.fecha.toLocaleString('es-MX')}`, pageWidth - 15, pageHeight - 9, { align: 'right' });

  // Descargar
  doc.save(`Cotizacion_${data.folio}_${data.vehiculo.marca}_${data.vehiculo.modelo}.pdf`);
}
