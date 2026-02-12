import { useState } from 'react'
import GerenciadorClientes from './components/clientes/GerenciadorClientes'
import Funcionarios from './components/funcionarios/Funcionarios'
import Orcamentos from './components/Orcamentos/Orcamentos'

type Aba = 'clientes' | 'funcionarios' | 'orcamentos'

const ABAS: { id: Aba; label: string }[] = [
  { id: 'clientes',     label: 'Clientes'     },
  { id: 'funcionarios', label: 'Funcionários' },
  { id: 'orcamentos',   label: 'Orçamentos'   },
]

function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('clientes')

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏗️</span>
          <span style={styles.logoTexto}>GestãoPro</span>
        </div>

        <nav style={styles.nav}>
          {ABAS.map(aba => (
            <button
              key={aba.id}
              style={{
                ...styles.navItem,
                ...(abaAtiva === aba.id ? styles.navItemAtivo : {}),
              }}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main style={styles.main}>
        {abaAtiva === 'clientes'     && <GerenciadorClientes />}
        {abaAtiva === 'funcionarios' && <Funcionarios />}
        {abaAtiva === 'orcamentos'   && (
          <Orcamentos
            onCriarObra={(orc) => {
              // Futuramente: navegar para criação de obra com o orçamento selecionado
              alert(`Criar Obra a partir do Orçamento #${orc.id} — em breve!`)
            }}
          />
        )}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
  },
  sidebar: {
    width: '220px',
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 16px',
    gap: '8px',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 8px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '8px',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoTexto: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.55)',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s, color 0.15s',
    width: '100%',
  },
  navItemAtivo: {
    background: '#6c63ff',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(108,99,255,0.35)',
  },
  navIcon: {
    fontSize: '1.1rem',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    background: 'linear-gradient(135deg, #f0f2f8 0%, #e8eaf6 100%)',
  },
}

export default App