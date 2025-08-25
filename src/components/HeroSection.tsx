import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  isSlideshow: boolean;
  currentSlideshow: number;
  filteredPanoramas: any[];
  onStartSlideshow: () => void;
  onCloseSlideshow: () => void;
}

const HeroSection = ({ 
  isSlideshow, 
  currentSlideshow, 
  filteredPanoramas, 
  onStartSlideshow, 
  onCloseSlideshow 
}: HeroSectionProps) => {
  return (
    <>
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-slate-800 mb-6">
            Погрузитесь в мир 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> 360°</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Исследуйте захватывающие панорамы со всех уголков планеты. 
            Каждый кадр — это путешествие.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" onClick={onStartSlideshow}>
              <Icon name="Play" size={20} className="mr-2" />
              Слайд-шоу
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Icon name="Camera" size={20} className="mr-2" />
              Смотреть все
            </Button>
          </div>
        </div>
      </section>

      {/* Slideshow Modal */}
      {isSlideshow && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl max-h-4xl">
            <img 
              src={filteredPanoramas[currentSlideshow]?.image}
              alt={filteredPanoramas[currentSlideshow]?.title}
              className="w-full h-full object-cover"
            />
            <Button 
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={onCloseSlideshow}
            >
              <Icon name="X" size={20} />
            </Button>
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h3 className="text-2xl font-bold">{filteredPanoramas[currentSlideshow]?.title}</h3>
              <p className="text-lg opacity-80">{filteredPanoramas[currentSlideshow]?.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;