import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CreditCard, Lock, DollarSign, Shield } from 'lucide-react';
import { Authorization } from '@/app/types/model';

interface AuthorizationDisplayProps {
  authorization: Authorization;
  title: string;
  variant?: 'default' | 'compact';
}

export function AuthorizationDisplay({ authorization, title, variant = 'default' }: AuthorizationDisplayProps) {
  const formatTransactionLimit = (value: number) => {
    if (value === -1) return "Ilimitado";
    if (value === 0) return "Bloqueado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-gray-50 p-3 rounded-lg border">
        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          {title}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cartão Virtual:</span>
            <Badge variant={authorization.registerVirtualCard ? "default" : "secondary"} className="text-xs">
              {authorization.registerVirtualCard ? "Sim" : "Não"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Senha:</span>
            <Badge variant={authorization.changePassword ? "default" : "secondary"} className="text-xs">
              {authorization.changePassword ? "Sim" : "Não"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">PIX:</span>
            <span className="font-medium text-gray-900 text-xs">{formatTransactionLimit(authorization.pix)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">TED:</span>
            <span className="font-medium text-gray-900 text-xs">{formatTransactionLimit(authorization.ted)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
          <Shield className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Cartão Virtual</span>
            </div>
            <Badge variant={authorization.registerVirtualCard ? "default" : "secondary"}>
              {authorization.registerVirtualCard ? "Permitido" : "Bloqueado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Alterar Senha</span>
            </div>
            <Badge variant={authorization.changePassword ? "default" : "secondary"}>
              {authorization.changePassword ? "Permitido" : "Bloqueado"}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Limites de Transações
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
              <span className="text-sm text-gray-800 font-medium">Empréstimo</span>
              <span className="font-semibold text-gray-900">{formatTransactionLimit(authorization.loan)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
              <span className="text-sm text-gray-800 font-medium">PIX</span>
              <span className="font-semibold text-gray-900">{formatTransactionLimit(authorization.pix)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
              <span className="text-sm text-gray-800 font-medium">TED</span>
              <span className="font-semibold text-gray-900">{formatTransactionLimit(authorization.ted)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
              <span className="text-sm text-gray-800 font-medium">Banksplit</span>
              <span className="font-semibold text-gray-900">{formatTransactionLimit(authorization.banksplit)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}