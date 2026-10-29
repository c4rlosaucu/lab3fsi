import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Inbox, 
  Package, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Activity, 
  FileBarChart, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Plane
} from 'lucide-react';

export default function Sidebar({ dealsCount = 0 }) {
  const location = useLocation();

  const mainMenuItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads', icon: Users, badge: 'New' },
    { to: '#projects', label: 'Projects', icon: Briefcase, disabled: true },
    { to: '#inbox', label: 'Inbox', icon: Inbox, disabled: true },
    { to: '#products', label: 'Products', icon: Package, disabled: true },
    { to: '#sales', label: 'Sales', icon: TrendingUp, disabled: true },
  ];

  const recordItems = [
    { to: '/', label: 'Deals', icon: Briefcase, badge: dealsCount },
    { to: '/companies', label: 'Companies', icon: Building2 },
    { to: '#peoples', label: 'Peoples', icon: UserCheck, disabled: true },
  ];

  const insightItems = [
    { to: '/activities', label: 'Activities', icon: Activity },
    { to: '/reports', label: 'Reports', icon: FileBarChart },
    { to: '#support', label: 'Support', icon: HelpCircle, disabled: true },
  ];

  const renderLink = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.to;

    if (item.disabled) {
      return (
        <div
          key={item.label}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#4D5365] opacity-50 cursor-not-allowed select-none"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-[#4D5365]" />
            <span>{item.label}</span>
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        className={({ isActive }) =>
          `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 ${
            isActive
              ? 'bg-[#191C26] text-white border border-[#272B38] font-semibold shadow-inner'
              : 'text-[#7A8296] hover:text-white hover:bg-[#14161F]'
          }`
        }
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-coral-400' : 'text-[#626A7E]'}`} />
          <span>{item.label}</span>
        </div>
        {item.badge !== undefined && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2A1815] text-coral-400 border border-coral-500/20">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between p-5 bg-[#0C0D12] border-r border-[#181B23] select-none min-h-screen">
      <div>
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 px-2 py-2 mb-8 block">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coral-500 via-orange-500 to-red-600 flex items-center justify-center text-white shadow-coral-glow">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              AeroCRM
              <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-[#251A18] text-coral-400 border border-coral-500/20">
                Airlines
              </span>
            </h1>
            <p className="text-[11px] text-[#61687B]">Corporate & Cargo</p>
          </div>
        </NavLink>

        {/* Section: MAIN MENU */}
        <div className="mb-6">
          <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#52596C] mb-2.5">
            MAIN MENU
          </p>
          <nav className="space-y-1">
            {mainMenuItems.map(renderLink)}
          </nav>
        </div>

        {/* Section: RECORD */}
        <div className="mb-6">
          <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#52596C] mb-2.5">
            RECORD
          </p>
          <nav className="space-y-1">
            {recordItems.map(renderLink)}
          </nav>
        </div>

        {/* Section: INSIGHT */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#52596C] mb-2.5">
            INSIGHT
          </p>
          <nav className="space-y-1">
            {insightItems.map(renderLink)}
          </nav>
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-[#181B23]">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#7A8296] hover:text-rose-400 hover:bg-[#1A1215] transition-all">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
