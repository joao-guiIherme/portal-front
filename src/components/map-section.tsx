'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { searchCoordinate } from '@/services/map';
import { fetchSafetyPlaces, fetchUser } from '@/services/api'; 
import type { SafetyPlace, UserModel } from '@/app/types/model';

const MAPBOX_TOKEN = "pk.eyJ1IjoiamdhbHZlczA0IiwiYSI6ImNtYzNweTI0eDA3ZGgya29pazA1dTRqaDUifQ.cgTmHxlFfRtlCDurPEAfKQ";

const MapSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Aracaju');
  const [viewport, setViewport] = useState({
    latitude: -10.9432,
    longitude: -37.0731,
    zoom: 10,
  });
  const [safetyPlaces, setSafetyPlaces] = useState<SafetyPlace[]>([]); 
  const [users, setUsers] = useState<UserModel[]>([]);  
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    
    if (!token) return;

    const loadSafetyPlacesAndUsers = async () => {
      try {
        const local = await fetchSafetyPlaces(token);
        setSafetyPlaces(local);
      } catch (error) {
        console.error('Erro ao buscar locais seguros:', error);
      }
      try {
        const users = await fetchUser(token);
        setUsers(users);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    loadSafetyPlacesAndUsers();
  }, [token]);

  function Distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const localLocation = safetyPlaces.filter(local => {
    const lat = local.location?.lat;
    const lng = local.location?.lng;
    if (typeof lat === 'number' && typeof lng === 'number') {
      const distance = Distance(viewport.latitude, viewport.longitude, lat, lng);
      return distance <= 20;
    }
    return false;
  });

  const qntLocal = localLocation.length;

  const usersLocation = users.filter(user =>
    Array.isArray(user.safetyPlaces) &&
    user.safetyPlaces.some(place => {
      const lat = place.location?.lat;
      const lng = place.location?.lng;
      if (typeof lat === 'number' && typeof lng === 'number') {
        const distance = Distance(viewport.latitude, viewport.longitude, lat, lng);
        return distance <= 20;
      }
      return false;
    })
  );

  const qntUser = usersLocation.length;


  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">
          CADASTROS POR GEOLOCALIZAÇÃO
        </h3>
        <div className="relative max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={async (e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (value.length > 3) {
                const coords = await searchCoordinate(value);
                if (coords) {
                  setViewport(prev => ({
                    ...prev,
                    latitude: coords.lat,
                    longitude: coords.lng,
                  }));
                }
              }
            }}
            placeholder="Buscar cidade..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#48b281] focus:border-transparent transition-colors"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-80 rounded-lg overflow-hidden">
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              latitude={viewport.latitude}
              longitude={viewport.longitude}
              zoom={viewport.zoom}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              style={{ width: '100%', height: '100%' }}
            >
              <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                <div className="bg-[#48b281] w-6 h-6 rounded-full border-4 border-white shadow-lg animate-bounce relative">
                  <MapPin className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                </div>
              </Marker>

              {safetyPlaces
                .filter(local => typeof local.location?.lat === 'number' && typeof local.location?.lng === 'number')
                .map((local, index) => (
                  <Marker
                    key={index}
                    latitude={local.location!.lat}
                    longitude={local.location!.lng}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded shadow-md mb-1">
                        Local Seguro
                      </span>
                      <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-md" />
                    </div>
                  </Marker>
                ))}
            </Map>
          </div>
        </div>

        <div className="space-y-8 mt-5">
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl bg-[#109859] transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-100 mb-1">Locais Seguros</p>
                <p className="text-s font-bold text-gray-100">{qntLocal}</p>
                <p className="text-xs text-gray-100 mt-1">Cadastrados na Região</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl bg-white transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Usuários Ativos</p>
                <p className="text-s font-bold text-gray-900">{qntUser}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapSection;