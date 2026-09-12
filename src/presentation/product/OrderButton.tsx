import RobinhoodIconImg from '@/assets/images/robinhood.png'
import { branches } from '@/data/branch/branches'
import { cn } from '@/shared/utils/cn'
import { Button, Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { ExternalLink, MapPin, Sparkles } from 'lucide-react'
import { Fragment, useState } from 'react'

type Props = {
  className?: string
  children?: React.ReactNode
  defaultBranchId?: string
}

type Platform = {
  name: string
  href: string
  icon: React.ReactNode
  label: string
}

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>X</title>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const DeliveryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>Delivery</title>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
)

const LineManIcon = () => (
  <svg
    className="h-10 w-10 shrink-0 drop-shadow-sm"
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>LINE</title>
    <rect width="40" height="40" rx="10" fill="#00C300" />
    <g transform="translate(8, 8)">
      <path
        fill="#ffffff"
        d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
      />
    </g>
  </svg>
)

const RobinhoodIcon = () => (
  // use image
  <img
    className="h-10 w-10 shrink-0 drop-shadow-sm bg-[#180034]/30 rounded-[10px] p-1"
    width={40}
    height={40}
    src={RobinhoodIconImg.src}
    alt="Robinhood"
  />
)

const GrabIcon = () => (
  <svg
    viewBox="0 0 40 40"
    className="h-10 w-10 shrink-0 drop-shadow-sm"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Grab</title>
    <rect width="40" height="40" rx="10" fill="#00B14F" />
    <g transform="translate(8, 8)">
      <path
        fill="#ffffff"
        d="M23.129 10.863a2.927 2.927 0 00-2.079-.872c-.57 0-1.141.212-1.455.421-.651.434-1.186.904-2.149 2.148v.894c.817-1.064 1.59-1.903 2.177-2.364.386-.31.933-.501 1.427-.501 1.275 0 2.352 1.077 2.352 2.352v.538c0 .63-.247 1.223-.698 1.668a2.341 2.341 0 01-1.654.685c-1.048 0-1.97-.719-2.22-1.701l-.422.51c.307 1.03 1.417 1.789 2.642 1.789.778 0 1.516-.31 2.079-.872.562-.562.871-1.3.871-2.079v-.538c0-.778-.31-1.517-.871-2.078m-12.8-.274c.406 0 .757.087 1.074.266.149-.186.299-.337.411-.449-.335-.256-.903-.415-1.485-.415-.83 0-1.584.3-2.122.843-.534.54-.83 1.287-.83 2.107v3.489h.598V12.94c0-1.385.968-2.352 2.354-2.352m5.678 5.84v-3.488c0-1.072-.84-1.913-1.913-1.913-.5 0-.976.203-1.343.57a1.895 1.895 0 00-.57 1.343v.538c0 1.037.877 1.913 1.913 1.913.285 0 .671-.07.908-.264v-.631c-.232.187-.57.298-.908.298a1.302 1.302 0 01-1.315-1.316v-.538a1.3 1.3 0 011.315-1.314 1.3 1.3 0 011.316 1.314v3.489zM0 12.596v.193c0 1.036.393 2.003 1.107 2.722a3.759 3.759 0 002.689 1.112c.82 0 1.548-.186 2.162-.551.506-.302.73-.607.75-.635V12.22H3.65v.597H6.11v2.434l-.002.002c-.288.288-.972.77-2.312.77a3.165 3.165 0 01-2.279-.938 3.247 3.247 0 01-.92-2.297v-.193c0-.83.375-1.656 1.026-2.269a3.558 3.558 0 012.442-.967c.847 0 1.438.129 1.913.416v-.67c-.494-.21-1.085-.305-1.913-.305C1.862 8.8 0 10.538 0 12.595m10.329-.968c.226 0 .419.037.571.112.075-.186.151-.339.262-.525-.162-.116-.549-.186-.833-.186-1.09 0-1.913.823-1.913 1.913v3.489h.598V12.94c0-.774.54-1.314 1.315-1.314m-4.351-.702v-.707c-.541-.29-1.131-.419-1.913-.419-.799 0-1.555.293-2.132.824-.577.532-.895 1.233-.895 1.972v.193c0 1.542 1.237 2.796 2.758 2.796 1.237 0 1.745-.405 1.874-.533v-1.794H3.65v.598h1.46v.899l-.005.001c-.187.075-.578.231-1.31.231-.58 0-1.122-.225-1.528-.636a2.203 2.203 0 01-.632-1.562v-.193c0-1.192 1.113-2.198 2.43-2.198.91 0 1.45.147 1.913.528m14.105 1.126c.27-.27.623-.424.967-.424.737 0 1.315.577 1.315 1.314v.538c0 .738-.578 1.316-1.315 1.316-.357 0-.702-.196-.972-.55a2.151 2.151 0 01-.418-1.12l-.484.591c.095.452.33.885.665 1.19.344.313.774.486 1.209.486a1.915 1.915 0 001.913-1.913v-.538c0-.499-.202-.977-.57-1.343a1.896 1.896 0 00-1.343-.57c-.316 0-.818.114-1.417.652l-.002.002c-.16.16-.536.536-.765.804-.384.42-.943 1.054-1.42 1.688v.933c.529-.68.833-1.06 1.33-1.634.445-.519.996-1.15 1.307-1.422m-8.939 1.428c0 .779.31 1.517.872 2.08a2.93 2.93 0 002.078.87c.33 0 .669-.07.908-.188v-.597c-.28.117-.618.188-.908.188-1.274 0-2.352-1.077-2.352-2.353v-.538c0-1.275 1.078-2.352 2.352-2.352a2.34 2.34 0 012.353 2.353v3.488h.598v-3.604a2.979 2.979 0 00-.915-2.006 2.92 2.92 0 00-2.036-.83c-.778 0-1.516.31-2.078.873a2.926 2.926 0 00-.872 2.078zm6.918-2.313c.183-.22.372-.443.596-.631V7.378h-.596zm1.037-.876V7.378h.597V9.88a3.601 3.601 0 00-.597.41"
      />
    </g>
  </svg>
)

