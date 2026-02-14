import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3333';

interface ItemServico { descricao: string; valor: number; }
interface FuncionarioEquipe { id: number; nome: string; valorDiaria: number; }
interface OrcamentoRef {
  id: number;
  nomeCliente: string | { nome?: string };
  diasPrevistos: number;
  equipe: FuncionarioEquipe[];
  itens: ItemServico[];
  margemdeLucro: number;
}
interface Obra {
  orcamento: OrcamentoRef;
  dataInicio: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA';
  cliente: { nome?: string } | string;
}

function getNome(v: string | { nome?: string } | undefined): string {
  if (!v) return '—';
  if (typeof v === 'string') return v;
  return v.nome ?? '—';
}

function calcularTotal(orc: OrcamentoRef): number {
  const totalDiarias  = (orc.equipe ?? []).reduce((a, f) => a + (f.valorDiaria ?? 0), 0);
  const custoMao      = totalDiarias * (orc.diasPrevistos ?? 0);
  const margem        = orc.margemdeLucro ?? 0.3;
  const valorMinimo   = margem < 1 ? custoMao / (1 - margem) : custoMao;
  const totalServicos = (orc.itens ?? []).reduce((a, i) => a + (i.valor ?? 0), 0);
  return valorMinimo + totalServicos;
}

const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
const fmtData = (d: string) => new Date(d).toLocaleDateString('pt-BR');

interface Props {
  orcamentoInicial?: { id: number } | null;
  onOrcamentoConsumido?: () => void;
}

