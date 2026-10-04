import type {
  PromptAnalysis,
  PromptIntentType,
  PromptRating,
  PromptScoreCriteria,
  ClarifyingQuestion,
} from '../types';

/**
 * Dynamic color interpolation from Red (0) to Green (100) based on prompt score.
 */
export function getScoreColor(score: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  // Hue: 0 = Red, 30 = Orange, 55 = Amber, 90 = Lime, 142 = Emerald Green
  const hue = Math.round((clamped / 100) * 142);
  return `hsl(${hue}, 85%, 55%)`;
}

/**
 * Intelligent prompt analysis and scoring algorithm.
 * Evaluates clarity, context, constraints, and depth, detects domain intent,
 * and generates context-aware clarifying questions to turn weak/vague prompts
 * (e.g. "hi", "explain me chapter 3", "fix this error") into 100% understood, high-scoring prompts.
 */
export function analyzePrompt(rawInput: string): PromptAnalysis {
  const input = (rawInput || '').trim();

  // 1. Handle empty input
  if (!input) {
    return {
      score: 0,
      scoreColor: 'hsl(0, 85%, 55%)',
      rating: 'incomplete',
      ratingLabel: 'Empty Prompt',
      ringColor: 'text-zinc-600',
      badgeBg: 'bg-zinc-800 text-zinc-400 border-zinc-700',
      intentType: 'too_vague',
      intentLabel: 'No Input',
      intentDescription: 'Type or dictate your prompt in the chatbox to see its score and clarifying questions.',
      subjectOrTopic: '',
      criteria: { clarity: 0, context: 0, constraints: 0, depth: 0 },
      strengths: [],
      missingElements: ['Core objective or question', 'Context or subject', 'Output format', 'Constraints'],
      clarifyingQuestions: [
        {
          id: 'q_empty_intent',
          question: 'What would you like the AI to help you with today?',
          purpose: 'Define the starting goal',
          placeholder: 'e.g. Explain how Redis caching works',
          quickOptions: [
            { label: 'Code & Debugging', insertText: 'Write a TypeScript function to ' },
            { label: 'Explain a Concept', insertText: 'Explain how this works with analogies: ' },
            { label: 'Draft an Email', insertText: 'Draft a professional email regarding: ' },
            { label: 'Brainstorm Ideas', insertText: 'Brainstorm 5 creative ideas for: ' },
          ],
        },
      ],
      quickTips: ['Start with an action verb (Explain, Build, Compare, Draft) and specify your exact topic.'],
      isVague: false,
      nudgeHeadline: '',
      nudgeMessage: '',
    };
  }

  const lower = input.toLowerCase();
  const words = input.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 2. Intent Detection
  let intentType: PromptIntentType = 'general_request';
  let intentLabel = 'General Request';
  let intentDescription = 'A general instruction or inquiry.';
  let subjectOrTopic = '';

  // Framework prompt detection (generated structured master prompt)
  const isFrameworkPrompt =
    /###\s*\[ROLE|###\s*SYSTEM DIRECTIVE|\[SYSTEM PERSONA\]/i.test(input) ||
    (/###\s*\[CONTEXT\]/i.test(input) && /###\s*\[CONSTRAINTS/i.test(input));

  // Patterns
  const isGreeting =
    !isFrameworkPrompt &&
    (/^(hi|hello|hey|yo|sup|halo|hai|good\s*(morning|afternoon|evening)|howdy|greetings|p|test)[\s!.,?]*$/i.test(
      input
    ) || (wordCount <= 2 && /^(hi|hello|hey|halo|hai)\b/i.test(input)));

  const chapterMatch = !isFrameworkPrompt ? input.match(/\b(?:chapter|bab)\s*([0-9ivxlcdm]+|[a-z]+)\b/i) : null;

  const isVaguePlaceholder =
    !isFrameworkPrompt && /\b(something|anything|stuff|things|things\s+about|apa\s*saja|apapun)\b/i.test(input);

  const isLearningRequest =
    !isFrameworkPrompt &&
    (/\b(i\s+(?:want|wanna)\s+to\s+learn|teach\s+me|how\s+(?:do\s+i|can\s+i|to)\s+learn|learn|study|master|belajar)\b/i.test(
      input
    ) || /^(learn|teach\s+me)\b/i.test(input));

  const isVagueOpenRequest =
    !isFrameworkPrompt &&
    (/^(i\s+(?:want|wanna)\s+to\s+learn\s+something|i\s+(?:want|wanna)\s+to\s+learn|teach\s+me\s+something|teach\s+me|i\s+want\s+to\s+know\s+something|tell\s+me\s+something|help\s+me\s+with\s+something|can\s+you\s+help\s+me|help\s+me|i\s+need\s+help|i\s+have\s+a\s+question|give\s+me\s+something|i\s+(?:want|wanna)\s+to\s+(?:build|make|code|create|do)\s+something|write\s+something|fix\s+this|explain\s+this)[\s!?.]*$/i.test(
      input
    ) || (wordCount <= 8 && isVaguePlaceholder && /\b(learn|build|make|create|help|code|write|tell|do)\b/i.test(input)));

  const isEntityInquiry =
    !isFrameworkPrompt &&
    /^(who\s+(?:is|was|are|were)|who's|what\s+(?:is|was|are|were|does|mean)|what's|tell\s+me\s+about|explain\s+who|siapa\s+(?:itu|dia)?|apa\s+(?:itu|maksud))\b/i.test(
      input
    );

  const entityName = isEntityInquiry
    ? input
        .replace(/^(who\s+(?:is|was|are|were)|who's|what\s+(?:is|was|are|were|does|mean)|what's|tell\s+me\s+about|explain\s+who|siapa\s+(?:itu|dia)?|apa\s+(?:itu|maksud))\s+/i, '')
        .replace(/[?.]+$/, '')
        .trim()
    : '';

  const isAcademicExplanation =
    !isFrameworkPrompt &&
    (Boolean(chapterMatch) ||
      /^(explain|teach|what is|how does|break down|summary of|summarize|walk me through|jelaskan|terangkan)\b/i.test(
        input
      ));

  const isCodingDebugging =
    /\b(fix|debug|error|traceback|exception|bug|issue|crash|syntax error|perbaiki error)\b/i.test(input) ||
    /\b(code|script|function|api|component|endpoint|database|sql|regex|typescript|javascript|python|golang|rust|react|vue|node|nodejs|node\.js|docker|css|html|bikin script|redis|websocket|gateway|server|backend)\b/i.test(
      input
    ) ||
    /```[\s\S]*```/.test(input);

  const isCareerInterview =
    /\b(resume|cv|curriculum vitae|interview|mock interview|job application|hiring manager|recruiter|star method|behavioral question|salary negotiation|promotion|career transition)\b/i.test(
      input
    );

  const isBusinessStrategy =
    /\b(business plan|business model|startup|go-to-market|gtm|pitch deck|value proposition|competitive analysis|swot|unit economics|cac|ltv|revenue model|monetization|market sizing|tam|sam|som|b2b|b2c|saas)\b/i.test(
      input
    );

  const isMarketingCopywriting =
    /\b(copywriting|ad copy|landing page|sales copy|email sequence|headline|cta|call to action|conversion rate|cro|sales pitch|marketing funnel|aida|pas formula)\b/i.test(
      input
    );

  const isProductUX =
    /\b(prd|product requirements?|user stor(y|ies)|user journey|wireframe|feature spec|onboarding flow|acceptance criteria|ux design|product manager|product management)\b/i.test(
      input
    );

  const isFinanceInvestment =
    /\b(dcf|discounted cash flow|valuation|ebitda|p&l|financial model|balance sheet|cash flow|cap table|roi|irr|npv|capital allocation|portfolio rebalancing|dividend)\b/i.test(
      input
    );

  const isLegalContracts =
    /\b(nda|non-disclosure|terms of service|privacy policy|contract clause|master services agreement|msa|liability clause|indemnification|governing law|breach of contract|license agreement)\b/i.test(
      input
    );

  const isHealthFitness =
    /\b(workout|push pull legs|ppl|hypertrophy|macro split|calorie deficit|meal plan|strength training|bodybuilding|bulking|cutting|cardio|running program|marathon|fitness routine)\b/i.test(
      input
    );

  const isTravelPlanning =
    /\b(itinerary|travel plan|vacation plan|flight layover|trip to|travel guide|packing list|day trip|weekend getaway|visit tokyo|visit paris|visit bali|explore [a-z]+)\b/i.test(
      input
    );

  const isWritingContent =
    /\b(write|draft|compose|generate)\b.*\b(email|letter|blog|post|essay|article|speech|proposal|cover letter|announcement|newsletter|surat|tulislah)\b/i.test(
      input
    ) || /\b(email|cover letter|blog post|essay)\b/i.test(input);

  const isAnalysisComparison =
    /\b(compare|vs|versus|difference between|pros and cons|which is better|evaluate|tradeoffs|bandingkan)\b/i.test(
      input
    );

  const isCreativeIdeation =
    /\b(brainstorm|ideas|suggest|creative|pitch|name for|slogan|story|plot|ide|usul)\b/i.test(input);

  const isSystemArchitecture =
    /\b(system design|architecture|microservices?|distributed system|database schema|scalability|high throughput|load balancer|websocket gateway)\b/i.test(
      input
    );

  const isTransformationTranslation =
    /\b(translate|convert|rewrite|paraphrase|proofread|simplify|terjemahkan|ringkas)\b/i.test(input);

  // Categorize intent
  if (isFrameworkPrompt) {
    intentType = 'general_request';
    intentLabel = 'Master Prompt (100%)';
    intentDescription = 'High-performance prompt structured with context, role, deliverables, and strict constraints.';
  } else if (isGreeting) {
    intentType = 'greeting';
    intentLabel = 'Greeting Only';
    intentDescription = 'Casual greeting without a prompt task or problem to solve.';
  } else if (
    /\b(spm|sejarah|kssm|perang dunia|pendudukan|tanah melayu|malaya|kemerdekaan|nasionalisme|darurat)\b/i.test(lower) ||
    (/\bhistory\b/i.test(lower) && /\b(spm|chapter|war|world war|empire|treaty|revolution)\b/i.test(lower))
  ) {
    intentType = 'academic_explanation';
    intentLabel = 'SPM History Study';
    const isWW2 = /\b(perang dunia|world war|wwii|ww2|jepun|axis|allies|bersekutu|paksi)\b/i.test(lower);
    subjectOrTopic = isWW2 ? 'SPM History: World War II' : 'SPM History / Sejarah';
    intentDescription = `Request to learn and revise ${subjectOrTopic}.`;
  } else if (
    /\b(math|mathematics|matematik|algebra|calculus|geometry|trigonometry|statistics|probability|matrices|matrix|equation|differential|integral|quadratic|sets|fractions|arithmetic)\b/i.test(
      lower
    ) || /\bchapter\s*\d+\s*(?:mathematics|math|matematik)\b/i.test(lower)
  ) {
    intentType = 'academic_explanation';
    intentLabel = 'Mathematics Study';
    subjectOrTopic = chapterMatch ? `Chapter ${chapterMatch[1]} Mathematics` : 'Mathematics Concepts';
    intentDescription = `Request to learn and solve ${subjectOrTopic}.`;
  } else if (chapterMatch) {
    intentType = 'academic_explanation';
    intentLabel = 'Chapter Explanation';
    subjectOrTopic = `Chapter ${chapterMatch[1]}`;
    intentDescription = `Request to explain or break down ${subjectOrTopic}.`;
  } else if (isCareerInterview) {
    intentType = 'career_interview';
    intentLabel = 'Career & Interview';
    intentDescription = 'Job interview prep, resume optimization, or career navigation.';
  } else if (isProductUX) {
    intentType = 'product_ux';
    intentLabel = 'Product & UX Design';
    intentDescription = 'PRD specifications, user experience flow, or feature definition.';
  } else if (isMarketingCopywriting) {
    intentType = 'marketing_copywriting';
    intentLabel = 'Marketing & Copywriting';
    intentDescription = 'High-converting ad copy, landing pages, or marketing funnels.';
  } else if (isBusinessStrategy) {
    intentType = 'business_strategy';
    intentLabel = 'Business & Strategy';
    intentDescription = 'Business modeling, go-to-market planning, or corporate strategy.';
  } else if (isFinanceInvestment) {
    intentType = 'finance_investment';
    intentLabel = 'Finance & Valuation';
    intentDescription = 'Financial modeling, valuation analysis, or investment thesis.';
  } else if (isLegalContracts) {
    intentType = 'legal_contracts';
    intentLabel = 'Legal & Contracts';
    intentDescription = 'Contract drafting, clause analysis, or legal risk evaluation.';
  } else if (isHealthFitness) {
    intentType = 'health_fitness';
    intentLabel = 'Health & Fitness';
    intentDescription = 'Workout splits, training programming, or nutrition guidance.';
  } else if (isTravelPlanning) {
    intentType = 'travel_planning';
    intentLabel = 'Travel & Itinerary';
    intentDescription = 'Trip planning, destination itineraries, or travel logistics.';
  } else if (isLearningRequest) {
    intentType = 'learning_education';
    if (isVaguePlaceholder || wordCount <= 4 || isVagueOpenRequest) {
      intentLabel = 'Vague Learning Goal';
      intentDescription = 'Desire to learn without specifying subject, target depth, or roadmap structure.';
      subjectOrTopic = 'General Topic (Unspecified)';
    } else {
      intentLabel = 'Learning Goal';
      intentDescription = 'Request to learn and master a specific topic, skill, or technology.';
      const afterVerb = input.replace(/^(i\s+(?:want|wanna)\s+to\s+learn|teach\s+me|how\s+(?:do\s+i|can\s+i|to)\s+learn|learn|study|master|belajar)\s+(?:about\s+)?/i, '').trim();
      subjectOrTopic = afterVerb.length > 50 ? afterVerb.slice(0, 48) + '...' : afterVerb;
    }
  } else if (isSystemArchitecture) {
    intentType = 'system_architecture';
    intentLabel = 'System Architecture';
    intentDescription = 'High-level infrastructure, scalability, and system design.';
  } else if (isCodingDebugging) {
    intentType = 'coding_debugging';
    intentLabel = 'Code & Debugging';
    intentDescription = 'Software development, bug fixing, or code implementation.';
  } else if (isAcademicExplanation) {
    intentType = 'academic_explanation';
    intentLabel = 'Concept Explanation';
    intentDescription = 'Request to explain or break down a concept or subject.';
    const afterVerb = input.replace(/^(explain|teach me|what is|how does|break down|summary of|summarize|jelaskan)\s+(?:about\s+)?/i, '').trim();
    subjectOrTopic = afterVerb.length > 50 ? afterVerb.slice(0, 48) + '...' : afterVerb;
  } else if (isWritingContent) {
    intentType = 'writing_content';
    intentLabel = 'Writing & Drafting';
    intentDescription = 'Content drafting, email, or written communication.';
  } else if (isAnalysisComparison) {
    intentType = 'analysis_comparison';
    intentLabel = 'Comparison & Analysis';
    intentDescription = 'Comparative analysis, pros/cons, and technical trade-offs.';
  } else if (isCreativeIdeation) {
    intentType = 'creative_ideation';
    intentLabel = 'Creative Ideation';
    intentDescription = 'Brainstorming novel ideas, names, or creative concepts.';
  } else if (isTransformationTranslation) {
    intentType = 'transformation_translation';
    intentLabel = 'Transformation';
    intentDescription = 'Translation, rewriting, or text transformation.';
  } else if (isEntityInquiry && entityName) {
    intentType = 'entity_biography';
    const isAcronym = entityName.length <= 5 && !/\s/.test(entityName);
    intentLabel = isAcronym ? 'Acronym & Entity Inquiry' : 'Entity & Biography Inquiry';
    subjectOrTopic = entityName;
    intentDescription = `Request to identify, profile, and explain ${entityName}.`;
  } else if (isVagueOpenRequest || (wordCount <= 3 && !/[?.!]/.test(input) && !isEntityInquiry)) {
    intentType = 'too_vague';
    intentLabel = 'Underspecified';
    intentDescription = 'Extremely brief or vague prompt lacking context or parameters.';
  }

  // 3. Rubric Evaluation
  let clarityScore = 0; // max 25
  let contextScore = 0; // max 30
  let constraintsScore = 0; // max 25
  let depthScore = 0; // max 20

  const strengths: string[] = [];
  const missingElements: string[] = [];

  // A. Clarity (max 25)
  const hasActionVerb =
    isEntityInquiry ||
    /\b(who\s+is|who\s+was|who\s+are|what\s+is|what\s+are|tell\s+me\s+about|explain|teach|learn|study|build|create|write|draft|fix|debug|compare|generate|analyze|implement|summarize|design|evaluate|jelaskan|buat|tulis|belajar|siapa|apa\s+itu)\b/i.test(
      input
    );
  if (hasActionVerb) {
    clarityScore += 10;
    strengths.push('Contains clear action directive');
  } else {
    missingElements.push('Explicit action verb (e.g. explain, build, draft)');
  }

  if (wordCount >= 3 && !isGreeting) {
    clarityScore += 8;
  }

  if (
    !isVaguePlaceholder &&
    !isVagueOpenRequest &&
    (/[?]|(objective|goal|task|result)/i.test(input) || (hasActionVerb && wordCount >= 3 && !isGreeting))
  ) {
    clarityScore += 7;
    strengths.push('Defines target goal');
  } else {
    missingElements.push('Specific end goal or desired answer');
  }

  // B. Context (max 30)
  const hasSourceOrDomain =
    (isEntityInquiry && Boolean(entityName)) ||
    /\b(book|textbook|author|course|clean code|ddia|operating system|paper|rfc|github|repo|project|environment|version|spec)\b/i.test(
      input
    ) ||
    /\b(python|javascript|typescript|react|vue|node|golang|rust|docker|sql|postgres|redis|aws|next\.?js|graphql|websocket|clustering|microservice|kafka)\b/i.test(
      input
    ) ||
    /\b(math|mathematics|matematik|algebra|calculus|geometry|trigonometry|statistics|probability|matrices|matrix|spm|history|sejarah|kssm|igcse|stpm|science|sains|physics|fizik|chemistry|kimia|biology|biologi|perang dunia|world war|economics|accounting)\b/i.test(
      input
    ) ||
    /\b(resume|cv|interview|salary|startup|gtm|pitch deck|marketing|ad copy|landing page|copywriting|prd|wireframe|dcf|ebitda|valuation|nda|contract|workout|hypertrophy|meal plan|itinerary|travel)\b/i.test(
      input
    );

  if (hasSourceOrDomain) {
    contextScore += 15;
    strengths.push('Specifies domain, subject, or syllabus');
  } else {
    if (chapterMatch) {
      missingElements.push('Source book, textbook, or course title');
    } else if (isCodingDebugging) {
      missingElements.push('Programming language, framework, or runtime');
    } else if (isEntityInquiry) {
      missingElements.push('Specific field, industry, or meaning to disambiguate');
    } else if (isCareerInterview) {
      missingElements.push('Target job title, seniority level, or company');
    } else if (isBusinessStrategy) {
      missingElements.push('Business model, target market, or stage');
    } else if (isMarketingCopywriting) {
      missingElements.push('Target audience, customer pain point, or channel');
    } else if (isProductUX) {
      missingElements.push('User problem, persona, or feature scope');
    } else if (isFinanceInvestment) {
      missingElements.push('Valuation methodology, financial metric, or time horizon');
    } else if (isLegalContracts) {
      missingElements.push('Governing jurisdiction, agreement type, or key parties');
    } else if (isHealthFitness) {
      missingElements.push('Training frequency, fitness goal, or equipment access');
    } else if (isTravelPlanning) {
      missingElements.push('Destination, trip duration, or travel style');
    } else {
      missingElements.push('Domain context, background scenario, or source material');
    }
  }

  const hasAudienceOrPersona = /\b(for\s+(beginners|seniors|executives|5\s*year\s*old|c-suite|students|developers|clients|management)|audience)\b/i.test(
    input
  );
  if (hasAudienceOrPersona) {
    contextScore += 8;
    strengths.push('Defines target audience or skill level');
  }

  const hasConcreteDetails =
    wordCount > 15 ||
    /```|https?:\/\/|error:|exception:|at\s+\w+\.\w+|table|column|json|yaml|schema|###|\[ROLE/i.test(input) ||
    /["'][^"']+["']/.test(input);

  if (hasConcreteDetails) {
    contextScore += 7;
    strengths.push('Provides concrete details, snippets, or specifics');
  } else {
    missingElements.push('Concrete examples, error logs, or specific data inputs');
  }

  // C. Constraints (max 25)
  const hasOutputFormat =
    /\b(table|bullet points?|bulleted|step-by-step|markdown|json|yaml|csv|summary|checklist|code blocks?|code snippets?|diagram|takeaways?|key takeaways?|outline|overview)\b/i.test(
      input
    ) || /\b(provide|write|generate|output)\b.*\bcode\b/i.test(input);

  if (hasOutputFormat) {
    constraintsScore += 10;
    strengths.push('Specifies output format');
  } else {
    missingElements.push('Desired format (e.g. bullet points, step-by-step, table)');
  }

  const hasLengthConstraint = /\b(\d+\s+(?:key\s+)?takeaways?|concise|brief|under\s+\d+|in\s+\d+\s+words|executive summary|1-page|detailed|in-depth|short)\b/i.test(
    input
  );
  if (hasLengthConstraint) {
    constraintsScore += 6;
    strengths.push('Specifies length or density');
  }

  const hasNegativeConstraints = /\b(no\s+(?:conversational\s+)?(?:filler|fluff|apologies|third party|libraries)|do not|without|avoid|strict|never|zero\s+(?:fluff|filler|apologies|dependencies))\b/i.test(
    input
  );
  if (hasNegativeConstraints) {
    constraintsScore += 5;
    strengths.push('Includes negative guardrails & anti-filler');
  }

  const hasToneGuidance = /\b(professional|formal|casual|socratic|architect|strictly|authoritative|friendly)\b/i.test(
    input
  );
  if (hasToneGuidance) {
    constraintsScore += 4;
  }

  // D. Depth & Architecture (max 20)
  const hasPersonaRole = /\b(act as|you are a|role:|as an? (senior|lead|principal|expert|consultant|tutor|architect))\b/i.test(
    input
  );
  if (hasPersonaRole) {
    depthScore += 8;
    strengths.push('Adopts specialized expert persona');
  }

  const hasReasoningCues = /\b(think step by step|chain of thought|first deconstruct|evaluate tradeoffs|explain why|pros and cons|root cause)\b/i.test(
    input
  );
  if (hasReasoningCues) {
    depthScore += 7;
    strengths.push('Prompts multi-step reasoning');
  }

  const hasEdgeCases = /\b(edge cases?|failure modes?|unit tests?|validation|security|benchmark|performance|error handling|heartbeat|shutdown|cleanup)\b/i.test(
    input
  );
  if (hasEdgeCases) {
    depthScore += 5;
    strengths.push('Requests edge cases & validation');
  }

  // Check for fully formatted framework structure
  if (isFrameworkPrompt) {
    clarityScore = 25;
    contextScore = 30;
    constraintsScore = 25;
    depthScore = 20;
    strengths.push('Complete production-grade prompt framework');
    strengths.push('Adopts specialized expert persona with strict guardrails');
    strengths.push('Explicit deliverables, output formatting, and edge cases');
  }

  // 4. Calculate Final Composite Score
  let totalScore = clarityScore + contextScore + constraintsScore + depthScore;

  // Apply contextual caps for known failure patterns (never cap framework prompts)
  if (isFrameworkPrompt) {
    totalScore = 100;
  } else if (isGreeting) {
    totalScore = 12;
  } else if (isVagueOpenRequest || (isLearningRequest && isVaguePlaceholder && wordCount <= 12)) {
    // Specifically handles "i want to learn something", "help me with something", "can you help me", etc.
    totalScore = 12;
  } else if (chapterMatch && !hasSourceOrDomain) {
    // Specifically handles "explain me chapter 3" -> caps at 28 because chapter without book is ambiguous
    totalScore = Math.min(28, Math.max(20, totalScore));
  } else if (wordCount <= 3 && !hasSourceOrDomain) {
    totalScore = Math.min(24, totalScore);
  } else if (isCodingDebugging && /\b(fix|debug|error)\b/i.test(input) && !hasConcreteDetails && !hasSourceOrDomain) {
    totalScore = Math.min(25, totalScore);
  }

  // Clamp 0 to 100
  totalScore = Math.max(5, Math.min(100, Math.round(totalScore)));

  // 5. Rating, Colors & Labels
  let rating: PromptRating = 'developing';
  let ratingLabel = 'Basic Draft';
  let ringColor = 'text-amber-400';
  let badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  if (totalScore < 35) {
    rating = isGreeting ? 'incomplete' : 'weak';
    ratingLabel = isGreeting ? 'Greeting Only' : 'Needs Context';
    ringColor = 'text-rose-500';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (totalScore < 65) {
    rating = 'developing';
    ratingLabel = 'Basic Draft';
    ringColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (totalScore < 85) {
    rating = 'strong';
    ratingLabel = 'Strong Prompt';
    ringColor = 'text-sky-400';
    badgeBg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  } else {
    rating = 'master';
    ratingLabel = 'Master Prompt';
    ringColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }

  // 6. Intelligent Vague Detection & Actionable Extension Nudge
  const isVague =
    !isFrameworkPrompt &&
    (isGreeting ||
      isVagueOpenRequest ||
      (isLearningRequest && (isVaguePlaceholder || wordCount <= 4)) ||
      totalScore < 50 ||
      rating === 'weak' ||
      rating === 'incomplete' ||
      intentType === 'too_vague');

  let nudgeHeadline = isFrameworkPrompt ? '' : 'Want a more accurate answer?';
  let nudgeMessage = isFrameworkPrompt
    ? ''
    : 'A few quick details will help the AI give you a clear, in-depth answer on the first try.';

  if (!isFrameworkPrompt) {
    if (isLearningRequest && (isVaguePlaceholder || wordCount <= 4 || isVagueOpenRequest)) {
      nudgeHeadline = 'Specify topic & skill level';
      nudgeMessage =
        'Tell the AI what you want to learn and your current level so it can explain things at the right depth.';
    } else if (isGreeting) {
      nudgeHeadline = 'Add your question or task';
      nudgeMessage =
        'Jump right in with your question or goal to get an immediate, helpful answer instead of generic chit-chat.';
    } else if (isCodingDebugging && /\b(fix|debug|error)\b/i.test(input) && !hasConcreteDetails) {
      nudgeHeadline = 'Add code or error message';
      nudgeMessage =
        'Paste your error message, code snippet, or tech stack so the AI can pinpoint the exact solution.';
    } else if (isCareerInterview && !hasConcreteDetails) {
      nudgeHeadline = 'Specify target role & level';
      nudgeMessage =
        'Mention the specific job title, industry, or company to get tailored interview questions and answers.';
    } else if (isBusinessStrategy && !hasConcreteDetails) {
      nudgeHeadline = 'Add business stage & market';
      nudgeMessage =
        'Include your business model (e.g. B2B SaaS, D2C) and target market for a realistic, executable strategy.';
    } else if (isHealthFitness && !hasConcreteDetails) {
      nudgeHeadline = 'Add schedule & equipment';
      nudgeMessage =
        'Specify days per week, training goal, and equipment access for a personalized workout routine.';
    } else if (isTravelPlanning && !hasConcreteDetails) {
      nudgeHeadline = 'Add duration & travel pace';
      nudgeMessage =
        'Specify number of days, who is traveling, and your preferred pace for an optimized day-by-day itinerary.';
    } else if (isEntityInquiry && !hasConcreteDetails) {
      nudgeHeadline = `Clarify "${entityName || 'entity'}" context`;
      nudgeMessage =
        `Tell the AI which field or meaning of "${entityName || 'this term'}" you mean to get a targeted profile.`;
    } else if (isVagueOpenRequest) {
      nudgeHeadline = 'Add what format you need';
      nudgeMessage =
        'Mention your expected format (e.g. step-by-step guide, summary, or code) for a much more useful response.';
    } else if (totalScore < 35) {
      nudgeHeadline = `Draft prompt (${totalScore}/100)`;
      nudgeMessage =
        'Click below to add quick details or let Enhance rewrite this prompt into a clear instruction.';
    } else if (totalScore < 55) {
      nudgeHeadline = `Good start (${totalScore}/100)`;
      nudgeMessage =
        'Add a goal or output format below to get a more thorough, high-quality answer.';
    }
  }

  // 7. Generate Intelligent Clarifying Questions ("Ask the user again based on what they prompted")
  const clarifyingQuestions: ClarifyingQuestion[] = [];
  const quickTips: string[] = [];

  // Scenario 0: MASTER PROMPT (Complete structured framework prompt)
  if (isFrameworkPrompt) {
    missingElements.length = 0;
    clarifyingQuestions.push({
      id: 'q_master_edge',
      question: 'Master prompt active (100%). Want to append optional reasoning guardrails?',
      purpose: 'Sharpen reasoning depth',
      quickOptions: [
        { label: 'Add Anti-Hallucination Rule', insertText: 'If any requirement is ambiguous, state assumptions explicitly rather than guessing.' },
        { label: 'Chain of Thought Reasoning', insertText: 'Think step-by-step and show reasoning before providing the final answer.' },
        { label: 'Strict JSON Schema', insertText: 'Output exclusively valid JSON matching a defined schema without markdown wrapping.' },
      ],
    });
    quickTips.push('Master Prompt structure detected! Role, context, deliverables, and constraints are fully specified.');
  }
  // Scenario 1: GREETING ("hi", "hello", etc.)
  else if (isGreeting) {
    clarifyingQuestions.push(
      {
        id: 'q_greet_task',
        question: 'What primary task or challenge are you working on?',
        purpose: 'Define actionable intent',
        placeholder: 'e.g. Build an API endpoint or explain quantum computing',
        quickOptions: [
          { label: 'Code & Software', insertText: 'I need help writing production code for: ' },
          { label: 'Concept Explanation', insertText: 'Explain how this concept works: ' },
          { label: 'Writing & Emails', insertText: 'Draft a professional communication regarding: ' },
          { label: 'Brainstorm Ideas', insertText: 'Brainstorm 5 creative ideas for: ' },
        ],
      },
      {
        id: 'q_greet_format',
        question: 'What output format would be most helpful?',
        purpose: 'Structure AI response',
        quickOptions: [
          { label: 'Step-by-step Guide', insertText: 'Format the response as a step-by-step guide with clear examples.' },
          { label: 'Concise Bullet Points', insertText: 'Keep it concise and straight to the point in bullet points.' },
          { label: 'Executive Brief', insertText: 'Provide a high-level executive summary with key takeaways.' },
        ],
      }
    );
    quickTips.push('LLMs perform 10x better when given an immediate task rather than conversational greetings.');
  }

  // Scenario 1B: SPM HISTORY / SEJARAH
  else if (
    /\b(spm|sejarah|kssm|perang dunia|pendudukan|tanah melayu|malaya|kemerdekaan|nasionalisme|darurat)\b/i.test(lower) ||
    (/\bhistory\b/i.test(lower) && /\b(spm|chapter|war|world war|empire|treaty|revolution)\b/i.test(lower))
  ) {
    clarifyingQuestions.push(
      {
        id: 'q_spm_syllabus',
        question: 'Which SPM syllabus or scope are you studying?',
        purpose: 'Align with curriculum standard',
        quickOptions: [
          { label: 'SPM Tingkatan 4 KSSM', insertText: 'Target syllabus: SPM Tingkatan 4 KSSM Sejarah.' },
          { label: 'SPM Tingkatan 5 KSSM', insertText: 'Target syllabus: SPM Tingkatan 5 KSSM Sejarah.' },
          { label: 'General World History', insertText: 'Focus on global World War II timeline, alliances, and treaties.' },
        ],
      },
      {
        id: 'q_spm_format',
        question: 'What study format would help you most for revision?',
        purpose: 'Structure exam deliverables',
        quickOptions: [
          {
            label: 'Chronological Timeline + Causes',
            insertText: 'Provide a chronological timeline detailing causes (Faktor Perang), key battles, and turning points.',
          },
          {
            label: 'KBAT Essay Model Answers',
            insertText: 'Include sample SPM-style KBAT essay questions with structured model answering frameworks.',
          },
          {
            label: '5-Minute Revision Summary',
            insertText: 'Deliver a high-density 5-minute revision summary with key dates, figures, and bullet points.',
          },
        ],
      },
      {
        id: 'q_spm_focus',
        question: 'Which specific historical aspect should be highlighted?',
        purpose: 'Target high-yield topics',
        quickOptions: [
          { label: 'Faktor Tercetusnya Perang', insertText: 'Focus on the pre-war causes in Europe and Asia-Pacific (Faktor Tercetus).' },
          { label: 'Pendudukan Jepun di Tanah Melayu', insertText: 'Focus specifically on the Japanese occupation of Malaya and its socio-political impact.' },
          { label: 'Kesan Politik, Ekonomi & Sosial', insertText: 'Analyze the post-war effects on nationalism and independence movements.' },
        ],
      }
    );
    quickTips.push('Specifying your target SPM syllabus level and preferred KBAT essay format maximizes exam preparation.');
  }

  // Scenario 1C: MATHEMATICS
  else if (
    /\b(math|mathematics|matematik|algebra|calculus|geometry|trigonometry|statistics|probability|matrices|matrix|equation|differential|integral|quadratic|sets|fractions|arithmetic)\b/i.test(
      lower
    ) || /\bchapter\s*\d+\s*(?:mathematics|math|matematik)\b/i.test(lower)
  ) {
    clarifyingQuestions.push(
      {
        id: 'q_math_level',
        question: 'What is your target syllabus or grade level for this math topic?',
        purpose: 'Calibrate mathematical rigor',
        quickOptions: [
          { label: 'SPM / Form 4-5 Math', insertText: 'Target syllabus: SPM / Form 4-5 KSSM Mathematics.' },
          { label: 'IGCSE / O-Level Math', insertText: 'Target syllabus: Cambridge IGCSE / O-Level Mathematics.' },
          { label: 'College / Undergraduate', insertText: 'Target level: College / Undergraduate Advanced Mathematics.' },
          { label: 'High School (Grade 10-12)', insertText: 'Target level: Standard High School Mathematics.' },
        ],
      },
      {
        id: 'q_math_format',
        question: 'What pedagogical breakdown format do you need?',
        purpose: 'Format mathematical delivery',
        quickOptions: [
          {
            label: 'Step-by-Step Solved Examples',
            insertText: 'Provide step-by-step solved examples showing full workings and algebraic operations for each step.',
          },
          {
            label: 'Formula Sheet & Mental Models',
            insertText: 'Provide a clean formula summary sheet with intuitive mental models for core definitions.',
          },
          {
            label: 'Practice Problems with Solutions',
            insertText: 'Include 3 graded practice problems with complete step-by-step solutions for self-assessment.',
          },
        ],
      },
      {
        id: 'q_math_focus',
        question: 'Which area should receive special emphasis?',
        purpose: 'Prevent exam mistakes',
        quickOptions: [
          { label: 'Common Pitfalls & Mistakes', insertText: 'Highlight frequent arithmetic/algebraic errors students make and how to avoid them.' },
          { label: 'Conceptual Intuition', insertText: 'Focus on visual and intuitive understanding of why the formulas work.' },
          { label: 'Exam Tips & Short Tricks', insertText: 'Provide exam speed tips, verification checks, and shortcut techniques.' },
        ],
      }
    );
    quickTips.push('Mentioning your specific syllabus level and requesting step-by-step solved examples ensures full working steps.');
  }

  // Scenario 2: LEARNING & EDUCATION ("i want to learn something", "teach me python", etc.)
  else if (isLearningRequest || intentType === 'learning_education') {
    if (isVaguePlaceholder || wordCount <= 4 || isVagueOpenRequest) {
      clarifyingQuestions.push({
        id: 'q_learn_topic',
        question: 'What specific topic, skill, or subject do you want to learn?',
        purpose: 'Define learning subject',
        placeholder: 'e.g. Mathematics, SPM History, or Python programming',
        quickOptions: [
          { label: 'Mathematics & Problem Solving', insertText: 'I want to learn Mathematics fundamentals and step-by-step problem solving.' },
          { label: 'SPM History / Sejarah', insertText: 'I want to study SPM Sejarah curriculum topics and exam preparation.' },
          { label: 'Python & Data Science', insertText: 'I want to learn Python for data science, analysis, and automation.' },
          { label: 'Science & Physics', insertText: 'I want to learn foundational Physics and scientific principles.' },
        ],
      });
    }

    clarifyingQuestions.push(
      {
        id: 'q_learn_level',
        question: 'What is your current experience level on this topic?',
        purpose: 'Calibrate pedagogical depth',
        quickOptions: [
          { label: 'Beginner (simple analogies)', insertText: "Explain for a complete beginner with zero prior background using clear, intuitive analogies." },
          { label: 'Intermediate', insertText: 'Assume intermediate background; skip basic syntax and focus on core best practices.' },
          { label: 'Advanced (deep dive)', insertText: 'Provide deep technical rigor with architectural patterns and advanced trade-offs.' },
        ],
      },
      {
        id: 'q_learn_format',
        question: 'What learning roadmap or structure do you prefer?',
        purpose: 'Structure the study plan',
        quickOptions: [
          {
            label: 'Step-by-Step Curriculum Roadmap',
            insertText: 'Create a structured learning roadmap with milestone objectives, key concepts, and practical exercises.',
          },
          {
            label: 'Hands-on Project Tutorial',
            insertText: 'Teach step-by-step through building a practical, hands-on portfolio project from scratch.',
          },
          {
            label: 'Core Mental Models + Quiz',
            insertText: 'Break down the core mental models followed by 3 practice quiz questions with solutions.',
          },
        ],
      }
    );
    quickTips.push('Specifying the exact topic, background level, and format gives you a tailored curriculum rather than generic trivia.');
  }

  // Scenario 3: CHAPTER / ACADEMIC EXPLANATION ("explain me chapter 3", etc.)
  else if (chapterMatch) {
    const chapterNum = chapterMatch[1];
    clarifyingQuestions.push(
      {
        id: 'q_chapter_book',
        question: `Which book, textbook, or course is Chapter ${chapterNum} from?`,
        purpose: 'Anchor exact source material',
        placeholder: 'e.g. Mathematics Form 4, Clean Code, or World History',
        quickOptions: [
          { label: 'Secondary / SPM Textbook', insertText: `from standard secondary school / SPM textbook.` },
          { label: 'University / College Course', insertText: `from introductory college curriculum textbook.` },
          { label: 'Clean Code (Software)', insertText: `from the book "Clean Code" by Robert C. Martin.` },
          { label: 'Designing Data-Intensive Apps', insertText: `from "Designing Data-Intensive Applications" by Martin Kleppmann.` },
        ],
      },
      {
        id: 'q_chapter_format',
        question: 'What depth and explanation format do you need?',
        purpose: 'Set response depth and structure',
        quickOptions: [
          {
            label: '5 Key Takeaways Summary',
            insertText: 'Provide a 5-minute executive summary with 5 key takeaways and bullet points.',
          },
          {
            label: 'Deep Conceptual Dive with Analogies',
            insertText: 'Break down the underlying concepts step-by-step with practical real-world analogies.',
          },
          {
            label: "Beginner 'Explain like I'm 12'",
            insertText: "Explain simply using plain English as if I am 12 years old, avoiding heavy jargon.",
          },
          {
            label: 'Study Guide & Practice Quiz',
            insertText: 'Provide a study guide with key definitions, formulas, and 3 practice quiz questions with answers.',
          },
        ],
      },
      {
        id: 'q_chapter_focus',
        question: `Are there specific subtopics in Chapter ${chapterNum} to emphasize?`,
        purpose: 'Target high-yield topics',
        quickOptions: [
          { label: 'Core Principles & Mechanisms', insertText: 'Focus specifically on the core principles and underlying mechanisms.' },
          { label: 'Step-by-Step Solved Examples', insertText: 'Include step-by-step solved examples demonstrating each concept.' },
          { label: 'Exam Traps & Common Pitfalls', insertText: 'Highlight common misconceptions, edge cases, and exam pitfalls.' },
        ],
      }
    );
    quickTips.push('Mentioning the exact book, subject, and your preferred format prevents the AI from guessing the wrong context.');
  }

  // Scenario 3: CONCEPT EXPLANATION ("explain recursion", "what is photosynthesis", etc.)
  else if (isAcademicExplanation) {
    clarifyingQuestions.push(
      {
        id: 'q_concept_audience',
        question: 'What is your background level on this topic?',
        purpose: 'Calibrate difficulty',
        quickOptions: [
          { label: 'Beginner (simple analogies)', insertText: "Explain for a complete beginner using intuitive real-world analogies." },
          { label: 'Intermediate', insertText: 'Assume intermediate knowledge; focus on practical patterns and real-world usage.' },
          { label: 'Advanced (deep dive)', insertText: 'Provide a rigorous, in-depth technical explanation with mathematical/architectural depth.' },
        ],
      },
      {
        id: 'q_concept_deliverable',
        question: 'What structure would help you learn best?',
        purpose: 'Format delivery',
        quickOptions: [
          { label: 'Core Principles + Visual Flow', insertText: 'Deconstruct into: 1) Core intuition, 2) Step-by-step diagram or workflow, 3) Real-world example.' },
          { label: 'Pros, Cons & Trade-offs', insertText: 'Highlight strengths, drawbacks, and alternative approaches.' },
          { label: 'Common Pitfalls & Mistakes', insertText: 'Explain the most frequent mistakes people make and how to avoid them.' },
        ],
      }
    );
  }

  // Scenario 4: CODING & DEBUGGING ("fix this error", "write python script", etc.)
  else if (isCodingDebugging) {
    const isError = /\b(fix|debug|error|traceback|exception|bug)\b/i.test(input);

    if (isError) {
      clarifyingQuestions.push({
        id: 'q_code_error_trace',
        question: 'What is the exact error message or stack trace?',
        purpose: 'Diagnose root cause',
        placeholder: 'Paste the error message or describe wrong output',
        quickOptions: [
          { label: 'Paste Error Trace', insertText: 'The exact error message and stack trace is: [paste error here]' },
          { label: 'App Crashes (Null / Undefined)', insertText: 'The application crashes with an unexpected undefined/null reference error.' },
          { label: 'Logic Error (Incorrect Output)', insertText: 'Code compiles without error but produces incorrect output: [expected vs actual]' },
        ],
      });
    }

    clarifyingQuestions.push(
      {
        id: 'q_code_stack',
        question: 'Which programming language and framework are you targeting?',
        purpose: 'Constrain syntax and idioms',
        quickOptions: [
          { label: 'TypeScript / React', insertText: 'using TypeScript 5 and React with strict typing and modern hooks.' },
          { label: 'Python 3.11+ (Typed)', insertText: 'using Python 3.11+ with strict type annotations and docstrings.' },
          { label: 'Node.js / Express', insertText: 'using Node.js and Express with async/await and structured error handling.' },
          { label: 'SQL / PostgreSQL', insertText: 'using PostgreSQL with index-optimized queries and CTEs.' },
        ],
      },
      {
        id: 'q_code_guardrails',
        question: 'What production standards should be enforced?',
        purpose: 'Prevent sloppy code',
        quickOptions: [
          { label: 'Production-ready with Tests', insertText: 'Include comprehensive unit tests and robust error handling.' },
          { label: 'Zero External Dependencies', insertText: 'Use only standard libraries; zero external dependencies.' },
          { label: 'High Performance & Typed', insertText: 'Optimize for O(1) performance, memory efficiency, and strict types.' },
        ],
      }
    );
  }

  // Scenario 5: WRITING & CONTENT ("write an email", "draft a blog post", etc.)
  else if (isWritingContent) {
    clarifyingQuestions.push(
      {
        id: 'q_write_recipient',
        question: 'Who is the recipient or target reader?',
        purpose: 'Tailor perspective and tone',
        quickOptions: [
          { label: 'Executive / C-Suite', insertText: 'Target audience: C-suite leadership. Keep it high-level, ROI-focused, and concise.' },
          { label: 'External Client / Customer', insertText: 'Target audience: external client. Maintain a professional, reassuring, and consultative tone.' },
          { label: 'Team / Engineering Colleague', insertText: 'Target audience: engineering peers. Direct, collaborative, and clear.' },
          { label: 'Hiring Manager / Recruiter', insertText: 'Target audience: hiring team. Confident, articulate, highlighting measurable impact.' },
        ],
      },
      {
        id: 'q_write_cta',
        question: 'What is the main objective or call-to-action (CTA)?',
        purpose: 'Direct response outcome',
        quickOptions: [
          { label: 'Schedule a 15-min Call', insertText: 'Include a clear call-to-action inviting them to a brief 15-minute sync this week.' },
          { label: 'Request Review & Sign-off', insertText: 'Request feedback and formal approval by the end of the week.' },
          { label: 'Deliver Milestone Update', insertText: 'Deliver a transparent milestone update outlining achievements, risks, and next steps.' },
        ],
      }
    );
  }

  // Scenario 6: COMPARISONS ("compare react vs vue", "is python better", etc.)
  else if (isAnalysisComparison) {
    clarifyingQuestions.push(
      {
        id: 'q_compare_criteria',
        question: 'What decision criteria matter most for your project?',
        purpose: 'Anchor technical trade-offs',
        quickOptions: [
          { label: 'Performance vs Learning Curve', insertText: 'Compare specifically across runtime performance, developer ergonomic learning curve, and community support.' },
          { label: 'Enterprise Scalability & Cost', insertText: 'Evaluate based on enterprise scalability, infrastructure cost, and long-term maintainability.' },
          { label: 'Matrix Table Comparison', insertText: 'Provide a structured markdown comparison matrix with pros, cons, and a definitive recommendation.' },
        ],
      }
    );
  }

  // Scenario 7: SYSTEM ARCHITECTURE
  else if (isSystemArchitecture) {
    clarifyingQuestions.push(
      {
        id: 'q_arch_scale',
        question: 'What throughput and scale do you anticipate?',
        purpose: 'Dimension the architecture',
        quickOptions: [
          { label: '100k+ Concurrency', insertText: 'Target scale: 100,000+ concurrent users with sub-50ms latency.' },
          { label: 'High Write Throughput', insertText: 'Target scale: 50,000 writes/second with horizontal partitioning and read replicas.' },
          { label: 'Event-Driven (Kafka / Redis)', insertText: 'Architecture pattern: Event-driven pub/sub using Kafka and Redis caching.' },
        ],
      }
    );
  }

  // Scenario 8: CAREER & INTERVIEW
  else if (isCareerInterview) {
    clarifyingQuestions.push(
      {
        id: 'q_career_role',
        question: 'What target role and seniority level are you preparing for?',
        purpose: 'Calibrate interview context',
        placeholder: 'e.g. Senior Software Engineer at Stripe',
        quickOptions: [
          { label: 'Senior / Staff Engineer', insertText: 'Target role: Senior Software Engineer at a top-tier tech company.' },
          { label: 'Product Manager', insertText: 'Target role: Senior Product Manager in high-growth B2B SaaS.' },
          { label: 'Engineering Director / VP', insertText: 'Target role: Engineering Director / Department VP.' },
          { label: 'General Industry Professional', insertText: 'Target role: Mid-to-senior industry professional.' },
        ],
      },
      {
        id: 'q_career_deliverable',
        question: 'What preparation format or material do you need most?',
        purpose: 'Structure career deliverables',
        quickOptions: [
          {
            label: 'STAR Behavioral Answers',
            insertText: 'Format using the STAR framework (Situation, Task, Action, Result) with high-impact quantifiable metrics.',
          },
          {
            label: 'Interactive Mock Interview',
            insertText: 'Conduct a simulated mock interview: ask me one challenging question at a time and critique my responses.',
          },
          {
            label: 'Resume XYZ-Formula Bullets',
            insertText: 'Rewrite into punchy XYZ-formula bullet points (Accomplished [X], as measured by [Y], by doing [Z]).',
          },
          {
            label: 'Salary Counter-Offer Script',
            insertText: 'Provide a strategic salary negotiation counter-offer script and email template with leverage points.',
          },
        ],
      }
    );
  }

  // Scenario 9: BUSINESS & STRATEGY
  else if (isBusinessStrategy) {
    clarifyingQuestions.push(
      {
        id: 'q_biz_stage',
        question: 'What is your business model and current stage?',
        purpose: 'Anchor commercial reality',
        placeholder: 'e.g. Seed-stage B2B SaaS, $20k MRR',
        quickOptions: [
          { label: 'Early-Stage B2B SaaS', insertText: 'Stage: Pre-seed/Seed stage B2B SaaS targeting mid-market enterprises.' },
          { label: 'D2C / eCommerce Brand', insertText: 'Stage: Direct-to-Consumer eCommerce brand seeking omnichannel scale.' },
          { label: 'Marketplace / Platform', insertText: 'Stage: Two-sided marketplace balancing supply and demand network effects.' },
          { label: 'Agency / Professional Services', insertText: 'Stage: High-ticket B2B service agency productizing offerings.' },
        ],
      },
      {
        id: 'q_biz_deliverable',
        question: 'Which strategic deliverable is the main priority?',
        purpose: 'Direct strategic output',
        quickOptions: [
          {
            label: '90-Day GTM Launch Roadmap',
            insertText: 'Provide a phased 90-day Go-To-Market roadmap with customer acquisition channels, milestones, and KPIs.',
          },
          {
            label: 'Unit Economics & CAC/LTV Model',
            insertText: 'Break down unit economics including CAC, LTV, payback period, and gross margin levers.',
          },
          {
            label: 'Pitch Deck Narrative & Moat',
            insertText: 'Outline a 10-slide pitch deck structure highlighting defensibility, network effects, and traction.',
          },
        ],
      }
    );
  }

  // Scenario 10: MARKETING & COPYWRITING
  else if (isMarketingCopywriting) {
    clarifyingQuestions.push(
      {
        id: 'q_mkt_audience',
        question: 'Who is the specific target audience and emotional trigger?',
        purpose: 'Sharpen buyer resonance',
        quickOptions: [
          { label: 'B2B C-Suite / VPs', insertText: 'Target: Busy VP/C-Suite leaders seeking efficiency, reduced overhead, and low risk.' },
          { label: 'High-Intent Consumers', insertText: 'Target: Performance-driven consumers looking for an immediate, premium solution.' },
          { label: 'Price-Conscious SMB Owners', insertText: 'Target: Small business owners needing affordable, turnkey automation without complexity.' },
        ],
      },
      {
        id: 'q_mkt_format',
        question: 'Which copywriting framework and deliverable format do you prefer?',
        purpose: 'Format conversion copy',
        quickOptions: [
          {
            label: 'PAS Landing Page Hero',
            insertText: 'Structure using the PAS framework (Problem - Agitate - Solution) for a high-converting landing page hero.',
          },
          {
            label: '3 Ad Variants with Hooks',
            insertText: 'Provide 3 distinct ad hook variations (contrarian, curiosity, pain-point) with primary text and CTAs.',
          },
          {
            label: '3-Part Email Nurture Sequence',
            insertText: 'Draft a 3-part email nurture sequence with curiosity-driven subject lines and clear calls-to-action.',
          },
        ],
      }
    );
  }

  // Scenario 11: PRODUCT & UX DESIGN
  else if (isProductUX) {
    clarifyingQuestions.push(
      {
        id: 'q_prod_scope',
        question: 'What is the core user problem and feature scope?',
        purpose: 'Define product scope',
        quickOptions: [
          { label: 'Onboarding & Activation', insertText: 'Focus: First-time user onboarding drop-off; optimize time-to-value (Aha! moment).' },
          { label: 'Core Feature Specification', insertText: 'Focus: End-to-end feature PRD with user stories, acceptance criteria, and edge cases.' },
          { label: 'Retention & Churn Mitigation', insertText: 'Focus: User engagement loops, notification cadence, and churn mitigation.' },
        ],
      },
      {
        id: 'q_prod_deliverable',
        question: 'What PRD/UX artifact do you need?',
        purpose: 'Format product specification',
        quickOptions: [
          {
            label: 'Complete PRD with Gherkin Specs',
            insertText: 'Deliver a complete Product Requirements Document (PRD) with Gherkin-style Given-When-Then acceptance criteria.',
          },
          {
            label: 'User Journey States Flow',
            insertText: 'Map out step-by-step user journey states: Empty state, Loading, Success, and Failure modes.',
          },
          {
            label: 'Success Metrics & Analytics Schema',
            insertText: 'Define North Star metric, leading indicators, counter-metrics, and event tracking schema.',
          },
        ],
      }
    );
  }

  // Scenario 12: FINANCE & VALUATION
  else if (isFinanceInvestment) {
    clarifyingQuestions.push(
      {
        id: 'q_fin_method',
        question: 'What valuation model or financial framework should be applied?',
        purpose: 'Dimension financial analysis',
        quickOptions: [
          { label: '5-Year DCF Model', insertText: 'Build a 5-year Discounted Cash Flow (DCF) model with WACC calculation and terminal value sensitivity.' },
          { label: 'Trading Multiples (Comps)', insertText: 'Evaluate using trading multiples (EV/EBITDA, P/E, EV/ARR) against peer benchmarks.' },
          { label: 'Unit Economics & Runway', insertText: 'Analyze gross margins, burn multiple, runway projection, and path to profitability.' },
        ],
      },
      {
        id: 'q_fin_scenarios',
        question: 'How should risk and sensitivity be structured?',
        purpose: 'Model risk scenarios',
        quickOptions: [
          { label: '3-Case Scenario Matrix (Bull/Base/Bear)', insertText: 'Provide a 3-case scenario table (Bull, Base, Bear) detailing key underlying assumptions.' },
          { label: '2D Sensitivity Table', insertText: 'Include a 2D sensitivity matrix testing valuation sensitivity to revenue growth vs discount rate.' },
          { label: 'Key Drivers & Downside Risks', insertText: 'Detail the 3 primary value drivers and top 3 downside risk factors.' },
        ],
      }
    );
  }

  // Scenario 13: LEGAL & CONTRACTS
  else if (isLegalContracts) {
    clarifyingQuestions.push(
      {
        id: 'q_legal_jurisdiction',
        question: 'What governing law and jurisdiction should be specified?',
        purpose: 'Set legal jurisdiction',
        quickOptions: [
          { label: 'Delaware / US Law', insertText: 'Governing law: State of Delaware, United States.' },
          { label: 'California / US Law', insertText: 'Governing law: State of California, United States.' },
          { label: 'England & Wales (UK Law)', insertText: 'Governing law: Laws of England and Wales.' },
        ],
      },
      {
        id: 'q_legal_protection',
        question: 'What is the desired contractual scope and stance?',
        purpose: 'Set contractual risk stance',
        quickOptions: [
          { label: 'Mutual Balanced Protections', insertText: 'Draft mutual, balanced protections standard for arm-length commercial negotiations.' },
          { label: 'Discloser-Favorable Protective', insertText: 'Stricter protections favoring the Disclosing / Vendor party with broad IP retention.' },
          { label: 'Standard 2-Year Term with Carve-outs', insertText: 'Include standard 2-year survival term, strict non-solicitation, and standard confidentiality exclusions.' },
        ],
      }
    );
  }

  // Scenario 14: HEALTH & FITNESS
  else if (isHealthFitness) {
    clarifyingQuestions.push(
      {
        id: 'q_fit_goal',
        question: 'What is your primary training goal and fitness focus?',
        purpose: 'Define physiological objective',
        quickOptions: [
          { label: 'Hypertrophy / Muscle Building', insertText: 'Primary goal: Maximum hypertrophy (muscle growth) with progressive overload.' },
          { label: 'Fat Loss & Conditioning', insertText: 'Primary goal: Sustainable fat loss preserving lean muscle mass with cardio conditioning.' },
          { label: 'Strength / Powerlifting', insertText: 'Primary goal: Maximal strength in squat, bench press, deadlift, and overhead press.' },
        ],
      },
      {
        id: 'q_fit_split',
        question: 'What weekly workout frequency and equipment do you have?',
        purpose: 'Constrain workout split',
        quickOptions: [
          { label: '4-Day Upper / Lower Split', insertText: 'Schedule: 4 days per week Upper/Lower split with full gym access.' },
          { label: '6-Day Push / Pull / Legs (PPL)', insertText: 'Schedule: 6 days per week Push-Pull-Legs (PPL) split with commercial gym equipment.' },
          { label: '3-Day Full Body (Home / Dumbbells)', insertText: 'Schedule: 3 days per week full-body routine using home dumbbells and bodyweight.' },
        ],
      }
    );
  }

  // Scenario 15: TRAVEL & ITINERARY
  else if (isTravelPlanning) {
    clarifyingQuestions.push(
      {
        id: 'q_trv_pace',
        question: 'What travel style and pace do you prefer?',
        purpose: 'Calibrate travel tempo',
        quickOptions: [
          { label: 'Balanced Cultural & Foodie', insertText: 'Pace: Balanced (2-3 key sights per day) with famous local food spots and hidden gems.' },
          { label: 'Fast-Paced Must-See Highlights', insertText: 'Pace: High-energy hitting all major iconic landmarks, photo spots, and attractions.' },
          { label: 'Relaxed Leisure & Scenic', insertText: 'Pace: Slow travel, scenic walks, cafes, and minimal rushed transit.' },
        ],
      },
      {
        id: 'q_trv_logistics',
        question: 'What daily breakdown format do you need?',
        purpose: 'Structure itinerary',
        quickOptions: [
          {
            label: 'Morning / Afternoon / Evening Breakdown',
            insertText: 'Format by day with Morning, Afternoon, Evening, transit routes, and estimated costs.',
          },
          {
            label: 'Neighborhood-Clustered Plan',
            insertText: 'Cluster sights strictly by walking neighborhood to minimize transit time and fatigue.',
          },
          {
            label: 'Passes, Booking & Budget Checklist',
            insertText: 'Include local transport pass recommendations, reservation deadlines, and budget tips.',
          },
        ],
      }
    );
  }

  // Scenario 16: ENTITY, BIOGRAPHY & ACRONYM DISAMBIGUATION
  else if (isEntityInquiry) {
    const isAcronym = entityName.length <= 5 && !/\s/.test(entityName);
    if (isAcronym) {
      clarifyingQuestions.push(
        {
          id: 'q_entity_disambiguation',
          question: `Which field or meaning of "${entityName.toUpperCase()}" are you looking for?`,
          purpose: 'Disambiguate acronym meaning',
          quickOptions: [
            {
              label: 'PartyNextDoor (Music / R&B Producer)',
              insertText: 'Focus on PartyNextDoor (Jahron Anthony Brathwaite), the Canadian R&B singer, songwriter, and producer signed to OVO Sound.',
            },
            {
              label: 'Medical (Paroxysmal Nocturnal Dyspnea)',
              insertText: 'Focus on the medical definition: Paroxysmal Nocturnal Dyspnea (respiratory shortness of breath).',
            },
            {
              label: 'All Meanings (Full Disambiguation)',
              insertText: 'Provide a comprehensive disambiguation covering all prominent meanings (music artist, medical terminology, and institutional acronyms).',
            },
          ],
        },
        {
          id: 'q_entity_depth',
          question: 'What depth and format would you like?',
          purpose: 'Format biographical delivery',
          quickOptions: [
            {
              label: 'Comprehensive Profile & Milestones',
              insertText: 'Provide a comprehensive profile detailing background origin, major career milestones, key collaborations, and current status.',
            },
            {
              label: 'Quick 3-Bullet Summary',
              insertText: 'Provide a high-density 3-bullet summary with essential identity, notable works, and cultural significance.',
            },
          ],
        }
      );
    } else {
      clarifyingQuestions.push(
        {
          id: 'q_bio_depth',
          question: `What aspect of "${entityName}" should be emphasized?`,
          purpose: 'Target biographical scope',
          quickOptions: [
            {
              label: 'Full Biography & Career Milestones',
              insertText: `Provide a full chronological biographical profile detailing early life, major breakthrough achievements, and current legacy.`,
            },
            {
              label: 'Key Contributions & Impact',
              insertText: `Focus specifically on their most significant contributions, industry impact, and defining works.`,
            },
            {
              label: 'Executive 3-Minute Summary',
              insertText: `Deliver a concise executive overview with key bullet points, major accolades, and essential facts.`,
            },
          ],
        },
        {
          id: 'q_bio_format',
          question: 'What output format do you prefer?',
          purpose: 'Format biographical output',
          quickOptions: [
            {
              label: 'Chronological Profile + Key Works',
              insertText: 'Format as a chronological biography followed by a structured list of notable works, milestones, and accolades.',
            },
            {
              label: 'Q&A Fast Facts Overview',
              insertText: 'Structure with an executive fast-facts summary table followed by key highlights.',
            },
          ],
        }
      );
    }
  }

  // Fallback: If prompt is already high scoring (> 80), offer sharpening questions!
  if (totalScore >= 80 && clarifyingQuestions.length === 0) {
    clarifyingQuestions.push(
      {
        id: 'q_sharp_edge',
        question: 'Would you like to sharpen constraints further?',
        purpose: 'Eliminate edge cases',
        quickOptions: [
          { label: 'Add Anti-Hallucination Rule', insertText: 'If any requirement is ambiguous, state assumptions explicitly rather than guessing.' },
          { label: 'Chain of Thought Reasoning', insertText: 'Think step-by-step and show reasoning before providing the final answer.' },
          { label: 'Strict JSON Output Schema', insertText: 'Output exclusively valid JSON matching a defined schema without markdown wrapping.' },
        ],
      }
    );
    quickTips.push('Great prompt! It has clear context, role, and requirements.');
  } else if (clarifyingQuestions.length === 0) {
    // General fallback clarifying question
    clarifyingQuestions.push(
      {
        id: 'q_gen_details',
        question: 'What specific output format and constraints do you need?',
        purpose: 'Clarify deliverables',
        quickOptions: [
          { label: 'Step-by-step with examples', insertText: 'Explain step-by-step with concrete, real-world examples.' },
          { label: 'Bulleted summary', insertText: 'Summarize the core takeaways in concise bullet points.' },
          { label: 'Actionable checklist', insertText: 'Provide an actionable, prioritized implementation checklist.' },
        ],
      }
    );
  }

  return {
    score: totalScore,
    scoreColor: getScoreColor(totalScore),
    rating,
    ratingLabel,
    ringColor,
    badgeBg,
    intentType,
    intentLabel,
    intentDescription,
    subjectOrTopic,
    criteria: {
      clarity: clarityScore,
      context: contextScore,
      constraints: constraintsScore,
      depth: depthScore,
    },
    strengths,
    missingElements,
    clarifyingQuestions,
    quickTips,
    isVague,
    nudgeHeadline,
    nudgeMessage,
  };
}
