import { brand, contact } from '../config/content'

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 flex flex-col items-center justify-center px-4 py-10 text-center">
      {/* Icon */}
      <div className="mb-6">
        <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,2.56 28.16,9.6 16,16.64 3.84,9.6" fill="#818cf8"/>
          <polygon points="3.84,9.6 16,16.64 16,29.44 3.84,22.4" fill="#4f46e5"/>
          <polygon points="16,16.64 28.16,9.6 28.16,22.4 16,29.44" fill="#312e81"/>
          <line x1="16" y1="2.56" x2="3.84" y2="9.6" stroke="#22d3ee" strokeWidth="1.44" strokeLinecap="round"/>
          <circle cx="16" cy="2.56" r="1.28" fill="#22d3ee"/>
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{brand.name}</h1>
      <p className="text-indigo-300 text-base sm:text-lg mb-8">{brand.description}</p>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 max-w-sm w-full space-y-2">
        <p className="text-white font-semibold text-lg">Em construção</p>
        <p className="text-indigo-200 text-sm">Estamos preparando novidades. Volte em breve!</p>
      </div>

      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.533 5.857L0 24l6.305-1.511A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.001-1.369l-.359-.214-3.741.896.942-3.638-.234-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
        </svg>
        Fale conosco
      </a>

      <p className="mt-10 mb-2 text-indigo-700 text-xs">
        © {new Date().getFullYear()} {brand.name}
      </p>
    </div>
  )
}
