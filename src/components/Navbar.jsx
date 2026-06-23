import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Eventi', href: '#events' },
  { label: 'Mappa', href: '#map' },
  { label: 'Calendario', href: '#calendar' },
  { label: 'Partecipa', href: '#cta' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-2xl border-b border-[#ff4500]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center group-hover:bg-[#ff6b00] transition-colors neon-glow">
            <span className="text-black font-black text-xs tracking-tighter">RM</span>
          </div>
          <span className="font-black text-base tracking-tight">
            MARSICA<span className="text-[#ff4500]">RMEET</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hover:text-white transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <a
          href="#cta"
          className="hidden md:block px-5 py-2 bg-[#ff4500] text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#ff6b00] transition-all duration-300 neon-glow"
        >
          Iscriviti
        </a>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-t border-[#ff4500]/15"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-gray-300 hover:text-white border-b border-white/5 font-medium transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-4 py-3 text-center bg-[#ff4500] text-black font-bold text-sm uppercase tracking-widest rounded-full"
              >
                Iscriviti
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