const ShopeeIcon = () => (
  <svg
    viewBox="0 0 40 40"
    className="h-10 w-10 shrink-0 drop-shadow-sm"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Shopee</title>
    <rect width="40" height="40" rx="10" fill="#EE4D2D" />
    <g transform="translate(8, 8)">
      <path
        d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z"
        fill="#ffffff"
      />
    </g>
  </svg>
)

const bkkPlatforms: Platform[] = [
  {
    name: 'Line Man',
    href: 'https://www.wongnai.com/delivery/businesses/2731010Vj/order',
    icon: <LineManIcon />,
    label: 'สั่งผ่าน Line Man Wongnai',
  },
  {
    name: 'Robinhood',
    href: 'https://static.robinhood.in.th/app_link.html?URI=robinhoodth://merchantlanding/id/360887',
    icon: <RobinhoodIcon />,
    label: 'สั่งผ่าน Robinhood',
  },
  {
    name: 'Grab Food',
    href: 'https://grab.onelink.me/2695613898',
    icon: <GrabIcon />,
    label: 'สั่งผ่าน GrabFood',
  },
  {
    name: 'Shopee Food',
    href: 'https://shopee.co.th/universal-link/now-food/shop/10202568',
    icon: <ShopeeIcon />,
    label: 'สั่งผ่าน Shopee Food',
  },
]

