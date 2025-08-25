import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  showAdmin: boolean;
  onToggleAdmin: () => void;
  onSetShowAdmin: (show: boolean) => void;
}

const Header = ({ showAdmin, onToggleAdmin }: HeaderProps) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icon name="Camera" size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">360° Панорамы</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              Галерея
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              О проекте
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              Контакты
            </a>
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAdmin}
            className="text-slate-600"
          >
            <Icon name="Settings" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;