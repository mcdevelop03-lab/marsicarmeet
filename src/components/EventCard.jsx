import { motion } from 'framer-motion'

const typeIcons = {
  RADUNO: '🏁',
  'CAR MEET': '🚗',
  'TRACK DAY': '⏱',
  TOUR: '🏔',
}

export default function EventCard({ event, index }) {
  const pct = Math.round((event.participants / event.maxParticipants) * 100)
  const isFull = pct >= 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
          style={{ color: event.typeColor, background: `${event.typeColor}18`, border: `1px solid ${event.typeColor}40` }}
        >
          {typeIcons[event.type]} {event.type}
        </div>
        {event.featured && (
          <span className="text-[10px] font-bold text-[#ffaa00] tracking-widest uppercase opacity-80">
            ★ In evidenza
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-black tracking-tight text-white leading-tight group-hover:text-[#ff6b00] transition-colors duration-300">
        {event.title}
      </h3>

      {/* Date & Location */}
      <div className="flex flex-col gap-1.5 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-[#ff4500]">◷</span>
          <span>{event.date} · {event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#ff4500]">◎</span>
          <span>{event.location}, <strong className="text-gray-300">{event.city}</strong></span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {event.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {event.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-white/5 rounded-full border border-white/8"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Participants bar */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider">
          <span>Partecipanti</span>
          <span style={{ color: isFull ? '#ff4500' : undefined }}>
            {event.participants} / {event.maxParticipants} {isFull && '· SOLD OUT'}
          </span>
        </div>
        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + index * 0.08 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${event.typeColor}, ${event.typeColor}aa)` }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        className="mt-auto w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          background: isFull ? 'transparent' : event.typeColor,
          color: isFull ? event.typeColor : '#000',
          border: isFull ? `1px solid ${event.typeColor}50` : 'none',
        }}
        disabled={isFull}
      >
        {isFull ? 'Lista d\'attesa →' : 'Registrati →'}
      </button>
    </motion.div>
  )
}
