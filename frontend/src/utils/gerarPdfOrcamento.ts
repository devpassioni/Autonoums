import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ItemServico {
  descricao: string;
  valor: number;
}

interface OrcamentoParaPDF {
  id: number;
  nomeCliente: string | { nome?: string };
  diasPrevistos: number;
  status: string;
  itens: ItemServico[];
  equipe: { nome?: string; valorDiaria: number }[];
  margemdeLucro: number;
}

function getNome(nomeCliente: string | { nome?: string }): string {
  if (typeof nomeCliente === 'string') return nomeCliente;
  if (typeof nomeCliente === 'object' && nomeCliente?.nome) return nomeCliente.nome;
  return '—';
}

function fmt(valor: number): string {
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

export function gerarPdfOrcamento(orc: OrcamentoParaPDF): void {
  const doc = new jsPDF();

  const AZUL_ESCURO  = [30, 41, 59]   as [number, number, number]; // #1e293b
  const AZUL_MEDIO   = [99, 102, 241] as [number, number, number]; // #6366f1
  const CINZA_CLARO  = [248, 250, 252] as [number, number, number];
  const CINZA_TEXTO  = [71, 85, 105]  as [number, number, number];
  const VERDE        = [22, 163, 74]  as [number, number, number];
  const AMARELO      = [217, 119, 6]  as [number, number, number];
  const VERMELHO     = [220, 38, 38]  as [number, number, number];

  const largura = doc.internal.pageSize.getWidth();
  let y = 0;

  // ── Cabeçalho ─────────────────────────────────────────────────
  doc.setFillColor(...AZUL_ESCURO);
  doc.rect(0, 0, largura, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', largura / 2, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 195, 220);
  doc.text(`Nº ${orc.id}  ·  Emitido em ${new Date().toLocaleDateString('pt-BR')}`, largura / 2, 29, { align: 'center' });

  y = 48;

  // ── Dados do Cliente ──────────────────────────────────────────
  doc.setFillColor(...CINZA_CLARO);
  doc.roundedRect(14, y, largura - 28, 34, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...CINZA_TEXTO);
  doc.text('DADOS DO CLIENTE', 20, y + 9);

  doc.setDrawColor(200, 210, 230);
  doc.line(20, y + 12, largura - 20, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 50);
  doc.text(`Cliente: ${getNome(orc.nomeCliente)}`, 20, y + 21);
  doc.text(`Dias previstos: ${orc.diasPrevistos}`, 20, y + 30);

  // Status badge
  const statusCor = orc.status === 'APROVADO' ? VERDE : orc.status === 'CANCELADO' ? VERMELHO : AMARELO;
  doc.setFillColor(...statusCor);
  doc.roundedRect(largura - 52, y + 15, 38, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(orc.status, largura - 33, y + 22, { align: 'center' });

  y += 44;

  // ── Serviços ──────────────────────────────────────────────────
  const totalServicos = orc.itens.reduce((acc, i) => acc + i.valor, 0);

  if (orc.itens.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...CINZA_TEXTO);
    doc.text('SERVIÇOS INCLUSOS', 20, y + 6);
    y += 10;

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [['Descrição', 'Valor']],
      body: orc.itens.map(item => [
        item.descricao,
        fmt(item.valor),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: [30, 41, 59],
      },
      headStyles: {
        fillColor: AZUL_MEDIO,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right', cellWidth: 40 },
      },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      tableLineColor: [220, 224, 240],
      tableLineWidth: 0.1,
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Equipe ────────────────────────────────────────────────────
  const totalDiarias   = orc.equipe.reduce((acc, f) => acc + f.valorDiaria, 0);
  const custoMaoDeObra = totalDiarias * orc.diasPrevistos;
  const margem         = orc.margemdeLucro ?? 0.3;
  const valorMinimo    = custoMaoDeObra / (1 - margem);
  const valorTotal     = valorMinimo + totalServicos;

  // ── Resumo Financeiro ────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...CINZA_TEXTO);
  doc.text('RESUMO FINANCEIRO', 20, y + 6);
  y += 10;

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [['Descrição', 'Valor']],
    body: [
      ['Mão de obra (equipe × dias previstos)', fmt(custoMaoDeObra)],
      ...(totalServicos > 0 ? [['Serviços adicionais', fmt(totalServicos)]] : []),
    ],
    styles: {
      fontSize: 10,
      cellPadding: 5,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: AZUL_MEDIO,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right', cellWidth: 40 },
    },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    tableLineColor: [220, 224, 240],
    tableLineWidth: 0.1,
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // ── Total Final ───────────────────────────────────────────────
  doc.setFillColor(235, 238, 255);
  doc.roundedRect(14, y, largura - 28, 16, 3, 3, 'F');
  doc.setDrawColor(...AZUL_MEDIO);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, largura - 28, 16, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...AZUL_MEDIO);
  doc.text('VALOR TOTAL DO ORÇAMENTO:', 20, y + 10.5);
  doc.text(fmt(valorTotal), largura - 18, y + 10.5, { align: 'right' });

  // ── Rodapé ────────────────────────────────────────────────────
  const altPagina = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 180, 200);
  doc.text(
    'Documento gerado automaticamente · Valores sujeitos a alteração',
    largura / 2,
    altPagina - 10,
    { align: 'center' }
  );

  doc.save(`orcamento-${orc.id}-${getNome(orc.nomeCliente).replace(/\s+/g, '_')}.pdf`);
}
