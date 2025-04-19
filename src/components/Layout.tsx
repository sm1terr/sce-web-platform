import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "@/lib/api";
import { ClearanceLevel, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, FileText, Archive, Info, Home, Menu, X, Shield, Settings, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = getCurrentUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Получить строку с уровнем доступа
  const getClearanceString = (level?: ClearanceLevel) => {
    if (!level) return "Уровень 1";
    
    const levelMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "Уровень 1",
      [ClearanceLevel.LEVEL_2]: "Уровень 2",
      [ClearanceLevel.LEVEL_3]: "Уровень 3",
      [ClearanceLevel.LEVEL_4]: "Уровень 4",
      [ClearanceLevel.LEVEL_5]: "Уровень 5"
    };
    
    return levelMap[level];
  };

  // Получить цвет для бейджа уровня доступа
  const getClearanceColor = (level?: ClearanceLevel) => {
    if (!level) return "bg-green-600";
    
    const colorMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "bg-green-600",
      [ClearanceLevel.LEVEL_2]: "bg-blue-600",
      [ClearanceLevel.LEVEL_3]: "bg-orange-600",
      [ClearanceLevel.LEVEL_4]: "bg-red-600",
      [ClearanceLevel.LEVEL_5]: "bg-black"
    };
    
    return colorMap[level];
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleName = (role: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: "Администратор",
      [UserRole.RESEARCHER]: "Исследователь",
      [UserRole.SECURITY]: "Сотрудник СБ",
      [UserRole.EXPLORER]: "Исследователь Аномалий",
      [UserRole.READER]: "Читатель"
    };
    
    return roleMap[role];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sce-header">
        <div className="flex items-center space-x-4">
          <Link to="/" className="sce-logo">
            SCE Foundation
          </Link>
          <div className="hidden md:flex items-center">
            <Badge variant="outline" className="text-sce-textAlt border-sce-textAlt font-mono">
              Secure. Control. Explore.
            </Badge>
          </div>
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
                <Button variant="ghost" className="text-sce-textAlt p-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-sce-secondary text-sce-textAlt">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.username}</span>
                      <Badge 
                        className={`${getClearanceColor(user.clearanceLevel)} text-white text-xs py-0 px-1`}
                      >
                        {getClearanceString(user.clearanceLevel)}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="font-normal text-xs text-muted-foreground">
                    {user.role && getRoleName(user.role)}
                    {user.position && <> • {user.position}</>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === UserRole.ADMIN && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Панель управления</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="w-full cursor-pointer text-sce-error">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </Link>
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
        <button className="md:hidden text-sce-textAlt" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-sce-secondary p-4 flex flex-col space-y-3">
          {user && (
            <div className="p-3 bg-sce-tertiary rounded flex items-center space-x-3 mb-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-sce-primary text-sce-textAlt">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sce-textAlt font-medium">{user.username}</div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`${getClearanceColor(user.clearanceLevel)} text-white text-xs`}
                  >
                    {getClearanceString(user.clearanceLevel)}
                  </Badge>
                  <span className="text-xs text-gray-300">
                    {user.role && getRoleName(user.role)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
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
              <div className="border-t border-gray-700 my-2 pt-2"></div>
              <Link to="/profile" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                <User size={18} className="mr-2" /> Профиль
              </Link>
              {user.role === UserRole.ADMIN && (
                <Link to="/admin" className="sce-nav-link flex items-center" onClick={toggleMenu}>
                  <Shield size={18} className="mr-2" /> Панель управления
                </Link>
              )}
              <Link to="/logout" className="sce-nav-link flex items-center text-red-400" onClick={toggleMenu}>
                <LogOut size={18} className="mr-2" /> Выйти
              </Link>
            </>
          ) : (
            <>
              <div className="border-t border-gray-700 my-2 pt-2"></div>
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

      <main className="flex-grow bg-sce-background">
        {children}
      </main>

      <footer className="sce-footer">
        <div className="sce-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 font-mono">SCE Foundation</h3>
              <p className="text-sm mb-2">Фонд SCE специализируется на сдерживании, контроле и изучении аномальных объектов для защиты человечества.</p>
              <div className="mt-4">
                <Badge variant="outline" className="font-mono text-sce-textAlt border-sce-textAlt">
                  Secure. Control. Explore.
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Навигация по сайту</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:underline text-sce-textAlt">Главная</Link></li>
                <li><Link to="/objects" className="hover:underline text-sce-textAlt">Объекты SCE</Link></li>
                <li><Link to="/posts" className="hover:underline text-sce-textAlt">Публикации</Link></li>
                <li><Link to="/about" className="hover:underline text-sce-textAlt">О Фонде</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Дополнительная информация</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:underline text-sce-textAlt">Политика конфиденциальности</Link></li>
                <li><Link to="/terms" className="hover:underline text-sce-textAlt">Условия использования</Link></li>
                {!user && (
                  <>
                    <li><Link to="/login" className="hover:underline text-sce-textAlt">Вход</Link></li>
                    <li><Link to="/register" className="hover:underline text-sce-textAlt">Регистрация</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} SCE Foundation. Все права защищены.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Доступ к определенным материалам на этом сайте ограничен и требует соответствующего уровня допуска.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
