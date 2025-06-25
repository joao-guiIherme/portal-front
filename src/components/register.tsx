'use client'

import { useState, useEffect } from 'react'
import { getUserById, Register } from "@/services/api"
import { Loader2, X, UserPlus, Eye, EyeOff } from 'lucide-react'

interface RegisterFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showToast?: (mensagem: string, tipo: 'success' | 'error') => void
}

export default function RegisterForm({ open, onOpenChange, showToast }: RegisterFormModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    username: "",
    password: "",
    role: [] as string[],
    cnpj: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBank, setIsLoadingBank] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchBankName = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setErrors(prev => ({ ...prev, general: 'Token de autenticação não encontrado' }))
        setIsLoadingBank(false)
        return
      }

      try {
        const user = await getUserById(token)
        setFormData(prev => ({
          ...prev,
          companyName: user.companyName || 'Nome do Banco',
          cnpj: user.cnpj || 'CNPJ do Banco'
        }))
        setErrors({})
      } catch (err) {
        console.error("Erro ao buscar nome do banco:", err)
        setErrors(prev => ({ ...prev, general: 'Erro ao carregar as informações do banco' }))
      } finally {
        setIsLoadingBank(false)
      }
    }

    fetchBankName()
  }, [open])

  const handleRoleChange = (value: string) => {
  const rolesArray = value.split(',').map(r => r.trim())
  setFormData(prev => ({ ...prev, role: rolesArray }))
  if (errors.role) {
    setErrors(prev => ({ ...prev, role: '' }))
  }
}

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.username) {
      newErrors.username = 'Nome de usuário é obrigatório'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter ao menos 3 caracteres'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve conter ao menos 6 caracteres'
    }

    if (!formData.role) {
      newErrors.role = 'Selecione uma permissão'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    const token = localStorage.getItem('token')
    if (!token) {
      setErrors({ general: 'Token de autenticação não encontrado' })
      setIsLoading(false)
      return
    }

    try {
    const result = await Register(token, formData);
    console.log("Registration successful:", result);
    showToast?.('Usuário cadastrado com sucesso!', 'success'); 

    setFormData({
        companyName: formData.companyName,
        email: "",
        username: "",
        password: "",
        role: [] as string[],
        cnpj: formData.cnpj
    });
    } catch (err) {
    console.error("Erro no cadastro:", err);
    showToast?.('Erro ao cadastrar usuário', 'error');
    } finally {
    setIsLoading(false);
    }
  }

  const handleClose = () => {
    setFormData({
      companyName: "",
      email: "",
      username: "",
      password: "",
      role: [] as string[],
      cnpj: ""
    })
    setErrors({})
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#026839] to-[#026839]/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Cadastro de Usuário</h2>
                <p className="text-white/80 text-sm">Portal Administrativo</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="p-6">
          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Banco
              </label>
              <input
                type="text"
                value={formData.companyName}
                placeholder={isLoadingBank ? "Carregando..." : "Nome do banco"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                readOnly
                disabled
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#026839] focus:border-[#026839] transition-all ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#026839] focus:border-[#026839] transition-all ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o nome de usuário"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#026839] focus:border-[#026839] transition-all ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite a senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissão
              </label>
              <select
                value={formData.role.join(',')}
                onChange={(e) => handleRoleChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#026839] focus:border-[#026839] transition-all ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Selecione o tipo de permissão</option>
                <option value="ROLE_ADMIN,ROLE_READER">Administrador - Acesso completo ao sistema</option>
                <option value="ROLE_READER">Leitor - Acesso apenas para visualização</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#026839] text-white rounded-lg hover:bg-[#026839]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cadastrando...
                </div>
              ) : (
                'Cadastrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}