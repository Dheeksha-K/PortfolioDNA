import { motion } from 'framer-motion'
import { Dna, ArrowLeft } from 'lucide-react'

interface NavbarProps {
  onLogoClick: () => void
  showBack: boolean
  onBack: () => void
}

export default function Navbar({ onLogoClick, showBack, onBack }: NavbarProps) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-7 h-7 rounded-lg bg-brand/20 flex items-center justify-center border border-brand/30 group-hover:bg-brand/30 transition-colors">
            <Dna size={14} className="text-brand" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-primary">
            Portfolio<span className="text-brand">DNA</span>
          </span>
        </button>

        {/* Nav links or back button */}
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            New Analysis
          </button>
        ) : (
          <nav className="flex items-center gap-1">
            {['features', 'how-it-works', 'about'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-3 py-1.5 text-sm text-muted hover:text-primary transition-colors rounded-md hover:bg-surface-2 capitalize"
              >
                {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <button
              onClick={() => scrollTo('analyze')}
              className="ml-2 px-3 py-1.5 text-sm font-medium bg-primary text-background rounded-md hover:bg-accent transition-colors"
            >
              Start Analysis
            </button>
          </nav>
        )}
      </div>
    </motion.header>
  )
}
