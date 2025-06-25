"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Wifi,
  Shield,
  CreditCard,
  Lock,
  User,
} from "lucide-react";
import { SafetyPlace, UserModel } from "@/app/types/model";

interface SafetyPlaceModalProps {
  safetyPlace: SafetyPlace | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyPlaceModal({ safetyPlace, isOpen, onClose }: SafetyPlaceModalProps) {
  if (!safetyPlace) return null;

  const formatTransactionLimit = (value: number | undefined) => {
    if (value === undefined) return "Não disponível";
    if (value === -1) return "Sem limites";
    if (value === 0) return "Não permitido";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getFullAddress = () => {
    if (!safetyPlace.address) return "Endereço não disponível";
    
    const { street, number, neighborhood, city, state, postalCode, country } = safetyPlace.address;
    return `${street}${number ? `, ${number}` : ''} - ${neighborhood}, ${city}/${state}, ${postalCode} - ${country}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <div className="bg-white p-6 rounded-lg">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {safetyPlace.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            <Separator className="bg-gray-200" />

            {/* Endereço */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-lg text-gray-900">Endereço</h3>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-gray-800">{getFullAddress()}</p>
                {safetyPlace.location && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <p className="text-xs text-gray-700">
                      <strong className="text-gray-900">Coordenadas GPS:</strong> {safetyPlace.location.lat}, {safetyPlace.location.lng}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-lg text-gray-900">Informações de WiFi</h3>
              </div>
              {safetyPlace.wifi ? (
                <div className="bg-green-50 p-4 rounded-lg space-y-2 border border-green-100">
                  <p className="text-sm text-gray-800">
                    <strong className="text-gray-900">SSID:</strong> {safetyPlace.wifi.ssid}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-gray-900">BSSID:</strong> {safetyPlace.wifi.bssid}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-gray-900">Segurança:</strong> 
                    <Badge variant="outline" className="ml-2 bg-white border-green-300 text-green-800">
                      {safetyPlace.wifi.security}
                    </Badge>
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Nenhuma informação de WiFi disponível</p>
                </div>
              )}
            </div>

            <Separator className="bg-gray-200" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-lg text-gray-900">Autorizações de Segurança</h3>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg space-y-4 border border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Cartão Virtual</span>
                    </div>
                    <Badge variant={safetyPlace.authorizationInSafetyPlace?.registerVirtualCard ? "default" : "secondary"}>
                      {safetyPlace.authorizationInSafetyPlace?.registerVirtualCard ? "Permitido" : "Bloqueado"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Alterar Senha</span>
                    </div>
                    <Badge variant={safetyPlace.authorizationInSafetyPlace?.changePassword ? "default" : "secondary"}>
                      {safetyPlace.authorizationInSafetyPlace?.changePassword ? "Permitido" : "Bloqueado"}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-purple-200" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-purple-900">Limites de Transações</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                      <span className="text-sm text-gray-800 font-medium">Empréstimo</span>
                      <span className="font-semibold text-gray-900">{formatTransactionLimit(safetyPlace.authorizationInSafetyPlace?.loan)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                      <span className="text-sm text-gray-800 font-medium">PIX</span>
                      <span className="font-semibold text-gray-900">{formatTransactionLimit(safetyPlace.authorizationInSafetyPlace?.pix)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                      <span className="text-sm text-gray-800 font-medium">TED</span>
                      <span className="font-semibold text-gray-900">{formatTransactionLimit(safetyPlace.authorizationInSafetyPlace?.ted)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                      <span className="text-sm text-gray-800 font-medium">Banksplit</span>
                      <span className="font-semibold text-gray-900">{formatTransactionLimit(safetyPlace.authorizationInSafetyPlace?.banksplit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}