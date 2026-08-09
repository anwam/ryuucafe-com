import { scrollToNode } from '@/shared/utils/scrollToNode'
import { Button } from '@headlessui/react'
import { useState } from 'react'
import OrderButton from '../product/OrderButton'

const Menus = [
  {
    name: 'Menu',
    link: '#menu',
  },
  {
    name: 'Contact',
    link: '#contact',
  },
]

function HambugerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <title>HamburgerIcon</title>
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  )
}

function HeaderMenus({
  vairiant = 'desktop',
}: {
  vairiant?: 'mobile' | 'desktop'
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (vairiant === 'mobile') {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost btn-circle text-shamrock-900 lg:hidden"
          aria-label="Toggle menu"
        >
          <HambugerIcon isOpen={isOpen} />
        </Button>
        {isOpen && (
          <>
            {/* Backdrop */}
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/20 cursor-default"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />
            {/* Menu */}
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-box bg-white border border-shamrock-100 p-3 shadow-xl shadow-shamrock-900/10">
              <ul className="menu space-y-1">
                {Menus.map((menu) => (
                  <li key={menu.name}>
                    <Button
                      className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-shamrock-50 hover:text-shamrock-700"
                      onClick={() => {
                        scrollToNode(menu.link)
                        setIsOpen(false)
                      }}
                    >
                      {menu.name}
                    </Button>
                  </li>
                ))}
                <li className="mt-3 border-t border-shamrock-100 pt-3">
                  <OrderButton className="btn-sm w-full bg-shamrock-500 text-white border-none hover:bg-shamrock-600 font-bold" />
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-6">
      <ul className="flex items-center gap-x-8">
        {Menus.map((menu) => (
          <li key={menu.name}>
            <Button
              className="relative font-poppins text-sm font-medium text-gray-600 hover:text-shamrock-700 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-shamrock-500 after:transition-all after:duration-300 hover:after:w-full"
              onClick={(_e) => scrollToNode(menu.link)}
            >
              {menu.name}
            </Button>
          </li>
        ))}
      </ul>
      <OrderButton className="btn btn-sm bg-shamrock-600 text-white border-none hover:bg-shamrock-700 rounded-full px-6 font-bold shadow-md shadow-shamrock-600/20 transition-all hover:shadow-lg hover:shadow-shamrock-600/30" />
    </div>
  )
}

export default HeaderMenus
