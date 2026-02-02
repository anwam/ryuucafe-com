import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/utils/cn'
import * as React from 'react'
import type { HeroBanner, HeroImage } from '../types'

interface HeroCarouselProps {
  banners?: HeroBanner[]
  fallbackImage: HeroImage
  className?: string
}

export function HeroCarousel({ banners, fallbackImage, className }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  // Prepare items
  const items =
    banners && banners.length > 0 ? banners : [{ responsiveImage: fallbackImage.responsiveImage }]

  // Auto-play effect
  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on('select', onSelect)

    // Simple autoplay interval (only if multiple items)
    let intervalId: ReturnType<typeof setInterval> | undefined
    if (items.length > 1) {
      intervalId = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext()
        } else {
          api.scrollTo(0)
        }
      }, 5000)
    }

    return () => {
      api.off('select', onSelect)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [api, items.length])

  if (items.length === 0) return null

  return (
    <div className={cn('relative w-full h-full min-h-100 lg:min-h-125', className)}>
      <div className="absolute inset-0 overflow-hidden bg-shamrock-50">
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            {items.map((item, index) => (
              <CarouselItem key={item.responsiveImage.src || index} className="h-full pl-0">
                <div className="relative w-full h-full">
                  <img
                    src={item.responsiveImage.src}
                    sizes={item.responsiveImage.sizes}
                    srcSet={item.responsiveImage.webpSrcSet}
                    alt={item.responsiveImage.alt || 'Matcha Tea'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{
                      viewTransitionName: index === 0 ? 'hero-image' : 'none',
                    }}
                  />
                  {/* Gradient Overlay for text legibility if needed, or just mood */}
                  <div className="absolute inset-0 bg-linear-to-t from-shamrock-900/20 to-transparent pointer-events-none" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {items.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/80 backdrop-blur-md border-0 text-white hover:text-shamrock-900 transition-all" />
              <CarouselNext className="right-4 bg-white/20 hover:bg-white/80 backdrop-blur-md border-0 text-white hover:text-shamrock-900 transition-all" />

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
                {Array.from({ length: count }).map((_, idx) => (
                  <button
                    key={`${idx + 1}`}
                    type="button"
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm',
                      idx === current - 1
                        ? 'bg-white w-8 shadow-sm'
                        : 'bg-white/40 w-2 hover:bg-white/60',
                    )}
                    onClick={() => api?.scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}
