import { Orcamento } from './Orcamentos';

export default function CalculosCard({ orcamento }: { orcamento: Orcamento }) {
  const totalDiarias   = (orcamento.equipe ?? []).reduce((a, f) => a + (f.valorDiaria ?? 0), 0);
  const custoMao       = totalDiarias * (orcamento.diasPrevistos ?? 0);
  const margem         = orcamento.margemdeLucro ?? 0.3;
  const valorMinimo    = margem < 1 ? custoMao / (1 - margem) : custoMao;
  const totalServicos  = (orcamento.itens ?? []).reduce((a, i) => a + (i.valor ?? 0), 0);
  const valorFinal     = valorMinimo + totalServicos;

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div style={s.card}>
      <p style={s.titulo}>Cálculos do Orçamento</p>

      <div style={s.linha}>
        <span style={s.label}>Funcionários / dia</span>
        <span style={s.valor}>{fmt(totalDiarias)}</span>
      </div>
      <div style={s.linha}>
        <span style={s.label}>Dias previstos</span>
        <span style={s.valor}>{orcamento.diasPrevistos}</span>
      </div>
      <div style={{ ...s.linha, ...s.separador }}>
        <span style={s.label}>Custo mão de obra</span>
        <span style={s.valor}>{fmt(custoMao)}</span>
      </div>

      <div style={s.destaque}>
        <span style={s.destaqueLabel}>Valor mínimo (c/ margem de {(margem * 100).toFixed(0)}%)</span>
        <span style={s.destaqueValor}>{fmt(valorMinimo)}</span>
      </div>

      <div style={{ ...s.linha, ...s.separador }}>
        <span style={s.label}>Total serviços</span>
        <span style={s.valor}>{fmt(totalServicos)}</span>
      </div>

      <div style={s.total}>
        <span style={s.totalLabel}>VALOR FINAL</span>
        <span style={s.totalValor}>{fmt(valorFinal)}</span>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:          { background: 'linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)', borderRadius: '16px', padding: '22px 24px', border: '1px solid #c7d2fe' },
  titulo:        { fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', margin: '0 0 16px' },
  linha:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: '0.88rem' },
  separador:     { borderBottom: '1px solid #c7d2fe', paddingBottom: '10px', marginBottom: '4px' },
  label:         { color: '#4b5563' },
  valor:         { fontWeight: 600, color: '#1a1a2e' },
  destaque:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', margin: '6px 0', fontSize: '0.88rem' },
  destaqueLabel: { color: '#92400e', fontWeight: 600 },
  destaqueValor: { color: '#92400e', fontWeight: 700 },
  total:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', marginTop: '4px' },
  totalLabel:    { fontWeight: 700, color: '#374151', fontSize: '0.9rem' },
  totalValor:    { fontSize: '1.6rem', fontWeight: 800, color: '#6c63ff' },
};
