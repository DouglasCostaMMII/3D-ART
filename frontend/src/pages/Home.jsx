import IsoCube from '../components/IsoCube'
import ProductGrid from '../components/ProductGrid'
import ProductCarousel from '../components/ProductCarousel'
import { brand, contact, home } from '../config/content'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative cubes in background */}
        <div className="absolute top-6 right-4 opacity-20 hidden sm:block" aria-hidden="true">
          <IsoCube size={80} />
        </div>
        <div className="absolute bottom-4 right-20 opacity-10 hidden lg:block" aria-hidden="true">
          <IsoCube size={48} />
        </div>
        <div className="absolute top-12 left-8 opacity-10 hidden lg:block" aria-hidden="true">
          <IsoCube size={36} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl">
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-6">
              <IsoCube size={64} />
              <div>
                <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none">
                  {brand.name}
                </h1>
                <span className="text-cyan-400 font-semibold text-xl sm:text-2xl">
                  {brand.tagline}
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-indigo-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
              {brand.fullDescription.split(brand.fullDescriptionHighlight).map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="text-cyan-300 font-medium">{brand.fullDescriptionHighlight}</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href="#produtos"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-cyan-400 hover:bg-cyan-300 text-indigo-900 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/20 text-sm sm:text-base"
              >
                {home.hero.cta}
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
              >
                {home.hero.whatsappCta}
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 text-indigo-100">
              {home.hero.stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-indigo-200 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <ProductCarousel />

      {/* Products section */}
      <div id="produtos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {home.products.sectionTitle}
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            {home.products.sectionSubtitle}
          </p>
        </div>
        <ProductGrid />
      </div>

    </div>
  )
}
