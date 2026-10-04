import type { LLMTarget, PromptTone, PromptFramework, PromptResult } from '../types';

export const TARGET_MODELS: { id: LLMTarget; name: string; badge: string; color: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT-4o', badge: 'OpenAI', color: 'from-emerald-500 to-teal-700' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', badge: 'Anthropic', color: 'from-amber-500 to-orange-700' },
  { id: 'gemini', name: 'Gemini 1.5 Pro', badge: 'Google', color: 'from-blue-500 to-indigo-700' },
  { id: 'perplexity', name: 'Perplexity Pro', badge: 'Research', color: 'from-cyan-500 to-blue-700' },
  { id: 'deepseek', name: 'DeepSeek R1', badge: 'Reasoning', color: 'from-blue-600 to-violet-800' },
];

export const TONE_OPTIONS: { id: PromptTone; label: string; icon: string; desc: string }[] = [
  { id: 'auto', label: '✦ Autonomous Deep Thought', icon: '✨', desc: 'Deeply analyzes subject matter and reasoning complexity automatically' },
  { id: 'academic', label: 'Academic & Tutor', icon: '📚', desc: 'Syllabus, step-by-step learning & exam prep (SPM, Math, etc.)' },
  { id: 'coder', label: 'Strict Coder', icon: '💻', desc: 'Production-ready code, typing & zero fluff' },
  { id: 'concise', label: 'Concise & Punchy', icon: '⚡', desc: 'No pleasantries, bulleted direct answers' },
  { id: 'socratic', label: 'Socratic Tutor', icon: '🎓', desc: 'Guided inquiry and progressive explanation' },
  { id: 'creative', label: 'Creative Spark', icon: '💡', desc: 'Brainstorming novel ideas and metaphors' },
  { id: 'executive', label: 'Executive Brief', icon: '📊', desc: 'ROI, decision matrices, strategic impact' },
  { id: 'architect', label: 'Senior Architect', icon: '🏛️', desc: 'System design, modularity & scalability' },
];

export const FRAMEWORK_OPTIONS: { id: PromptFramework; label: string; description: string }[] = [
  { id: 'cgc', label: 'Context-Goal-Constraints (Master Prompt)', description: 'Proven high-precision framework with deep reasoning protocols' },
  { id: 'stepbystep', label: 'Chain of Thought (Step-by-Step)', description: 'Forces model to reason through sequential phases before answering' },
  { id: 'persona_constraints', label: 'Role + Anti-Hallucination Guardrails', description: 'Strict boundaries and explicit formatting rules' },
];

export interface DeepAnalysisResult {
  domainKey: string;
  subjectTitle: string;
  cognitiveIntent: string;
  expertPersona: string;
  reasoningPhases: string[];
  deliverables: string[];
  guardrails: string[];
}

/**
 * Universal Autonomous Deep Thinking Engine:
 * In-depth cognitive analysis that dynamically deconstructs ANY prompt across
 * all knowledge domains, everyday tasks, technical fields, and creative endeavors.
 */
