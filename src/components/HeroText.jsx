import { motion } from 'framer-motion'

const tickerItems = [
  'RADUNO NOTTURNO MILANO · 5 LUG',
  'TRACK DAY MONZA · 13 LUG',
  'TOUR DOLOMITI · 19 LUG',
  'GRAN RADUNO ROMA · 26 LUG',
  'TRACK DAY VALLELUNGA · 3 AGO',
  'TOUR COSTIERA AMALFITANA · 10 AGO',
]

export default function HeroText() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] flex flex-col items-center justify-center text-center px-6">

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="text-[#ff4500] text-xs font-bold tracking-[0.35em] uppercase mb-5"
      >
        ◆ La Piattaforma Premium
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-6xl md:text-[6.5rem] leading-none tracking-tight mb-6 font-bebas"
      >
        VIVI LA
        <br />
        <span className="gradient-text">PASSIONE</span>
        <br />
        DEL MOTORE
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.75 }}
        className="text-gray-400 text-sm md:text-lg mb-10 max-w-lg leading-relaxed"
      >
        Raduni, Car Meet, Track Day e Tour Panoramici.
        <br />
        Unisciti alla community italiana degli appassionati.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.95 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <a
          href="#events"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ff4500] text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#ff6b00] transition-all duration-300 neon-glow"
        >
          Trova il prossimo raduno
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
        <a
          href="#map"
          className="inline-flex items-center justify-center px-8 py-4 border border-white/15 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:border-[#ff4500]/50 hover:bg-white/4 transition-all duration-300"
        >
          Vedi la mappa
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="flex gap-10 justify-center"
      >
        {[
          { num: '2.4K+', label: 'Appassionati' },
          { num: '48', label: 'Eventi/Anno' },
          { num: '12', label: 'Regioni' },
        ].map(({ num, label }) => (
          <div key={label}>
            <div className="text-3xl font-black text-white leading-none">{num}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint — narrative bridge to CarShowcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Scopri la GTR</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[#ff4500] to-transparent"
        />
      </motion.div>

      {/* Ticker bar */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-[#ff4500]/8 border-t border-[#ff4500]/20 overflow-hidden flex items-center">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap flex items-center gap-12"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-[11px] font-bold text-[#ff4500] tracking-widest uppercase">
              ● {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
