"use client";

import { useState, useEffect } from 'react';
import { SafetyPlaceCard } from '@/components/safety-place-card';
import { SafetyPlaceModal } from '@/components/safety-place-modal';
import { AuthorizationDisplay } from '@/components/authDisplay';
import { SafetyPlace, UserModel, ClientGroup } from '@/app/types/model';
import { fetchSafetyPlaces, findUserId } from '@/services/api';
import { Shield, Users, Loader2 } from 'lucide-react';

function App() {
    const [clientGroups, setClientGroups] = useState<ClientGroup[]>([]);
    const [selectedSafetyPlace, setSelectedSafetyPlace] = useState<SafetyPlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserModel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchClientId, setSearchClientId] = useState('');


    useEffect(() => {
        const loadSafetyPlaces = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const token = localStorage.getItem('token') ?? "";
                const safetyPlacesRaw: any[] = await fetchSafetyPlaces(token);

                const safetyPlaces: SafetyPlace[] = safetyPlacesRaw.map(sp => ({
                ...sp,
                _id: sp._id ?? sp.id, 
                }));

                console.log("Locais recebidos da API:", safetyPlaces);
                
                const clientGroupsMap = new Map<string, ClientGroup>();
                
                for (const safetyPlace of safetyPlaces) {
                    try {
                        const userData = await findUserId(token, safetyPlace._id);
                        const clientId = userData.clientId;
                        
                        if (!clientGroupsMap.has(clientId)) {
                            clientGroupsMap.set(clientId, {
                                clientId,
                                safetyPlaces: [],
                                authorizationOutSafetyPlace: userData.authorizationOutSafetyPlace
                            });
                        }
                        
                        clientGroupsMap.get(clientId)!.safetyPlaces.push(safetyPlace);
                    } catch (err) {
                        console.error(`Error fetching user data for safety place ${safetyPlace._id}:`, err);
                        const unknownClientId = 'unknown';
                        if (!clientGroupsMap.has(unknownClientId)) {
                            clientGroupsMap.set(unknownClientId, {
                                clientId: unknownClientId,
                                safetyPlaces: []
                            });
                        }
                        clientGroupsMap.get(unknownClientId)!.safetyPlaces.push(safetyPlace);
                    }
                }
                
                setClientGroups(Array.from(clientGroupsMap.values()));
            } catch (err) {
                setError('Erro ao carregar os locais seguros. Tente novamente.');
                console.error('Error loading safety places:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadSafetyPlaces();
    }, []);

    const handleCardClick = async (safetyPlace: SafetyPlace) => {
        setSelectedSafetyPlace(safetyPlace);
        setIsModalOpen(true);

        const token = localStorage.getItem('token') || 'demo-token';
        try {
            const userData = await findUserId(token, safetyPlace._id);
            setUser(userData);
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
            setUser(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSafetyPlace(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#109859]" />
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md border border-red-100">
                    <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Shield className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Erro ao carregar dados</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r cursor-pointer from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    const totalSafetyPlaces = clientGroups.reduce((total, group) => total + group.safetyPlaces.length, 0);


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#026839]">LOCAL SEGURO</h1>
                            <p className="text-gray-600 ml-1">Gerencie seus locais seguros</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>{clientGroups.length} Usuários</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4" />
                                <span>{totalSafetyPlaces} Locais Seguros</span>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Buscar por ID do usuário"
                                    className="px-4 py-2 border rounded-xl text-sm w-full sm:w-auto"
                                    value={searchClientId}
                                    onChange={(e) => setSearchClientId(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {clientGroups.length > 0 ? (
                    <div className="space-y-10">
                        {clientGroups
                        .filter(group => group.clientId.includes(searchClientId.trim()))
                        .map((clientGroup, index) => (
                            <div key={clientGroup.clientId} className="group">
                                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-500">
                                    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-8 py-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                                                    <Users className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {clientGroup.clientId === 'unknown' 
                                                            ? 'Usuário Não Identificado' 
                                                            : `Id do Usuário: ${clientGroup.clientId}`}
                                                    </h2>
                                                    <p className="text-green-100 text-lg">
                                                        {clientGroup.safetyPlaces.length} {clientGroup.safetyPlaces.length === 1 ? 'local seguro' : 'locais seguros'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="text-right">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl"></div>
                                    </div>
                                    
                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                            {clientGroup.safetyPlaces.map((safetyPlace) => (
                                                <SafetyPlaceCard
                                                    key={safetyPlace._id}
                                                    safetyPlace={safetyPlace}
                                                    onClick={() => handleCardClick(safetyPlace)}
                                                />
                                            ))}
                                        </div>
                                        
                                        {clientGroup.authorizationOutSafetyPlace && (
                                            <div className="border-t border-gray-200 pt-8">
                                                <AuthorizationDisplay
                                                    authorization={clientGroup.authorizationOutSafetyPlace}
                                                    title="Permissões Fora do Local Seguro"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-12 max-w-md mx-auto border border-white/20">
                            <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                                <Shield className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum local seguro encontrado</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Comece adicionando seus primeiros locais seguros para começar a monitorar e proteger.
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <SafetyPlaceModal
                safetyPlace={selectedSafetyPlace}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default App;