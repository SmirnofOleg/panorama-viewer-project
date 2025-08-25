import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import PanoramaModal from '@/components/PanoramaModal';
import LikeSystem from '@/components/LikeSystem';
import RatingSystem from '@/components/RatingSystem';
import PanoramaViewer360 from '@/components/PanoramaViewer360';
import { cn } from '@/lib/utils';

interface LazyPanoramaCardProps {
  panorama: any;
  filteredPanoramas: any[];
  likes: Record<number, boolean>;
  likesCounts: Record<number, number>;
  comments: Record<string, string[]>;
  newComment: string;
  currentModalIndex: number;
  onToggleLike: (id: number) => void;
  onSelectPanorama: (panorama: any) => void;
  onModalIndexChange: (index: number) => void;
  onCommentChange: (comment: string) => void;
  onAddComment: (id: number) => void;
  threshold?: number;
  className?: string;
}

const LazyPanoramaCard: React.FC<LazyPanoramaCardProps> = ({ 
  panorama, 
  filteredPanoramas, 
  likes, 
  likesCounts, 
  comments,
  newComment,
  currentModalIndex,
  onToggleLike, 
  onSelectPanorama, 
  onModalIndexChange,
  onCommentChange,
  onAddComment,
  threshold = 0.1,
  className
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '100px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [threshold]);

  const CardSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-lg animate-pulse">
      <div className="relative h-64 bg-slate-200">
        <div className="absolute top-4 left-4">
          <div className="h-6 w-20 bg-slate-300 rounded"></div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="Camera" size={48} className="text-slate-300" />
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="h-6 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-slate-200 rounded"></div>
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <div key={star} className="w-4 h-4 bg-slate-200 rounded"></div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
            </div>
            <div className="h-5 w-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={cardRef}
      className={cn("transition-all duration-300", className)}
    >
      {!isInView ? (
        <CardSkeleton />
      ) : (
        <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
          <div className="relative overflow-hidden">
            <div className="h-64 relative">
              {isInView && (
                <div 
                  className={cn(
                    "transition-opacity duration-500",
                    isLoaded ? "opacity-100" : "opacity-0"
                  )}
                >
                  <PanoramaViewer360 
                    imageUrl={panorama.image}
                    className="w-full h-full"
                    onFullscreen={handleLoad}
                  />
                </div>
              )}
              
              {!isLoaded && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-slate-600">Загрузка 360°...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-slate-800">
                {panorama.category}
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4">
              <LikeSystem
                panoramaId={panorama.id}
                initialLikes={panorama.likes}
                variant="heart"
                size="md"
                onLike={onToggleLike}
                className="bg-white/90 rounded-full p-2"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="absolute inset-0 w-full h-full bg-transparent hover:bg-transparent border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => {
                    onSelectPanorama(panorama);
                    onModalIndexChange(filteredPanoramas.findIndex(p => p.id === panorama.id));
                  }}
                >
                  <Icon name="Maximize" size={32} className="text-white" />
                </Button>
              </DialogTrigger>
              <PanoramaModal
                filteredPanoramas={filteredPanoramas}
                currentModalIndex={currentModalIndex}
                likes={likes}
                likesCounts={likesCounts}
                comments={comments}
                newComment={newComment}
                onModalIndexChange={onModalIndexChange}
                onSelectPanorama={onSelectPanorama}
                onToggleLike={onToggleLike}
                onCommentChange={onCommentChange}
                onAddComment={onAddComment}
              />
            </Dialog>
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {panorama.title}
            </h3>
            <p className="text-slate-600 mb-4">{panorama.description}</p>
            
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {panorama.tags?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                ))}
              </div>
              
              <RatingSystem
                panoramaId={panorama.id}
                initialRating={panorama.rating || 0}
                totalRatings={panorama.totalRatings || 0}
                size="sm"
                showStats={true}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <LikeSystem
                    panoramaId={panorama.id}
                    initialLikes={panorama.likes}
                    variant="minimal"
                    size="sm"
                    onLike={onToggleLike}
                  />
                  <div className="flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    <span>{panorama.views}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-primary font-medium">360°</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LazyPanoramaCard;