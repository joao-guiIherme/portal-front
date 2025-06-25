import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-[#109859] rounded-xl shadow-lg p-6 text-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-100" />
      <span className="text-sm">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

export default InfoCard;