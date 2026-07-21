import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import IsoCube from './IsoCube'
import { brand, header } from '../config/content'

export default function Header() {
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleAnchorClick(e, href) {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 group">
            <IsoCube size={36} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-indigo-600 text-base sm:text-lg tracking-tight">
                {brand.name}
              </span>
              <span className="text-cyan-500 text-xs sm:text-sm font-medium -mt-0.5">
                {brand.tagline}
              </span>
            </div>
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {header.navLinks.map((link) =>
              link.type === 'route' ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-2 sm:px-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label={header.cartAriaLabel(totalItems)}
            >
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
              <span className="hidden sm:inline text-sm font-medium">{header.cartButton}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-indigo-900 text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger button — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-md">
          <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Navegação mobile">
            {header.navLinks.map((link) =>
              link.type === 'route' ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
