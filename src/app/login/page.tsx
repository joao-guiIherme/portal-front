'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { Login } from '@/services/api'; 

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await Login(formData); // Usa o importado Login()

      localStorage.setItem('token', data.token);

      // Redireciona para o app
      router.push('/');
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 relative overflow-hidden flex items-center justify-center">
      {}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full -translate-x-48 -translate-y-48 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400 rounded-full translate-x-40 translate-y-40 opacity-15"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-600 rounded-full -translate-x-32 -translate-y-32 opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-300 rounded-full opacity-15"></div>

      {}
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md relative z-10 border border-emerald-100">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-emerald-600 mr-2" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">
            LOCAL<br />SEGURO
          </h1>
          <p className="text-gray-500 text-sm">Portal Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-emerald-700 font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2 h-12 border-emerald-200 rounded-xl bg-gray-50"
              required
            />
          </div>

          <div>
            <Label htmlFor="senha" className="text-emerald-700 font-medium text-sm">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={(e) => handleInputChange('senha', e.target.value)}
              className="mt-2 h-12 border-emerald-200 rounded-xl bg-gray-50"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl"
          >
            ENTRAR
          </Button>

          {erro && <p className="text-red-600 text-center text-sm">{erro}</p>}          
        </form>
      </div>
    </div>
  );
}
