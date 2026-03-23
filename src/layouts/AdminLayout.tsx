import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import CreateListModal from "../components/contacts/CreateListModal";
import {
  Menu,
  X,
  Plus,
  LogOut,
  LayoutDashboard,
  Users,
  Globe,
} from "lucide-react";

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  const isAdminPage = location.pathname === "/admin";
  const isContactsPage = location.pathname === "/admin/contacts";

  const handlePlusAction = () => {
    if (isAdminPage) navigate("/admin/surveys/new");
    else if (isContactsPage) setIsListModalOpen(true);
    setIsMenuOpen(false);
  };

  const navLinks = [
    {
      to: "/admin",
      label: t("NAV.SURVEY"),
      active: isAdminPage,
      icon: <LayoutDashboard size={20} />,
    },
    {
      to: "/admin/contacts",
      label: t("NAV.CONTACTS"),
      active: isContactsPage,
      icon: <Users size={20} />,
    },
  ];

  const plusButtonText = isAdminPage ? t("SURVEY.NEW") : t("CONTACTS.NEW_LIST");

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f12] text-[#e8e6e1]">
      <header className="m-4 lg:mx-11 p-2 bg-[#1e1e24]/90 backdrop-blur-md border border-white/10 rounded-xl relative z-[100] shadow-xl">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-[#e9c46a] hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            <h2 className="text-[#e9c46a] text-xl font-serif tracking-tight font-bold">
              Survey App
            </h2>

            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    link.active
                      ? "bg-[#e9c46a] text-black shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {(isAdminPage || isContactsPage) && (
              <button
                onClick={handlePlusAction}
                className="bg-[#e9c46a] text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#e9c46a]/10"
              >
                <Plus size={18} strokeWidth={3} />
                <span>{plusButtonText}</span>
              </button>
            )}

            <button
              onClick={logout}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
            >
              <LogOut size={16} />
              {t("AUTH.LOGOUT")}
            </button>
          </div>
        </div>

        {/* --- Burger Menu --- */}
        {isMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="lg:hidden absolute top-[calc(100%+12px)] left-0 w-full max-w-[280px] p-3 bg-[#1e1e24] border border-gray-700/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                      link.active
                        ? "bg-[#e9c46a] text-black font-bold"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={link.active ? "text-black" : "text-gray-500"}
                    >
                      {link.icon}
                    </span>
                    <span className="text-sm uppercase tracking-wide">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-col gap-3">
                {/* Selector Limba integrat curat */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#111114] rounded-xl border border-white/5">
                  <Globe size={16} className="text-gray-500" />
                  <div className="flex-1 scale-90 origin-left">
                    <LanguageSwitcher isMobile />
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 transition-colors rounded-xl text-sm uppercase"
                >
                  <LogOut size={18} />
                  {t("AUTH.LOGOUT")}
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      <main className="flex-1 p-4 lg:p-11">
        <Outlet />
      </main>

      <CreateListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSuccess={() => {
          setIsListModalOpen(false);
          navigate(0);
        }}
      />
    </div>
  );
}
