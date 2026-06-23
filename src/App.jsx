import Navbar from './components/Navbar'
import HeroText from './components/HeroText'
import CarShowcase from './components/CarShowcase'
import EventsSection from './components/EventsSection'
import MapSection from './components/MapSection'
import CalendarSection from './components/CalendarSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-[#050505] text-white overflow-x-hidden">
      <Navbar />
      <HeroText />
      <CarShowcase />
      <EventsSection />
      <MapSection />
      <CalendarSection />
      <CTASection />
      <Footer />
    </div>
  )
}
