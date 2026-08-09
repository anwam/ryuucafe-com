import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'
// Intentional exception to "presentation never imports data": this is a client-side
// runtime refetch after hydration, not a build-time fetch. See CLAUDE.md.
import { bannerRepository } from '@/data/banner/DatoCmsBannerRepository'
import { cn } from '@/shared/utils/cn'
import * as React from 'react'
import type { HeroBanner, HeroImage } from '@/domain/home/types'

interface HeroCarouselProps {
  /** SSG banners from build-time data — shown immediately */
  initialBanners?: HeroBanner[]
  fallbackImage: HeroImage
  className?: string
}

function buildItems(banners: HeroBanner[] | undefined, fallbackImage: HeroImage): HeroBanner[] {
  if (banners && banners.length > 0) {
    return banners
  }
  return [{ responsiveImage: fallbackImage.responsiveImage }]
}

export function HeroCarousel({ initialBanners, fallbackImage, className }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [banners, setBanners] = React.useState<HeroBanner[] | undefined>(initialBanners)

  const items = buildItems(banners, fallbackImage)

  // Fetch the latest banners on the client to get fresh data
  React.useEffect(() => {
    let cancelled = false

    bannerRepository.getHeroBanners().then((freshBanners) => {
      if (!cancelled && freshBanners.length > 0) {
        setBanners(freshBanners)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Auto-play & slide tracking
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
    <div className={cn('relative w-full h-auto min-h-100 aspect-38/9', className)}>
      <div className={cn('absolute inset-0 overflow-hidden bg-shamrock-50', className)}>
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            {items.map((item, index) => (
              <CarouselItem key={item.responsiveImage.src || index} className="h-full pl-0">
                <div className={cn('relative w-full h-full', className)}>
                  <img
                    src={item.responsiveImage.src}
                    sizes={item.responsiveImage.sizes}
                    srcSet={item.responsiveImage.webpSrcSet}
                    alt={item.responsiveImage.alt || 'Matcha Tea'}
                    className={cn('absolute inset-0 w-full h-full object-cover', className)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{
                      viewTransitionName: index === 0 ? 'hero-image' : 'none',
                    }}
                  />
                  {/* Gradient Overlay */}
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
