import { useEffect, useState } from 'react';

export interface EmpresaSettings {
  nomeEmpresa: string;
  telefone: string;
  email: string;
  endereco: string;
  logoBase64: string;
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
}

const STORAGE_KEY = 'gestaopro_settings';

export function loadSettings(): EmpresaSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { nomeEmpresa: '', telefone: '', email: '', endereco: '', logoBase64: '', banco: '', agencia: '', conta: '', pix: '' };
}

export function saveSettings(s: EmpresaSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function Configuracoes() {
  const [form, setForm]       = useState<EmpresaSettings>(loadSettings());
  const [salvo, setSalvo]     = useState(false);
  const [preview, setPreview] = useState<string>(form.logoBase64);

  useEffect(() => { setForm(loadSettings()); }, []);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setForm(f => ({ ...f, logoBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSalvar = () => {
    saveSettings(form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const set = (k: keyof EmpresaSettings, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={s.page}>

      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Configurações</h1>
          <p style={s.subtitulo}>Dados da empresa para PDFs e documentos</p>
        </div>
      </div>

      <hr style={s.divider} />

      <div style={s.grid}>

        {/* ── Logo ── */}
        <div style={s.card}>
          <p style={s.cardTitulo}>Logo da Empresa</p>
          <div style={s.logoArea}>
            {preview
              ? <img src={preview} alt="logo" style={s.logoImg} />
              : <div style={s.logoPlaceholder}>Sem logo</div>
            }
            <div>
              <input type="file" accept="image/*" id="logo-input" style={{ display: 'none' }} onChange={handleLogo} />
              <button style={s.btnUpload} onClick={() => document.getElementById('logo-input')?.click()}>
                {preview ? 'Alterar Logo' : 'Enviar Logo'}
              </button>
              <p style={s.logoHint}>PNG ou JPG · aparecerá no topo do PDF</p>
              {preview && (
                <button style={s.btnRemoverLogo} onClick={() => { setPreview(''); set('logoBase64', ''); }}>
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Dados da Empresa ── */}
        <div style={s.card}>
          <p style={s.cardTitulo}>Dados da Empresa</p>
          <div style={s.formGrid}>
            <div style={s.campo}>
              <label style={s.label}>Nome da Empresa</label>
              <input style={s.input} placeholder="Ex: Construções Silva" value={form.nomeEmpresa} onChange={e => set('nomeEmpresa', e.target.value)} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Telefone</label>
              <input style={s.input} placeholder="Ex: (11) 98765-4321" value={form.telefone} onChange={e => set('telefone', e.target.value)} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>E-mail</label>
              <input style={s.input} type="email" placeholder="Ex: contato@empresa.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div style={{ ...s.campo, gridColumn: '1 / -1' }}>
              <label style={s.label}>Endereço</label>
              <input style={s.input} placeholder="Ex: Rua das Flores, 123 — São Paulo, SP" value={form.endereco} onChange={e => set('endereco', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Dados Bancários ── */}
        <div style={{ ...s.card, gridColumn: '1 / -1' }}>
          <p style={s.cardTitulo}>Dados Bancários</p>
          <p style={s.cardSub}>Essas informações aparecem no rodapé do orçamento em PDF junto ao aviso de adiantamento de 30%.</p>
          <div style={s.formGrid}>
            <div style={s.campo}>
              <label style={s.label}>Banco</label>
              <input style={s.input} placeholder="Ex: Banco do Brasil" value={form.banco} onChange={e => set('banco', e.target.value)} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Agência</label>
              <input style={s.input} placeholder="Ex: 1234-5" value={form.agencia} onChange={e => set('agencia', e.target.value)} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Conta</label>
              <input style={s.input} placeholder="Ex: 12345-6" value={form.conta} onChange={e => set('conta', e.target.value)} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>PIX</label>
              <input style={s.input} placeholder="Ex: contato@empresa.com ou 11.999.999/0001-99" value={form.pix} onChange={e => set('pix', e.target.value)} />
            </div>
          </div>
        </div>

      </div>

      {/* ── Salvar ── */}
      <div style={s.footer}>
        <button style={{ ...s.btnSalvar, ...(salvo ? s.btnSalvoOk : {}) }} onClick={handleSalvar}>
          {salvo ? 'Salvo com sucesso!' : 'Salvar Configurações'}
        </button>
      </div>

    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:       { minHeight: '100vh', background: 'linear-gradient(135deg,#f0f2f8 0%,#e8eaf6 100%)', padding: '40px 48px', fontFamily: "'Segoe UI',sans-serif", color: '#1a1a2e' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  titulo:     { fontSize: '2.8rem', fontWeight: 800, margin: 0, color: '#1a1a2e' },
  subtitulo:  { fontSize: '0.95rem', color: '#6b7280', margin: '4px 0 0' },
  divider:    { border: 'none', borderTop: '1px solid #dde1ee', margin: '20px 0' },
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card:       { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,.07)' },
  cardTitulo: { fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', margin: '0 0 4px' },
  cardSub:    { fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 16px' },
  logoArea:   { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px' },
  logoImg:    { width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px', background: '#f9fafb' },
  logoPlaceholder: { width: '100px', height: '100px', border: '2px dashed #e5e7eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#9ca3af', background: '#f9fafb' },
  btnUpload:  { background: '#ede9fe', color: '#6c63ff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  logoHint:   { fontSize: '0.72rem', color: '#9ca3af', margin: '6px 0 0' },
  btnRemoverLogo: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', padding: '4px 0', display: 'block', marginTop: '4px' },
  formGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' },
  campo:      { display: 'flex', flexDirection: 'column' as const, gap: '5px' },
  label:      { fontSize: '0.78rem', fontWeight: 600, color: '#374151' },
  input:      { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '9px 13px', fontSize: '0.92rem', color: '#1a1a2e', outline: 'none' },
  footer:     { display: 'flex', justifyContent: 'flex-end', marginTop: '24px' },
  btnSalvar:  { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(108,99,255,.35)', transition: 'background .2s' },
  btnSalvoOk: { background: '#16a34a', boxShadow: '0 4px 14px rgba(22,163,74,.3)' },
};
