import React from 'react';
import { BarChart3, FileText, Home, Menu, X } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const navigation = [
  { name: 'Dashboard', icon: Home, id: 'home' },
  { name: 'Generate Quiz', icon: FileText, id: 'generate' },
  { name: 'View Results', icon: BarChart3, id: 'results' }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activePage, 
  setActivePage 
}) => {
  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
      <div className="flex h-16 items-center justify-between px-4">
        {isSidebarOpen && <h1 className="text-xl font-bold">Quiz Admin</h1>}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors
              ${activePage === item.id ? 'bg-blue-50 text-blue-700' : ''}`}
          >
            <item.icon size={20} className="mr-4" />
            {isSidebarOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};