export function deepAnalyzePrompt(input: string): DeepAnalysisResult {
  const lower = input.toLowerCase().trim();

  // 1. CAREER, INTERVIEW & RESUME
  // e.g. "prepare for behavioral interview", "negotiate salary", "review my resume", "write cover letter"
  if (
    /\b(resume|cv|interview|cover letter|salary|negotiat\w*|job offer|job application|hiring manager|recruiter|linkedin profile|behavioral interview|star method|appraisal|promotion)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'career_interview_resume',
      subjectTitle: 'Career Acceleration, Executive Hiring & Interview Strategy',
      cognitiveIntent: 'Maximizing candidate hireability, STAR storytelling, ATS optimization, and executive presence',
      expertPersona:
        'Act as an elite Executive Career Strategist, Former Fortune 500 Head of Talent, and Master Interview Coach.',
      reasoningPhases: [
        'Target Calibration: Identify the role seniority, employer expectations, and key competencies required for top-tier hiring.',
        'STAR Framework Structuring: Formulate achievements with measurable Situation, Task, Action, and Quantified Results.',
        'Anticipate Skepticism & Objections: Preempt potential concerns regarding experience gaps, transitions, or salary expectations.',
        'Executive Polish: Refine the tone to convey high agency, collaborative leadership, and decisive confidence.',
      ],
      deliverables: [
        'High-Impact STAR Script / Tailored Bullet Points with quantified metrics and power verbs.',
        'Anticipated Tough Follow-ups & Curveball Questions with strategic counter-narratives.',
        'Executive Delivery Notes: Verbal pacing, key phrasing anchors, and negotiation levers to maintain confidence.',
      ],
      guardrails: [
        'Use concrete numbers, metrics (% growth, revenue, team size), and active power verbs; eliminate passive clichés.',
        'Ensure all framing is authentic, defensible, and projects executive presence without sounding arrogant.',
      ],
    };
  }

  // 2. BUSINESS STRATEGY, STARTUPS & VENTURE CAPITAL
  // e.g. "write pitch deck", "startup business plan", "SaaS go to market", "competitor analysis", "unit economics"
  if (
    /\b(business plan|pitch deck|startup|investor|venture capital|vc\b|swot|competitor analysis|go to market|gtm|monetization|tam\b|cac\b|ltv\b|saas\b|unit economics|business model|pricing strategy|market research)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'business_strategy_startups',
      subjectTitle: 'Venture Capital Strategy, Business Models & Market Execution',
      cognitiveIntent: 'Constructing investor-grade defensibility, scalable unit economics, and actionable market capture',
      expertPersona:
        'Act as a veteran Silicon Valley Venture Partner, Serial B2B Founder, and Enterprise Growth Strategist.',
      reasoningPhases: [
        'Value Proposition & Market Sizing: Deconstruct the urgency of the problem, ICP (Ideal Customer Profile), and addressable market size.',
        'Moat & Defensibility Analysis: Evaluate structural advantages (network effects, switching costs, IP, proprietary data).',
        'Unit Economics Stress-Testing: Model CAC, LTV, payback windows, gross margins, and churn vulnerability.',
        'Investor Objection Anticipation: Prepare counter-theses for regulatory, market crowding, and platform risk concerns.',
      ],
      deliverables: [
        'Executive Strategic Brief: Core value thesis, proprietary market insight, and unfair competitive advantages.',
        'Structured Monetization & Unit Economics Blueprint: Pricing architecture, gross margin targets, and CAC:LTV mechanics.',
        'Go-To-Market (GTM) Phased Roadmap: Early adopter acquisition channels, sales motion, and 12-month KPI milestones.',
        'Critical Failure Modes & Defensibility Strategies: Competitor response scenarios and contingency buffers.',
      ],
      guardrails: [
        'Ground recommendations in realistic unit economics, verified distribution channels, and market realities.',
        'Eliminate generic entrepreneurial buzzwords; provide concrete metrics and actionable strategic steps.',
      ],
    };
  }

  // 3. MARKETING, SALES & CONVERSION COPYWRITING
  // e.g. "write cold email to pitch SaaS", "landing page copy", "Facebook ad copy", "high converting sales email"
  if (
    /\b(copywriting|ad copy|landing page|sales email|cold email|sales pitch|conversion rate|cro\b|facebook ads?|google ads?|email marketing|sales funnel|headline|tagline|slogan|call to action|cta\b|lead gen)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'marketing_copywriting_sales',
      subjectTitle: 'Direct-Response Copywriting & Conversion Optimization (CRO)',
      cognitiveIntent: 'Attention capture, psychological persuasion, objection obliteration, and friction-free conversion',
      expertPersona:
        'Act as a world-class Direct-Response Copywriter and Conversion Rate Optimization (CRO) Specialist with over $100M in verified campaign revenue.',
      reasoningPhases: [
        'Audience Psychology & Core Trigger: Isolate the prospect’s deepest skepticism, core pain point, and primary aspiration.',
        'Pattern-Interrupt Hook Creation: Engineer an irresistible opening headline that breaks cognitive scroll fatigue.',
        'Persuasion Architecture: Sequence social proof, risk reversal, visceral benefits, and urgency logically.',
        'Friction-Free Action Design: Formulate a low-commitment, high-clarity call-to-action (CTA).',
      ],
      deliverables: [
        'Primary High-Converting Copy: Irresistible hook/subject line, problem agitation, solution reveal, and frictionless CTA.',
        '3 Distinct Angle Variations: (e.g. Pain-Agitate-Solve, Story/Curiosity, Direct ROI/Metric proof).',
        'Objections Handled Matrix: Explicit psychological doubts preempted and risk-reversal guarantees embedded.',
        'A/B Split-Testing Playbook: Top test variables, headline alternatives, and leading conversion metrics to track.',
      ],
      guardrails: [
        'Write with visceral, concrete clarity; avoid passive corporate jargon and generic flattery.',
        'Structure for rapid visual scanning with bold subheads, short paragraphs, and bulleted benefits.',
      ],
    };
  }

  // 4. PRODUCT MANAGEMENT & UX/UI SPECIFICATIONS
  // e.g. "PRD for checkout feature", "user stories with acceptance criteria", "wireframe UX flow"
  if (
    /\b(prd\b|product requirement|user stor\w*|acceptance criteria|wireframe|ux\b|ui design|user persona|user journey|customer journey|feature spec|onboarding flow|mvp\b|product backlog)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'product_management_ux',
      subjectTitle: 'Product Requirements Specification (PRD) & UX Architecture',
      cognitiveIntent: 'Translating strategic objectives into rigorous, developer-ready requirements and frictionless UX flows',
      expertPersona:
        'Act as a Principal Product Manager and Head of Product Design with deep experience in enterprise-scale digital products.',
      reasoningPhases: [
        'User Problem & Metric Definition: Define the target user persona, core pain point, North Star metric, and guardrail KPIs.',
        'End-to-End User State Mapping: Trace every step from entry, normal operation, loading states, to error states.',
        'Edge Cases & Error Handling: Specify fallback behaviors, permission rejections, network latency, and boundary limits.',
        'Engineering Readiness: Format functional requirements into testable Given-When-Then acceptance criteria.',
      ],
      deliverables: [
        'Executive PRD / Feature Specification: Problem statement, user personas, and measurable success metrics.',
        'End-to-End User Journey & Functional Requirements: Step-by-step UI/UX interaction flow and component states.',
        'Developer-Ready User Stories (Given-When-Then format) covering primary paths, validation, and edge cases.',
        'Technical Dependencies & Telemetry Plan: Required API endpoints, data models, and analytics tracking events.',
      ],
      guardrails: [
        'Explicitly define edge cases (empty states, latency, offline, permission rejections).',
        'Ensure all acceptance criteria are unambiguous, testable, and directly implementable by engineering teams.',
      ],
    };
  }

  // 5. DATA SCIENCE, MACHINE LEARNING & AI SYSTEMS
  // e.g. "pandas data cleaning", "train PyTorch model", "build RAG pipeline", "hypothesis testing"
  if (
    /\b(data science|machine learning|deep learning|pandas|numpy|scikit|pytorch|tensorflow|rag\b|fine tuning|llm\b|vector database|embeddings|data visualization|hypothesis test\w*|regression|clustering|neural network|nlp\b|computer vision)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'data_science_ai',
      subjectTitle: 'Data Science, Machine Learning & Applied AI Architecture',
      cognitiveIntent: 'Rigorous statistical methodology, mathematical loss optimization, and production ML pipelines',
      expertPersona:
        'Act as a Principal Data Scientist and AI Research Engineer with deep expertise in statistical learning and production ML systems.',
      reasoningPhases: [
        'Problem Formulation & Loss Definition: Align the analytical objective with proper statistical metrics and validation design.',
        'Data Preprocessing & Feature Engineering: Address missingness, class imbalance, scaling, and feature leakage.',
        'Algorithmic Selection & Trade-offs: Contrast baseline models with complex architectures regarding interpretability vs accuracy.',
        'Validation & Production Monitoring: Design cross-validation strategies, leakage guards, and concept drift metrics.',
      ],
      deliverables: [
        'Methodological Blueprint: Mathematical formulation, data pipeline design, and model architecture rationale.',
        'Production Python Implementation: Clean, vectorized, fully commented code using standard libraries (Pandas/PyTorch/Scikit-Learn).',
        'Validation & Diagnostic Suite: Comprehensive evaluation metrics (ROC-AUC, F1, RMSE) and error analysis.',
        'Deployment Considerations: Latency bottlenecks, inference memory footprint, and data drift monitoring.',
      ],
      guardrails: [
        'Provide syntactically correct, vectorized Python code; avoid inefficient iterative loops where vectorization is standard.',
        'Explicitly guard against data leakage, overfitting, and unrepresentative evaluation splits.',
      ],
    };
  }

  // 6. QUANTITATIVE FINANCE, INVESTMENT & VALUATION
  // e.g. "DCF model for Apple", "financial statement analysis", "crypto portfolio strategy", "budget forecast"
  if (
    /\b(financial model|dcf\b|discounted cash flow|valuation|stocks?|investment|portfolio|crypto|bitcoin|ethereum|balance sheet|income statement|cash flow|accounting|tax\b|budgeting|ebitda|roic|p\/e ratio)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'finance_investment_accounting',
      subjectTitle: 'Quantitative Financial Modeling, Corporate Valuation & Investment Analysis',
      cognitiveIntent: 'Cash flow deconstruction, risk-adjusted valuation, and disciplined capital allocation',
      expertPersona:
        'Act as a Senior Investment Banking Director and Chartered Financial Analyst (CFA) with deep institutional modeling expertise.',
      reasoningPhases: [
        'Cash Flow & Capital Deconstruction: Analyze revenue drivers, operating leverage, working capital needs, and CapEx intensity.',
        'Valuation Sensitivity Modeling: Formulate DCF discount rates (WACC), terminal growth rates, and market multiple comps.',
        'Downside Risk & Liquidity Stress-Testing: Model interest rate shocks, margin compression, and covenant thresholds.',
        'Capital Allocation Thesis: Synthesize quantitative findings into a disciplined, numbers-backed recommendation.',
      ],
      deliverables: [
        'Executive Financial Assessment: Core financial health diagnosis, margin trajectory, and valuation summary.',
        'Quantitative Model Framework: Cash flow dynamics, working capital parameters, and sensitivity matrix (Base/Bull/Bear).',
        'Downside Exposure & Stress Scenarios: Liquidity runway, debt coverage ratios, and key vulnerability triggers.',
        'Actionable Investment / Capital Thesis: Clear execution milestones and target entry/exit valuation benchmarks.',
      ],
      guardrails: [
        'Support conclusions with mathematical ratios (P/E, EV/EBITDA, ROIC, FCF yield) and explicit assumptions.',
        'State parameter assumptions and sensitivity thresholds transparently.',
      ],
    };
  }

  // 7. LEGAL, CONTRACTS & REGULATORY COMPLIANCE
  // e.g. "draft an NDA", "terms of service", "clause for contractor agreement", "indemnification clause"
  if (
    /\b(nda\b|contract|agreement|terms of service|privacy policy|clause|intellectual property|trademark|copyright|patent|indemnification|liability|breach of contract|employment agreement|compliance|gdpr)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'legal_contracts_compliance',
      subjectTitle: 'Corporate Legal Architecture & Contractual Risk Mitigation',
      cognitiveIntent: 'Precise contractual drafting, liability containment, and statutory compliance',
      expertPersona:
        'Act as a Senior Corporate Counsel and Contracts Specialist with deep experience in commercial agreements and risk allocation.',
      reasoningPhases: [
        'Scope & Jurisdiction Framing: Establish governing law, party definitions, and the specific commercial intent.',
        'Risk & Ambiguity Scrutiny: Analyze indemnity scopes, representations, warranties, and termination triggers.',
        'Clause Crafting: Draft enforceable, balanced provisions protecting critical assets without impeding agreement.',
        'Compliance Alignment: Ensure adherence to applicable statutory frameworks (privacy, labor, or intellectual property).',
      ],
      deliverables: [
        'Complete Contractual Provisions: Comprehensive, legally rigorous contract language with defined terms.',
        'Clause-by-Clause Strategic Breakdown: Plain-English explanation of risk allocations, liability caps, and termination rights.',
        'Negotiation Levers & Fallback Language: Recommended redlines and compromise positions for opposing counsel.',
      ],
      guardrails: [
        'Use precise, standardized legal nomenclature; eliminate vague or contradictory definitions.',
        'Include standard notice that text is for drafting structure and should be finalized with qualified legal counsel.',
      ],
    };
  }

  // 8. HEALTH, FITNESS, NUTRITION & PHYSIOLOGY
  // e.g. "push pull legs workout", "hypertrophy routine", "meal plan for fat loss", "intermittent fasting guide"
  if (
    /\b(workout|hypertrophy|gym\b|exercise routine|muscle building|fat loss|diet plan|meal plan|nutrition|macros|protein|caloric deficit|cardio|strength training|bodybuilding|sleep hygiene|intermittent fasting)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'health_fitness_lifestyle',
      subjectTitle: 'Exercise Physiology, Hypertrophy Mechanics & Nutritional Science',
      cognitiveIntent: 'Evidence-based training periodization, biomechanical efficiency, and personalized macronutrient protocols',
      expertPersona:
        'Act as an elite Strength & Conditioning Specialist (CSCS) and Sports Nutritionist with deep expertise in exercise physiology.',
      reasoningPhases: [
        'Physiological Split Design: Balance volume, intensity, exercise order, and neuromuscular recovery.',
        'Biomechanical Selection: Prioritize high stimulus-to-fatigue exercises, joint stability, and full range of motion.',
        'Energy Balance & Macro Calculation: Determine TDEE, caloric targets, and optimal protein/carb/fat distribution.',
        'Progressive Overload System: Establish clear metrics for systematic weight, rep, and volume progression.',
      ],
      deliverables: [
        'Complete Weekly Training Blueprint: Daily exercise selection, target sets, rep ranges, RPE/RIR intensity, and rest intervals.',
        'Nutritional Protocol & Macro Breakdown: Daily calorie targets, macro grams, meal timing, and hydration benchmarks.',
        'Progressive Overload & Deload Rules: Explicit guidelines on when and how to add load and manage systemic fatigue.',
        'Form Cues & Injury Prevention: Key biomechanical checkpoints and common execution traps to avoid.',
      ],
      guardrails: [
        'Ground recommendations in verified exercise physiology and sports nutrition science.',
        'Prioritize joint longevity, safety, and sustainable progressive overload over extreme fads.',
      ],
    };
  }

  // 9. TRAVEL, ITINERARY ARCHITECTURE & LOCAL LOGISTICS
  // e.g. "5 day itinerary in Tokyo", "budget trip to Paris", "vacation planning for family"
  if (
    /\b(travel|itinerary|trip to|vacation|flight|hotel|sightseeing|backpacking|tokyo|paris|japan|europe|bali|places to visit|travel guide|budget trip|tourist)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'travel_itinerary_planning',
      subjectTitle: 'Curated Travel Itinerary Architecture & Logistical Planning',
      cognitiveIntent: 'Geographical routing optimization, authentic local immersion, and frictionless transit logistics',
      expertPersona:
        'Act as a World-Class Travel Concierge, Experienced Expedition Planner, and Local Cultural Specialist.',
      reasoningPhases: [
        'Geographical Cluster Optimization: Group venues by immediate neighborhood to eliminate transit fatigue and backtracking.',
        'Pacing & Energy Sequencing: Balance heavy sightseeing blocks with scenic breaks, cultural dining, and relaxed downtime.',
        'Logistical Verification: Factor in transit pass mechanics, booking lead times, operating hours, and seasonal crowds.',
        'Authentic Cultural Integration: Incorporate regional cuisine specialties, etiquette customs, and hidden neighborhood spots.',
      ],
      deliverables: [
        'Day-by-Day Master Itinerary: Morning, afternoon, and evening blocks with specific venue names, routing, and transit details.',
        'Curated Dining & Neighborhood Gems: Authentic regional food specialties, reservation tips, and scenic coffee stops.',
        'Logistical Blueprint & Budget Estimates: Transport passes, advance ticket requirements, and realistic daily expense tiers.',
        'Local Etiquette, Safety & Pro-Tips: Transit nuances, crowd avoidance strategies, and local cultural norms.',
      ],
      guardrails: [
        'Organize venues strictly by geographic proximity to prevent unfeasible cross-town transit schedules.',
        'Include concrete transit lines/stations and realistic time allocations for each activity.',
      ],
    };
  }

  // 10. CREATIVE WRITING, FICTION & NARRATIVE ARCHITECTURE
  // e.g. "write a sci-fi short story", "screenplay dialogue", "character arc", "novel chapter"
  if (
    /\b(story|novel|screenplay|film script|movie script|video script|youtube script|theatrical script|fiction|sci-fi|fantasy|character arc|worldbuilding|plot twist|poetry|poem|lyrics|comedy|standup|creative writing)\b/i.test(
      lower
    ) ||
    (/\b(script|dialogue)\b/i.test(lower) &&
      !/\b(python|bash|shell|node|code|api|scrape|data|sql|powershell|typescript|javascript|bug|function|endpoint|backend)\b/i.test(
        lower
      ) &&
      /\b(scene|character|film|movie|video|actor|play|theatre|narrative|protagonist)\b/i.test(lower))
  ) {
    return {
      domainKey: 'creative_writing_entertainment',
      subjectTitle: 'Narrative Fiction, Screenwriting & Immersive Storytelling',
      cognitiveIntent: 'Atmospheric worldbuilding, visceral sensory prose, dynamic tension, and authentic dialogue subtext',
      expertPersona:
        'Act as an award-winning Novelist, Hollywood Screenwriter, and Narrative Architect with deep mastery of literary craftsmanship.',
      reasoningPhases: [
        'Premise & Stakes Formulation: Establish the inciting disturbance, core dramatic question, and protagonist flaw.',
        'Sensory Worldbuilding & Tone: Select visceral sensory details, distinct metaphoric language, and atmospheric tone.',
        'Scene Tension & Beat Progression: Escalate interpersonal conflict and internal turmoil through action and subtext.',
        'Thematic Resonance: Ensure character choices dictate the plot rather than arbitrary coincidence.',
      ],
      deliverables: [
        'Polished Scene / Narrative Draft: Immersive prose rich in sensory detail, emotional depth, and subtext-laden dialogue.',
        'Character Motivation Matrix: Core desire, fatal flaw, internal contradiction, and immediate objective in the scene.',
        'Narrative Beat Sheet & Tension Progression: Structural milestones from hook, rising friction, to climactic turning point.',
      ],
      guardrails: [
        'Show, don’t tell: replace generic exposition with sensory detail, character action, and subtext.',
        'Ensure characters speak with distinctive, authentic voices rather than sounding like generic narrators.',
      ],
    };
  }

  // 11. HIGH-STAKES INTERPERSONAL & WORKPLACE COMMUNICATION
  // e.g. "difficult conversation with boss", "conflict resolution with coworker", "resignation letter", "salary negotiation email"
  if (
    /\b(difficult conversation|conflict resolution|coworker|boss|manager|resignation|dispute|complaint|apology|awkward situation|boundary|feedback to)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'professional_communications_interpersonal',
      subjectTitle: 'High-Stakes Workplace Communication & Conflict Resolution',
      cognitiveIntent: 'Non-defensive communication, psychological de-escalation, and collaborative problem-solving',
      expertPersona:
        'Act as an Executive Leadership Coach, Master Conflict Mediator, and Organizational Psychologist.',
      reasoningPhases: [
        'Stakeholder Perspective Calibration: Profile the other party’s incentives, anxieties, and potential defensive triggers.',
        'Objective Fact Separation: Disentangle observable facts from emotional assumptions or personal attacks.',
        'De-escalation & Psychological Safety: Validate concerns while maintaining clear boundaries and professional standards.',
        'Collaborative Resolution: Formulate constructive, dignity-preserving proposals that invite alignment.',
      ],
      deliverables: [
        'Ready-to-Use Script / Communication Draft: Carefully phrased email or talking points balancing empathy, firmness, and clarity.',
        'Strategic Delivery Playbook: Optimal timing, tone, body language, and medium (in-person vs email).',
        'Anticipated Objections & Counter-Phrasing: Calm, assertive responses for potential defensive or hostile reactions.',
      ],
      guardrails: [
        'Maintain calm, assertive professionalism; eliminate passive-aggressive phrasing, blame, or over-apologizing.',
        'Frame outcomes collaboratively with clear next steps and mutual accountability.',
      ],
    };
  }

  // 12. SYNTHESIS, SUMMARIZATION & CONTENT TRANSFORMATION
  // e.g. "summarize meeting transcript", "extract action items", "ELI5 explanation", "rewrite for executive"
  if (
    /\b(summarize|summary of|tldr\b|action items|meeting notes|transcript|bullet points of|extract|rewrite|simplify|eli5\b|paraphrase|proofread|translate to)\b/i.test(
      lower
    )
  ) {
    return {
      domainKey: 'transformation_summarization',
      subjectTitle: 'High-Density Executive Synthesis & Actionable Content Extraction',
      cognitiveIntent: 'Maximum signal-to-noise ratio, lossless conceptual compression, and immediately actionable takeaways',
      expertPersona:
        'Act as a Master Information Architect, Executive Synthesizer, and Intelligence Analyst.',
      reasoningPhases: [
        'Hierarchical Deconstruction: Filter out conversational noise, tangents, and pleasantries to isolate primary decisions.',
        'Lossless Compression: Condense complex arguments into crisp, high-density bullet points preserving essential data.',
        'Actionable Extraction: Tag every commitment with explicit ownership, deliverables, and deadlines.',
      ],
      deliverables: [
        'Executive TL;DR: 3-5 high-density bullet points capturing the core thesis and bottom-line impact.',
        'Thematic Structured Synthesis: Categorized breakdown of key arguments, decisions, and supporting data.',
        'Action Items & Commitments Table: Explicit tasks, owners, and deliverable deadlines.',
      ],
      guardrails: [
        'Zero editorializing or hallucinating details not present in the original input.',
        'Deliver maximum information density in minimal reading time with high-contrast formatting.',
      ],
    };
  }

  // 13. SPM / MALAYSIAN SECONDARY EDUCATION & HISTORY
  // e.g. "history in SPM chapter perang dunia kedua"
  const isSPMHistory =
    /\b(spm|sejarah|kssm|perang dunia|pendudukan|tanah melayu|malaya|kemerdekaan|nasionalisme|darurat)\b/i.test(lower) ||
    (/\bhistory\b/i.test(lower) && /\b(spm|chapter|war|world war|empire|treaty|revolution|bab)\b/i.test(lower));

  if (isSPMHistory) {
    const isWW2 = /\b(perang dunia|world war|wwii|ww2|jepun|axis|allies|bersekutu|paksi)\b/i.test(lower);
    return {
      domainKey: 'academic_spm_history',
      subjectTitle: isWW2 ? 'SPM History (Sejarah KSSM) — World War II & Malayan Theater' : 'SPM History & Curriculum Studies',
      cognitiveIntent: 'Master-level syllabus deconstruction, chronological causality, and SPM KBAT exam preparation',
      expertPersona:
        'Act as an elite History Educator and SPM (Sijil Pelajaran Malaysia) Curriculum Specialist with deep mastery of the KSSM Form 4/5 Sejarah syllabus and 20th-century geopolitical warfare.',
      reasoningPhases: [
        'Curriculum Alignment: Ground explanations in standard Malaysian SPM KSSM History textbook standards and official marking criteria.',
        'Chronological & Causal Deconstruction: Map the pre-war geopolitical tensions in Europe and the Asia-Pacific, detailing alliances (Pihak Bersekutu vs Paksi) and turning points.',
        'Malayan Theater & Socio-Political Impact: Thoroughly analyze the Japanese invasion and occupation of Malaya (Pendudukan Jepun), hardship factors, and the rise of local political consciousness/nationalism.',
        'Exam Synthesis (KBAT): Formulate sample SPM-style Higher-Order Thinking Skills (KBAT) essay questions with model answering frameworks.',
      ],
      deliverables: [
        'Chronological Timeline & Root Causes: Clear breakdown of underlying triggers (Faktor Tercetus), major alliances, and turning points in Europe and Asia-Pacific.',
        'Events in Malaya & Southeast Asia: Detailed analysis of the Japanese occupation administration, socio-economic hardships, and the catalyst for post-war nationalist movements.',
        'High-Yield SPM Exam Analysis & KBAT Frameworks: Model essay answering techniques, key marking rubrics, and sample KBAT questions with complete structured answers.',
        'Quick-Revision Summary & Memory Aids: High-frequency exam terms (e.g. Dasar Pendudukan, Kesan Politik/Ekonomi/Sosial), crucial dates, and bulleted takeaways for fast revision.',
      ],
      guardrails: [
        'Strictly adhere to verified historical facts and Malaysian SPM KSSM History curriculum standards.',
        'Include standard Malay historical terms alongside explanations where helpful (e.g. Faktor Tercetus, Pihak Bersekutu, Paksi, Pendudukan Jepun, Kesan Pentadbiran) for direct exam relevance.',
        'Present information using clean markdown headers, bullet points, and chronological milestone tables.',
        'Zero conversational fluff, preamble, or generic apologies; begin directly with the curriculum breakdown.',
      ],
    };
  }

  // 14. MATHEMATICS & PROBLEM SOLVING
  // e.g. "Chapter 4 Mathematics", calculus, algebra, geometry
  const isMathematics =
    /\b(math|mathematics|matematik|algebra|calculus|geometry|trigonometry|statistics|probability|matrices|matrix|equation|differential|integral|quadratic|sets|fractions|arithmetic|formula|theorems?)\b/i.test(
      lower
    ) || /\bchapter\s*\d+\s*(?:mathematics|math|matematik)\b/i.test(lower);

  if (isMathematics) {
    const chapterMatch = input.match(/\b(?:chapter|bab)\s*([0-9ivxlcdm]+|[a-z0-9_-]+)\b/i);
    const chapterNum = chapterMatch ? `Chapter ${chapterMatch[1]}` : 'Mathematical Topic';
    return {
      domainKey: 'academic_mathematics',
      subjectTitle: `${chapterNum} Mathematics & Problem Solving`,
      cognitiveIntent: 'First-principles conceptual understanding, algebraic derivation, and rigorous step-by-step problem solving',
      expertPersona:
        'Act as a Master Mathematics Educator and Problem-Solving Specialist with deep expertise in pedagogy, algebraic derivations, and mathematical intuition.',
      reasoningPhases: [
        'Foundational Deconstruction: Define core definitions, variables, and theorems underlying this mathematical topic without confusing jargon.',
        'Graded Step-by-Step Derivation: Structure solved walkthrough examples from foundational concepts to advanced multi-step application problems.',
        'Diagnostic Error Analysis: Identify frequent arithmetic, algebraic, sign, or conceptual mistakes students make and contrast them with correct methods.',
        'Formulate Practice Problems: Provide self-assessment problems with complete, step-by-step worked solutions for self-testing.',
      ],
      deliverables: [
        'Core Foundations & Visual Intuition: Clear explanation of fundamental definitions, formulas, and theorems with intuitive mental models.',
        'Graded Step-by-Step Solved Examples: Walkthrough problems (from basic to challenging applications) demonstrating full algebraic workings and operations for each step.',
        'Common Pitfalls & Diagnostic Traps: Highlight frequent calculation errors, sign mistakes, and formula misapplications to prevent exam mistakes.',
        'Practice Problems & Exam Mastery: 2-3 targeted review problems with step-by-step worked solutions for self-assessment.',
      ],
      guardrails: [
        'Format all equations, formulas, and expressions using clean, standardized mathematical notation.',
        'Show all intermediate steps and operations; never jump from premise to solution without showing intermediate workings.',
        'If the specific curriculum or grade level is unspecified, identify the standard topics covered in Chapter 4 (e.g. Operations on Sets, Consumer Mathematics, Matrices, or Quadratic Equations) and provide complete, self-contained explanations.',
        'Zero conversational fluff or generic pleasantries; begin directly with the mathematical breakdown.',
      ],
    };
  }

  // 15. SCIENCES & STEM
  // e.g. "physics thermodynamics", "chemistry periodic table", "photosynthesis"
  const isScience = /\b(science|sains|physics|fizik|chemistry|kimia|biology|biologi|photosynthesis|genetics|thermodynamics|newton|quantum|periodic table|organic chemistry|medicine|anatomy)\b/i.test(
    lower
  );

  if (isScience) {
    return {
      domainKey: 'academic_science',
      subjectTitle: 'Science & STEM Empirical Education',
      cognitiveIntent: 'Mechanistic breakdown, empirical law formulation, and intuitive scientific understanding',
      expertPersona:
        'Act as an expert STEM Educator and Scientific Researcher. Break down complex empirical phenomena, chemical mechanisms, or physical laws with conceptual clarity and mathematical rigor.',
      reasoningPhases: [
        'Empirical Core: Define the fundamental phenomenon, governing physical/chemical/biological laws, and relevant SI units.',
        'Mechanistic Pathway: Trace reaction mechanisms, biological processes, or physical dynamics step-by-step.',
        'Real-World Intuition: Pair abstract formulas with concrete everyday analogies or laboratory demonstrations.',
        'Assessment of Traps: Detail high-frequency exam misconceptions and formulate review check questions.',
      ],
      deliverables: [
        'Core Scientific Intuition: Clear explanation of physical laws, reaction mechanisms, or biological pathways using intuitive analogies.',
        'Step-by-Step Breakdown & Formulations: Detailed mathematical or chemical equations showing balance, units, and conditions.',
        'High-Yield Takeaways & Misconceptions: Common traps, key formulas to memorize, and 2-3 conceptual check questions with answers.',
      ],
      guardrails: [
        'Maintain scientific precision, standard IUPAC/SI nomenclature, and correct units throughout.',
        'Use clean markdown headings, bulleted explanations, and formatted reaction/equation lines.',
        'Zero conversational filler; begin immediately with the scientific explanation.',
      ],
    };
  }

  // 16. SOFTWARE ENGINEERING & DEBUGGING
  // e.g. "fix bug in React", "Python script to scrape web", "SQL join optimization"
  const isCoding =
    /\b(fix|debug|error|traceback|exception|bug|syntax|code|script|function|api|component|endpoint|database|sql|query|queries|joins?|indexing?|postgres|postgresql|mysql|sqlite|mongodb|nosql|redis|regex|typescript|javascript|python|golang|rust|react|vue|node|nodejs|docker|css|html|backend|frontend|fullstack)\b/i.test(
      lower
    ) || /```[\s\S]*```/.test(input);

  if (isCoding) {
    return {
      domainKey: 'coding',
      subjectTitle: 'Software Engineering & Production Implementation',
      cognitiveIntent: 'Root-cause diagnosis, resilient architecture, and idiomatic production code implementation',
      expertPersona:
        'Act as a Senior Staff Software Engineer and Technical Lead. Write clean, robust, production-grade code following modern best practices, strict typing, and defensive design patterns.',
      reasoningPhases: [
        'Technical Requirement / Failure Diagnosis: Isolate the root cause of the error or analyze the technical specifications.',
        'Architectural Pattern Selection: Choose the optimal data structures, algorithmic complexity, and idiomatic framework patterns.',
        'Production Implementation: Write clean, fully typed, maintainable code with inline explanatory comments.',
        'Validation & Edge Cases: Verify boundary conditions, null/undefined safety, memory management, and error recovery.',
      ],
      deliverables: [
        'Technical Diagnosis & Implementation Strategy: Clear overview of the architectural approach, root cause, and direct solution.',
        'Production-Grade Code: Clean, modular, fully typed implementation with explanatory comments and zero pseudo-code shortcuts.',
        'Edge Cases, Failure Modes & Validation: Error handling, boundary conditions, performance considerations, and testing/validation strategy.',
      ],
      guardrails: [
        'Provide fully typed, syntactically correct code blocks with modern idioms.',
        'Do not include fluff, preamble, or generic apologies.',
        'Structure output with clear markdown headers and bullet points.',
        'Highlight any dependencies, trade-offs, or configuration requirements.',
      ],
    };
  }

  // 17. SYSTEM DESIGN & CLOUD ARCHITECTURE
  // e.g. "design scalable notification service", "microservices architecture"
  const isArchitecture = /\b(system design|architecture|microservices?|distributed system|database schema|scalability|high throughput|load balancer|kafka|redis|clustering)\b/i.test(
    lower
  );

  if (isArchitecture) {
    return {
      domainKey: 'system_architecture',
      subjectTitle: 'Distributed Systems & Cloud Architecture',
      cognitiveIntent: 'High-availability infrastructure design, quantitative capacity estimation, and failure mode mitigation',
      expertPersona:
        'Act as a Principal Distributed Systems and Cloud Architect. Design robust, fault-tolerant, high-throughput systems capable of scaling under heavy load.',
      reasoningPhases: [
        'Scope & Capacity Requirements: Dimension requests per second (RPS), data volume, read/write ratios, and latency SLAs.',
        'High-Level Component Flow: Map ingress, microservice boundaries, asynchronous messaging, and storage layers.',
        'Data Strategy & Trade-offs: Contrast relational vs NoSQL, partitioning keys, caching tiers, and CAP theorem consistency choices.',
        'Resiliency & Disaster Recovery: Address circuit breakers, rate limiting, replication lag, and single points of failure.',
      ],
      deliverables: [
        'High-Level Architecture: Component breakdown, data flows, protocols, and ASCII/Mermaid architectural diagram.',
        'Data Modeling & Storage Strategy: Schema design, partitioning keys, caching layers, and consistency guarantees.',
        'Scalability Bottlenecks & Failure Modes: Quantitative sizing, bottleneck mitigations, redundancy, and CAP trade-offs.',
      ],
      guardrails: [
        'Emphasize quantitative estimates (throughput, latency, storage) and explicit trade-offs.',
        'Include concrete architectural patterns rather than generic high-level advice.',
        'Zero fluff or pleasantries; begin directly with the architectural specification.',
      ],
    };
  }

  // 18. COMPARATIVE ANALYSIS & TECHNICAL EVALUATION
  // e.g. "compare React vs Vue", "PostgreSQL vs MongoDB", "Mac vs Windows for developers"
  const isComparison = /\b(compare|vs|versus|difference between|pros and cons|which is better|evaluate|tradeoffs)\b/i.test(
    lower
  );

  if (isComparison) {
    return {
      domainKey: 'analysis_comparison',
      subjectTitle: 'Comparative Evaluation & Strategic Trade-off Analysis',
      cognitiveIntent: 'Multi-criteria trade-off analysis, empirical contrast, and contextual decision modeling',
      expertPersona:
        'Act as a Principal Technical Analyst and Strategic Technology Advisor. Deliver an objective, rigorous comparative evaluation to guide critical decisions.',
      reasoningPhases: [
        'Evaluation Criteria: Establish dimensions across capability, developer ergonomics, long-term maintenance, and operational cost.',
        'Empirical Comparison: Map each option across dimensions with verified pros and cons.',
        'Synthesis & Verdict: Formulate definitive recommendations tailored to specific operational constraints and use cases.',
      ],
      deliverables: [
        'Structured Comparison Matrix: Table evaluating key dimensions across features, complexity, performance, and operational cost.',
        'Deep-Dive Trade-offs: Objective analysis of critical advantages and hidden limitations of each approach.',
        'Decision Framework & Recommendation: Clear guidance on which option to choose based on specific scenarios.',
      ],
      guardrails: [
        'Maintain strict impartiality and objective criteria.',
        'Use structured markdown tables and bulleted highlights.',
        'Highlight real-world edge cases and operational trade-offs.',
      ],
    };
  }

  // 19. GENERAL ACADEMIC LEARNING & STUDY GUIDES
  const isGeneralAcademic =
    /\b(chapter|bab|learn|study|teach me|course|syllabus|textbook|curriculum|exam|tutorial|roadmap|belajar)\b/i.test(
      lower
    ) || /^explain\b/i.test(lower);

  if (isGeneralAcademic) {
    return {
      domainKey: 'academic_general',
      subjectTitle: 'Academic Learning & Curriculum Mastery',
      cognitiveIntent: 'Structured pedagogical progression, core mental models, and knowledge retention',
      expertPersona:
        'Act as a Master Educator and Pedagogical Mentor. Provide a structured, engaging, and comprehensive learning breakdown designed to help the student thoroughly master this topic.',
      reasoningPhases: [
        'Prerequisite Deconstruction: Identify foundational concepts required before tackling the core material.',
        'Progressive Walkthrough: Structure the material from intuitive fundamentals to complex applications.',
        'Practical Examples: Provide concrete real-world manifestations of the concept.',
        'Self-Assessment Review: Formulate practice questions to test comprehension and reinforce retention.',
      ],
      deliverables: [
        'Core Conceptual Foundations: Clear, jargon-free overview of the fundamental principles and definitions.',
        'Structured Walkthrough & Real-World Examples: Step-by-step progression from basic intuition to deeper applications with concrete examples.',
        'High-Yield Summary & Review Questions: Key takeaways to remember, common misconceptions, and practice check questions with answers.',
      ],
      guardrails: [
        'Present ideas progressively from simple to complex.',
        'Use clear formatting, bulleted takeaways, and bold highlights for key terms.',
        'Zero filler, preamble, or generic conversational pleasantries.',
      ],
    };
  }

  // 20. ENTITY, BIOGRAPHICAL, ACRONYM & FACTUAL INQUIRIES
  // e.g. "who is pnd", "who was Alan Turing", "what is pnd", "who is sam altman"
  const isEntityInquiry =
    /^(who\s+(?:is|was|are|were)|who's|what\s+(?:is|was|are|were|does|does\s+.*\s+mean)|what's|tell\s+me\s+about|explain\s+who|siapa\s+(?:itu|dia)?|apa\s+(?:itu|maksud))\b/i.test(
      lower
    );

  if (isEntityInquiry) {
    const entityTarget = input
      .replace(/^(who\s+(?:is|was|are|were)|who's|what\s+(?:is|was|are|were|does|does\s+.*\s+mean)|what's|tell\s+me\s+about|explain\s+who|siapa\s+(?:itu|dia)?|apa\s+(?:itu|maksud))\s+/i, '')
      .replace(/[?.]+$/, '')
      .trim();

    const isAcronym = entityTarget.length <= 5 && !/\s/.test(entityTarget);

    return {
      domainKey: 'entity_biography_inquiry',
      subjectTitle: isAcronym
        ? `Entity Identification & Disambiguation: "${entityTarget.toUpperCase()}"`
        : `Biographical Profile & Entity Analysis: "${entityTarget || input}"`,
      cognitiveIntent:
        'Comprehensive identity verification, multi-context disambiguation, biographical timeline, and cultural/historical impact',
      expertPersona:
        'Act as an authoritative Biographer, Cultural Historian, and Encyclopedic Knowledge Specialist with expertise across contemporary culture, music & entertainment, historical icons, medical terminology, and global institutional entities.',
      reasoningPhases: [
        `Entity & Acronym Disambiguation: Identify all prominent entities or meanings associated with "${entityTarget || input}" (e.g. music/entertainment figure PartyNextDoor vs medical/technical acronyms).`,
        'Primary Identity Deep-Dive: Provide an exhaustive breakdown of the most globally recognized figure or entity, including origin, real name, career timeline, and defining contributions.',
        'Secondary & Alternative Meanings: Clearly outline alternative definitions across medicine, technology, finance, or institutions to ensure zero ambiguity.',
        'Cultural & Historical Legacy: Evaluate why this entity is notable, their defining works or achievements, and current relevance.',
      ],
      deliverables: [
        `Primary Entity Profile (${isAcronym ? `e.g. PartyNextDoor / Jahron Anthony Brathwaite for "${entityTarget.toUpperCase()}"` : `Direct Profile of "${entityTarget}"`}): Full background, identity, breakthrough milestones, and defining achievements.`,
        'Notable Works, Discography & Accolades: Major releases, collaborative milestones, awards, and historical contributions.',
        ...(isAcronym
          ? [
              `Alternative Disambiguations for "${entityTarget.toUpperCase()}": Secondary meanings including medical (e.g. Paroxysmal Nocturnal Dyspnea, Prenatal Diagnosis), organizational, or technical definitions.`,
            ]
          : []),
        'Executive Fast-Facts Table & Key Takeaways: High-density summary of essential facts, dates, aliases, and significance.',
      ],
      guardrails: [
        'Lead immediately with the definitive answer for the primary entity before detailing secondary disambiguations.',
        'Maintain factual, objective biographical precision with dates, verified associations, and zero speculative rumors.',
        'Zero conversational preamble or filler. Begin immediately with the structured biographical profile.',
        'Format output using clean markdown headings, bold terminology, and structured bullet points.',
      ],
    };
  }

  // 21. DYNAMIC SMART COGNITIVE INFERENCE (Universal Fallback for ANY prompt)
  const cleanSnippet = input.length > 50 ? input.slice(0, 48) + '...' : input;

  return {
    domainKey: 'universal_inquiry',
    subjectTitle: `Domain Analysis: "${cleanSnippet}"`,
    cognitiveIntent: `First-principles deconstruction, contextual reasoning, and high-impact structured execution for "${cleanSnippet}"`,
    expertPersona: `Act as an elite Subject Matter Expert and Principal Advisor with deep domain authority in this field.`,
    reasoningPhases: [
      `Deconstruct Core Objectives: Unpack the explicit and implicit goals, fundamental context, and key parameters of: "${cleanSnippet}".`,
      'Methodological Framework: Formulate the most rigorous, accurate, and direct approach to address the inquiry.',
      'Edge Cases & Quality Assurance: Identify nuance, common misconceptions, edge cases, and potential caveats.',
      'Actionable Synthesis: Deliver an exhaustive, beautifully structured, directly usable response.',
    ],
    deliverables: [
      'Comprehensive Core Breakdown: Direct, high-density analysis addressing the request completely.',
      'Step-by-Step Strategic Framework: Concrete examples, structured explanations, or execution roadmap.',
      'Nuance, Assumptions & Trade-offs: Critical caveats, failure modes, and recommended next steps.',
    ],
    guardrails: [
      'Zero conversational fluff, pleasantries, or preamble. Begin immediately with the structured solution.',
      'Structure output using clean markdown headings, bold terminology, and structured bullet points.',
      'If any detail or prerequisite is ambiguous, state reasonable assumptions explicitly rather than guessing.',
    ],
  };
}

