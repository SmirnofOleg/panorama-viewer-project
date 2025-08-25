import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface RatingSystemProps {
  panoramaId: number;
  initialRating?: number;
  initialUserRating?: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showStats?: boolean;
  onRate?: (panoramaId: number, rating: number, newAverage: number) => void;
  className?: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  panoramaId,
  initialRating = 0,
  initialUserRating = 0,
  totalRatings = 0,
  size = 'md',
  interactive = true,
  showStats = true,
  onRate,
  className
}) => {
  const [averageRating, setAverageRating] = useState(initialRating);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(totalRatings);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedUserRating = localStorage.getItem(`panorama_rating_${panoramaId}`);
    if (savedUserRating) {
      setUserRating(parseInt(savedUserRating));
    }
    
    const savedAverage = localStorage.getItem(`panorama_avg_rating_${panoramaId}`);
    if (savedAverage) {
      setAverageRating(parseFloat(savedAverage));
    }
    
    const savedCount = localStorage.getItem(`panorama_ratings_count_${panoramaId}`);
    if (savedCount) {
      setRatingsCount(parseInt(savedCount));
    }
  }, [panoramaId]);

  const handleRate = (rating: number) => {
    if (!interactive) return;
    
    const oldUserRating = userRating;
    const oldCount = ratingsCount;
    const oldTotal = averageRating * oldCount;
    
    let newCount = oldCount;
    let newTotal = oldTotal;
    
    if (oldUserRating === 0) {
      // New rating
      newCount = oldCount + 1;
      newTotal = oldTotal + rating;
    } else {
      // Update existing rating
      newTotal = oldTotal - oldUserRating + rating;
    }
    
    const newAverage = newCount > 0 ? newTotal / newCount : 0;
    
    setUserRating(rating);
    setAverageRating(newAverage);
    setRatingsCount(newCount);
    setIsAnimating(true);
    
    // Save to localStorage
    localStorage.setItem(`panorama_rating_${panoramaId}`, rating.toString());
    localStorage.setItem(`panorama_avg_rating_${panoramaId}`, newAverage.toString());
    localStorage.setItem(`panorama_ratings_count_${panoramaId}`, newCount.toString());
    
    // Animation reset
    setTimeout(() => setIsAnimating(false), 500);
    
    // Call parent callback
    onRate?.(panoramaId, rating, newAverage);
  };

  const getStarClass = (starIndex: number) => {
    const displayRating = hoveredStar || userRating || averageRating;
    const isFilled = starIndex <= displayRating;
    const isPartial = starIndex - 0.5 <= displayRating && starIndex > displayRating;
    
    return cn(
      "transition-all duration-200 cursor-pointer",
      isFilled && "text-yellow-400 fill-current",
      isPartial && "text-yellow-400",
      !isFilled && !isPartial && "text-gray-300",
      interactive && "hover:text-yellow-400 hover:scale-110",
      isAnimating && isFilled && "animate-bounce"
    );
  };

  const sizeMap = {
    sm: 14,
    md: 18,
    lg: 24
  };

  const starSize = sizeMap[size];

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Превосходно";
    if (rating >= 4) return "Отлично";
    if (rating >= 3.5) return "Хорошо";
    if (rating >= 3) return "Неплохо";
    if (rating >= 2) return "Удовлетворительно";
    return "Требует улучшения";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 4) return "bg-blue-100 text-blue-800";
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800";
    if (rating >= 3) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            disabled={!interactive}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-110"
            )}
          >
            <Icon 
              name="Star" 
              size={starSize}
              className={getStarClass(star)}
            />
          </button>
        ))}
      </div>

      {/* Rating Info */}
      {showStats && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {averageRating.toFixed(1)}
          </span>
          
          {ratingsCount > 0 && (
            <>
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getRatingColor(averageRating))}
              >
                {getRatingText(averageRating)}
              </Badge>
              
              <span className="text-xs text-gray-500">
                ({ratingsCount} {ratingsCount === 1 ? 'оценка' : 'оценок'})
              </span>
            </>
          )}
        </div>
      )}

      {/* User Rating Indicator */}
      {userRating > 0 && (
        <div className="flex items-center gap-1">
          <Icon name="User" size={12} className="text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">
            Ваша оценка: {userRating}
          </span>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;