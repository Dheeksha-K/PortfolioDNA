import { Dna, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand/20 flex items-center justify-center border border-brand/30">
              <Dna size={12} className="text-brand" />
            </div>
            <span className="text-sm font-medium text-primary">
              Portfolio<span className="text-brand">DNA</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={13} className="text-muted-2" />
            <span>
              <strong className="text-muted-2">Privacy First</strong> — Reports are generated only for the current session.
              PortfolioDNA does not publicly expose analyzed websites.
            </span>
          </div>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} PortfolioDNA
          </p>
        </div>
      </div>
    </footer>
  )
}
