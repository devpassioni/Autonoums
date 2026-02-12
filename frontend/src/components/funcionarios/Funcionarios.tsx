import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3333';

interface Funcionario {
  id: number;
  nome: string;
  valorDiaria: number;
  diasTrabalhados: number;
}

interface NovoFuncionarioForm {
  nome: string;
  valorDiaria: string;
  diasTrabalhados: string;
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState<NovoFuncionarioForm>({
    nome: '',
    valorDiaria: '',
    diasTrabalhados: '',
  });

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch(`${API_URL}/funcionarios`);
      const data = await res.json();
      setFuncionarios(data);
    } catch {
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este funcionário?')) return;
    await fetch(`${API_URL}/funcionarios/${id}`, { method: 'DELETE' });
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.valorDiaria) {
      setErro('Nome e Valor da Diária são obrigatórios.');
      return;
    }
    setSubmitting(true);
    setErro('');
    try {
      const res = await fetch(`${API_URL}/funcionarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          valorDiaria: Number(form.valorDiaria),
          diasTrabalhados: Number(form.diasTrabalhados || 0),
        }),
      });
      if (!res.ok) throw new Error();
      const criado = await res.json();
      setFuncionarios((prev) => [...prev, criado]);
      setShowModal(false);
      setForm({ nome: '', valorDiaria: '', diasTrabalhados: '' });
    } catch {
      setErro('Erro ao criar funcionário.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAPagar = funcionarios.reduce(
    (acc, f) => acc + f.valorDiaria * f.diasTrabalhados,
    0
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Funcionários</h1>
          <p style={styles.subtitulo}>Gerenciamento de Equipe</p>
        </div>
        <button style={styles.btnNovo} onClick={() => { setErro(''); setShowModal(true); }}>
          + Novo Funcionário
        </button>
      </div>

      <hr style={styles.divider} />

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statIcon}>👷</span>
          <div>
            <p style={styles.statLabel}>TOTAL</p>
            <p style={styles.statValor}>{funcionarios.length}</p>
          </div>
        </div>
        <div style={styles.stat}>
          <span style={styles.statIcon}>💰</span>
          <div>
            <p style={styles.statLabel}>TOTAL A PAGAR</p>
            <p style={styles.statValor}>
              R$ {totalAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Cards */}
      {loading ? (
        <p style={styles.mensagem}>Carregando...</p>
      ) : funcionarios.length === 0 ? (
        <p style={styles.mensagem}>Nenhum funcionário cadastrado.</p>
      ) : (
        <div style={styles.grid}>
          {funcionarios.map((f) => (
            <div key={f.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>👷 FUNCIONÁRIO</span>
                <button
                  style={styles.btnDelete}
                  onClick={() => handleDelete(f.id)}
                  title="Remover funcionário"
                >
                  🗑
                </button>
              </div>

              <h2 style={styles.cardNome}>{f.nome}</h2>

              <div style={styles.cardInfo}>
                <span style={styles.infoIcon}>💵</span>
                <span>
                  R$ {f.valorDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / dia
                </span>
              </div>

              <div style={styles.cardInfo}>
                <span style={styles.infoIcon}>📅</span>
                <span>
                  {f.diasTrabalhados} dia{f.diasTrabalhados !== 1 ? 's' : ''} trabalhado
                  {f.diasTrabalhados !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.totalLabel}>Total a receber:</span>
                <span style={styles.totalValor}>
                  R$ {(f.valorDiaria * f.diasTrabalhados).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitulo}>Novo Funcionário</h2>

            {erro && <p style={styles.erroMsg}>{erro}</p>}

            <label style={styles.label}>Nome *</label>
            <input
              style={styles.input}
              placeholder="Ex: João Silva"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <label style={styles.label}>Valor da Diária (R$) *</label>
            <input
              style={styles.input}
              type="number"
              placeholder="Ex: 200"
              value={form.valorDiaria}
              onChange={(e) => setForm({ ...form, valorDiaria: e.target.value })}
            />

            <label style={styles.label}>Dias Trabalhados</label>
            <input
              style={styles.input}
              type="number"
              placeholder="Ex: 0"
              value={form.diasTrabalhados}
              onChange={(e) => setForm({ ...form, diasTrabalhados: e.target.value })}
            />

            <div style={styles.modalActions}>
              <button
                style={styles.btnCancelar}
                onClick={() => { setShowModal(false); setErro(''); }}
              >
                Cancelar
              </button>
              <button
                style={styles.btnSalvar}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f2f8 0%, #e8eaf6 100%)',
    padding: '40px 48px',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#1a1a2e',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  titulo: {
    fontSize: '2.8rem',
    fontWeight: 800,
    margin: 0,
    color: '#1a1a2e',
  },
  subtitulo: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '4px 0 0',
  },
  btnNovo: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 22px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
    transition: 'background 0.2s',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #dde1ee',
    margin: '20px 0',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    borderRadius: '10px',
    padding: '12px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  statLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#9ca3af',
    letterSpacing: '0.05em',
    margin: 0,
  },
  statValor: {
    fontSize: '1.4rem',
    fontWeight: 800,
    margin: 0,
    color: '#1a1a2e',
  },
  mensagem: {
    marginTop: '40px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '8px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px 22px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    background: '#ede9fe',
    color: '#6c63ff',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '0.04em',
  },
  btnDelete: {
    background: '#fff0f0',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 9px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#ef4444',
    lineHeight: 1,
  },
  cardNome: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
    color: '#1a1a2e',
  },
  cardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#4b5563',
  },
  infoIcon: {
    fontSize: '1rem',
  },
  cardFooter: {
    marginTop: '6px',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontWeight: 600,
  },
  totalValor: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#6c63ff',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#fff',
    borderRadius: '18px',
    padding: '32px',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalTitulo: {
    fontSize: '1.4rem',
    fontWeight: 800,
    margin: 0,
    color: '#1a1a2e',
  },
  erroMsg: {
    color: '#ef4444',
    fontSize: '0.85rem',
    background: '#fff0f0',
    padding: '8px 12px',
    borderRadius: '8px',
    margin: 0,
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '-6px',
  },
  input: {
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#1a1a2e',
    transition: 'border-color 0.2s',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  btnCancelar: {
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnSalvar: {
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
  },
};
