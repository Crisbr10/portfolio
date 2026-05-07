# Skill Registry — astro-portfolio

Generated: 2026-05-05 by sdd-init
Mode: engram

## Project Conventions

- **AGENTS.md**: Not present at project level (global at `~/.config/opencode/AGENTS.md`)
- **GEMINI.md**: Not present at project level (global at `~/.gemini/GEMINI.md` with strict-tdd-mode: enabled)
- **CLAUDE.md**: Not present
- **.cursorrules**: Not present
- **copilot-instructions.md**: Not present

## Global Convention Files (user-level)

| File | Path | Content |
|------|------|---------|
| AGENTS.md | `~/.config/opencode/AGENTS.md` | Engram protocol, SDD orchestrator rules |
| GEMINI.md | `~/.gemini/GEMINI.md` | Spanish-only, code modification rules, skills usage, strict-tdd-mode: enabled |

## User Skills

### Code Review & Quality
| Skill | Path | Trigger |
|-------|------|---------|
| judgment-day | `~/.config/opencode/skills/judgment-day/SKILL.md` | "judgment day", "review adversarial", "dual review", "doble review" |
| requesting-code-review | `~/.agents/skills/requesting-code-review/SKILL.md` | Completing tasks, major features, before merging |
| react-doctor | `~/.agents/skills/react-doctor/SKILL.md` | After React changes, reviewing code, finishing features |

### Testing & TDD
| Skill | Path | Trigger |
|-------|------|---------|
| tdd | `~/.agents/skills/tdd/SKILL.md` | "tdd", "red-green-refactor", test-first development |
| test-driven-development | `~/.agents/skills/test-driven-development/SKILL.md` | Implementing features or bugfixes |
| go-testing | `~/.config/opencode/skills/go-testing/SKILL.md` | Go tests, teatest, test coverage |
| python-testing-patterns | `~/.agents/skills/python-testing-patterns/SKILL.md` | Python tests, pytest, fixtures |

### Frontend & UI
| Skill | Path | Trigger |
|-------|------|---------|
| ui-ux-pro-max | `~/.agents/skills/ui-ux-pro-max/SKILL.md` | UI design, components, styles, accessibility |
| vercel-react-best-practices | `~/.agents/skills/vercel-react-best-practices/SKILL.md` | React/Next.js performance, data fetching, bundle optimization |
| next-best-practices | `~/.agents/skills/next-best-practices/SKILL.md` | Next.js file conventions, RSC, data patterns |
| next-cache-components | `~/.agents/skills/next-cache-components/SKILL.md` | Next.js 16 cache, PPR, cacheLife, cacheTag |
| vercel-react-native-skills | `~/.agents/skills/vercel-react-native-skills/SKILL.md` | React Native, Expo, mobile performance |
| expo-dev-client | `~/.agents/skills/expo-dev-client/SKILL.md` | Expo development client, TestFlight |
| react-email | `~/.agents/skills/react-email/SKILL.md` | HTML email templates with React |

### Backend & API
| Skill | Path | Trigger |
|-------|------|---------|
| api-design-principles | `~/.agents/skills/api-design-principles/SKILL.md` | REST/GraphQL API design, API standards |
| email-best-practices | `~/.agents/skills/email-best-practices/SKILL.md` | Email features, SPF/DKIM/DMARC, compliance |
| resend | `~/.agents/skills/resend/SKILL.md` | Resend email API, transactional emails, webhooks |
| supabase-postgres-best-practices | `~/.agents/skills/supabase-postgres-best-practices/SKILL.md` | Postgres optimization, Supabase |
| nextjs-supabase-auth | `~/.agents/skills/nextjs-supabase-auth/SKILL.md` | Supabase Auth + Next.js App Router |
| evolution-api | `~/.agents/skills/evolution-api/SKILL.md` | WhatsApp integration, chatbots |
| twilio-communications | `~/.agents/skills/twilio-communications/SKILL.md` | SMS, WhatsApp Business, voice, 2FA |

### Workflow & Planning
| Skill | Path | Trigger |
|-------|------|---------|
| brainstorming | `~/.agents/skills/brainstorming/SKILL.md` | MUST use before creative work — features, components, functionality |
| diagnose | `~/.agents/skills/diagnose/SKILL.md` | "diagnose this", "debug this", bugs, performance regressions |
| grill-me | `~/.agents/skills/grill-me/SKILL.md` | "grill me", stress-test a plan |
| grill-with-docs | `~/.agents/skills/grill-with-docs/SKILL.md` | Stress-test against domain model, ADRs |
| improve-codebase-architecture | `~/.agents/skills/improve-codebase-architecture/SKILL.md` | Architecture improvement, refactoring, testability |
| zoom-out | `~/.agents/skills/zoom-out/SKILL.md` | Broader context, high-level perspective |
| to-issues | `~/.agents/skills/to-issues/SKILL.md` | Break plan/spec/PRD into issues |
| to-prd | `~/.agents/skills/to-prd/SKILL.md` | Create PRD from conversation context |
| triage | `~/.agents/skills/triage/SKILL.md` | Issue triage, state machine |

### Git & PRs
| Skill | Path | Trigger |
|-------|------|---------|
| branch-pr | `~/.config/opencode/skills/branch-pr/SKILL.md` | Creating pull requests, opening PRs |
| issue-creation | `~/.config/opencode/skills/issue-creation/SKILL.md` | Creating GitHub issues, reporting bugs |

### Meta
| Skill | Path | Trigger |
|-------|------|---------|
| skill-creator | `~/.config/opencode/skills/skill-creator/SKILL.md` | Create new skill, add agent instructions |
| find-skills | `~/.agents/skills/find-skills/SKILL.md` | "how do I do X", find skill |
| write-a-skill | `~/.agents/skills/write-a-skill/SKILL.md` | Create/write/build new skill |
| setup-matt-pocock-skills | `~/.agents/skills/setup-matt-pocock-skills/SKILL.md` | Setup engineering skills context |

## Excluded from Registry

SDD phase skills (managed by orchestrator): sdd-apply, sdd-archive, sdd-design, sdd-explore, sdd-init, sdd-propose, sdd-spec, sdd-tasks, sdd-verify
