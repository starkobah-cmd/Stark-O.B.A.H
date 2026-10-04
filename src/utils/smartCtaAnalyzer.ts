export interface SmartCtaRecommendation {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  bestMatch?: any;
  alternatives?: any[];
  badge?: string;
  description?: string;
  footerNote?: string;
  theme?: string;
  layout?: string;
  detectedTopicName?: string;
  topicId?: string;
}

export function analyzeArticleForCta(html: string): SmartCtaRecommendation {
  const match = {
    title: "Need Expert Engineering or SEO Support?",
    buttonText: "Schedule Consultation",
    buttonUrl: "/contact",
    badge: "Scale Growth",
    description: "Connect directly with our senior full-stack and growth architects.",
    footerNote: "No obligations. Direct architectural feedback.",
    theme: "orange",
    layout: "banner",
    detectedTopicName: "Engineering & Growth",
    topicId: "engineering"
  };

  return {
    ...match,
    bestMatch: match,
    alternatives: [match]
  };
}
