import { useState } from 'react'
import GerenciadorClientes from './components/clientes/GerenciadorClientes'
import Funcionarios from './components/funcionarios/Funcionarios'
import Orcamentos from './components/Orcamentos/Orcamentos'
import Obras from './components/Obras/Obras'
import Configuracoes from './components/Configuracoes/Configuracoes'

type Aba = 'clientes' | 'funcionarios' | 'orcamentos' | 'obras' | 'configuracoes'

const ABAS: { id: Aba; label: string; descricao: string }[] = [
  { id: 'clientes',       label: 'Clientes',       descricao: 'Carteira'   },
  { id: 'funcionarios',   label: 'Funcionários',    descricao: 'Equipe'     },
  { id: 'orcamentos',     label: 'Orçamentos',      descricao: 'Propostas'  },
  { id: 'obras',          label: 'Obras',           descricao: 'Projetos'   },
  { id: 'configuracoes',  label: 'Configurações',   descricao: 'Empresa'    },
]

function App() {
  const [abaAtiva, setAbaAtiva]               = useState<Aba>('clientes')
  const [orcamentoParaObra, setOrcamentoParaObra] = useState<{ id: number } | null>(null)

  const handleCriarObra = (orc: { id: number }) => {
    setOrcamentoParaObra(orc)
    setAbaAtiva('obras')
  }

  return (
    <div style={styles.root}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoTexto}>GestãoPro</span>
        </div>

        <nav style={styles.nav}>
          {ABAS.filter(a => a.id !== 'configuracoes').map(aba => (
            <button
              key={aba.id}
              style={{ ...styles.navItem, ...(abaAtiva === aba.id ? styles.navItemAtivo : {}) }}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <span style={styles.navLabel}>{aba.label}</span>
              <span style={{ ...styles.navSub, ...(abaAtiva === aba.id ? styles.navSubAtivo : {}) }}>
                {aba.descricao}
              </span>
            </button>
          ))}
        </nav>

        {/* Configurações fixado no fundo */}
        <div style={styles.sidebarFooter}>
          <button
            style={{ ...styles.navItem, ...(abaAtiva === 'configuracoes' ? styles.navItemAtivo : {}), width: '100%' }}
            onClick={() => setAbaAtiva('configuracoes')}
          >
            <span style={styles.navLabel}>Configurações</span>
            <span style={{ ...styles.navSub, ...(abaAtiva === 'configuracoes' ? styles.navSubAtivo : {}) }}>
              Empresa
            </span>
          </button>
        </div>
      </aside>

      {/* ── Conteúdo ── */}
      <main style={styles.main}>
        {abaAtiva === 'clientes'      && <GerenciadorClientes />}
        {abaAtiva === 'funcionarios'  && <Funcionarios />}
        {abaAtiva === 'orcamentos'    && <Orcamentos onCriarObra={handleCriarObra} />}
        {abaAtiva === 'obras'         && (
          <Obras
            orcamentoInicial={orcamentoParaObra}
            onOrcamentoConsumido={() => setOrcamentoParaObra(null)}
          />
        )}
        {abaAtiva === 'configuracoes' && <Configuracoes />}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '200px', background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '24px 14px', flexShrink: 0 },
  logo: { padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' },
  logoTexto: { color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' },
  nav: { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '10px 12px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s' },
  navItemAtivo: { background: '#6c63ff', color: '#fff', boxShadow: '0 4px 12px rgba(108,99,255,0.35)' },
  navLabel: { fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 },
  navSub: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '1px' },
  navSubAtivo: { color: 'rgba(255,255,255,0.65)' },
  sidebarFooter: { paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  main: { flex: 1, overflow: 'auto', background: 'linear-gradient(135deg,#f0f2f8 0%,#e8eaf6 100%)' },
}

export default App