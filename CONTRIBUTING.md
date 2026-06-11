# Contributing to Hiroshige Portfolio

> This project was built using a **mode-based agent pipeline**. Each mode is a specialized agent that produces a specific output. This document explains the architecture, how to extend it, and the conventions to follow.

---

## 1. How the Project is Organized

This project uses a multi-mode agent system where each mode has a defined role:

| Mode | Color | Focus | Produces |
|---|---|---|---|
| **start** | #F59E0B | Intake, planning, orchestration | project initialization, build order |
| **design** | #8B5CF6 | Design system, tokens, direction | `design-system.md` |
| **frontend** | #3B82F6 | UI components, routing, state | `FRONTEND.md`, all React components |
| **database** | #EC4899 | Schema, migrations, queries | `DATABASE.md`, schema, seed |
| **backend** | #10B981 | API, business logic, data layer | `server/API.md`, Express routes |
| **cleanup** | #6B7280 | Refactoring, tech debt, consistency | Updated docs, removed dead code |
| **testing** | #A855F7 | Unit, integration, E2E | Test files, coverage reports |
| **documentation** | #F97316 | Architecture, API, onboarding docs | `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` |

Each mode runs in sequence following the build order: **start → design → frontend → database → backend → cleanup → testing → documentation**. Modes excluded from this project: security (no auth/user data), devops (local-only deployment).

---

## 2. How to Add a New Mode

To add a new mode to the pipeline (e.g., a performance mode):

1. **Create the mode agent file** at `.am/agent/<name>.md` with these required sections:
   - Role and focus description
   - Inputs (what it consumes from previous modes)
   - Outputs (what it produces)
   - Handoff rules (which modes it connects to)
   - Files it should read at startup
   - Files it is allowed to modify

2. **Define handoff chain** in the mode file. Specify which mode precedes it and which mode follows. For example:
   ```
   Handoff from: testing mode
   Handoff to: documentation mode
   ```

3. **Add to build order** in `.am/project.md` under the `Build Order` section.

4. **Add to mode reference table** in `.am/project.md` with color and focus.

5. **Create state tracking** — the mode should create `.am/state/<name>.json` on first run to track what it has touched.

6. **Document outputs** — if the mode produces documentation beyond what existing docs cover, add a reference in the relevant architecture document.

---

## 3. How to Add a New Skill

Skills are reusable instruction sets that modes can load. The project already has many available skills (see `.am/skills/`).

To add a new skill:

1. **Create the skill file** at `.am/skills/<source>/<name>/SKILL.md` with:
   - Trigger keywords (when the skill should be loaded)
   - Workflow instructions
   - References to scripts, templates, or examples
   - Any constraints or known edge cases

2. **Reference the skill** in the relevant mode file. Each mode can load one or more skills using the skill tool.

3. **Follow the existing patterns** in `.am/skills/agent-skills/` for structure and conventions.

---

## 4. Prompt-Writing Rules

When writing prompts for agent modes:

1. **Reference the architecture plan**. Each prompt should cite the relevant section of `.am/project.md` for context and constraints.

2. **Be explicit about handoffs**. Every prompt should specify:
   - What to read before starting
   - What to produce
   - Where to write output
   - What to suggest as next step

3. **Use the project's build order**. Do not skip modes. Each mode builds on the outputs of previous modes.

4. **Respect the mode's scope**. A mode should only modify files within its defined scope. Cross-boundary changes should be flagged for the next mode.

5. **Include failing conditions**. Specify what qualifies as a failure (e.g., "do not produce output if X condition is not met") rather than relying on external QA.

---

## 5. Testing Requirements

Each mode must produce testable outputs:

| Mode | What to test | How |
|---|---|---|
| **design** | Color contrast ratios, typography scale | Manual verification, contrast checkers |
| **frontend** | Component render, animations, accessibility | Vitest + @testing-library/react, manual browser tests |
| **database** | Schema creation, seed insertion, indexes | Vitest + supertest with in-memory SQLite |
| **backend** | Route responses, validation, error cases | Vitest + supertest with isolated DB mock |
| **cleanup** | No regressions after refactoring | Full test suite run (`npm test`) |
| **documentation** | Terminology consistency, version accuracy | Manual review across all docs |

The existing test suite (57 tests, 93.93% coverage) provides a baseline. New features should maintain or improve coverage.

Run tests before submitting changes:

```bash
npm test                   # Run all tests
npm run test:coverage      # Run with coverage report
```

---

## 6. Code Style

This project follows strict conventions defined in `.am/project.md`:

- **TypeScript strict mode** — no `any` types
- **Single quotes**, no semicolons, 2-space indent, trailing commas
- **`const` over `let`**, early returns over `else`
- **Named exports** — default exports only for Next.js page files (`page.tsx`)
- **No inline comments** unless the code is genuinely non-obvious
- **`use client` directive** only on files that need browser APIs
- **Server Components by default** — Client Components only when interactivity or animation is required

---

## 7. Documentation Standards

All documentation files should follow these conventions:

1. **README.md** — Project overview, quickstart, tech stack, prerequisites, running locally, deployment, contributing link
2. **ARCHITECTURE.md** — System overview diagram, subsystem descriptions, mode relationships, data flow, component trees, how-to-add guides, known limitations
3. **CONTRIBUTING.md** — This file. Mode/skill creation, prompt-writing rules, testing, code style, docs standards
4. **FRONTEND.md** — Component tree, state management, API contract, conventions, accessibility checklist
5. **DATABASE.md** — Schema, ERD, indexing strategy, migration plan, seed strategy
6. **server/API.md** — Full endpoint documentation with types, examples, error codes, data mappings
7. **design-system.md** — Color tokens, typography, spacing, motion, DaisyUI overrides, component specs, animation patterns, accessibility

Writing rules:
- No marketing fluff — be direct and factual
- Every code block must be copy-pasteable and correct
- Version numbers must match `package.json`
- Do not invent information — synthesize from existing mode docs
- Do not use emojis unless explicitly requested

---

## 8. File Structure Conventions

```
components/
  ComponentName/
    index.tsx              — implementation (simplified for this project)
                              or flat: ComponentName.tsx

hooks/
  useHookName.ts           — custom hooks

lib/
  module-name.ts           — utility functions

server/
  routes/
    resource-name.ts       — Express route handlers
  __tests__/
    resource-name.test.ts  — co-located tests
```

---

## 9. How to Add a New Feature

1. **Read the architecture plan** in `.am/project.md` to understand constraints
2. **Create a spec** following the spec-driven development pattern
3. **Implement database changes** if needed (schema, seed, migration)
4. **Implement backend** (endpoints, type mapping)
5. **Implement frontend** (components, data functions, types)
6. **Add tests** (route tests, lib tests)
7. **Update documentation** (this is handled by the documentation mode, but note changes)

---

*Last updated: 2026-06-11*
