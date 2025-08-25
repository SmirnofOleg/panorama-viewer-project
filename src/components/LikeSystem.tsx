import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface LikeSystemProps {
  panoramaId: number;
  initialLikes?: number;
  initialUserLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'heart' | 'minimal';
  onLike?: (panoramaId: number, isLiked: boolean, newCount: number) => void;
  className?: string;
}

const LikeSystem: React.FC<LikeSystemProps> = ({
  panoramaId,
  initialLikes = 0,
  initialUserLiked = false,
  size = 'md',
  variant = 'default',
  onLike,
  className
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedLike = localStorage.getItem(`panorama_like_${panoramaId}`);
    if (savedLike) {
      setUserLiked(JSON.parse(savedLike));
    }
    
    const savedCount = localStorage.getItem(`panorama_count_${panoramaId}`);
    if (savedCount) {
      setLikes(parseInt(savedCount));
    }
  }, [panoramaId]);

  const handleLike = () => {
    const newUserLiked = !userLiked;
    const newLikes = newUserLiked ? likes + 1 : likes - 1;
    
    setUserLiked(newUserLiked);
    setLikes(newLikes);
    setIsAnimating(true);
    
    // Save to localStorage
    localStorage.setItem(`panorama_like_${panoramaId}`, JSON.stringify(newUserLiked));
    localStorage.setItem(`panorama_count_${panoramaId}`, newLikes.toString());
    
    // Trigger animation reset
    setTimeout(() => setIsAnimating(false), 300);
    
    // Call parent callback
    onLike?.(panoramaId, newUserLiked, newLikes);
  };

  const sizeClasses = {
    sm: 'h-8 px-2',
    md: 'h-10 px-3',
    lg: 'h-12 px-4'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  if (variant === 'heart') {
    return (
      <button
        onClick={handleLike}
        className={cn(
          "relative transition-all duration-200 hover:scale-110",
          isAnimating && "animate-pulse",
          className
        )}
      >
        <Icon 
          name="Heart" 
          size={iconSizes[size]} 
          className={cn(
            "transition-all duration-200",
            userLiked 
              ? "text-red-500 fill-current drop-shadow-lg" 
              : "text-gray-400 hover:text-red-400"
          )}
        />
        {isAnimating && userLiked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-20 animate-ping" />
          </div>
        )}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <button
          onClick={handleLike}
          className={cn(
            "transition-all duration-200 hover:scale-110",
            isAnimating && "animate-bounce"
          )}
        >
          <Icon 
            name="Heart" 
            size={iconSizes[size]} 
            className={cn(
              "transition-colors duration-200",
              userLiked 
                ? "text-red-500 fill-current" 
                : "text-gray-400 hover:text-red-400"
            )}
          />
        </button>
        <span className="text-sm font-medium">{likes}</span>
      </div>
    );
  }

  return (
    <Button
      variant={userLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      className={cn(
        sizeClasses[size],
        "transition-all duration-200",
        userLiked && "bg-red-500 hover:bg-red-600 text-white border-red-500",
        isAnimating && "animate-pulse scale-105",
        className
      )}
    >
      <Icon 
        name="Heart" 
        size={iconSizes[size]} 
        className={cn(
          "mr-1 transition-all duration-200",
          userLiked && "fill-current"
        )}
      />
      {likes}
    </Button>
  );
};

export default LikeSystem;