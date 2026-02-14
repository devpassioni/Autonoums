import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// Lê direto do localStorage — sem dependência circular
interface EmpresaSettings {
  nomeEmpresa: string; telefone: string; email: string;
  endereco: string; logoBase64: string;
  banco: string; agencia: string; conta: string; pix: string;
}
function loadSettings(): EmpresaSettings {
  try {
    const raw = localStorage.getItem('gestaopro_settings');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { nomeEmpresa:'', telefone:'', email:'', endereco:'', logoBase64:'', banco:'', agencia:'', conta:'', pix:'' };
}

interface ItemServico { descricao: string; valor: number; }

interface OrcamentoParaPDF {
  id: number;
  nomeCliente: string | { nome?: string; telefone?: string; endereco?: string };
  diasPrevistos: number;
  status: string;
  itens: ItemServico[];
  equipe: { nome?: string; valorDiaria: number }[];
  margemdeLucro: number;
}

function getNome(v: string | { nome?: string }): string {
  if (typeof v === 'string') return v;
  return v?.nome ?? '—';
}

function getCliente(v: string | { nome?: string; telefone?: string; endereco?: string }) {
  if (typeof v === 'string') return { nome: v, telefone: '', endereco: '' };
  return { nome: v?.nome ?? '—', telefone: v?.telefone ?? '', endereco: v?.endereco ?? '' };
}

function fmt(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

const AZUL    = [30, 41, 59]    as [number, number, number];
const ROXO    = [108, 99, 255]  as [number, number, number];
const CINZA   = [248, 250, 252] as [number, number, number];
const TEXTO   = [71, 85, 105]   as [number, number, number];
const VERDE   = [22, 163, 74]   as [number, number, number];
const AMARELO = [217, 119, 6]   as [number, number, number];
const VERMELHO= [220, 38, 38]   as [number, number, number];

export function gerarPdfOrcamento(orc: OrcamentoParaPDF): void {
  const doc     = new jsPDF();
  const W       = doc.internal.pageSize.getWidth();
  const H       = doc.internal.pageSize.getHeight();
  const cfg: EmpresaSettings = loadSettings();
  const cliente = getCliente(orc.nomeCliente);
  let y = 0;

  // ── Cabeçalho empresa ─────────────────────────────────────────
  doc.setFillColor(...AZUL);
  doc.rect(0, 0, W, 44, 'F');

  let logoFim = 14;
  if (cfg.logoBase64) {
    try {
      // Detecta o tipo real pelo prefixo do data URL
      let imgType = 'PNG';
      if (cfg.logoBase64.startsWith('data:image/jpeg') || cfg.logoBase64.startsWith('data:image/jpg')) {
        imgType = 'JPEG';
      } else if (cfg.logoBase64.startsWith('data:image/webp')) {
        imgType = 'WEBP';
      } else if (cfg.logoBase64.startsWith('data:image/gif')) {
        imgType = 'GIF';
      }
      doc.addImage(cfg.logoBase64, imgType, 14, 8, 28, 28);
      logoFim = 46;
    } catch (e) {
      console.warn('[PDF] Erro ao carregar logo:', e);
    }
  }

  const empresaNome = cfg.nomeEmpresa || 'Minha Empresa';
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(empresaNome, cfg.logoBase64 ? 48 : 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 195, 220);
  const linhasEmpresa = [cfg.telefone, cfg.email, cfg.endereco].filter(Boolean).join('   ·   ');
  if (linhasEmpresa) doc.text(linhasEmpresa, cfg.logoBase64 ? 48 : 14, 26);

  // Número do orçamento (direita)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('ORÇAMENTO', W - 14, 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 195, 220);
  doc.text(`Nº ${orc.id}  ·  ${new Date().toLocaleDateString('pt-BR')}`, W - 14, 27, { align: 'right' });

  y = 54;

  // ── Dados do Cliente ─────────────────────────────────────────
  doc.setFillColor(...CINZA);
  doc.roundedRect(14, y, W - 28, 36, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...TEXTO);
  doc.text('DADOS DO CLIENTE', 20, y + 8);
  doc.setDrawColor(210, 218, 235);
  doc.line(20, y + 11, W - 20, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(cliente.nome, 20, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXTO);
  const infosCliente: string[] = [];
  if (cliente.telefone) infosCliente.push(`Tel: ${cliente.telefone}`);
  if (cliente.endereco) infosCliente.push(`Endereço: ${cliente.endereco}`);
  infosCliente.push(`Dias previstos: ${orc.diasPrevistos} dias`);
  doc.text(infosCliente.join('   ·   '), 20, y + 29);

  // Status badge
  const corStatus = orc.status === 'APROVADO' ? VERDE : orc.status === 'CANCELADO' ? VERMELHO : AMARELO;
  doc.setFillColor(...corStatus);
  doc.roundedRect(W - 52, y + 13, 38, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(orc.status, W - 33, y + 20, { align: 'center' });

  y += 46;

  // ── Serviços ──────────────────────────────────────────────────
  const totalServicos = (orc.itens ?? []).reduce((a, i) => a + i.valor, 0);

  if ((orc.itens ?? []).length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...TEXTO);
    doc.text('SERVIÇOS INCLUSOS', 20, y + 5);
    y += 9;

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [['Descrição', 'Valor']],
      body: (orc.itens ?? []).map(item => [item.descricao, fmt(item.valor)]),
      styles:      { fontSize: 10, cellPadding: 5, textColor: [30, 41, 59] },
      headStyles:  { fillColor: ROXO, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles:{ 0: { cellWidth: 'auto' }, 1: { halign: 'right', cellWidth: 40 } },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      tableLineColor: [220, 224, 240],
      tableLineWidth: 0.1,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Resumo Financeiro ─────────────────────────────────────────
  const totalDiarias = (orc.equipe ?? []).reduce((a, f) => a + (f.valorDiaria ?? 0), 0);
  const custoMao     = totalDiarias * (orc.diasPrevistos ?? 0);
  const margem       = orc.margemdeLucro ?? 0.3;
  const valorMinimo  = margem < 1 ? custoMao / (1 - margem) : custoMao;
  const valorTotal   = valorMinimo + totalServicos;
  const adiantamento = valorTotal * 0.3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...TEXTO);
  doc.text('RESUMO FINANCEIRO', 20, y + 5);
  y += 9;

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [['Descrição', 'Valor']],
    body: [
      ['Mão de obra (equipe × dias previstos)', fmt(custoMao)],
      ...(totalServicos > 0 ? [['Serviços adicionais', fmt(totalServicos)]] : []),
    ],
    styles:      { fontSize: 10, cellPadding: 5, textColor: [30, 41, 59] },
    headStyles:  { fillColor: ROXO, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles:{ 0: { cellWidth: 'auto' }, 1: { halign: 'right', cellWidth: 40 } },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    tableLineColor: [220, 224, 240],
    tableLineWidth: 0.1,
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // ── Total ─────────────────────────────────────────────────────
  doc.setFillColor(235, 238, 255);
  doc.roundedRect(14, y, W - 28, 16, 3, 3, 'F');
  doc.setDrawColor(...ROXO);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, W - 28, 16, 3, 3, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...ROXO);
  doc.text('VALOR TOTAL DO ORÇAMENTO:', 20, y + 10.5);
  doc.text(fmt(valorTotal), W - 18, y + 10.5, { align: 'right' });
  y += 22;

  // ── Adiantamento ─────────────────────────────────────────────
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, y, W - 28, 14, 3, 3, 'F');
  doc.setDrawColor(...AMARELO);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, y, W - 28, 14, 3, 3, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...AMARELO);
  doc.text('Adiantamento necessário para início (30%):', 20, y + 9);
  doc.text(fmt(adiantamento), W - 18, y + 9, { align: 'right' });
  y += 22;

  // ── Dados Bancários & Disclaimer ─────────────────────────────
  const banco    = cfg.banco    || 'Banco do Brasil';
  const agencia  = cfg.agencia  || '1234-5';
  const conta    = cfg.conta    || '12345-6';
  const pix      = cfg.pix      || 'contato@empresa.com';

  doc.setFillColor(...CINZA);
  doc.roundedRect(14, y, W - 28, 44, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...TEXTO);
  doc.text('DADOS PARA PAGAMENTO', 20, y + 8);
  doc.line(20, y + 11, W - 20, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`${banco}  ·  Agência: ${agencia}  ·  Conta: ${conta}`, 20, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.text(`PIX: ${pix}`, 20, y + 27);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...TEXTO);
  const aviso = `É necessário o pagamento de 30% do valor total (${fmt(adiantamento)}) como adiantamento para início dos serviços.`;
  doc.text(aviso, 20, y + 37, { maxWidth: W - 40 });

  // ── Rodapé ────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 190, 210);
  doc.text('Documento gerado automaticamente · Valores sujeitos a alteração conforme negociação', W / 2, H - 10, { align: 'center' });

  doc.save(`orcamento-${orc.id}-${cliente.nome.replace(/\s+/g, '_')}.pdf`);
}