import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import PanoramaCard from '@/components/PanoramaCard';
import Footer from '@/components/Footer';
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
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

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

  const closeSlideshow = () => {
    setIsSlideshow(false);
  };

  const handleToggleAdmin = () => {
    setShowAdmin(!showAdmin);
  };

  const handleSetShowAdmin = (show: boolean) => {
    setShowAdmin(show);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        showAdmin={showAdmin}
        onToggleAdmin={handleToggleAdmin}
        onSetShowAdmin={handleSetShowAdmin}
      />

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
          <HeroSection
            isSlideshow={isSlideshow}
            currentSlideshow={currentSlideshow}
            filteredPanoramas={filteredPanoramas}
            onStartSlideshow={startSlideshow}
            onCloseSlideshow={closeSlideshow}
          />

          <CategoriesSection
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Panorama Gallery */}
          <section className="px-6 pb-16">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPanoramas.map((panorama) => (
                  <PanoramaCard
                    key={panorama.id}
                    panorama={panorama}
                    filteredPanoramas={filteredPanoramas}
                    likes={likes}
                    likesCounts={likesCounts}
                    comments={comments}
                    newComment={newComment}
                    currentModalIndex={currentModalIndex}
                    onToggleLike={toggleLike}
                    onSelectPanorama={setSelectedPanorama}
                    onModalIndexChange={setCurrentModalIndex}
                    onCommentChange={setNewComment}
                    onAddComment={addComment}
                  />
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;