import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calendarEvents } from '../data/events'

const DAYS_OF_WEEK = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
// July 2026: starts on Wednesday → index 2 (0 = LUN)
const MONTH_START_INDEX = 2
const DAYS_IN_MONTH = 31

function buildCalendarCells() {
  const cells = []
  for (let i = 0; i < 35; i++) {
    const day = i - MONTH_START_INDEX + 1
    cells.push(day >= 1 && day <= DAYS_IN_MONTH ? day : null)
  }
  return cells
}

const cells = buildCalendarCells()

const typeColors = {
  RADUNO: '#ff4500',
  'CAR MEET': '#ff4500',
  'TRACK DAY': '#ff6b00',
  TOUR: '#ffaa00',
}

export default function CalendarSection() {
  const [selected, setSelected] = useState(null)

  const today = 23 // June 23 context — highlight reference

  return (
    <section id="calendar" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-14"
      >
        <p className="text-[#ff4500] text-xs font-bold tracking-[0.3em] uppercase mb-3">
          ◆ Agenda eventi
        </p>
        <h2 className="text-5xl md:text-6xl font-bebas tracking-tight mb-4">
          LUGLIO <span className="gradient-text">2026</span>
        </h2>
        <div className="w-20 h-0.5 bg-[#ff4500] shadow-[0_0_10px_#ff4500]" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-3">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-600 tracking-widest py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              const eventInfo = day ? calendarEvents[day] : null
              const isSelected = selected === day
              const color = eventInfo ? typeColors[eventInfo.type] : null

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.01 }}
                  onClick={() => day && setSelected(isSelected ? null : day)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center relative
                    transition-all duration-200
                    ${!day ? 'opacity-0 pointer-events-none' : ''}
                    ${eventInfo ? 'cursor-pointer' : 'cursor-default'}
                    ${isSelected ? 'scale-110' : ''}
                  `}
                  style={{
                    background: isSelected
                      ? `${color}22`
                      : eventInfo
                      ? `${color}0d`
                      : 'rgba(255,255,255,0.025)',
                    border: isSelected
                      ? `1px solid ${color}70`
                      : eventInfo
                      ? `1px solid ${color}30`
                      : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isSelected ? `0 0 16px ${color}40` : 'none',
                  }}
                >
                  {day && (
                    <>
                      <span
                        className="text-sm font-bold leading-none"
                        style={{ color: isSelected ? color : eventInfo ? '#fff' : '#555' }}
                      >
                        {day}
                      </span>
                      {eventInfo && (
                        <span
                          className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                          style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Event detail panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            {selected ? `${selected} Luglio 2026` : 'Seleziona una data'}
          </h3>

          <AnimatePresence mode="wait">
            {selected && calendarEvents[selected] ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-6"
                style={{ borderColor: `${typeColors[calendarEvents[selected].type]}30` }}
              >
                <div
                  className="text-[10px] font-black tracking-widest uppercase mb-3"
                  style={{ color: typeColors[calendarEvents[selected].type] }}
                >
                  {calendarEvents[selected].type}
                </div>
                <h4 className="text-lg font-black text-white mb-2">
                  {calendarEvents[selected].title}
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  {selected} Luglio 2026
                </p>
                <a
                  href="#events"
                  className="block text-center py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  style={{
                    background: typeColors[calendarEvents[selected].type],
                    color: '#000',
                  }}
                >
                  Dettagli evento →
                </a>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Upcoming events list */}
                {Object.entries(calendarEvents).map(([day, evt]) => (
                  <div
                    key={day}
                    onClick={() => setSelected(Number(day))}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/2 hover:border-white/12 cursor-pointer transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: `${typeColors[evt.type]}15`, color: typeColors[evt.type] }}
                    >
                      {day}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{evt.title}</div>
                      <div className="text-[10px] text-gray-500">{evt.type}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
