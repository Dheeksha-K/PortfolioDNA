import { Palette } from 'lucide-react'

interface Props { palette: string[] }

export default function ColorPaletteCard({ palette }: Props) {
  return (
    <div className="card p-5 h-full">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-4">Color Palette Detected</p>

      {palette.length === 0 ? (
        <div className="flex items-start gap-2">
          <Palette size={14} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            No inline colors could be extracted from the page HTML.
            Colors may be defined in external stylesheets that were not analyzed.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {palette.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
              <span className="text-[10px] font-mono text-muted">{color}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
