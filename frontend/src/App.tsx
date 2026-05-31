import GerenciadorClientes from './components/clientes/GerenciadorClientes'

function App() {
<<<<<<< Updated upstream
  return <GerenciadorClientes />
=======
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
          <span style={styles.logoTexto}>Autonoums</span>
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
>>>>>>> Stashed changes
}

export default App
