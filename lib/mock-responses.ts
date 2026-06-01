/** Pre-written AI responses for the mock streaming demo */
export const MOCK_RESPONSES: Record<string, string> = {
  default: `Here's what I've put together for you:

**Analysis Complete** — I've processed your request and identified several key insights. The data suggests a strong correlation between the variables you mentioned.

### Key Findings
1. **Pattern Recognition** — There's a recurring theme in the dataset that aligns with your hypothesis
2. **Optimization Opportunity** — I found 3 areas where efficiency could be improved by approximately 40%
3. **Risk Assessment** — The current approach has minimal downside with significant upside potential

Would you like me to dive deeper into any of these areas, or shall I generate a detailed report?`,

  code: `Here's a clean implementation approach:

\`\`\`typescript
interface DataProcessor {
  transform(input: RawData): ProcessedData;
  validate(data: ProcessedData): boolean;
  export(data: ProcessedData, format: OutputFormat): string;
}

class ConnectorProcessor implements DataProcessor {
  private cache = new Map<string, ProcessedData>();
  
  transform(input: RawData): ProcessedData {
    const cached = this.cache.get(input.id);
    if (cached) return cached;
    
    const result = this.pipeline(input);
    this.cache.set(input.id, result);
    return result;
  }
}
\`\`\`

This uses a caching strategy to avoid redundant processing. The interface ensures type safety across your pipeline.`,

  brainstorm: `Let me help you brainstorm! Here are some creative directions:

🎯 **Core Concept**: Build around the idea of "connected intelligence" — where each node in the canvas represents a thought that can link to others.

💡 **Feature Ideas**:
- **Smart Clustering** — Auto-group related nodes by semantic similarity
- **Time Travel** — Scrub through the evolution of your canvas over time
- **Collaborative Spaces** — Share specific canvas regions with team members
- **AI Synthesis** — Select multiple nodes and have AI summarize the connections

🎨 **Visual Direction**:
- Organic, flowing connection lines between nodes
- Color-coded categories with gentle gradients
- Ambient particle effects that respond to activity level

Which direction excites you most?`,

  research: `Here's a research summary based on your query:

## Literature Review

The current body of research suggests several promising avenues:

| Study | Year | Key Finding | Relevance |
|-------|------|-------------|-----------|
| Chen et al. | 2024 | Neural scaling laws apply to multimodal systems | High |
| Patel & Kim | 2025 | Retrieval-augmented approaches outperform fine-tuning | Medium |
| Nakamura | 2025 | Efficiency gains plateau beyond 10B parameters | High |

### Synthesis
The evidence points toward a hybrid approach combining retrieval augmentation with selective fine-tuning. This aligns with the efficiency constraints you mentioned.

### Recommended Next Steps
1. Prototype the retrieval pipeline with your existing dataset
2. Benchmark against the baseline metrics from Chen et al.
3. Iterate on the retrieval strategy before scaling`,

  design: `Here's a design direction for your project:

## Visual System

**Color Palette**: I recommend a split-complementary scheme anchored in deep indigo (#1a1a2e) with accents in coral (#ff6b6b) and teal (#4ecdc4).

**Typography Hierarchy**:
- Display: Geist Bold 48px — for hero elements
- Heading: Geist Semibold 24px — for section titles
- Body: Inter Regular 16px — for readable content
- Caption: Inter 12px — for metadata

**Component Style**:
- Glassmorphic cards with 8px blur
- Subtle gradient borders on hover
- Micro-animations on state changes (200ms ease-out)

**Layout**: Responsive grid with 12 columns, 24px gutter. Content maxes at 1200px but canvas extends infinitely.

Want me to generate specific component mockups?`,
};

/** Pick a contextual response based on keywords in the prompt */
export function pickResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('code') || lower.includes('implement') || lower.includes('function') || lower.includes('build')) {
    return MOCK_RESPONSES.code;
  }
  if (lower.includes('brainstorm') || lower.includes('idea') || lower.includes('creative')) {
    return MOCK_RESPONSES.brainstorm;
  }
  if (lower.includes('research') || lower.includes('study') || lower.includes('paper') || lower.includes('literature')) {
    return MOCK_RESPONSES.research;
  }
  if (lower.includes('design') || lower.includes('ui') || lower.includes('visual') || lower.includes('layout')) {
    return MOCK_RESPONSES.design;
  }
  return MOCK_RESPONSES.default;
}
