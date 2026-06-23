import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { events } from '../data/events'

const typeColors = {
  RADUNO: '#ff4500',
  'CAR MEET': '#ff4500',
  'TRACK DAY': '#ff6b00',
  TOUR: '#ffaa00',
}

/* Simplified Italy outline in a 340×500 viewBox */
const ITALY_PATH = `
  M 100,28 L 118,18 L 145,12 L 178,10 L 210,14 L 238,22 L 262,32 L 278,46
  L 285,58 L 282,72 L 275,90 L 270,108 L 268,128 L 272,148 L 280,168
  L 290,190 L 298,214 L 302,238 L 300,258 L 295,278 L 292,296 L 298,314
  L 308,330 L 318,344 L 326,358 L 322,372 L 310,382 L 296,386 L 282,380
  L 272,368 L 268,354 L 274,342 L 286,336 L 296,338 L 298,350 L 288,360
  L 278,362 L 270,355 L 272,344 L 282,340
  M 282,340 L 270,338 L 258,334 L 244,326 L 234,314 L 226,300 L 218,282
  L 210,260 L 202,240 L 194,220 L 182,200 L 168,182 L 152,165 L 136,148
  L 118,128 L 106,108 L 98,88 L 96,68 L 98,48 L 100,28
`

export default function MapSection() {
  const [activeEvent, setActiveEvent] = useState(null)

  return (
    <section id="map" className="py-28 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-[#ff4500] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            ◆ Dove siamo
          </p>
          <h2 className="text-5xl md:text-6xl font-bebas tracking-tight mb-4">
            EVENTI IN <span className="gradient-text">ITALIA</span>
          </h2>
          <div className="w-20 h-0.5 bg-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map visualization */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Radar background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[280, 220, 160, 100].map(r => (
                  <div
                    key={r}
                    className="absolute rounded-full border border-[#ff4500]/6"
                    style={{ width: r, height: r }}
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 340 500"
                className="w-full drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 1px #ff450020)' }}
              >
                {/* Italy outline */}
                <path
                  d={ITALY_PATH}
                  fill="none"
                  stroke="#ff4500"
                  strokeWidth="1"
                  strokeOpacity="0.18"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Subtle Italy fill */}
                <path
                  d={ITALY_PATH}
                  fill="#ff4500"
                  fillOpacity="0.03"
                  strokeLinejoin="round"
                />

                {/* Connecting lines between markers */}
                {events.slice(0, -1).map((evt, i) => {
                  const next = events[i + 1]
                  const x1 = parseFloat(evt.mapX) * 3.4
                  const y1 = parseFloat(evt.mapY) * 5.0
                  const x2 = parseFloat(next.mapX) * 3.4
                  const y2 = parseFloat(next.mapY) * 5.0
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#ff4500"
                      strokeWidth="0.4"
                      strokeOpacity="0.15"
                      strokeDasharray="3,4"
                    />
                  )
                })}

                {/* Event markers */}
                {events.map((evt, i) => {
                  const cx = parseFloat(evt.mapX) * 3.4
                  const cy = parseFloat(evt.mapY) * 5.0
                  const color = typeColors[evt.type]
                  const isActive = activeEvent?.id === evt.id

                  return (
                    <g
                      key={evt.id}
                      onClick={() => setActiveEvent(isActive ? null : evt)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulse ring */}
                      <circle cx={cx} cy={cy} r={isActive ? 14 : 10} fill={color} fillOpacity="0.08">
                        <animate attributeName="r" values={isActive ? "12;18;12" : "8;13;8"} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="fill-opacity" values="0.12;0.02;0.12" dur="2s" repeatCount="indefinite" />
                      </circle>
                      {/* Dot */}
                      <circle cx={cx} cy={cy} r={isActive ? 5 : 3.5} fill={color} fillOpacity="0.95" />
                      {/* Inner dot */}
                      <circle cx={cx} cy={cy} r={isActive ? 2 : 1.2} fill="#fff" fillOpacity="0.9" />
                      {/* City label */}
                      <text
                        x={cx + 8}
                        y={cy + 1}
                        fontSize="6"
                        fill={color}
                        fillOpacity="0.85"
                        fontFamily="Inter, sans-serif"
                        fontWeight="700"
                        letterSpacing="0.5"
                      >
                        {evt.city.toUpperCase()}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </motion.div>

          {/* Event list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {events.map((evt, i) => {
              const isActive = activeEvent?.id === evt.id
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  onClick={() => setActiveEvent(isActive ? null : evt)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'border-[#ff4500]/50 bg-[#ff4500]/8'
                      : 'border-white/6 bg-white/2 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-lg"
                      style={{ background: typeColors[evt.type], boxShadow: `0 0 8px ${typeColors[evt.type]}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black tracking-widest" style={{ color: typeColors[evt.type] }}>
                          {evt.type}
                        </span>
                        <span className="text-xs text-gray-500">{evt.date}</span>
                      </div>
                      <p className="font-bold text-sm text-white mt-0.5 truncate">{evt.title}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{evt.city}</span>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-gray-400 mt-3 leading-relaxed overflow-hidden"
                      >
                        {evt.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
