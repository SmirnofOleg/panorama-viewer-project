import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface PanoramaModalProps {
  filteredPanoramas: any[];
  currentModalIndex: number;
  likes: Record<number, boolean>;
  likesCounts: Record<number, number>;
  comments: Record<string, string[]>;
  newComment: string;
  onModalIndexChange: (index: number) => void;
  onSelectPanorama: (panorama: any) => void;
  onToggleLike: (id: number) => void;
  onCommentChange: (comment: string) => void;
  onAddComment: (id: number) => void;
}

const PanoramaModal = ({
  filteredPanoramas,
  currentModalIndex,
  likes,
  likesCounts,
  comments,
  newComment,
  onModalIndexChange,
  onSelectPanorama,
  onToggleLike,
  onCommentChange,
  onAddComment
}: PanoramaModalProps) => {
  const currentPanorama = filteredPanoramas[currentModalIndex];
  if (!currentPanorama) return null;

  const goToPrevious = () => {
    const newIndex = currentModalIndex > 0 ? currentModalIndex - 1 : filteredPanoramas.length - 1;
    onModalIndexChange(newIndex);
    onSelectPanorama(filteredPanoramas[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentModalIndex < filteredPanoramas.length - 1 ? currentModalIndex + 1 : 0;
    onModalIndexChange(newIndex);
    onSelectPanorama(filteredPanoramas[newIndex]);
  };

  return (
    <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
        {/* Image */}
        <img 
          src={currentPanorama.image}
          alt={currentPanorama.title}
          className="w-full h-2/3 object-cover"
        />
        
        {/* Navigation arrows */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute left-4 top-1/3 transform -translate-y-1/2 z-10"
          onClick={goToPrevious}
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="absolute right-4 top-1/3 transform -translate-y-1/2 z-10"
          onClick={goToNext}
        >
          <Icon name="ChevronRight" size={20} />
        </Button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent p-6 text-white overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white mb-2">
              {currentPanorama.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentPanorama.category}
            </Badge>
            <div className="flex gap-2">
              {currentPanorama.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs text-white/80 border-white/30">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-white/90 mb-4">{currentPanorama.description}</p>
          
          <div className="flex items-center gap-6 mb-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => onToggleLike(currentPanorama.id)}
            >
              <Icon 
                name="Heart" 
                size={16} 
                className={`mr-1 ${likes[currentPanorama.id] ? 'text-red-500 fill-current' : ''}`}
              />
              {likesCounts[currentPanorama.id] || currentPanorama.likes}
            </Button>
            
            <div className="flex items-center gap-1 text-white/70">
              <Icon name="Eye" size={16} />
              <span>{currentPanorama.views}</span>
            </div>
            
            <div className="flex items-center gap-1 text-white/70">
              <Icon name="Calendar" size={16} />
              <span>{currentPanorama.uploadDate}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-white/20 pt-4">
            <h4 className="font-semibold mb-3 text-white">Комментарии</h4>
            
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {(comments[currentPanorama.id] || []).map((comment, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-2 text-sm">
                  {comment}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder="Добавить комментарий..."
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddComment(currentPanorama.id);
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onAddComment(currentPanorama.id)}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default PanoramaModal;