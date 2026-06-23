import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { events, eventTypes } from '../data/events'
import EventCard from './EventCard'

export default function EventsSection() {
  const [activeFilter, setActiveFilter] = useState('Tutti')

  const filtered = activeFilter === 'Tutti'
    ? events
    : events.filter(e => e.type === activeFilter)

  return (
    <section id="events" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-14"
      >
        <p className="text-[#ff4500] text-xs font-bold tracking-[0.3em] uppercase mb-3">
          ◆ Calendario 2026
        </p>
        <h2 className="text-5xl md:text-6xl font-bebas tracking-tight mb-4">
          PROSSIMI <span className="gradient-text">EVENTI</span>
        </h2>
        <div className="w-20 h-0.5 bg-[#ff4500] shadow-[0_0_10px_#ff4500]" />
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {eventTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeFilter === type
                ? 'bg-[#ff4500] text-black neon-glow'
                : 'border border-white/10 text-gray-400 hover:border-[#ff4500]/40 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Cards grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-600"
        >
          Nessun evento trovato per questa categoria.
        </motion.div>
      )}
    </section>
  )
}
