import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import PanoramaModal from '@/components/PanoramaModal';
import LikeSystem from '@/components/LikeSystem';
import RatingSystem from '@/components/RatingSystem';
import PanoramaViewer360 from '@/components/PanoramaViewer360';

interface PanoramaCardProps {
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
}

const PanoramaCard = ({ 
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
  onAddComment
}: PanoramaCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <div className="h-64">
          <PanoramaViewer360 
            imageUrl={panorama.image}
            className="w-full h-full"
          />
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
  );
};

export default PanoramaCard;