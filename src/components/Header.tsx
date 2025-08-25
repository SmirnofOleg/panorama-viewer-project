import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  showAdmin: boolean;
  onToggleAdmin: () => void;
  onSetShowAdmin: (show: boolean) => void;
}

const Header = ({ showAdmin, onToggleAdmin, onSetShowAdmin }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Camera" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              360° Панорамы
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onSetShowAdmin(false)}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Главная
            </button>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">Галерея</a>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">Категории</a>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">О проекте</a>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">Избранное</a>
            <button 
              onClick={onToggleAdmin}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Settings" size={16} className="mr-2 inline" />
              Админ
            </button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Icon name="Menu" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#" className="text-lg">Главная</a>
                <a href="#" className="text-lg">Галерея</a>
                <a href="#" className="text-lg">Категории</a>
                <a href="#" className="text-lg">О проекте</a>
                <a href="#" className="text-lg">Избранное</a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;