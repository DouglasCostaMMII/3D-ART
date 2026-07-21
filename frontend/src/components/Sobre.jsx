import { sobre, contact } from '../config/content'

export default function Sobre() {
  return (
    <div id="sobre">
      {/* Hero: foto + texto lado a lado */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                {sobre.identity.heading}
              </h1>
              {sobre.identity.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-500 text-base leading-relaxed mb-3">{p}</p>
              ))}

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-8 mb-8">
                {sobre.identity.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold text-indigo-600">{s.value}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.533 5.857L0 24l6.305-1.511A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.001-1.369l-.359-.214-3.741.896.942-3.638-.234-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
                {sobre.identity.cta}
              </a>
            </div>

            {/* Foto da máquina */}
            <div className="flex items-center justify-center">
              <img
                src="/bambulab.jpg"
                alt="Impressora 3D Bambu Lab A1"
                className="w-full max-w-lg rounded-2xl object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{sobre.process.heading}</h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sobre.process.steps.map((step, i) => (
              <li key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                <span className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Materiais */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{sobre.materials.heading}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sobre.materials.items.map((m) => (
              <div key={m.name} className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col gap-1">
                <span className="text-indigo-600 font-bold text-lg">{m.name}</span>
                <span className="text-gray-500 text-xs leading-relaxed">{m.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
