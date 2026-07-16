import { useCart } from '../context/CartContext'
import IsoCube from './IsoCube'

export default function Header() {
  const { totalItems, openCart } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 group">
            <IsoCube size={36} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-indigo-600 text-base sm:text-lg tracking-tight">
                3D Studio
              </span>
              <span className="text-cyan-500 text-xs sm:text-sm font-medium -mt-0.5">
                Impressões
              </span>
            </div>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Tagline - hidden on very small screens */}
            <span className="hidden md:block text-gray-400 text-sm">
              Impressão 3D sob demanda
            </span>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-2 sm:px-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label={`Carrinho com ${totalItems} itens`}
            >
              {/* Shopping bag icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-indigo-900 text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
