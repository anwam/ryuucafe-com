import { cn } from '@/shared/utils/cn'
import * as React from 'react'
import OrderButton from './OrderButton'

type Props = {
  /** id of the section that should be scrolled past before the bar appears */
  revealAfterId: string
}

export default function MobileOrderBar({ revealAfterId }: Props) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const target = document.getElementById(revealAfterId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    observer.observe(target)

    return () => observer.disconnect()
  }, [revealAfterId])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-sticky-cta lg:hidden',
        'bg-white/95 backdrop-blur-md border-t border-shamrock-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]',
        'px-4 pt-3 transition-transform duration-300 ease-out',
        'pb-[calc(env(safe-area-inset-bottom)+0.75rem)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!visible}
    >
      <OrderButton className="btn w-full bg-shamrock-500 text-white hover:bg-shamrock-600 rounded-full py-3 text-base font-bold shadow-md shadow-shamrock-600/20" />
    </div>
  )
}
