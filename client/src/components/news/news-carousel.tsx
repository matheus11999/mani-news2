import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/seo";
import { ArticleWithCategory } from "@shared/schema";
import { cn } from "@/lib/utils";

interface NewsCarouselProps {
  articles: ArticleWithCategory[];
}

export default function NewsCarousel({ articles }: NewsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!articles.length) return null;

  return (
    <section className="relative mb-8">
      <div className="embla overflow-hidden rounded-2xl shadow-2xl" ref={emblaRef}>
        <div className="embla__container flex">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id} className="embla__slide flex-shrink-0 flex-grow-0 basis-full relative">
              <Link 
                href={`/article/${article.slug}`} 
                className="block relative group"
                data-testid={`carousel-article-${article.slug}`}
              >
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                    <div className="max-w-4xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <Badge 
                          style={{ backgroundColor: article.category.color }}
                          className="text-white font-semibold px-2 sm:px-3 py-1 text-xs sm:text-sm"
                        >
                          {article.category.name}
                        </Badge>
                        <div className="flex items-center text-white/80 text-xs sm:text-sm">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span>{formatRelativeTime(new Date(article.publishedAt!))}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">
                        {article.title}
                      </h2>
                      
                      {article.subtitle && (
                        <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
                          {article.subtitle}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-white/70">
                        <span className="font-medium text-xs sm:text-sm">Notícia em destaque</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        className={cn(
          "absolute left-4 top-1/3 transform -translate-y-1/2 z-10",
          "bg-white/20 backdrop-blur-sm border-white/30 text-white",
          "hover:bg-white/30 transition-all duration-200",
          "w-12 h-12 rounded-full p-0",
          "shadow-lg hover:shadow-xl"
        )}
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        data-testid="carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        className={cn(
          "absolute right-4 top-1/3 transform -translate-y-1/2 z-10",
          "bg-white/20 backdrop-blur-sm border-white/30 text-white",
          "hover:bg-white/30 transition-all duration-200",
          "w-12 h-12 rounded-full p-0",
          "shadow-lg hover:shadow-xl"
        )}
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        data-testid="carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === selectedIndex
                ? "bg-primary w-8"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => scrollTo(index)}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}