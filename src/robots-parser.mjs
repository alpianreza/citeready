/**
 * Zero-dependency robots.txt parser and AI crawler policy evaluator.
 */

export const AI_CRAWLERS = [
  { name: 'OAI-SearchBot', owner: 'OpenAI', role: 'search', label: 'ChatGPT Search / Citations' },
  { name: 'ChatGPT-User', owner: 'OpenAI', role: 'search', label: 'ChatGPT Live Retrieval' },
  { name: 'PerplexityBot', owner: 'Perplexity', role: 'search', label: 'Perplexity Citations' },
  { name: 'ClaudeBot', owner: 'Anthropic', role: 'search', label: 'Claude Search / Retrieval' },
  { name: 'GPTBot', owner: 'OpenAI', role: 'training', label: 'OpenAI Model Training' },
  { name: 'anthropic-ai', owner: 'Anthropic', role: 'training', label: 'Anthropic Bulk Crawler' },
  { name: 'Google-Extended', owner: 'Google', role: 'training', label: 'Gemini AI Grounding/Training' },
  { name: 'Applebot-Extended', owner: 'Apple', role: 'training', label: 'Apple Intelligence Training' },
  { name: 'Meta-ExternalAgent', owner: 'Meta', role: 'training', label: 'Meta AI Crawler' },
  { name: 'Amazonbot', owner: 'Amazon', role: 'training', label: 'Alexa / Amazon Q Crawler' },
];

export function parseRobotsTxt(content) {
  const lines = String(content ?? '').split(/\r?\n/);
  const groups = [];
  const sitemaps = [];
  let currentGroup = null;

  for (const rawLine of lines) {
    const noComment = rawLine.replace(/#.*$/, '').trim();
    if (!noComment) {
      if (currentGroup && currentGroup.rules.length > 0) {
        currentGroup = null;
      }
      continue;
    }

    const colonIdx = noComment.indexOf(':');
    if (colonIdx === -1) continue;

    const directive = noComment.slice(0, colonIdx).trim().toLowerCase();
    const value = noComment.slice(colonIdx + 1).trim();

    if (directive === 'sitemap') {
      if (value && !sitemaps.includes(value)) sitemaps.push(value);
      continue;
    }

    if (directive === 'user-agent') {
      if (!currentGroup || currentGroup.rules.length > 0) {
        currentGroup = { agents: [], rules: [] };
        groups.push(currentGroup);
      }
      if (value) currentGroup.agents.push(value.toLowerCase());
      continue;
    }

    if ((directive === 'allow' || directive === 'disallow') && currentGroup) {
      currentGroup.rules.push({ type: directive, path: value });
    }
  }

  return { groups, sitemaps, raw: String(content ?? '') };
}

function matchRuleLength(rulePath, targetPath) {
  if (rulePath === '') return -1; // Empty Disallow: means allow all (no match)
  const escaped = rulePath
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  const endAnchor = rulePath.endsWith('$');
  const patternStr = `^${escaped}${endAnchor ? '' : ''}`;
  try {
    const re = new RegExp(patternStr);
    if (re.test(targetPath)) {
      return rulePath.replace(/\*/g, '').length;
    }
  } catch {
    if (targetPath.startsWith(rulePath)) {
      return rulePath.length;
    }
  }
  return -1;
}

function resolveRulesForAgent(parsedRobots, agentName) {
  const lower = agentName.toLowerCase();
  const specificRules = [];
  const wildcardRules = [];
  let hasExplicitGroup = false;

  for (const group of parsedRobots.groups) {
    const matchesSpecific = group.agents.some((a) => a === lower);
    const matchesWildcard = group.agents.includes('*');
    if (matchesSpecific) {
      hasExplicitGroup = true;
      specificRules.push(...group.rules);
    } else if (matchesWildcard) {
      wildcardRules.push(...group.rules);
    }
  }

  const rules = hasExplicitGroup ? specificRules : wildcardRules;
  return { rules, hasExplicitGroup };
}

function isRootAllowed(rules) {
  if (!rules || rules.length === 0) return { allowed: true, matchedRule: null };

  let bestLen = -1;
  let bestType = 'allow';
  let matchedRule = null;

  for (const rule of rules) {
    if (rule.type === 'disallow' && rule.path === '') {
      continue;
    }
    const len = matchRuleLength(rule.path, '/');
    if (len > bestLen || (len === bestLen && rule.type === 'allow')) {
      bestLen = len;
      bestType = rule.type;
      matchedRule = `${rule.type}: ${rule.path}`;
    }
  }

  return {
    allowed: bestLen === -1 ? true : bestType === 'allow',
    matchedRule,
  };
}

export function evaluateAiCrawlers(parsedRobots) {
  const wildcard = resolveRulesForAgent(parsedRobots, '*');
  const wildcardCheck = isRootAllowed(wildcard.rules);

  const bots = AI_CRAWLERS.map((bot) => {
    const { rules, hasExplicitGroup } = resolveRulesForAgent(parsedRobots, bot.name);
    const decision = isRootAllowed(rules);
    return {
      ...bot,
      explicit: hasExplicitGroup,
      allowed: decision.allowed,
      matchedRule: decision.matchedRule,
      status: decision.allowed ? (hasExplicitGroup ? 'allowed-explicit' : 'allowed-default') : 'blocked',
    };
  });

  return {
    wildcardBlocked: !wildcardCheck.allowed,
    sitemaps: parsedRobots.sitemaps,
    bots,
  };
}
