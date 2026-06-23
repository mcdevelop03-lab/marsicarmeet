import { useRef, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import CarScene from './CarScene'

const tickerItems = [
  'RADUNO NOTTURNO MILANO · 5 LUG',
  'TRACK DAY MONZA · 13 LUG',
  'TOUR DOLOMITI · 19 LUG',
  'GRAN RADUNO ROMA · 26 LUG',
  'TRACK DAY VALLELUNGA · 3 AGO',
  'TOUR COSTIERA AMALFITANA · 10 AGO',
]

export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
          <CarScene mouse={mouse} />
        </Suspense>
      </div>

      {/* Left gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/55 to-transparent pointer-events-none" />
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />

      {/* Hero text — left column */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-[#ff4500] text-xs font-bold tracking-[0.35em] uppercase mb-5"
        >
          ◆ La Piattaforma Premium
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-[6.5rem] leading-none tracking-tight mb-6 font-bebas"
        >
          VIVI LA
          <br />
          <span className="gradient-text">PASSIONE</span>
          <br />
          DEL MOTORE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="text-gray-400 text-base md:text-lg mb-10 max-w-lg leading-relaxed"
        >
          Raduni, Car Meet, Track Day e Tour Panoramici.
          <br className="hidden md:block" />
          Unisciti alla community italiana degli appassionati.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="flex flex-col sm:flex-row gap-4"
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-14 flex gap-10"
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
      </div>

      {/* Event type badges — right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
      >
        {[
          { label: 'RADUNO', color: '#ff4500' },
          { label: 'CAR MEET', color: '#ff4500' },
          { label: 'TRACK DAY', color: '#ff6b00' },
          { label: 'TOUR', color: '#ffaa00' },
        ].map(({ label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 + i * 0.1 }}
            className="px-4 py-2 glass-card rounded-full text-xs font-bold tracking-widest"
            style={{ color }}
          >
            {label}
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Scorri</span>
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