export default function Obras({ orcamentoInicial, onOrcamentoConsumido }: Props) {
  const [obras, setObras]         = useState<Obra[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState('');
  const [form, setForm]           = useState({ idOrcamento: '', dataInicio: '' });

  // ── fetch ─────────────────────────────────────────────────────
  const fetchObras = async () => {
    try {
      const r = await fetch(`${API_URL}/obras`);
      setObras(await r.json());
    } catch { setErro('Erro ao carregar obras.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchObras(); }, []);

  // Abre modal pré-preenchido se vier de "Criar Obra" na tela de orçamentos
  useEffect(() => {
    if (orcamentoInicial) {
      setForm(f => ({ ...f, idOrcamento: String(orcamentoInicial.id) }));
      setErro('');
      setShowModal(true);
    }
  }, [orcamentoInicial]);

  // ── criar ─────────────────────────────────────────────────────
  const handleCriar = async () => {
    if (!form.idOrcamento || !form.dataInicio) { setErro('Preencha todos os campos.'); return; }
    setSalvando(true); setErro('');
    try {
      const r = await fetch(`${API_URL}/obras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idOrcamento: Number(form.idOrcamento), dataInicio: form.dataInicio }),
      });
      const data = await r.json();
      if (!r.ok) { setErro(data.error ?? 'Erro ao criar obra.'); return; }
      await fetchObras();
      setShowModal(false);
      setForm({ idOrcamento: '', dataInicio: '' });
      onOrcamentoConsumido?.();
    } catch { setErro('Erro ao criar obra.'); }
    finally  { setSalvando(false); }
  };

  // ── deletar ───────────────────────────────────────────────────
  const handleDeletar = async (idOrcamento: number) => {
    if (!confirm('Remover esta obra?')) return;
    try {
      const r = await fetch(`${API_URL}/obras/${idOrcamento}`, { method: 'DELETE' });
      if (!r.ok) { setErro('Erro ao remover obra. Verifique se o endpoint DELETE /obras/:idOrcamento existe.'); return; }
      setObras(p => p.filter(o => o.orcamento.id !== idOrcamento));
    } catch { setErro('Erro ao remover obra.'); }
  };

  const emAndamento = obras.filter(o => o.status === 'EM_ANDAMENTO').length;
  const totalGeral  = obras.reduce((a, o) => a + calcularTotal(o.orcamento), 0);

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Obras</h1>
          <p style={s.subtitulo}>Acompanhamento Financeiro de Projetos</p>
        </div>
        <button style={s.btnNovo} onClick={() => { setErro(''); setForm({ idOrcamento: '', dataInicio: '' }); setShowModal(true); }}>
          + Registrar Obra
        </button>
      </div>

      <hr style={s.divider} />

      {/* ── Stats ── */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={{ ...s.statLabel, color: '#6c63ff' }}>TOTAL DE OBRAS</p>
          <p style={s.statValor}>{obras.length}</p>
        </div>
        <div style={s.statCard}>
          <p style={{ ...s.statLabel, color: '#d97706' }}>EM ANDAMENTO</p>
          <p style={s.statValor}>{emAndamento}</p>
        </div>
        <div style={{ ...s.statCard, minWidth: '200px' }}>
          <p style={{ ...s.statLabel, color: '#16a34a' }}>VOLUME FINANCEIRO</p>
          <p style={{ ...s.statValor, fontSize: '1.3rem' }}>{fmt(totalGeral)}</p>
        </div>
      </div>

      <hr style={s.divider} />

      {erro && <p style={s.erroGlobal}>{erro}</p>}

      {/* ── Grid de obras ── */}
      {loading ? (
        <p style={s.msg}>Carregando...</p>
      ) : obras.length === 0 ? (
        <div style={s.vazioBox}>
          <p style={s.vazioTitulo}>Nenhuma obra registrada</p>
          <p style={s.vazioSub}>Aprove um orçamento e registre a obra aqui.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {obras.map((obra, idx) => {
            const orc   = obra.orcamento;
            const total = calcularTotal(orc);
            const custoMao = (orc.equipe ?? []).reduce((a, f) => a + (f.valorDiaria ?? 0), 0) * (orc.diasPrevistos ?? 0);
            const totalServicos = (orc.itens ?? []).reduce((a, i) => a + (i.valor ?? 0), 0);
            const emAndamento   = obra.status === 'EM_ANDAMENTO';

            return (
              <div key={idx} style={s.card}>

                {/* Card header */}
                <div style={s.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <p style={s.cardCliente}>{getNome(obra.cliente)}</p>
                    <p style={s.cardSub}>Orçamento #{orc.id} · Iniciada em {fmtData(obra.dataInicio)}</p>
                  </div>
                  <div style={s.cardHeaderRight}>
                    <span style={{ ...s.statusBadge, ...(emAndamento ? s.statusAndamento : s.statusConcluida) }}>
                      {emAndamento ? 'Em Andamento' : 'Concluída'}
                    </span>
                    <button style={s.btnDeletar} onClick={() => handleDeletar(orc.id)} title="Remover obra">
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={s.cardDivider} />

                {/* Financeiro */}
                <div style={s.financeiro}>
                  <div style={s.finRow}>
                    <span style={s.finLabel}>Dias previstos</span>
                    <span style={s.finValor}>{orc.diasPrevistos} dias</span>
                  </div>
                  <div style={s.finRow}>
                    <span style={s.finLabel}>Mão de obra</span>
                    <span style={s.finValor}>{fmt(custoMao)}</span>
                  </div>
                  <div style={s.finRow}>
                    <span style={s.finLabel}>Serviços</span>
                    <span style={s.finValor}>{fmt(totalServicos)}</span>
                  </div>
                  <div style={s.finRow}>
                    <span style={s.finLabel}>Equipe</span>
                    <span style={s.finValor}>{(orc.equipe ?? []).length} funcionário(s)</span>
                  </div>
                </div>

                {/* Total */}
                <div style={s.cardTotal}>
                  <span style={s.cardTotalLabel}>Valor Total</span>
                  <span style={s.cardTotalValor}>{fmt(total)}</span>
                </div>

                {/* Serviços listados */}
                {(orc.itens ?? []).length > 0 && (
                  <div style={s.servicos}>
                    <p style={s.servicosTitulo}>Serviços inclusos</p>
                    {orc.itens.map((item, i) => (
                      <div key={i} style={s.servicoItem}>
                        <span style={s.servicoDesc}>{item.descricao}</span>
                        <span style={s.servicoValor}>{fmt(item.valor)}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitulo}>Registrar Obra</h2>
              <button style={s.btnFechar} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {erro && <p style={s.erroMsg}>{erro}</p>}

            <div style={s.infoBox}>
              Somente orçamentos com status <strong>APROVADO</strong> podem gerar uma obra.
            </div>

            <label style={s.label}>ID do Orçamento *</label>
            <input
              style={s.input}
              type="number"
              placeholder="Ex: 1"
              value={form.idOrcamento}
              onChange={e => setForm({ ...form, idOrcamento: e.target.value })}
            />

            <label style={s.label}>Data de Início *</label>
            <input
              style={s.input}
              type="date"
              value={form.dataInicio}
              onChange={e => setForm({ ...form, dataInicio: e.target.value })}
            />

            <div style={s.modalActions}>
              <button style={s.btnCancelar} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={s.btnSalvar} onClick={handleCriar} disabled={salvando}>
                {salvando ? 'Registrando...' : 'Registrar Obra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: 'linear-gradient(135deg,#f0f2f8 0%,#e8eaf6 100%)', padding: '40px 48px', fontFamily: "'Segoe UI',sans-serif", color: '#1a1a2e' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  titulo:      { fontSize: '2.8rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  subtitulo:   { fontSize: '0.95rem', color: '#6b7280', margin: '4px 0 0' },
  btnNovo:     { backgroundColor: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 22px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,99,255,.35)' },
  divider:     { border: 'none', borderTop: '1px solid #dde1ee', margin: '20px 0' },
  statsRow:    { display: 'flex', gap: '16px', flexWrap: 'wrap' as const, marginBottom: '8px' },
  statCard:    { background: '#fff', borderRadius: '10px', padding: '14px 24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', minWidth: '120px' },
  statLabel:   { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', margin: 0 },
  statValor:   { fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 0', color: '#1a1a2e' },
  erroGlobal:  { background: '#fff0f0', color: '#dc2626', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '12px' },
  msg:         { textAlign: 'center' as const, color: '#9ca3af', marginTop: '40px' },

  vazioBox:    { background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center' as const, border: '1px solid #e5e7eb', marginTop: '8px' },
  vazioTitulo: { fontWeight: 700, color: '#374151', fontSize: '1.1rem', margin: '0 0 8px' },
  vazioSub:    { color: '#9ca3af', margin: 0, fontSize: '0.9rem' },

  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginTop: '8px' },

  card:        { background: '#fff', borderRadius: '16px', padding: '22px 24px', boxShadow: '0 2px 14px rgba(0,0,0,.07)', display: 'flex', flexDirection: 'column' as const, gap: '14px' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  cardCliente: { fontWeight: 800, fontSize: '1.1rem', color: '#1a1a2e', margin: 0 },
  cardSub:     { fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' },
  cardHeaderRight: { display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '6px' },
  statusBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const },
  statusAndamento: { background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a' },
  statusConcluida: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
  btnDeletar:  { background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700 },
  cardDivider: { border: 'none', borderTop: '1px solid #f3f4f6', margin: 0 },

  financeiro:  { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  finRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' },
  finLabel:    { color: '#6b7280' },
  finValor:    { fontWeight: 600, color: '#1a1a2e' },

  cardTotal:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', borderRadius: '10px', padding: '12px 16px', border: '1px solid #c7d2fe' },
  cardTotalLabel: { fontWeight: 700, color: '#4338ca', fontSize: '0.85rem' },
  cardTotalValor: { fontWeight: 800, fontSize: '1.25rem', color: '#4338ca' },

  servicos:    { background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e2e8f0' },
  servicosTitulo: { fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 8px', textTransform: 'uppercase' as const },
  servicoItem: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' },
  servicoDesc: { color: '#374151' },
  servicoValor: { fontWeight: 600, color: '#16a34a' },

  overlay:     { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal:       { background: '#fff', borderRadius: '18px', padding: '32px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' as const, gap: '12px', boxShadow: '0 20px 60px rgba(0,0,0,.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitulo: { fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  btnFechar:   { background: 'none', border: 'none', fontSize: '1rem', color: '#9ca3af', cursor: 'pointer' },
  erroMsg:     { color: '#ef4444', fontSize: '0.85rem', background: '#fff0f0', padding: '8px 12px', borderRadius: '8px', margin: 0 },
  infoBox:     { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#1d4ed8' },
  label:       { fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '-6px' },
  input:       { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.95rem', color: '#1a1a2e', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' },
  btnCancelar:  { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnSalvar:    { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(108,99,255,.3)' },
};
