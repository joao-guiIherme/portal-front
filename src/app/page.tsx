'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, MapPin, Wifi, Navigation, BarChart3 } from 'lucide-react';
import DashboardCard from "@/components/dashboard-card";
import InfoCard, { InfoItem } from "@/components/info-card";
import MapSection from "@/components/map-section";
import { fetchSafetyPlaces, fetchUser } from "@/services/api"; 
import Charts from "@/components/pie-chart";
import { SafetyPlace } from './types/model';


function Home() {
  const [safetyPlaces, setSafetyPlaces] = useState<SafetyPlace[]>([]);
  const [user, setUser] = useState([]);
  const wifiCount = safetyPlaces.filter(place => place.wifi).length;
  const geoCount = safetyPlaces.filter(place => place.location).length;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      console.log(token);
    }
    console.log('Token:', localStorage.getItem('token'));

    const fetchData = async () => {
      try {
        // Obtenha o token JWT do armazenamento local ou do contexto de autenticação
        const token = localStorage.getItem('token');
        // Buscar locais seguros
        const places = await fetchSafetyPlaces(token ?? "");
        setSafetyPlaces(places);
        const user = await fetchUser(token ?? "");
        setUser(user)
       
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);
  

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-[#026839]">
            PORTAL LOCAL SEGURO
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cards verdes */}
          <div className="lg:col-span-1 space-y-7">
            <InfoCard title="INFORMAÇÕES GERAIS">
              <InfoItem
                icon={Users}
                label="Usuários Ativos:"
                value={user.length.toString()}
              />
              <InfoItem
                icon={MapPin}
                label="Locais Seguros:"
                value={safetyPlaces.length.toString()}
              />
            </InfoCard>

            <InfoCard title="TIPOS DE CADASTRO">
              <InfoItem
                icon={Wifi}
                label="Wi-fi"
                value=""
              />
              <InfoItem
                icon={Navigation}
                label="Geolocalização"
                value=""
              />
            </InfoCard>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 gap-6 lg:col-span-1">
            <DashboardCard
              title="Cadastros WiFi"
              value={wifiCount.toString()}
              icon={Wifi}
              description="No total"
            />
            <DashboardCard
              title="Cadastros Geo"
              value={geoCount.toString()}
              icon={Navigation}
              description="No total"
            />
          </div>
          
          {/* Coluna para o gráfico (direita) - ocupa 2 colunas em lg */}
          <div className="lg:col-span-1">
            {Charts(wifiCount, geoCount)}
          </div>
          
          
        </div>
        
        {/* Map Section */}
        <MapSection />
      </main>
    </div>
  );
}
export default Home;