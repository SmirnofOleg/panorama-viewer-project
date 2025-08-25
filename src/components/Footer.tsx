import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Camera" size={24} />
              <span className="text-xl font-bold">360° Панорамы</span>
            </div>
            <p className="text-slate-300">
              Погружайтесь в удивительные миры через технологию панорамной съёмки.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Разделы</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Природа</a>
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Архитектура</a>
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Путешествия</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span className="text-slate-300">info@360panoramas.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span className="text-slate-300">Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 360° Панорамы. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;