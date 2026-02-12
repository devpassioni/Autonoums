import { useState } from 'react';
import { ItemServico } from './Orcamentos';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: ItemServico) => void;
}

export default function AdicionarServicoDialog({ open, onClose, onSubmit }: Props) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor]         = useState('');
  const [erro, setErro]           = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!descricao.trim() || !valor) { setErro('Preencha todos os campos.'); return; }
    onSubmit({ descricao: descricao.trim(), valor: parseFloat(valor) });
    setDescricao(''); setValor(''); setErro('');
    onClose();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.titulo}>Adicionar Serviço</h3>
          <button style={s.btnFechar} onClick={onClose}>✕</button>
        </div>

        {erro && <p style={s.erro}>{erro}</p>}

        <label style={s.label}>Descrição *</label>
        <input style={s.input} placeholder="Ex: Pintura externa" value={descricao}
          onChange={e => setDescricao(e.target.value)} />

        <label style={s.label}>Valor (R$) *</label>
        <input style={s.input} type="number" step="0.01" min="0" placeholder="Ex: 1500.00"
          value={valor} onChange={e => setValor(e.target.value)} />

        <div style={s.footer}>
          <button style={s.btnCancelar} onClick={onClose}>Cancelar</button>
          <button style={s.btnConfirmar} onClick={handleSubmit}>Adicionar Serviço</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:      { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal:        { background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo:       { fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  btnFechar:    { background: 'none', border: 'none', fontSize: '1rem', color: '#9ca3af', cursor: 'pointer' },
  erro:         { color: '#ef4444', fontSize: '0.85rem', background: '#fff0f0', padding: '8px 12px', borderRadius: '8px', margin: 0 },
  label:        { fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '-6px' },
  input:        { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.95rem', color: '#1a1a2e', outline: 'none' },
  footer:       { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' },
  btnCancelar:  { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnConfirmar: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', boxShadow: '0 4px 12px rgba(22,163,74,.3)' },
};
