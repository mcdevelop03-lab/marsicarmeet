import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function useCountdown(targetDate) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return t
}

function SparkleCanvas() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      hue: Math.random() > 0.5 ? '#ff4500' : '#ff6b00',
    }))

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.002
        if (p.alpha <= 0 || p.y < 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 4
          p.alpha = Math.random() * 0.7 + 0.3
          p.vy = -Math.random() * 0.6 - 0.2
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.hue
        ctx.globalAlpha = p.alpha * 0.5
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default function CTASection() {
  // Next event: Raduno Notturno Milano on July 5 2026 at 21:00
  const countdown = useCountdown('2026-07-05T21:00:00')

  const units = [
    { label: 'GIORNI', value: countdown.days },
    { label: 'ORE', value: countdown.hours },
    { label: 'MIN', value: countdown.minutes },
    { label: 'SEC', value: countdown.seconds },
  ]

  return (
    <section id="cta" className="relative py-32 overflow-hidden bg-[#030303]">
      {/* Animated background sparks */}
      <SparkleCanvas />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)' }}
        />
      </div>

      {/* Horizontal accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff4500]/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff4500]/30 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#ff4500] text-xs font-bold tracking-[0.3em] uppercase mb-6">
            ◆ Prossimo evento in
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-10">
            {units.map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-6 md:gap-10">
                <div className="text-center">
                  <motion.div
                    key={value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-5xl md:text-7xl font-bebas tabular-nums text-white"
                    style={{ textShadow: '0 0 30px rgba(255,69,0,0.3)' }}
                  >
                    {String(value).padStart(2, '0')}
                  </motion.div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1">{label}</div>
                </div>
                {i < units.length - 1 && (
                  <span className="text-3xl font-bebas text-[#ff4500]/40 mb-4">:</span>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas tracking-tight mb-4">
            PRONTO A SCENDERE
            <br />
            <span className="gradient-text">IN PISTA?</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Iscriviti gratuitamente e accedi a tutti gli eventi della community.
            Non perdere il prossimo raduno.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#events"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-[#ff4500] text-black font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 neon-glow"
            >
              Trova il prossimo raduno →
            </motion.a>
            <motion.a
              href="#events"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 border border-[#ff4500]/30 text-[#ff4500] font-bold text-sm uppercase tracking-widest rounded-full hover:border-[#ff4500]/60 hover:bg-[#ff4500]/5 transition-all duration-300"
            >
              Sfoglia tutti gli eventi
            </motion.a>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-10"
        >
          {[
            { num: '2.400+', label: 'Iscritti alla community' },
            { num: '48', label: 'eventi organizzati nel 2026' },
            { num: '4.9 ★', label: 'valutazione media eventi' },
            { num: '12', label: 'regioni coperte' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black gradient-text">{num}</div>
              <div className="text-xs text-gray-600 mt-1 max-w-[120px]">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
