'use client'
import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'


// const autorizacoesData = [
//   { tipo: 'PIX', locais: 1 },
//   { tipo: 'TED', locais: 3 },
//   { tipo: 'Banksplit', locais: 2 },
//   { tipo: 'Alterar Senha', locais: 0 },
// ]

const cores = ['#10B981', '#3B82F6']

export default function DashboardCards(wifiCount: number, geoWifi: number) {
  const cadastroData = [
  { name: 'Wi-Fi', value: wifiCount },
  { name: 'Geolocalização', value: geoWifi },
]
  return (
    <div className="w-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Cadastro por Tipo */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cadastros por Tipo</h2>
        <ResponsiveContainer width="100%" height={232}>
          <PieChart>
            <Pie data={cadastroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {cadastroData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Autorizações Permitidas */}
      {/* <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Autorizações Permitidas</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={autorizacoesData}>
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="locais" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Destaque do Dia */}
      {/* <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-2">🔒 Local Destaque</h2>
        <p className="text-sm text-gray-600 mb-1">1600 Amphitheatre Pkwy</p>
        <p className="text-sm text-gray-600">Autorizado: TED, Banksplit</p>
      </div> */}
    </div>
  )
}
