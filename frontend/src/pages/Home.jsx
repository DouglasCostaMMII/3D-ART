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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <IsoCube size={28} />
              <div>
                <p className="text-white font-bold text-sm">{brand.name} - {brand.tagline}</p>
                <p className="text-gray-500 text-xs">{brand.description}</p>
              </div>
            </div>

            {/* Contact channels */}
            <div className="flex flex-col gap-2.5">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Contato</p>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors text-sm group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {contact.whatsappDisplay}
              </a>

              {/* Instagram */}
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-500 flex-shrink-0">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                {contact.instagramHandle}
              </a>

              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors text-sm"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-indigo-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {contact.email}
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} {brand.name} - {brand.tagline}.{home.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
