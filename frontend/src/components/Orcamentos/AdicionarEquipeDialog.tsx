import { useState } from 'react';
import { FuncionarioEquipe } from './Orcamentos';

interface Props {
  open: boolean;
  onClose: () => void;
  funcionarios: FuncionarioEquipe[];
  equipeAtual: FuncionarioEquipe[];
  onSubmit: (selecionados: FuncionarioEquipe[]) => void;
}

export default function AdicionarEquipeDialog({ open, onClose, funcionarios, equipeAtual, onSubmit }: Props) {
  const [selecionados, setSelecionados] = useState<FuncionarioEquipe[]>([]);

  if (!open) return null;

  const jaAdicionado = (id: number) => equipeAtual.some(f => f.id === id);

  const toggle = (f: FuncionarioEquipe) => {
    setSelecionados(prev => prev.find(s => s.id === f.id) ? prev.filter(s => s.id !== f.id) : [...prev, f]);
  };

  const handleConfirm = () => {
    onSubmit(selecionados);
    setSelecionados([]);
    onClose();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.titulo}>Adicionar Funcionários</h3>
          <button style={s.btnFechar} onClick={onClose}>✕</button>
        </div>

        <div style={s.lista}>
          {funcionarios.length === 0 ? (
            <p style={s.vazio}>Nenhum funcionário cadastrado.</p>
          ) : funcionarios.map(f => {
            const adicionado = jaAdicionado(f.id);
            const marcado    = selecionados.some(s => s.id === f.id);
            return (
              <div
                key={f.id}
                style={{ ...s.item, ...(adicionado ? s.itemDisabled : marcado ? s.itemMarcado : {}) }}
                onClick={() => !adicionado && toggle(f)}
              >
                <div style={{ ...s.checkbox, ...(marcado || adicionado ? s.checkboxOn : {}) }}>
                  {(marcado || adicionado) && '✓'}
                </div>
                <div style={s.info}>
                  <p style={s.nome}>{f.nome}</p>
                  <p style={s.sub}>R$ {(f.valorDiaria ?? 0).toFixed(2)}/dia</p>
                </div>
                {adicionado && <span style={s.tag}>Já na equipe</span>}
              </div>
            );
          })}
        </div>

        <div style={s.footer}>
          <button style={s.btnCancelar} onClick={onClose}>Cancelar</button>
          <button style={s.btnConfirmar} onClick={handleConfirm} disabled={selecionados.length === 0}>
            Adicionar ({selecionados.length})
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:      { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal:        { background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo:       { fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  btnFechar:    { background: 'none', border: 'none', fontSize: '1rem', color: '#9ca3af', cursor: 'pointer' },
  lista:        { maxHeight: '320px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  vazio:        { color: '#9ca3af', textAlign: 'center' as const, padding: '20px 0', fontSize: '0.9rem' },
  item:         { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', cursor: 'pointer', transition: 'border .15s' },
  itemMarcado:  { border: '1.5px solid #6c63ff', background: '#ede9fe' },
  itemDisabled: { background: '#f9fafb', cursor: 'default', opacity: 0.7 },
  checkbox:     { width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 },
  checkboxOn:   { background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' },
  info:         { flex: 1 },
  nome:         { fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', margin: 0 },
  sub:          { fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' },
  tag:          { fontSize: '0.72rem', color: '#9ca3af', background: '#f3f4f6', borderRadius: '6px', padding: '2px 8px' },
  footer:       { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  btnCancelar:  { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnConfirmar: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', boxShadow: '0 4px 12px rgba(108,99,255,.3)' },
};