/**
 * Cleanly extracts the core original prompt if the input was already enhanced
 * by Prompt3000, preventing nested header accumulation on repeated enhancements.
 */
export function extractCorePrompt(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // 1. Matches `User Request: "..."` pattern across CGC, few-shot, and persona frameworks
  const userRequestMatch = trimmed.match(
    /User Request:\s*"([\s\S]+?)"\s*(?:\n\s*(?:Target AI Platform|Domain Category|Cognitive Objective|Subject Domain|###)|$)/i
  );
  if (userRequestMatch && userRequestMatch[1]?.trim()) {
    return userRequestMatch[1].trim();
  }

  // 2. Matches `### [TASK STATEMENT & DOMAIN]\n"..."` pattern from stepbystep framework
  const taskStatementMatch = trimmed.match(
    /### \[TASK STATEMENT & DOMAIN\]\s*\n\s*"([\s\S]+?)"(?:\s*\n|$)/i
  );
  if (taskStatementMatch && taskStatementMatch[1]?.trim()) {
    return taskStatementMatch[1].trim();
  }

  // 3. Fallback for unquoted or multiline User Request
  const genericUserReq = trimmed.match(/User Request:\s*([^\n\r]+)/i);
  if (genericUserReq && genericUserReq[1]?.trim()) {
    return genericUserReq[1].trim().replace(/^"+|"+$/g, '');
  }

  return trimmed;
}

/**
 * Enhanced Master Prompt Generator:
 * Deeply analyzes any prompt autonomously without manual style buttons,
 * formulating the ultimate high-performance prompt for the target LLM.
 */
export function enhancePrompt(
  input: string,
  target: LLMTarget = 'chatgpt',
  tone: PromptTone = 'auto',
  framework: PromptFramework = 'cgc'
): PromptResult {
  const trimmed = input.trim();
  const coreInput = extractCorePrompt(trimmed);
  const cleanInput = coreInput || 'Provide an in-depth, structured breakdown of this topic';

  // Perform autonomous deep thinking on the user prompt
  const analysis = deepAnalyzePrompt(cleanInput);

  // If a manual override is supplied (e.g. from saved user preferences)
  let roleDesc = analysis.expertPersona;
  let deliverables = analysis.deliverables;
  let guardrails = analysis.guardrails;
  let reasoningPhases = analysis.reasoningPhases;

  if (tone === 'academic') {
    roleDesc = 'Act as an expert Academic Educator and Subject Matter Specialist. Provide a clear, pedagogical, step-by-step breakdown tailored for deep understanding and exam mastery.';
  } else if (tone === 'coder') {
    roleDesc = 'Act as a Senior Staff Engineer. Write clean, production-grade, maintainable code following modern best practices.';
    deliverables = [
      'Technical Diagnosis & Implementation Strategy: Clear overview of the architectural approach and direct solution.',
      'Production-Grade Code: Clean, modular, fully typed implementation with explanatory comments.',
      'Edge Cases, Failure Modes & Validation: Error handling, performance considerations, and testing/validation strategy.',
    ];
    guardrails = [
      'Provide fully typed, syntactically correct code blocks where relevant.',
      'Do not include fluff, preamble, or generic apologies.',
      'Structure your output using clear markdown headers and bullet points.',
      'Highlight any trade-offs or assumptions made.',
    ];
  } else if (tone === 'concise') {
    roleDesc = 'Act as an expert consultant delivering direct, high-density answers without conversational filler.';
    deliverables = [
      'Direct Answer: Core takeaway in 1-2 punchy sentences.',
      'High-Density Breakdown: Bulleted essential points covering the necessary specifics.',
      'Immediate Next Action: One clear next step or conclusion.',
    ];
    guardrails = [
      'Strictly zero conversational filler, pleasantries, or preamble.',
      'Use concise bullet points and bold keywords for maximum information density.',
      'State facts and solutions directly.',
    ];
  } else if (tone === 'socratic') {
    roleDesc = 'Act as a patient mentor using the Socratic method to reveal underlying core principles through guided inquiry.';
    deliverables = [
      'Core Conceptual Reflection: Frame the foundational question or problem clearly.',
      'Progressive Guiding Steps: Walk through the underlying mechanics step-by-step with targeted probing questions.',
      'Understanding Check: Prompt the user to test their reasoning against a concrete scenario.',
    ];
  } else if (tone === 'creative') {
    roleDesc = 'Act as a visionary creative strategist and divergent thinker.';
  } else if (tone === 'executive') {
    roleDesc = 'Act as a VP of Strategy and Technology preparing a high-level briefing for C-suite decision makers.';
  } else if (tone === 'architect') {
    roleDesc = 'Act as an elite Principal Software Architect with 15+ years experience in distributed systems.';
  }

  // Construct master prompt incorporating deep reasoning protocol
  let formattedPrompt = '';

  const uniqueGuardrails = Array.from(
    new Set([
      ...guardrails.map((g) => g.replace(/^- /, '')),
      'Zero conversational fluff, pleasantries, or preamble. Begin immediately with the structured solution.',
      'Structure output using clean markdown headings, bold terminology, and structured bullet points.',
      'If any detail or prerequisite is ambiguous, state reasonable assumptions explicitly rather than guessing.',
    ])
  );

  if (framework === 'cgc') {
    formattedPrompt = `### [SYSTEM DIRECTIVE & EXPERT PERSONA]
${roleDesc}

### [PRIMARY OBJECTIVE & TASK STATEMENT]
User Request: "${cleanInput}"
Target AI Platform: ${target.toUpperCase()}
Domain Category: ${analysis.subjectTitle}
Cognitive Objective: ${analysis.cognitiveIntent}

### [DEEP REASONING & THINKING PROTOCOL]
Before providing the finalized answer, analyze and reason through the request using the following steps:
${reasoningPhases.map((phase, idx) => `${idx + 1}. **${phase.split(':')[0]}**: ${phase.split(':')[1] || phase}`).join('\n')}

### [COMPREHENSIVE KEY DELIVERABLES]
${deliverables.map((d, idx) => `${idx + 1}. ${d}`).join('\n')}

### [STRICT PRODUCTION CONSTRAINTS & GUARDRAILS]
${uniqueGuardrails.map((g) => `- ${g}`).join('\n')}`;
  } else if (framework === 'stepbystep') {
    formattedPrompt = `### [SYSTEM DIRECTIVE & EXPERT PERSONA]
${roleDesc}

### [TASK STATEMENT & DOMAIN]
"${cleanInput}"
Subject Domain: ${analysis.subjectTitle}
Cognitive Objective: ${analysis.cognitiveIntent}

### [SYSTEMATIC REASONING WORKFLOW]
Please analyze this request through sequential thinking before delivering the final solution:
${reasoningPhases.map((phase, idx) => `${idx + 1}. **${phase.split(':')[0]}**: ${phase.split(':')[1] || phase}`).join('\n')}

### [KEY DELIVERABLES]
${deliverables.map((d, idx) => `${idx + 1}. ${d}`).join('\n')}

### [STRICT PRODUCTION CONSTRAINTS & GUARDRAILS]
${uniqueGuardrails.map((g) => `- ${g}`).join('\n')}`;
  } else if (framework === 'fewshot') {
    formattedPrompt = `### [SYSTEM DIRECTIVE & EXPERT PERSONA]
${roleDesc}

### [PRIMARY OBJECTIVE & TASK STATEMENT]
User Request: "${cleanInput}"
Target AI Platform: ${target.toUpperCase()}
Domain Category: ${analysis.subjectTitle}

### [DEEP REASONING & THINKING PROTOCOL]
${reasoningPhases.map((phase, idx) => `${idx + 1}. **${phase.split(':')[0]}**: ${phase.split(':')[1] || phase}`).join('\n')}

### [KEY DELIVERABLES]
${deliverables.map((d, idx) => `${idx + 1}. ${d}`).join('\n')}

### [STRICT PRODUCTION CONSTRAINTS & GUARDRAILS]
${uniqueGuardrails.map((g) => `- ${g}`).join('\n')}`;
  } else {
    // persona_constraints
    formattedPrompt = `### [SYSTEM DIRECTIVE & EXPERT PERSONA]
${roleDesc}

### [PRIMARY OBJECTIVE & TASK STATEMENT]
User Request: "${cleanInput}"
Domain Category: ${analysis.subjectTitle}
Cognitive Objective: ${analysis.cognitiveIntent}

### [DEEP REASONING & THINKING PROTOCOL]
${reasoningPhases.map((phase, idx) => `${idx + 1}. **${phase.split(':')[0]}**: ${phase.split(':')[1] || phase}`).join('\n')}

### [COMPREHENSIVE KEY DELIVERABLES]
${deliverables.map((d, idx) => `${idx + 1}. ${d}`).join('\n')}

### [STRICT PRODUCTION CONSTRAINTS & GUARDRAILS]
${uniqueGuardrails.map((g) => `- ${g}`).join('\n')}`;
  }

  return {
    id: 'p3k_' + Date.now().toString(36),
    originalText: cleanInput,
    enhancedPrompt: formattedPrompt,
    targetModel: target,
    tone: tone,
    framework: framework,
    timestamp: Date.now(),
    tags: [target, tone, analysis.domainKey, framework],
  };
}
