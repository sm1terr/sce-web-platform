import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserPlus, FileText, Archive, Info, Home, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = getCurrentUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sce-header">
        <div className="flex items-center space-x-4">
          <Link to="/" className="sce-logo">
            SCE Foundation
          </Link>
          <span className="hidden md:inline text-sm text-gray-300">Secure. Control. Explore.</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex sce-nav">
          <Link to="/" className="sce-nav-link">
            Главная
          </Link>
          <Link to="/objects" className="sce-nav-link">
            Объекты SCE
          </Link>
          <Link to="/posts" className="sce-nav-link">
            Публикации
          </Link>
          <Link to="/about" className="sce-nav-link">
            О нас
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  {user.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">Профиль</Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full">Панель управления</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="w-full">Выйти</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="sce-nav-link">
                Вход
              </Link>
              <Link to="/register" className="sce-nav-link">
                Регистрация
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-sce-secondary p-4 flex flex-col space-y-3">
          <Link to="/" className="sce-nav-link flex items-center" onClick={toggleMenu}>
            <Home size={18} className="mr-2" /> Главная
          </Link>
          <Link to="/objects" className="sce-nav-link flex items-center" onClick={toggleMenu}>
            <Archive size={18} className="mr-2" /> Объекты SCE
          </Link>
          <Link to="/posts" className="sce-nav-link flex items-center" onClick={toggleMenu}>
            <FileText size={18} className="mr-2" /> Публикации
          </Link>
          <Link to="/about" className="sce-nav-link flex items-center" onClick={toggleMenu}>
            <Info size={18} className="mr-2" /> О нас
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                <User size={18} className="mr-2" /> Профиль
              </Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                  <User size={18} className="mr-2" /> Панель управления
                </Link>
              )}
              <Link to="/logout" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                <User size={18} className="mr-2" /> Выйти
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                <User size={18} className="mr-2" /> Вход
              </Link>
              <Link to="/register" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                <UserPlus size={18} className="mr-2" /> Регистрация
              </Link>
            </>
          )}
        </nav>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className="sce-footer">
        <div className="sce-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-2">SCE Foundation</h3>
              <p className="text-sm">Secure. Control. Explore.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Ссылки</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/objects" className="hover:underline">Объекты SCE</Link></li>
                <li><Link to="/posts" className="hover:underline">Публикации</Link></li>
                <li><Link to="/about" className="hover:underline">О нас</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Правовая информация</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/privacy" className="hover:underline">Политика конфиденциальности</Link></li>
                <li><Link to="/terms" className="hover:underline">Условия использования</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-center">
            &copy; {new Date().getFullYear()} SCE Foundation. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
