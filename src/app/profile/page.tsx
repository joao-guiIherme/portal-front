"use client"
import React, { useEffect, useState } from 'react';
import { Edit2, Key, UserPlus, LogOut, Save, Loader2 } from 'lucide-react';
import { getUserById, updateUser, validateToken, UserUpdateRequest } from '@/services/api';
import { Toast } from '@/components/toast';
import { PasswordModal } from '@/components/PasswordModal';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/register';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

type Role = {
  id: string | null;
  name: string;
};

type UserData = {
  id: string;
  password: string;
  email: string;
  username: string;
  companyName: string;
  cnpj: string;
  roles: Role[];
};

function App() {
  const router = useRouter();
  // Gerenciamento de estados
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('Carregando...');
  const [newUsername, setNewUsername] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);


  // Carregar o perfil do usuário ao montar o componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = validateToken();
        if (!token) {
          showToast('Parece que tivemos um erro validando sua conta, tente sair e logar novamente!', 'error');
          return;
        }

        const userData = await getUserById(token);
        setUserData(userData);
        setUsername(userData.username);
        setNewUsername(userData.username);

      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showToast('Erro ao carregar o perfil. Tente novamente!', 'error');
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Funções utility
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Manuseio de username
  const handleUsernameChange = (value: string) => {
    setNewUsername(value);
    setHasChanges(value !== username);
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      showToast('O nome do usuário não pode ser vazio', 'error');
      return;
    }

    if (newUsername === username) {
      setHasChanges(false);
      setIsEditingUsername(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = validateToken();
      if (!token) {
        showToast('Autenticação é requerida', 'error');
        return;
      }

      const updateData: UserUpdateRequest = { username: newUsername };
      await updateUser(token, updateData);
      
      setUsername(newUsername);
      setHasChanges(false);
      setIsEditingUsername(false);
      showToast('Nome de usuário atualizado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Falha ao atulziar nome de usuário:', error);
      showToast(error.message || 'Falha ao atulziar nome de usuário', 'error');
      setNewUsername(username); // Reseta ao original
    } finally {
      setIsLoading(false);
    }
  };

  // Manuseio de senha
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordUpdate = async (newPassword: string) => {
    try {
      const token = validateToken();
      if (!token) {
        showToast('Autenticação é requerida', 'error');
        return;
      }

      const updateData: UserUpdateRequest = { password: newPassword };
      await updateUser(token, updateData);
      showToast('Senha atualizada com sucesso!', 'success');
    } catch (error: any) {
      console.error('Falha ao atualizar senha:', error);
      showToast(error.message || 'Falha ao atualizar senha', 'error');
      throw error; // Relançar o erro para que o modal possa tratá-lo
    }
  };

  // Cadastro de usuário
  const handleRegisterNewUser = () => {
    const isAdmin = userData?.roles?.some((role) => role.name === 'ROLE_ADMIN');

    if (!isAdmin) {
      showToast('Apenas administradores podem registrar novos usuários', 'error');
      return;
    }

    setIsRegisterModalOpen(true);
  };


  // Manuseio de logOut
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('token');
      showToast('Saiu com sucesso', 'success');
      // Redirecionar para a página de login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

  // Configuração Menu
  const menuItems = [
    {
      icon: Key,
      label: 'Mudar senha',
      action: handleChangePassword,
      description: 'Atualize a senha de sua conta'
    },
    {
      icon: UserPlus,
      label: 'Registrar Novo Usuário',
      action: handleRegisterNewUser,
      description: 'Adicione um novo usuário ao sistema'
    },
    {
      icon: LogOut,
      label: 'SAIR',
      action: handleLogout,
      description: 'Finalizar sua sessão atual',
      isLogout: true
    }
  ];

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#109859]" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-[#026839]">
            PERFIL
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center items-start justify-center mt-12">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl shadow-xl overflow-hidden bg-white">
            {/* Profile Header Section */}
            <div className="p-8 bg-gradient-to-br from-[#109859] to-[#109859]/90">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-1">Perfil de Usuário</h2>
                <p className="text-white/80">Gerencie suas informações pessoais</p>
              </div>

              {/* Username Section */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditingUsername ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          className="flex-1 px-4 py-3 border border-[#109859]/25 rounded-lg focus:ring-2 focus:ring-[#109859] focus:border-[#109859] transition-all duration-200 bg-white"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                          disabled={isLoading}
                          placeholder="Enter username"
                        />
                        <button
                          onClick={handleSaveUsername}
                          disabled={isLoading}
                          className="px-4 py-2 cursor-pointer text-sm rounded-lg text-white bg-[#109859] hover:bg-[#109859]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Salvar'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingUsername(false);
                            setNewUsername(username);
                            setHasChanges(false);
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 cursor-pointer text-sm rounded-lg text-[#109859] hover:bg-[#109859]/10 transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-[#109859]">{username}</h3>
                        <button
                          onClick={() => setIsEditingUsername(true)}
                          className="p-2 cursor-pointer rounded-lg transition-colors duration-200 group text-[#109859] hover:bg-[#109859]/10"
                        >
                          <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-9">
              <div className="space-y-7">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full cursor-pointer flex items-center gap-4 p-8 rounded-xl transition-all duration-200 group border-2 h-25 ${
                      item.isLogout
                        ? 'hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300'
                        : 'hover:text-[#109859] text-gray-700 border-gray-200 hover:border-[#109859]/25 hover:bg-[#109859]/5'
                    }`}
                  >
                    <div className={`p-4 rounded-xl transition-colors duration-200 ${
                      item.isLogout
                        ? 'bg-red-100 group-hover:bg-red-200'
                        : 'bg-gray-100 group-hover:bg-[#109859]/10'
                    }`}>
                      <item.icon className={`w-6 h-6 transition-colors duration-200 ${
                        item.isLogout ? 'text-red-600' : 'text-gray-600 group-hover:text-[#109859]'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-lg mb-1">{item.label}</h4>
                      <p className="text-sm opacity-70">{item.description}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      item.isLogout ? 'bg-red-300' : 'bg-gray-300 group-hover:bg-[#109859]'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (aparece quando há mudanças não salvas) */}
      {hasChanges && !isEditingUsername && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleSaveUsername}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-4 bg-[#109859] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-[#109859]/90 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordUpdate}
        isLoading={isLoading}
      />
      {/* Register Modal */}
      <RegisterForm
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen} 
        showToast={showToast}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default App;