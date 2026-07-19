export interface OpenGraph {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
}

export interface SocialLinks {
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  email: string | null;
}

export interface HeadingNode {
  tag: string;
  text: string;
}

export interface DetectedInfo {
  pageTitle: string | null;
  metaDescription: string | null;
  openGraph: OpenGraph;
  headingHierarchy: HeadingNode[];
  navigationItems: string[];
  hasViewportTag: boolean;
  socialLinks: SocialLinks;
  hasContactInfo: boolean;
  hasProjectSection: boolean;
  hasSkillsSection: boolean;
  hasResume: boolean;
  hasDarkMode: boolean;
  hasCTA: boolean;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  totalImages: number;
  hasLangAttribute: boolean;
}

export interface Scores {
  overall: number | null;
  seo: number | null;
  accessibility: number | null;
  content: number | null;
  branding: number | null;
}

export interface Issue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  issue: string;
  reason: string;
  impact: string;
  suggestedFix: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AccessibilitySummary {
  hasLangAttribute: boolean;
  altTextCoverage: 'full' | 'partial' | 'none' | 'no-images';
  hasAriaLabels: boolean;
  hasSkipLinks: boolean;
  hasViewportTag: boolean;
  hasFocusStyles: boolean | null;
}

export interface AnalysisResult {
  isPortfolio: boolean;
  notPortfolioMessage?: string;
  error?: string;
  overview: {
    url: string;
    title: string | null;
    analyzedAt: string;
  };
  detected: DetectedInfo;
  scores: Scores;
  strengths: string[];
  issues: Issue[];
  recommendations: Recommendation[];
  techStack: string[];
  colorPalette: string[];
  accessibility: AccessibilitySummary;
}
