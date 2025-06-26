"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Wifi } from "lucide-react";
import { SafetyPlace } from "@/app/types/model";

interface SafetyPlaceCardProps {
  safetyPlace: SafetyPlace;
  onClick: () => void;
}

export function SafetyPlaceCard({ safetyPlace, onClick }: SafetyPlaceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasAddress = () => {
    return safetyPlace.address && 
           safetyPlace.address.city && 
           safetyPlace.address.state;
  };

  return (
    <Card 
      className="cursor-pointer bg-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-0 transform hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">
            {safetyPlace.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
          <span>Início: {formatDate(safetyPlace.dataInicio)}</span>
        </div>
        
        {hasAddress() ? (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-green-700" />
            <span className="truncate">
              {safetyPlace.address!.city}, {safetyPlace.address!.state}
            </span>
          </div>
        ) : safetyPlace.wifi ? (
          <div className="flex items-center text-sm text-gray-600">
            <Wifi className="h-4 w-4 mr-2 text-purple-800" />
            <span className="truncate">
              WiFi: {safetyPlace.wifi.ssid}
            </span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Sem informações de localização</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}