import { brand, contact } from '../config/content'
import IsoCube from '../components/IsoCube'

const channels = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: contact.whatsappDisplay,
    href: `https://wa.me/${contact.whatsapp}`,
    description: 'Fale diretamente conosco para tirar dúvidas, fazer pedidos personalizados ou solicitar orçamentos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    color: 'emerald',
    colorClasses: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      icon: 'bg-emerald-500 text-white',
      badge: 'bg-emerald-100 text-emerald-700',
      button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      ring: 'focus:ring-emerald-400',
    },
    badge: 'Resposta rápida',
    cta: 'Abrir WhatsApp',
    external: true,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    value: contact.instagramHandle,
    href: contact.instagram,
    description: 'Acompanhe nossos projetos, novidades e bastidores das impressões no Instagram.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    colorClasses: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      icon: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white',
      badge: 'bg-pink-100 text-pink-700',
      button: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white',
      ring: 'focus:ring-pink-400',
    },
    badge: 'Nossos projetos',
    cta: 'Ver perfil',
    external: true,
  },
  {
    key: 'email',
    label: 'E-mail',
    value: contact.email,
    href: `mailto:${contact.email}`,
    description: 'Para propostas, parcerias ou dúvidas mais detalhadas, entre em contato pelo e-mail.',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    colorClasses: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      icon: 'bg-indigo-600 text-white',
      badge: 'bg-indigo-100 text-indigo-700',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      ring: 'focus:ring-indigo-400',
    },
    badge: 'Propostas e parcerias',
    cta: 'Enviar e-mail',
    external: false,
  },
]

export default function Contacts() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 pt-10 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <IsoCube size={52} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fale com a gente
          </h1>
          <p className="mt-3 text-indigo-200 text-base sm:text-lg max-w-md mx-auto">
            Estamos disponíveis pelo WhatsApp, Instagram e e-mail. Escolha o canal que preferir.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-2xl mx-auto px-4 -mt-8 pb-16 space-y-4">
        {channels.map((ch) => (
          <div
            key={ch.key}
            className={`${ch.colorClasses.bg} ${ch.colorClasses.border} border rounded-2xl p-5 sm:p-6 shadow-sm`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`${ch.colorClasses.icon} rounded-xl p-3 flex-shrink-0 shadow-sm`}>
                {ch.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{ch.label}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ch.colorClasses.badge}`}>
                    {ch.badge}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{ch.description}</p>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <a
                    href={ch.href}
                    target={ch.external ? '_blank' : undefined}
                    rel={ch.external ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${ch.colorClasses.button} ${ch.colorClasses.ring}`}
                  >
                    {ch.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                  <span className="text-gray-600 text-sm font-medium">{ch.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs pt-2">
          {brand.name} · {brand.description}
        </p>
      </section>
    </div>
  )
}
