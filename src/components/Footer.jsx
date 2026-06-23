import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center">
                <span className="text-black font-black text-xs">RM</span>
              </div>
              <span className="font-black text-base tracking-tight">
                MARSICA<span className="text-[#ff4500]">RMEET</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              La community italiana dei veri appassionati di motori. Raduni, Track Day, Tour e molto altro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Esplora</h4>
            <ul className="space-y-2">
              {['Prossimi eventi', 'Mappa eventi', 'Calendario', 'Diventa organizzatore', 'Community'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>info@marsicarmeet.it</li>
              <li>Instagram: @marsicarmeet</li>
              <li>Facebook: MarsicaRMeet</li>
            </ul>
            <div className="flex gap-3 mt-6">
              {['IG', 'FB', 'YT', 'TK'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-[#ff4500]/60 hover:text-[#ff4500] transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© 2026 MarsicaRMeet. Tutti i diritti riservati.</p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Termini di Servizio</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
