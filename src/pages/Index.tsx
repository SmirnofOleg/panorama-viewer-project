import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import PanoramaViewer from '@/components/PanoramaViewer';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [selectedPanorama, setSelectedPanorama] = useState<any>(null);
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [newComment, setNewComment] = useState('');
  const [currentSlideshow, setCurrentSlideshow] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<number, number>>({});

  const [panoramas, setPanoramas] = useState([
    {
      id: 1,
      title: "Горные вершины",
      category: "Природа",
      image: "/img/fc339de0-fed1-451c-b1b8-6246250018a7.jpg",
      description: "Захватывающий вид на заснеженные горные пики",
      tags: ["горы", "снег", "пейзаж"],
      likes: 42,
      views: 156,
      uploadDate: "2024-08-20",
      status: 'published' as const
    },
    {
      id: 2, 
      title: "Городской закат",
      category: "Архитектура",
      image: "/img/f4d5d75a-0cec-4536-8747-d88e9470b27a.jpg", 
      description: "Современный мегаполис в золотых лучах заката",
      tags: ["город", "закат", "небоскрёбы"],
      likes: 38,
      views: 203,
      uploadDate: "2024-08-22",
      status: 'published' as const
    },
    {
      id: 3,
      title: "Тропический рай", 
      category: "Природа",
      image: "/img/e882a710-f2ee-4495-9e24-37e7136a7f62.jpg",
      description: "Кристально чистые воды и белоснежный песок",
      tags: ["пляж", "океан", "тропики"],
      likes: 67,
      views: 289,
      uploadDate: "2024-08-25",
      status: 'published' as const
    }
  ]);

  // Initialize likes counts
  useState(() => {
    const initialLikes: Record<number, number> = {};
    panoramas.forEach(p => {
      initialLikes[p.id] = p.likes;
    });
    setLikesCounts(initialLikes);
  });

  const categories = ["Все", "Природа", "Архитектура", "Путешествия"];
  const [activeCategory, setActiveCategory] = useState("Все");

  const filteredPanoramas = activeCategory === "Все" 
    ? panoramas 
    : panoramas.filter(p => p.category === activeCategory);

  const addComment = (panoramaId: number) => {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [panoramaId]: [...(prev[panoramaId] || []), newComment]
    }));
    setNewComment('');
  };

  const toggleLike = (panoramaId: number) => {
    const isLiked = likes[panoramaId] || false;
    setLikes(prev => ({ ...prev, [panoramaId]: !isLiked }));
    setLikesCounts(prev => ({
      ...prev,
      [panoramaId]: prev[panoramaId] + (isLiked ? -1 : 1)
    }));
  };

  const handleAddPanorama = (newPanorama: any) => {
    const panorama = {
      ...newPanorama,
      id: Date.now(),
      likes: 0,
      views: 0,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setPanoramas(prev => [...prev, panorama]);
    setLikesCounts(prev => ({ ...prev, [panorama.id]: 0 }));
  };

  const handleEditPanorama = (id: number, updates: any) => {
    setPanoramas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePanorama = (id: number) => {
    setPanoramas(prev => prev.filter(p => p.id !== id));
    setLikes(prev => { const newLikes = { ...prev }; delete newLikes[id]; return newLikes; });
    setLikesCounts(prev => { const newCounts = { ...prev }; delete newCounts[id]; return newCounts; });
  };

  const startSlideshow = () => {
    setIsSlideshow(true);
    setCurrentSlideshow(0);
    const interval = setInterval(() => {
      setCurrentSlideshow(prev => {
        const next = prev + 1;
        if (next >= filteredPanoramas.length) {
          clearInterval(interval);
          setIsSlideshow(false);
          return 0;
        }
        return next;
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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
                onClick={() => setShowAdmin(false)}
                className="text-slate-600 hover:text-primary transition-colors"
              >
                Главная
              </button>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Галерея</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Категории</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">О проекте</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Избранное</a>
              <button 
                onClick={() => setShowAdmin(!showAdmin)}
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

      {showAdmin ? (
        <div className="container mx-auto px-6 py-8">
          <AdminPanel 
            panoramas={panoramas}
            onAddPanorama={handleAddPanorama}
            onEditPanorama={handleEditPanorama}
            onDeletePanorama={handleDeletePanorama}
          />
        </div>
      ) : (
        <>
        {/* Hero Section */}
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
              <Button size="lg" className="px-8" onClick={startSlideshow}>
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
              <PanoramaViewer 
                imageUrl={filteredPanoramas[currentSlideshow]?.image}
                className="w-full h-full"
              />
              <Button 
                variant="secondary"
                className="absolute top-4 right-4 z-10"
                onClick={() => setIsSlideshow(false)}
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

        {/* Categories */}
        <section className="px-6 mb-12">
          <div className="container mx-auto">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Panorama Gallery */}
        <section className="px-6 pb-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPanoramas.map((panorama) => (
                <Card key={panorama.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={panorama.image}
                      alt={panorama.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-slate-800">
                        {panorama.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/90 hover:bg-white"
                        onClick={() => toggleLike(panorama.id)}
                      >
                        <Icon 
                          name="Heart" 
                          size={16} 
                          className={likes[panorama.id] ? 'text-red-500 fill-current' : ''}
                        />
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="absolute inset-0 w-full h-full bg-transparent hover:bg-transparent border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => setSelectedPanorama(panorama)}
                        >
                          <Icon name="Maximize" size={32} className="text-white" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                        <div className="relative">
                          <div className="w-full h-[60vh] relative">
                            <PanoramaViewer 
                              imageUrl={panorama.image}
                              className="absolute inset-0"
                            />
                            <div className="absolute top-4 right-4 z-10">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleLike(panorama.id)}
                                className="bg-white/80 hover:bg-white"
                              >
                                <Icon 
                                  name="Heart" 
                                  size={16} 
                                  className={likes[panorama.id] ? 'text-red-500 fill-current' : ''}
                                />
                                <span className="ml-1">{likesCounts[panorama.id] || panorama.likes}</span>
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{panorama.title}</h3>
                            <p className="text-slate-600 mb-4">{panorama.description}</p>
                            
                            <div className="flex gap-2 mb-6">
                              {panorama.tags.map(tag => (
                                <Badge key={tag} variant="outline">#{tag}</Badge>
                              ))}
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-3">Комментарии</h4>
                              <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                                {(comments[panorama.id] || []).map((comment, idx) => (
                                  <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm">
                                    {comment}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Textarea 
                                  placeholder="Оставьте комментарий..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="flex-1 min-h-[40px] max-h-[80px]"
                                />
                                <Button onClick={() => addComment(panorama.id)}>
                                  <Icon name="Send" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {panorama.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{panorama.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {panorama.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Icon name="Heart" size={14} className="text-red-500" />
                          <span>{likesCounts[panorama.id] || panorama.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Eye" size={14} />
                          <span>{panorama.views}</span>
                        </div>
                        <span className="text-primary font-medium">360°</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
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
        </>
      )}
    </div>
  );
};

export default Index;