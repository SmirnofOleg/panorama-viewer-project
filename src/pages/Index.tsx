import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import LazyPanoramaCard from '@/components/LazyPanoramaCard';
import Pagination from '@/components/Pagination';
import Footer from '@/components/Footer';
import AdvancedAdminPanel from '@/components/AdvancedAdminPanel';

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

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
      rating: 4.5,
      totalRatings: 23,
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
      rating: 4.2,
      totalRatings: 18,
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
      rating: 4.8,
      totalRatings: 31,
      uploadDate: "2024-08-25",
      status: 'published' as const
    },
    {
      id: 4,
      title: "Северное сияние", 
      category: "Природа",
      image: "/img/fc339de0-fed1-451c-b1b8-6246250018a7.jpg",
      description: "Магическое свечение полярного неба",
      tags: ["северное", "сияние", "ночь"],
      likes: 89,
      views: 412,
      rating: 4.9,
      totalRatings: 45,
      uploadDate: "2024-08-15",
      status: 'published' as const
    },
    {
      id: 5,
      title: "Готический собор",
      category: "Архитектура", 
      image: "/img/f4d5d75a-0cec-4536-8747-d88e9470b27a.jpg",
      description: "Величественная архитектура средневековья",
      tags: ["собор", "готика", "история"],
      likes: 34,
      views: 187,
      rating: 4.3,
      totalRatings: 15,
      uploadDate: "2024-08-18",
      status: 'published' as const
    },
    {
      id: 6,
      title: "Сафари в Африке",
      category: "Путешествия",
      image: "/img/e882a710-f2ee-4495-9e24-37e7136a7f62.jpg", 
      description: "Дикая природа африканской саванны",
      tags: ["сафари", "африка", "животные"],
      likes: 76,
      views: 298,
      rating: 4.6,
      totalRatings: 28,
      uploadDate: "2024-08-12",
      status: 'published' as const
    },
    {
      id: 7,
      title: "Космический центр",
      category: "Архитектура",
      image: "/img/f4d5d75a-0cec-4536-8747-d88e9470b27a.jpg",
      description: "Футуристический дизайн космической эры", 
      tags: ["космос", "архитектура", "будущее"],
      likes: 52,
      views: 165,
      rating: 4.4,
      totalRatings: 22,
      uploadDate: "2024-08-10",
      status: 'published' as const
    },
    {
      id: 8,
      title: "Подводный мир",
      category: "Природа",
      image: "/img/e882a710-f2ee-4495-9e24-37e7136a7f62.jpg",
      description: "Коралловые рифы и морская жизнь",
      tags: ["океан", "кораллы", "рыбы"],
      likes: 94,
      views: 356,
      rating: 4.7,
      totalRatings: 38,
      uploadDate: "2024-08-08",
      status: 'published' as const
    }
  ]);

  // Initialize likes counts
  useEffect(() => {
    const initialLikes: Record<number, number> = {};
    panoramas.forEach(p => {
      initialLikes[p.id] = p.likes;
    });
    setLikesCounts(initialLikes);
  }, [panoramas]);

  const categories = ["Все", "Природа", "Архитектура", "Путешествия"];
  const [activeCategory, setActiveCategory] = useState("Все");

  const filteredPanoramas = activeCategory === "Все" 
    ? panoramas 
    : panoramas.filter(p => p.category === activeCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPanoramas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPanoramas = filteredPanoramas.slice(startIndex, endIndex);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

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
          <AdvancedAdminPanel 
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

          <section className="px-6 pb-16">
            <div className="container mx-auto space-y-8">
              {/* Gallery Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {activeCategory === "Все" ? "Все панорамы" : activeCategory}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Найдено {filteredPanoramas.length} панорам
                  </p>
                </div>
              </div>

              {/* Panorama Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPanoramas.map((panorama) => (
                  <LazyPanoramaCard
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

              {/* Empty State */}
              {filteredPanoramas.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    Панорамы не найдены
                  </h3>
                  <p className="text-slate-500">
                    Попробуйте выбрать другую категорию или добавить новые панорамы
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredPanoramas.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPanoramas.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showPageSize={true}
                  showInfo={true}
                  className="pt-8"
                />
              )}
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;