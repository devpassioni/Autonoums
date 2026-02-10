import { useState, useEffect } from 'react';
import './GerenciadorClientes.css';

const API_URL = 'http://localhost:3333';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  tipo: 'Pessoa Fisica' | 'Pessoa Juridica';
}

interface FormData {
  nome: string;
  telefone: string;
  endereco: string;
  tipo: 'Pessoa Fisica' | 'Pessoa Juridica';
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

// Ícones SVG inline
const Icons = {
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Users: ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  User: ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Building: ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  ),
  Phone: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  MapPin: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
};

export default function GerenciadorClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    endereco: '',
    tipo: 'Pessoa Fisica'
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      const data = await response.json();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showNotification('Erro ao carregar clientes', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchClientes();
        setShowModal(false);
        setFormData({ nome: '', telefone: '', endereco: '', tipo: 'Pessoa Fisica' });
        showNotification('Cliente adicionado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      showNotification('Erro ao adicionar cliente', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este cliente?')) return;

    try {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchClientes();
        showNotification('Cliente removido com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      showNotification('Erro ao remover cliente', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const pessoaFisicaCount = clientes.filter(c => c.tipo === 'Pessoa Fisica').length;
  const pessoaJuridicaCount = clientes.filter(c => c.tipo === 'Pessoa Juridica').length;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <div className="title-section">
              <h1>Clientes</h1>
              <p className="subtitle">Gerenciamento de Carteira</p>
            </div>
            <button className="btn-add" onClick={() => setShowModal(true)}>
              <Icons.Plus />
              Novo Cliente
            </button>
          </div>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-icon">
                <Icons.Users size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total</span>
                <span className="stat-value">{clientes.length}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Icons.User size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Pessoa Física</span>
                <span className="stat-value">{pessoaFisicaCount}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Icons.Building size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Pessoa Jurídica</span>
                <span className="stat-value">{pessoaJuridicaCount}</span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            <Icons.Users size={80} />
            <h3 className="empty-title">Nenhum cliente cadastrado</h3>
            <p className="empty-text">Comece adicionando seu primeiro cliente</p>
          </div>
        ) : (
          <div className="clientes-grid">
            {clientes.map((cliente, index) => (
              <div key={cliente.id} className="cliente-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-header">
                  <div className={`cliente-tipo ${cliente.tipo === 'Pessoa Fisica' ? 'tipo-pf' : 'tipo-pj'}`}>
                    {cliente.tipo === 'Pessoa Fisica' ? (
                      <><Icons.User size={14} /> Pessoa Física</>
                    ) : (
                      <><Icons.Building size={14} /> Pessoa Jurídica</>
                    )}
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cliente.id)}
                    title="Remover cliente"
                  >
                    <Icons.Trash />
                  </button>
                </div>
                <h3 className="cliente-nome">{cliente.nome}</h3>
                <div className="cliente-info">
                  <div className="info-item">
                    <div className="info-icon">
                      <Icons.Phone size={16} />
                    </div>
                    <span>{cliente.telefone}</span>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <Icons.MapPin size={16} />
                    </div>
                    <span>{cliente.endereco || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Novo Cliente</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <Icons.X />
              </button>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefone *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Endereço</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Cliente *</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="pf"
                      name="tipo"
                      value="Pessoa Fisica"
                      checked={formData.tipo === 'Pessoa Fisica'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'Pessoa Fisica' })}
                    />
                    <label htmlFor="pf" className="radio-label">
                      <Icons.User size={18} />
                      Pessoa Física
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="pj"
                      name="tipo"
                      value="Pessoa Juridica"
                      checked={formData.tipo === 'Pessoa Juridica'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'Pessoa Juridica' })}
                    />
                    <label htmlFor="pj" className="radio-label">
                      <Icons.Building size={18} />
                      Pessoa Jurídica
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-submit">
                Adicionar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <Icons.CheckCircle /> : <Icons.AlertCircle />}
          {notification.message}
        </div>
      )}
    </div>
  );
}
