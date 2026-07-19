import { Layers } from 'lucide-react'

interface Props { techStack: string[] }

export default function TechStackCard({ techStack }: Props) {
  return (
    <div className="card p-5 h-full">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-4">Technology Stack Detected</p>

      {techStack.length === 0 ? (
        <div className="flex items-start gap-2">
          <Layers size={14} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            No specific frameworks or libraries could be identified from the page source.
            The site may use custom code or a technology that does not leave identifiable markers in the HTML.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {techStack.map(tech => (
            <span
              key={tech}
              className="px-2.5 py-1 bg-surface-2 border border-border text-xs text-muted-2 rounded-md font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
