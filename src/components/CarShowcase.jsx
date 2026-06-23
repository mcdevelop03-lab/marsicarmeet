import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { useScroll, useTransform } from 'framer-motion'

const CarScene = lazy(() => import('./CarScene'))

export default function CarShowcase() {
  const sectionRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Both sets always computed — useTransform cannot be called conditionally
  const desktopCarX    = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-12, 0, 1.2, 1.2])
  const desktopCarRotY = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.25, 0.08, 0, 0])
  const mobileCarX     = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-6, 0, 0, 0])
  const mobileCarRotY  = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.15, 0.04, 0, 0])

  const carX    = isMobile ? mobileCarX    : desktopCarX
  const carRotY = isMobile ? mobileCarRotY : desktopCarRotY

  return (
    <section ref={sectionRef} className="relative h-[150vh] bg-[#050505]">
      <div className="sticky top-0 h-screen">
        <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
          <CarScene
            mouse={mouse}
            isMobile={isMobile}
            carX={carX}
            carRotY={carRotY}
          />
        </Suspense>
      </div>
    </section>
  )
}
