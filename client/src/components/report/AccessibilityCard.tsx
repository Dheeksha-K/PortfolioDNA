import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import type { AccessibilitySummary } from '../../types/analysis'

interface Props { accessibility: AccessibilitySummary }

function Row({
  label,
  value,
  description,
}: {
  label: string
  value: boolean | null | string
  description?: string
}) {
  const isUnknown = value === null
  const isPassed = value === true || value === 'full' || value === 'no-images'
  const isPartial = value === 'partial'

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      {isUnknown ? (
        <HelpCircle size={14} className="text-muted shrink-0 mt-0.5" />
      ) : isPassed ? (
        <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
      ) : isPartial ? (
        <CheckCircle2 size={14} className="text-warning shrink-0 mt-0.5" />
      ) : (
        <XCircle size={14} className="text-danger shrink-0 mt-0.5" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-2">{label}</p>
        {description && <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <span className={`text-[10px] font-medium shrink-0 ml-auto ${
        isUnknown ? 'text-muted' :
        isPassed ? 'text-success' :
        isPartial ? 'text-warning' :
        'text-danger'
      }`}>
        {isUnknown ? 'Unknown' : isPassed ? 'Pass' : isPartial ? 'Partial' : 'Fail'}
      </span>
    </div>
  )
}

export default function AccessibilityCard({ accessibility }: Props) {
  const altDesc = {
    'full': 'All images have alt text.',
    'partial': 'Some images are missing alt text.',
    'none': 'No images have alt text.',
    'no-images': 'No images found on the page.',
  }

  return (
    <div className="card p-5">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-2">Accessibility Summary</p>
      <p className="text-xs text-muted mb-4">
        Based on static HTML analysis. Dynamic behaviors (keyboard navigation, focus traps, contrast ratios) require browser rendering to evaluate fully.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <Row
            label="HTML lang attribute"
            value={accessibility.hasLangAttribute}
            description="Tells screen readers which language to use."
          />
          <Row
            label="Viewport meta tag"
            value={accessibility.hasViewportTag}
            description="Ensures correct rendering on mobile devices."
          />
          <Row
            label="Image alt text"
            value={accessibility.altTextCoverage}
            description={altDesc[accessibility.altTextCoverage]}
          />
        </div>
        <div>
          <Row
            label="ARIA labels"
            value={accessibility.hasAriaLabels}
            description="Provides additional context for screen readers."
          />
          <Row
            label="Skip navigation links"
            value={accessibility.hasSkipLinks}
            description="Allows keyboard users to skip repetitive navigation."
          />
          <Row
            label="Focus styles"
            value={accessibility.hasFocusStyles}
            description="Not determinable from static HTML alone."
          />
        </div>
      </div>
    </div>
  )
}
