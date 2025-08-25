import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  fallback = '/img/placeholder-panorama.jpg',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const defaultPlaceholder = (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 animate-pulse">
      <Icon name="Camera" size={32} className="text-slate-400 mb-2" />
      <div className="w-3/4 h-4 bg-slate-200 rounded mb-2"></div>
      <div className="w-1/2 h-3 bg-slate-200 rounded"></div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {!isInView && (
        <div className="absolute inset-0">
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {isInView && (
        <>
          <img
            ref={imgRef}
            src={hasError ? fallback : src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />

          {isLoading && !isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Загрузка...</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center text-slate-500">
                <Icon name="ImageOff" size={32} className="mx-auto mb-2" />
                <p className="text-sm">Ошибка загрузки</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;