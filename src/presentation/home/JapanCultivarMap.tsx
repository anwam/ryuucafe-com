import type { Cultivar } from '@/domain/product/types'
import { cn } from '@/shared/utils/cn'
import { geoCentroid } from 'd3-geo'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { ComposableMap, Geography, ZoomableGroup, useGeographies } from 'react-simple-maps'

type Props = {
  cultivars: Cultivar[]
}

const GEO_URL = '/data/japan-prefectures.topojson'
const HIGHLIGHT_COLOR = '#2d7a52'
const DEFAULT_COLOR = '#e2e8f0'
const DEFAULT_CENTER: [number, number] = [137, 38]
const DEFAULT_ZOOM = 1
const ACTIVE_ZOOM = 5

function DropletIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-shamrock-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Clear</title>
      <path d="M12 2.5s6 7.2 6 11.5a6 6 0 1 1-12 0c0-4.3 6-11.5 6-11.5Z" />
    </svg>
  )
}

function PitcherIcon() {
  return (
    <svg
      className="h-4 w-4 text-shamrock-600 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Latte</title>
      <path d="M5 8h11l-.8 9.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M9 4.5c-.7.6-1 1.1-1 1.8s.3 1.2 1 1.8" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      className="h-4 w-4 text-shamrock-600 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Location</title>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

type MapLayerProps = {
  activeCultivar: Cultivar | null
}

/** Rendered inside <ComposableMap> so useGeographies/ZoomableGroup can access the map context. */
function MapLayer({ activeCultivar }: MapLayerProps) {
  const { geographies } = useGeographies({ geography: GEO_URL })

  const activeGeo = React.useMemo(
    () => geographies.find((geo) => String(geo.properties?.id) === activeCultivar?.prefectureId),
    [geographies, activeCultivar],
  )

  // Pan/zoom to the selected prefecture's centroid, otherwise show the whole country
  const mapCenter = activeGeo ? (geoCentroid(activeGeo) as [number, number]) : DEFAULT_CENTER
  const mapZoom = activeGeo ? ACTIVE_ZOOM : DEFAULT_ZOOM

  return (
    <ZoomableGroup
      center={mapCenter}
      zoom={mapZoom}
      filterZoomEvent={(event) => event.type !== 'wheel'}
      className="transition-transform duration-700 ease-in-out"
    >
      {geographies.map((geo) => {
        const isActive = geo === activeGeo
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            className="cursor-default transition-colors duration-300 outline-none hover:brightness-95"
            style={{
              fill: isActive ? HIGHLIGHT_COLOR : DEFAULT_COLOR,
              stroke: '#ffffff',
              strokeWidth: 0.6,
              outline: 'none',
            }}
          />
        )
      })}
    </ZoomableGroup>
  )
}

export default function JapanCultivarMap({ cultivars }: Props) {
  const [activeCultivar, setActiveCultivar] = React.useState<Cultivar | null>(cultivars[0] ?? null)

  const tasteNotes =
    activeCultivar?.tasteNotes
      .split(',')
      .map((tn) => tn.trim())
      .filter(Boolean) ?? []

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6 lg:items-stretch">
      {/* 1. Selector List */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-shamrock-700">
            Select Cultivar ({cultivars.length})
          </span>
          <span className="text-xs text-gray-400 hidden lg:inline">Scroll to view</span>
        </div>

        <ul className="flex gap-2 overflow-x-auto pb-2 lg:h-[540px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1.5 lg:pb-0">
          {cultivars.map((cultivar) => {
            const isActive = activeCultivar?.id === cultivar.id
            return (
              <li key={cultivar.id} className="shrink-0 lg:shrink-0">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCultivar(cultivar)}
                  className={cn(
                    'group block w-full rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 whitespace-nowrap lg:whitespace-normal',
                    isActive
                      ? 'border-shamrock-600 bg-shamrock-600 text-white shadow-md shadow-shamrock-900/10 scale-[1.01]'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-shamrock-200 hover:bg-shamrock-50/70',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-poppins text-sm font-semibold tracking-tight">
                      {cultivar.name}
                    </span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-shamrock-200 shrink-0 hidden lg:inline-block" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'block text-xs font-normal mt-0.5',
                      isActive ? 'text-shamrock-100' : 'text-gray-400',
                    )}
                  >
                    {cultivar.city ? `${cultivar.city}, ` : ''}
                    {cultivar.prefecture}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 2. Emphasized Information Card */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8 lg:min-h-[540px]">
          {/* Background Accent Gradient */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-44 w-44 rounded-full bg-linear-to-br from-shamrock-100/60 to-transparent blur-2xl pointer-events-none" />

          <AnimatePresence mode="wait" initial={false}>
            {activeCultivar ? (
              <motion.div
                key={activeCultivar.id}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                className="relative z-10 flex h-full flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top Tag & Origin Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-shamrock-50 px-3 py-1 text-xs font-semibold text-shamrock-700 border border-shamrock-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-shamrock-500" />
                      Single Cultivar • Ceremonial Grade
                    </span>

                    {activeCultivar.region && (
                      <span className="text-xs font-medium text-gray-400 font-poppins">
                        {activeCultivar.region} Region
                      </span>
                    )}
                  </div>

                  {/* Cultivar Name */}
                  <div>
                    <h3 className="font-esteban text-3xl font-bold text-gray-900 lg:text-4xl tracking-tight">
                      {activeCultivar.name}
                    </h3>

                    {/* Origin Location Detail */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-shamrock-800 bg-shamrock-50/70 px-3 py-1 rounded-lg border border-shamrock-100/80">
                      <MapPinIcon />
                      <span className="font-sarabun">
                        {activeCultivar.city ? `${activeCultivar.city}, ` : ''}
                        {activeCultivar.prefecture}
                        {activeCultivar.region ? ` (${activeCultivar.region})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Taste Profile Section */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Taste Notes & Character
                    </div>
                    {tasteNotes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tasteNotes.map((tn, idx) => (
                          <motion.span
                            key={tn}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.05 + idx * 0.04 }}
                            className="inline-flex items-center rounded-lg border border-shamrock-200/70 bg-shamrock-50/90 px-3 py-1.5 font-poppins text-xs font-semibold tracking-wide text-shamrock-800 uppercase shadow-2xs"
                          >
                            {tn}
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No taste notes available</p>
                    )}
                  </div>
                </div>

                {/* Serving Prices Section */}
                <div className="relative z-10 mt-8 border-t border-gray-100 pt-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Serving Options
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Clear Option */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      className="flex flex-col justify-between rounded-xl border border-shamrock-100 bg-linear-to-b from-shamrock-50/50 to-white p-3.5 sm:p-4 transition-all duration-300 hover:shadow-sm hover:border-shamrock-200"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-shamrock-700">
                        <DropletIcon />
                        <span>Clear (ใส)</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-poppins text-2xl font-bold text-gray-900">
                          {activeCultivar.priceClear == null
                            ? '-'
                            : `฿${activeCultivar.priceClear}`}
                        </span>
                        <span className="text-xs text-gray-400 block mt-0.5">/ serve</span>
                      </div>
                    </motion.div>

                    {/* Latte Option */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.15 }}
                      className="flex flex-col justify-between rounded-xl border border-shamrock-100 bg-linear-to-b from-shamrock-50/50 to-white p-3.5 sm:p-4 transition-all duration-300 hover:shadow-sm hover:border-shamrock-200"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-shamrock-700">
                        <PitcherIcon />
                        <span>Latte (นม)</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-poppins text-2xl font-bold text-gray-900">
                          {activeCultivar.priceLatte == null
                            ? '-'
                            : `฿${activeCultivar.priceLatte}`}
                        </span>
                        <span className="text-xs text-gray-400 block mt-0.5">/ serve</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
                Select a cultivar from the list
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Narrow Vertical Terroir Map */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="relative flex h-full min-h-[360px] lg:min-h-[540px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Map Header Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm border border-gray-100/80">
              Terroir Map
            </div>
            {activeCultivar && (
              <div className="rounded-full bg-shamrock-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {activeCultivar.prefecture}
              </div>
            )}
          </div>

          {/* Interactive Map */}
          <div className="flex-1 w-full flex items-center justify-center pt-10 pb-4">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: DEFAULT_CENTER, scale: 1400 }}
              className="h-full w-full max-h-[460px]"
            >
              <MapLayer activeCultivar={activeCultivar} />
            </ComposableMap>
          </div>

          {/* Map Footer Note */}
          <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-2 text-center text-[11px] text-gray-400 font-sarabun">
            ซูมและไฮไลท์แหล่งกำเนิด: {activeCultivar?.prefecture ?? 'Japan'}
          </div>
        </div>
      </div>
    </div>
  )
}
