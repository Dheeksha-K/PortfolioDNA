import { CheckCircle2, XCircle, Code2, Briefcase, AtSign, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { DetectedInfo } from '../../types/analysis'

interface Props { detected: DetectedInfo }

function Bool({ val, label }: { val: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {val ? (
        <CheckCircle2 size={13} className="text-success shrink-0" />
      ) : (
        <XCircle size={13} className="text-muted shrink-0" />
      )}
      <span className={`text-xs ${val ? 'text-muted-2' : 'text-muted'}`}>{label}</span>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted">{label}</span>
      {value ? (
        <span className="text-xs text-muted-2 break-words leading-relaxed">{value}</span>
      ) : (
        <span className="text-xs text-muted italic">Not found</span>
      )}
    </div>
  )
}

export default function DetectedInfoCard({ detected }: Props) {
  const [showHeadings, setShowHeadings] = useState(false)

  return (
    <div className="card p-5">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-5">Detected Information</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadata */}
        <div className="lg:col-span-2 space-y-0">
          <p className="text-xs font-medium text-muted-2 mb-2">Metadata</p>
          <div className="bg-surface-2 rounded-lg px-4 divide-y divide-border">
            <MetaRow label="Page Title" value={detected.pageTitle} />
            <MetaRow label="Meta Description" value={detected.metaDescription} />
            <MetaRow label="OG Title" value={detected.openGraph?.title} />
            <MetaRow label="OG Description" value={detected.openGraph?.description} />
            <MetaRow label="OG Image" value={detected.openGraph?.image} />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <p className="text-xs font-medium text-muted-2 mb-3">Page Features</p>
          <div className="space-y-2">
            <Bool val={detected.hasViewportTag} label="Viewport meta tag" />
            <Bool val={detected.hasLangAttribute} label="HTML lang attribute" />
            <Bool val={detected.hasProjectSection} label="Projects section" />
            <Bool val={detected.hasSkillsSection} label="Skills section" />
            <Bool val={detected.hasContactInfo} label="Contact information" />
            <Bool val={detected.hasCTA} label="Call-to-action" />
            <Bool val={detected.hasResume} label="Resume / CV linked" />
            <Bool val={detected.hasDarkMode} label="Dark mode support" />
          </div>

          {/* Social links */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-2 mb-3">Social Links</p>
            <div className="space-y-2">
              {[
                { icon: Code2, key: 'github', label: 'GitHub' },
                { icon: Briefcase, key: 'linkedin', label: 'LinkedIn' },
                { icon: AtSign, key: 'twitter', label: 'Twitter / X' },
                { icon: Mail, key: 'email', label: 'Email' },
              ].map(({ icon: Icon, key, label }) => {
                const val = detected.socialLinks?.[key as keyof typeof detected.socialLinks]
                return (
                  <div key={key} className="flex items-center gap-2">
                    <Icon size={13} className={val ? 'text-brand' : 'text-muted'} />
                    {val ? (
                      <a
                        href={val.startsWith('http') ? val : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand hover:underline truncate max-w-[180px]"
                      >
                        {label} ✓
                      </a>
                    ) : (
                      <span className="text-xs text-muted">{label} — not found</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Image alt text */}
      {detected.totalImages > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-2 mb-1">Image Alt Text</p>
          <p className="text-xs text-muted">
            {detected.imagesWithAlt} of {detected.totalImages} images have alt text
            {detected.imagesWithoutAlt > 0 && (
              <span className="text-warning ml-1">({detected.imagesWithoutAlt} missing)</span>
            )}
          </p>
        </div>
      )}

      {/* Heading hierarchy */}
      {detected.headingHierarchy?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setShowHeadings(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-2 hover:text-primary transition-colors"
          >
            {showHeadings ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Heading Hierarchy ({detected.headingHierarchy.length} headings)
          </button>
          {showHeadings && (
            <div className="mt-3 space-y-1 max-h-40 overflow-y-auto pr-1">
              {detected.headingHierarchy.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-brand bg-brand/10 px-1.5 py-0.5 rounded shrink-0">{h.tag.toUpperCase()}</span>
                  <span className="text-xs text-muted leading-relaxed">{h.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
