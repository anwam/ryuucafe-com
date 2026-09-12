import { branches } from '@/data/branch/branches'
import type { Branch } from '@/domain/branch/types'
import OrderButton from '@/presentation/product/OrderButton'
import { cn } from '@/shared/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Navigation,
  Sparkles,
  Store,
  Utensils,
} from 'lucide-react'
import * as React from 'react'

export interface HeroBranchShowcaseProps {
  className?: string
  initialBranchId?: string
}

function StorefrontIllustration({ branch }: { branch: Branch }) {
  const isBkk = branch.id === 'bkk'

  return (
    <div className="relative w-full h-full min-h-64 sm:min-h-72 overflow-hidden rounded-2xl bg-linear-to-br from-shamrock-950 via-shamrock-900 to-black flex flex-col justify-between p-6">
      {/* Ambient background glow and grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-shamrock-400 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-malachite-400 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Japanese decorative kanji/emblem in background */}
      <div className="absolute right-6 bottom-4 select-none pointer-events-none text-white/5 font-poppins text-8xl font-black">
        {isBkk ? 'RYUU' : 'KORAT'}
      </div>

      {/* Storefront Aesthetic Graphic representation */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/15 shadow-sm bg-white/10 text-white font-poppins">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isBkk ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300 animate-pulse',
              )}
            />
            {branch.statusLabel}
          </span>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-shamrock-400/20 text-shamrock-200 border border-shamrock-300/30 font-poppins">
          {branch.badgeLabel}
        </span>
      </div>

      {/* Center Storefront Art Frame */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center text-center py-4 px-2">
        <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-shamrock-800 to-shamrock-600 border border-shamrock-300/30 text-shamrock-100 shadow-xl shadow-shamrock-950/50">
          <Store className="h-8 w-8 text-shamrock-200" strokeWidth={1.75} />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-malachite-500 text-shamrock-950 text-xs font-bold shadow-md">
            🍵
          </div>
        </div>
        <h4 className="font-poppins text-lg font-bold text-white tracking-wide">{branch.nameTh}</h4>
        <p className="text-xs text-shamrock-300/90 font-sarabun mt-1 max-w-xs line-clamp-2">
          {branch.tagline}
        </p>
      </div>

      {/* Bottom Storefront bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-shamrock-200/80 font-sarabun">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 text-shamrock-300 shrink-0" />
          <span className="truncate">{branch.address.short}</span>
        </div>
        <span className="text-[11px] font-poppins tracking-widest text-shamrock-400 shrink-0 ml-2">
          {branch.nameJp}
        </span>
      </div>
    </div>
  )
}

export default function HeroBranchShowcase({
  className,
  initialBranchId = 'bkk',
}: HeroBranchShowcaseProps) {
  const [activeBranchId, setActiveBranchId] = React.useState(initialBranchId)
  const [copied, setCopied] = React.useState(false)
  const [imageError, setImageError] = React.useState<Record<string, boolean>>({})

  // Sync with document.documentElement.dataset.branch or localStorage on mount
  React.useEffect(() => {
    try {
      const currentDocBranch = document.documentElement.dataset.branch
      const saved = localStorage.getItem('ryuu_selected_branch')
      const targetBranch = currentDocBranch || saved
      if (targetBranch && (targetBranch === 'bkk' || targetBranch === 'korat')) {
        setActiveBranchId(targetBranch)
        document.documentElement.dataset.branch = targetBranch
      }
    } catch (e) {}

    const handleExternalChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ branchId: string }>
      if (customEvent.detail?.branchId) {
        setActiveBranchId(customEvent.detail.branchId)
      }
    }

    window.addEventListener('ryuu-branch-change', handleExternalChange)
    return () => window.removeEventListener('ryuu-branch-change', handleExternalChange)
  }, [])

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0]

  const handleSelectBranch = (branchId: string) => {
    setActiveBranchId(branchId)
    try {
      document.documentElement.dataset.branch = branchId
      localStorage.setItem('ryuu_selected_branch', branchId)
      window.dispatchEvent(new CustomEvent('ryuu-branch-change', { detail: { branchId } }))
    } catch (e) {}
  }

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImageError = (branchId: string) => {
    setImageError((prev) => ({ ...prev, [branchId]: true }))
  }

  return (
    <div
      className={cn(
        'relative w-full max-w-xl mx-auto rounded-3xl bg-linear-to-b from-white/10 to-white/5 p-3 sm:p-4 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/40',
        className,
      )}
    >
      {/* Branch Selector Segmented Control */}
      <div className="relative flex rounded-2xl bg-black/40 p-1.5 backdrop-blur-md border border-white/10">
        {branches.map((branch) => {
          const isActive = branch.id === activeBranchId
          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => handleSelectBranch(branch.id)}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer',
                isActive
                  ? 'text-shamrock-950 font-bold'
                  : 'text-shamrock-100/70 hover:text-white hover:bg-white/5',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-branch-indicator"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-shamrock-200 via-shamrock-100 to-malachite-200 shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <MapPin
                  className={cn('h-4 w-4', isActive ? 'text-shamrock-900' : 'text-shamrock-400')}
                />
                <span className="font-poppins">{branch.name}</span>
                <span className="text-xs font-sarabun hidden sm:inline">
                  ({branch.id === 'bkk' ? 'เสนานิคม' : 'โคราช'})
                </span>
                {branch.status === 'coming_soon' && (
                  <span
                    className={cn(
                      'ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                      isActive
                        ? 'bg-shamrock-900 text-shamrock-100'
                        : 'bg-amber-400/25 text-amber-200 border border-amber-300/30',
                    )}
                  >
                    Soon
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active Branch Display Content */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {/* Storefront Image Window / Fallback Illustration */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-inner group">
              {/* If user provided valid image and not errored */}
              {activeBranch.storefrontImage.src && !imageError[activeBranch.id] ? (
                <div className="relative aspect-16/10 w-full overflow-hidden">
                  <img
                    src={activeBranch.storefrontImage.src}
                    alt={activeBranch.storefrontImage.alt}
                    onError={() => handleImageError(activeBranch.id)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-linear-to-t from-shamrock-950/90 via-shamrock-950/30 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/50 text-white border border-white/20 font-poppins">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          activeBranch.status === 'open'
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-amber-300 animate-pulse',
                        )}
                      />
                      {activeBranch.statusLabel}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-shamrock-500/80 text-white border border-white/20 font-poppins">
                      {activeBranch.badgeLabel}
                    </span>
                  </div>

                  {/* Overlaid Bottom Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-poppins text-lg font-bold text-white drop-shadow-md">
                      {activeBranch.nameTh}
                    </h4>
                    <p className="text-xs text-shamrock-200 font-sarabun line-clamp-1">
                      {activeBranch.tagline}
                    </p>
                  </div>
                </div>
              ) : (
                /* Beautiful Stylized Storefront Art Fallback */
                <StorefrontIllustration branch={activeBranch} />
              )}
            </div>

            {/* Branch Details Deck */}
            <div className="rounded-2xl bg-shamrock-950/60 p-4 border border-white/10 backdrop-blur-md text-shamrock-50 flex flex-col gap-3">
              {/* Theme Mood Gimmick Pill */}
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-shamrock-200 font-sarabun">
                  <span>{activeBranch.id === 'korat' ? '🪵' : '🍵'}</span>
                  <span>
                    {activeBranch.id === 'korat'
                      ? 'ธีมร้าน Warm Dark Wood (บรรยากาศไม้โทนอุ่น)'
                      : 'ธีมร้าน Fresh Matcha Green (บรรยากาศมัทฉะการ์เดน)'}
                  </span>
                </div>
                <span className="text-[10px] text-shamrock-400 font-poppins hidden sm:inline">
                  Interactive Theme
                </span>
              </div>

              {/* Vibe / Description */}
              <p className="text-xs sm:text-sm text-shamrock-100/90 font-sarabun leading-relaxed">
                {activeBranch.description}
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-1.5">
                {activeBranch.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-shamrock-200 border border-white/10 font-sarabun"
                  >
                    <span className="h-1 w-1 rounded-full bg-malachite-300" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Address & Hours */}
              <div className="space-y-1.5 border-t border-white/10 pt-3 text-xs font-sarabun text-shamrock-200/90">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-shamrock-300 shrink-0 mt-0.5" />
                    <span className="leading-snug">{activeBranch.address.full}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(activeBranch.address.full)}
                    className="shrink-0 p-1 rounded-md bg-white/10 hover:bg-white/20 text-shamrock-200 transition-colors cursor-pointer"
                    title="คัดลอกที่อยู่"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {activeBranch.openingHours && (
                  <div className="flex items-center gap-2 text-shamrock-300/80">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{activeBranch.openingHours}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for this Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {activeBranch.deliveryAvailable ? (
                  <OrderButton
                    defaultBranchId={activeBranch.id}
                    className="w-full bg-shamrock-300 hover:bg-shamrock-200 text-shamrock-950 font-bold py-2.5 rounded-xl text-sm transition-all duration-300 shadow-md shadow-shamrock-900/30 flex items-center justify-center gap-1.5"
                  >
                    <Utensils className="h-4 w-4" />
                    สั่งเดลิเวอรี ({activeBranch.name})
                  </OrderButton>
                ) : (
                  <a
                    href="#menu"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-shamrock-300 hover:bg-shamrock-200 text-shamrock-950 font-bold py-2.5 rounded-xl text-sm transition-all duration-300 shadow-md shadow-shamrock-900/30 font-sarabun"
                  >
                    <Sparkles className="h-4 w-4" />
                    ดูเมนูเครื่องดื่ม
                  </a>
                )}

                {activeBranch.googleMapsUrl ? (
                  <a
                    href={activeBranch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200 font-sarabun"
                  >
                    <Navigation className="h-3.5 w-3.5 text-shamrock-300" />
                    เปิด Google Maps
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200 font-sarabun"
                  >
                    <Navigation className="h-3.5 w-3.5 text-shamrock-300" />
                    ข้อมูลติดต่อสาขา
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
