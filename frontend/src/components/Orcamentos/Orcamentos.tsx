import { useEffect, useState } from 'react';
import CalculosCard from './CalculosCard';
import AdicionarEquipeDialog from './AdicionarEquipeDialog';
import AdicionarServicoDialog from './AdicionarServicoDialog';
import { gerarPdfOrcamento } from '../../utils/gerarPdfOrcamento';

const API_URL = 'http://localhost:3333';

export interface ItemServico { descricao: string; valor: number; }
export interface FuncionarioEquipe { id: number; nome: string; valorDiaria: number; }
export interface Orcamento {
  id: number;
  nomeCliente: string | { id?: number; nome?: string };
  diasPrevistos: number;
  status: 'PENDENTE' | 'APROVADO' | 'CANCELADO';
  itens: ItemServico[];
  equipe: FuncionarioEquipe[];
  margemdeLucro: number;
}

export function getNomeCliente(v: string | { nome?: string }): string {
  if (typeof v === 'string') return v;
  return v?.nome ?? '—';
}

const STATUS: Record<string, React.CSSProperties> = {
  PENDENTE:  { background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a' },
  APROVADO:  { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
  CANCELADO: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
};

export default function Orcamentos({ onCriarObra }: { onCriarObra?: (orc: Orcamento) => void }) {
  const [orcamentos, setOrcamentos]       = useState<Orcamento[]>([]);
  const [selecionado, setSelecionado]     = useState<Orcamento | null>(null);
  const [clientes, setClientes]           = useState<{ id: number; nome: string }[]>([]);
  const [funcionarios, setFuncionarios]   = useState<FuncionarioEquipe[]>([]);
  const [loading, setLoading]             = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [showEquipe, setShowEquipe]       = useState(false);
  const [showServico, setShowServico]     = useState(false);
  const [aprovando, setAprovando]         = useState(false);
  const [salvando, setSalvando]           = useState(false);
  const [erro, setErro]                   = useState('');
  const [form, setForm]                   = useState({ clienteId: '', diasPrevistos: '', margemdeLucro: '30' });

  // ── fetch ─────────────────────────────────────────────────────
  const fetchOrcamentos = async () => {
    try {
      const r = await fetch(`${API_URL}/orcamentos`);
      const d = await r.json();
      setOrcamentos(d);
    } catch { setErro('Erro ao carregar orçamentos.'); }
    finally  { setLoading(false); }
  };

  const fetchClientes = async () => {
    try { const r = await fetch(`${API_URL}/clientes`); setClientes(await r.json()); } catch {}
  };

  const fetchFuncionarios = async () => {
    try { const r = await fetch(`${API_URL}/funcionarios`); setFuncionarios(await r.json()); } catch {}
  };

  useEffect(() => { fetchOrcamentos(); }, []);

  // Mantém selecionado sincronizado após atualizações
  useEffect(() => {
    if (selecionado) {
      const atualizado = orcamentos.find(o => o.id === selecionado.id);
      if (atualizado) setSelecionado(atualizado);
    }
  }, [orcamentos]);

  // ── criar ─────────────────────────────────────────────────────
  const handleCriar = async () => {
    if (!form.clienteId || !form.diasPrevistos) { setErro('Preencha todos os campos obrigatórios.'); return; }
    setSalvando(true); setErro('');
    const cliente = clientes.find(c => c.id === Number(form.clienteId));
    try {
      const r = await fetch(`${API_URL}/orcamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente:    cliente,
          diasPrevistos:  Number(form.diasPrevistos),
          margemdeLucro:  Number(form.margemdeLucro) / 100,
        }),
      });
      if (!r.ok) throw new Error();
      const criado = await r.json();
      setOrcamentos(p => [...p, criado]);
      setSelecionado(criado);
      setShowModal(false);
      setForm({ clienteId: '', diasPrevistos: '', margemdeLucro: '30' });
    } catch { setErro('Erro ao criar orçamento.'); }
    finally  { setSalvando(false); }
  };

  // ── atualizar (PUT /orcamentos/:id) ───────────────────────────
  const atualizar = async (patch: Partial<Orcamento>) => {
    if (!selecionado) return;
    const atualizado = { ...selecionado, ...patch };
    setSalvando(true);
    try {
      const r = await fetch(`${API_URL}/orcamentos/${selecionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atualizado),
      });
      if (!r.ok) throw new Error();
      const salvo = await r.json();
      setOrcamentos(p => p.map(o => o.id === salvo.id ? salvo : o));
      setSelecionado(salvo);
    } catch { setErro('Erro ao salvar. Verifique se o endpoint PUT /orcamentos/:id existe.'); }
    finally  { setSalvando(false); }
  };

  // ── aprovar ───────────────────────────────────────────────────
  const handleAprovar = async () => {
    if (!selecionado) return;
    setAprovando(true);
    try {
      const r = await fetch(`${API_URL}/orcamentos/${selecionado.id}/aprovar`, { method: 'PATCH' });
      if (!r.ok) throw new Error();
      const patch = { ...selecionado, status: 'APROVADO' as const };
      setOrcamentos(p => p.map(o => o.id === selecionado.id ? patch : o));
      setSelecionado(patch);
    } catch { setErro('Erro ao aprovar.'); }
    finally  { setAprovando(false); }
  };

  // ── equipe ────────────────────────────────────────────────────
  const handleAdicionarEquipe = (novos: FuncionarioEquipe[]) => {
    if (!selecionado) return;
    const equipeAtual = selecionado.equipe ?? [];
    const ids = new Set(equipeAtual.map(f => f.id));
    const merged = [...equipeAtual, ...novos.filter(f => !ids.has(f.id))];
    atualizar({ equipe: merged });
  };

  const handleRemoverEquipe = (id: number) => {
    if (!selecionado) return;
    atualizar({ equipe: (selecionado.equipe ?? []).filter(f => f.id !== id) });
  };

  // ── serviços ──────────────────────────────────────────────────
  const handleAdicionarServico = (item: ItemServico) => {
    if (!selecionado) return;
    atualizar({ itens: [...(selecionado.itens ?? []), item] });
  };

  const handleRemoverServico = (idx: number) => {
    if (!selecionado) return;
    atualizar({ itens: (selecionado.itens ?? []).filter((_, i) => i !== idx) });
  };

  const pendentes  = orcamentos.filter(o => o.status === 'PENDENTE').length;
  const aprovados  = orcamentos.filter(o => o.status === 'APROVADO').length;

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Orçamentos</h1>
          <p style={s.subtitulo}>Controle de Propostas Comerciais</p>
        </div>
        <button style={s.btnNovo} onClick={() => { setErro(''); fetchClientes(); setShowModal(true); }}>
          + Novo Orçamento
        </button>
      </div>

      <hr style={s.divider} />

      {/* ── Stats ── */}
      <div style={s.statsRow}>
        {[
          { label: 'TOTAL',     valor: orcamentos.length, cor: '#6c63ff' },
          { label: 'PENDENTES', valor: pendentes,          cor: '#d97706' },
          { label: 'APROVADOS', valor: aprovados,          cor: '#16a34a' },
        ].map(st => (
          <div key={st.label} style={s.statCard}>
            <p style={{ ...s.statLabel, color: st.cor }}>{st.label}</p>
            <p style={s.statValor}>{st.valor}</p>
          </div>
        ))}
      </div>

      <hr style={s.divider} />

      {erro && <p style={s.erroGlobal}>{erro}</p>}

      {/* ── Split panel ── */}
      {loading ? <p style={s.msg}>Carregando...</p> : (
        <div style={s.split}>

          {/* Lista */}
          <div style={s.lista}>
            {orcamentos.length === 0
              ? <p style={s.msg}>Nenhum orçamento.</p>
              : orcamentos.map(orc => (
                <div
                  key={orc.id}
                  style={{ ...s.listaItem, ...(selecionado?.id === orc.id ? s.listaItemAtivo : {}) }}
                  onClick={() => setSelecionado(orc)}
                >
                  <div style={s.listaItemHeader}>
                    <span style={s.listaItemNome}>{getNomeCliente(orc.nomeCliente)}</span>
                    <span style={{ ...s.badge, ...STATUS[orc.status] }}>{orc.status}</span>
                  </div>
                  <p style={s.listaItemSub}>#{orc.id} · {orc.diasPrevistos} dias previstos</p>

                  {orc.status === 'APROVADO' && (
                    <button
                      style={s.btnCriarObra}
                      onClick={e => { e.stopPropagation(); onCriarObra?.(orc); }}
                    >
                      Criar Obra →
                    </button>
                  )}
                </div>
              ))
            }
          </div>

          {/* Detalhe */}
          <div style={s.detalhe}>
            {!selecionado ? (
              <div style={s.vazio}>
                <p style={s.vazioTexto}>Selecione um orçamento para ver os detalhes</p>
              </div>
            ) : (
              <div style={s.detalheInner}>

                {/* Header do detalhe */}
                <div style={s.detalheHeader}>
                  <div>
                    <h2 style={s.detalheNome}>{getNomeCliente(selecionado.nomeCliente)}</h2>
                    <p style={s.detalheSub}>{selecionado.diasPrevistos} dias previstos</p>
                  </div>
                  <div style={s.detalheAcoes}>
                    <span style={{ ...s.badge, ...STATUS[selecionado.status] }}>{selecionado.status}</span>
                    {selecionado.status === 'PENDENTE' && (
                      <button style={s.btnAprovar} onClick={handleAprovar} disabled={aprovando}>
                        {aprovando ? 'Aprovando...' : 'Aprovar'}
                      </button>
                    )}
                    {selecionado.status === 'APROVADO' && (
                      <span style={{ fontSize: '0.78rem', color: '#16a34a', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                        Use o card na lista para criar a obra
                      </span>
                    )}
                    <button style={s.btnPdf} onClick={() => gerarPdfOrcamento(selecionado)}>
                      Exportar PDF
                    </button>
                  </div>
                </div>

                {/* Equipe */}
                <div style={s.secao}>
                  <div style={s.secaoHeader}>
                    <span style={s.secaoTitulo}>Equipe ({selecionado.equipe?.length ?? 0})</span>
                    {selecionado.status === 'PENDENTE' && (
                      <button style={s.btnSecao} onClick={() => { fetchFuncionarios(); setShowEquipe(true); }}>
                        + Adicionar
                      </button>
                    )}
                  </div>
                  {(selecionado.equipe ?? []).length === 0
                    ? <p style={s.secaoVazio}>Nenhum funcionário adicionado.</p>
                    : (selecionado.equipe ?? []).map(f => (
                      <div key={f.id} style={s.itemRow}>
                        <div>
                          <p style={s.itemNome}>{f.nome}</p>
                          <p style={s.itemSub}>R$ {(f.valorDiaria ?? 0).toFixed(2)}/dia</p>
                        </div>
                        {selecionado.status === 'PENDENTE' && (
                          <button style={s.btnRemover} onClick={() => handleRemoverEquipe(f.id)}>✕</button>
                        )}
                      </div>
                    ))
                  }
                </div>

                {/* Serviços */}
                <div style={s.secao}>
                  <div style={s.secaoHeader}>
                    <span style={s.secaoTitulo}>Serviços ({selecionado.itens?.length ?? 0})</span>
                    {selecionado.status === 'PENDENTE' && (
                      <button style={s.btnSecaoVerde} onClick={() => setShowServico(true)}>
                        + Adicionar
                      </button>
                    )}
                  </div>
                  {(selecionado.itens ?? []).length === 0
                    ? <p style={s.secaoVazio}>Nenhum serviço adicionado.</p>
                    : (selecionado.itens ?? []).map((item, idx) => (
                      <div key={idx} style={s.itemRow}>
                        <div>
                          <p style={s.itemNome}>{item.descricao}</p>
                          <p style={{ ...s.itemSub, color: '#16a34a', fontWeight: 600 }}>
                            R$ {(item.valor ?? 0).toFixed(2)}
                          </p>
                        </div>
                        {selecionado.status === 'PENDENTE' && (
                          <button style={s.btnRemover} onClick={() => handleRemoverServico(idx)}>✕</button>
                        )}
                      </div>
                    ))
                  }
                </div>

                {/* Cálculos */}
                <CalculosCard orcamento={selecionado} />

              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Novo Orçamento ── */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitulo}>Novo Orçamento</h2>
              <button style={s.btnFechar} onClick={() => setShowModal(false)}>✕</button>
            </div>
            {erro && <p style={s.erroMsg}>{erro}</p>}

            <label style={s.label}>Cliente *</label>
            <select style={s.select} value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <label style={s.label}>Dias Previstos *</label>
            <input style={s.input} type="number" placeholder="Ex: 30" value={form.diasPrevistos}
              onChange={e => setForm({ ...form, diasPrevistos: e.target.value })} />

            <label style={s.label}>Margem de Lucro (%) *</label>
            <input style={s.input} type="number" step="0.1" min="0" max="100" placeholder="Ex: 30"
              value={form.margemdeLucro} onChange={e => setForm({ ...form, margemdeLucro: e.target.value })} />

            <div style={s.modalActions}>
              <button style={s.btnCancelar} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={s.btnSalvar} onClick={handleCriar} disabled={salvando}>
                {salvando ? 'Criando...' : 'Criar Orçamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialogs ── */}
      <AdicionarEquipeDialog
        open={showEquipe}
        onClose={() => setShowEquipe(false)}
        funcionarios={funcionarios}
        equipeAtual={selecionado?.equipe ?? []}
        onSubmit={handleAdicionarEquipe}
      />
      <AdicionarServicoDialog
        open={showServico}
        onClose={() => setShowServico(false)}
        onSubmit={handleAdicionarServico}
      />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page:       { minHeight: '100vh', background: 'linear-gradient(135deg,#f0f2f8 0%,#e8eaf6 100%)', padding: '40px 48px', fontFamily: "'Segoe UI',sans-serif", color: '#1a1a2e' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  titulo:     { fontSize: '2.8rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  subtitulo:  { fontSize: '0.95rem', color: '#6b7280', margin: '4px 0 0' },
  btnNovo:    { backgroundColor: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 22px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,99,255,.35)' },
  divider:    { border: 'none', borderTop: '1px solid #dde1ee', margin: '20px 0' },
  statsRow:   { display: 'flex', gap: '16px', flexWrap: 'wrap' as const, marginBottom: '8px' },
  statCard:   { background: '#fff', borderRadius: '10px', padding: '14px 24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', minWidth: '110px' },
  statLabel:  { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', margin: 0 },
  statValor:  { fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 0', color: '#1a1a2e' },
  msg:        { textAlign: 'center' as const, color: '#9ca3af', marginTop: '40px' },
  erroGlobal: { background: '#fff0f0', color: '#dc2626', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '12px' },

  split:      { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' },
  lista:      { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  listaItem:  { background: '#fff', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', border: '1.5px solid transparent', boxShadow: '0 1px 4px rgba(0,0,0,.06)', transition: 'border-color .15s' },
  listaItemAtivo: { border: '1.5px solid #6c63ff', boxShadow: '0 2px 12px rgba(108,99,255,.18)' },
  listaItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  listaItemNome: { fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e', flex: 1, marginRight: '8px' },
  listaItemSub: { fontSize: '0.78rem', color: '#9ca3af', margin: 0 },
  btnCriarObra: { marginTop: '10px', width: '100%', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 2px 8px rgba(108,99,255,.3)' },
  badge:      { display: 'inline-block', padding: '3px 9px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' as const },

  detalhe:    { minHeight: '400px' },
  detalheInner: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  vazio:      { background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center' as const, border: '1px solid #e5e7eb' },
  vazioTexto: { color: '#9ca3af' },

  detalheHeader: { background: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '12px' },
  detalheNome: { fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  detalheSub:  { fontSize: '0.85rem', color: '#6b7280', margin: '2px 0 0' },
  detalheAcoes: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' as const },

  btnAprovar:  { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '7px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  btnObra:     { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(108,99,255,.3)' },
  btnPdf:      { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 14px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.03em' },

  secao:       { background: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,.06)' },
  secaoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  secaoTitulo: { fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e' },
  secaoVazio:  { fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center' as const, padding: '12px 0' },
  btnSecao:    { background: '#ede9fe', color: '#6c63ff', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  btnSecaoVerde: { background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  itemRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: '10px', marginBottom: '6px' },
  itemNome:    { fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', margin: 0 },
  itemSub:     { fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0' },
  btnRemover:  { background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 700 },

  overlay:     { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal:       { background: '#fff', borderRadius: '18px', padding: '32px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column' as const, gap: '12px', boxShadow: '0 20px 60px rgba(0,0,0,.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitulo: { fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  btnFechar:   { background: 'none', border: 'none', fontSize: '1rem', color: '#9ca3af', cursor: 'pointer' },
  erroMsg:     { color: '#ef4444', fontSize: '0.85rem', background: '#fff0f0', padding: '8px 12px', borderRadius: '8px', margin: 0 },
  label:       { fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '-6px' },
  select:      { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.95rem', color: '#1a1a2e', background: '#fff', cursor: 'pointer', width: '100%' },
  input:       { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.95rem', color: '#1a1a2e' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' },
  btnCancelar:  { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnSalvar:    { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(108,99,255,.3)' },
};