export default function OrderButton({ className, children, defaultBranchId = 'bkk' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(defaultBranchId)

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0]

  return (
    <>
      <Button
        accessKey="Order"
        onClick={() => {
          setSelectedBranchId(defaultBranchId)
          setIsOpen(true)
        }}
        className={cn('btn btn-primary', className)}
      >
        {children || 'สั่งซื้อ'}
      </Button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog className="relative z-[200]" onClose={() => setIsOpen(false)}>
          {/* Backdrop */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          </TransitionChild>

          {/* Panel wrapper */}
          <div className="fixed inset-0 flex w-screen items-end justify-center sm:items-center sm:p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="w-full overflow-hidden rounded-t-3xl bg-gray-50 shadow-2xl ring-1 ring-black/5 sm:max-w-md sm:rounded-3xl">
                {/* Gradient header */}
                <div className="relative overflow-hidden bg-linear-to-br from-shamrock-950 via-shamrock-900 to-shamrock-800 px-6 pb-6 pt-6 text-white">
                  {/* Decorative blobs */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-shamrock-400/20 blur-2xl" />
                  <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-malachite-400/20 blur-xl" />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                    aria-label="ปิด"
                  >
                    <XIcon />
                  </button>

                  {/* Header content */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-shamrock-200 shadow-inner backdrop-blur-sm border border-white/10">
                      <DeliveryIcon />
                    </div>
                    <div>
                      <p className="font-ibm-plex-sans-thai text-xs font-semibold tracking-wider text-shamrock-300">
                        ORDER ONLINE • RYUU
                      </p>
                      <h2 className="font-poppins text-xl font-bold text-white">เลือกช่องทางสั่งซื้อ</h2>
                    </div>
                  </div>

                  {/* Branch tabs */}
                  <div className="mt-4 flex rounded-xl bg-black/40 p-1 border border-white/10">
                    {branches.map((b) => {
                      const isActive = b.id === selectedBranchId
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBranchId(b.id)}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'bg-shamrock-600 text-white shadow-sm'
                              : 'text-shamrock-200/70 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{b.name}</span>
                          {b.status === 'coming_soon' && (
                            <span className="text-[10px] bg-amber-400/30 text-amber-200 px-1 rounded">
                              Soon
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Platform list / Branch info */}
                <div className="rounded-t-3xl bg-gray-50 px-5 pb-6 pt-5">
                  {selectedBranch.deliveryAvailable ? (
                    <>
                      <div className="mb-3 flex items-center justify-between text-xs text-gray-500 font-sarabun px-1">
                        <span>{selectedBranch.nameTh}</span>
                        <span className="text-shamrock-700 font-medium font-poppins">Open Now</span>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {bkkPlatforms.map((platform) => (
                          <li key={platform.name}>
                            <a
                              href={platform.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                'group flex w-full items-center gap-4 rounded-2xl px-4 py-3',
                                'bg-white shadow-xs ring-1 ring-black/5 transition-all duration-200',
                                'hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-50 hover:ring-black/10 text-gray-900',
                              )}
                            >
                              {/* App Icon */}
                              {platform.icon}

                              {/* Labels */}
                              <div className="flex flex-col min-w-0">
                                <span className="font-poppins text-[15px] font-semibold leading-tight text-gray-900">
                                  {platform.name}
                                </span>
                                <span className="font-ibm-plex-sans-thai text-xs text-gray-500 mt-0.5">
                                  {platform.label}
                                </span>
                              </div>

                              {/* Arrow */}
                              <span className="ml-auto shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-shamrock-600">
                                <ExternalLink className="h-[18px] w-[18px]" strokeWidth={2.5} />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-center font-ibm-plex-sans-thai text-xs text-gray-400">
                        กดเลือกแอปพลิเคชันเพื่อเข้าสู่หน้าเมนูสั่งซื้อ
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-6 px-4 bg-white rounded-2xl border border-shamrock-100 shadow-xs">
                      <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-600 mb-3">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <h3 className="font-poppins font-bold text-gray-900 text-base">
                        {selectedBranch.nameTh}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 font-sarabun leading-relaxed">
                        บริการเดลิเวอรีสำหรับสาขาโคราช จะเปิดให้บริการพร้อมกับการเปิดตัวสาขาอย่างเป็นทางการ เร็วๆ
                        นี้
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shamrock-50 text-shamrock-800 text-xs font-medium font-sarabun border border-shamrock-200">
                        <span>✨ ติดตามวันเปิดตัวได้ทาง Instagram @ryuu.bkk</span>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
