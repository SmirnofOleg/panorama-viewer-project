import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import PanoramaViewer from '@/components/PanoramaViewer';

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
  const handlePrevious = () => {
    const newIndex = currentModalIndex > 0 ? currentModalIndex - 1 : filteredPanoramas.length - 1;
    onModalIndexChange(newIndex);
    onSelectPanorama(filteredPanoramas[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentModalIndex < filteredPanoramas.length - 1 ? currentModalIndex + 1 : 0;
    onModalIndexChange(newIndex);
    onSelectPanorama(filteredPanoramas[newIndex]);
  };

  const handleThumbnailClick = (index: number) => {
    onModalIndexChange(index);
    onSelectPanorama(filteredPanoramas[index]);
  };

  const currentPanorama = filteredPanoramas[currentModalIndex];

  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
      <div className="relative">
        <div className="w-full h-[60vh] relative">
          <PanoramaViewer 
            imageUrl={currentPanorama?.image}
            className="absolute inset-0"
          />
          
          {/* Navigation arrows */}
          {filteredPanoramas.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                onClick={handlePrevious}
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                onClick={handleNext}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </>
          )}

          {/* Counter and like button */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <Badge className="bg-black/50 text-white border-0">
              {currentModalIndex + 1} / {filteredPanoramas.length}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4 z-10">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onToggleLike(currentPanorama?.id)}
              className="bg-white/80 hover:bg-white"
            >
              <Icon 
                name="Heart" 
                size={16} 
                className={likes[currentPanorama?.id] ? 'text-red-500 fill-current' : ''}
              />
              <span className="ml-1">{likesCounts[currentPanorama?.id] || currentPanorama?.likes}</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{currentPanorama?.title}</h3>
              <p className="text-slate-600">{currentPanorama?.description}</p>
            </div>
            
            {/* Mini thumbnails slider */}
            {filteredPanoramas.length > 1 && (
              <div className="flex gap-2 max-w-xs overflow-x-auto scrollbar-hide">
                {filteredPanoramas.map((thumb, index) => (
                  <button
                    key={thumb.id}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentModalIndex
                        ? 'border-primary shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={thumb.image}
                      alt={thumb.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mb-6">
            {currentPanorama?.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Комментарии</h4>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {(comments[currentPanorama?.id] || []).map((comment, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm">
                  {comment}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea 
                placeholder="Оставьте комментарий..."
                value={newComment}
                onChange={(e) => onCommentChange(e.target.value)}
                className="flex-1 min-h-[40px] max-h-[80px]"
              />
              <Button onClick={() => onAddComment(currentPanorama?.id)}>
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