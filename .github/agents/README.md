# GitHub Copilot Custom Agents - FirefighterHub

This directory contains specialized GitHub Copilot coding agents configured for the FirefighterHub project.

## Available Agents

### UI/UX Implementation Specialist

**File:** `ui-ux-implementation-specialist.md`

**Purpose:** Expert agent for implementing the comprehensive UI/UX design audit (Issues #14-#36). Specializes in:
- Design system implementation (Tailwind CSS, design tokens)
- Accessibility compliance (WCAG 2.1 AA/AAA standards)
- Visual consistency and component patterns
- React + TypeScript best practices

**Use this agent for:**
- Implementing any issue from the UI/UX audit (#14-#36)
- Design system improvements and standardization
- Accessibility fixes and enhancements
- Color system migrations and updates
- Component styling and visual hierarchy
- Typography and spacing improvements

**Key Features:**
- Understands FirefighterHub architecture (shift-based data, design tokens)
- Follows phase-based implementation roadmap
- Enforces WCAG contrast requirements
- Implements changes incrementally with thorough testing
- Maintains backward compatibility
- Provides detailed progress updates

## How to Use Custom Agents

### On GitHub.com

1. **Via Agents Panel:**
   - Navigate to any issue (e.g., #14, #15, #16)
   - Click the "Agents" dropdown in the agents panel
   - Select "ui-ux-implementation-specialist"
   - Assign the issue to Copilot

2. **Via Agents Tab:**
   - Go to https://github.com/DrunkOnJava/firefighterHub/copilot/agents
   - Select your custom agent from the dropdown
   - Type your task or question
   - Copilot will respond using the agent's specialized knowledge

3. **Via Issue Assignment:**
   - Open an issue from the UI/UX audit
   - Assign to @copilot
   - In the dropdown, select "ui-ux-implementation-specialist"
   - Copilot will use the specialized agent to implement the fix

### In Pull Requests

When Copilot creates a PR using a custom agent, the PR description will note which agent was used:

```markdown
## Implementation Details

This pull request was created by GitHub Copilot using the **ui-ux-implementation-specialist** custom agent.

Agent specialization: Design system implementation and WCAG accessibility compliance
```

### In VS Code (Chat Modes)

You can also use custom agents as chat modes in VS Code:

1. Open GitHub Copilot Chat
2. Click the mode dropdown
3. Select "ui-ux-implementation-specialist"
4. Ask questions or request implementations

## Agent Configuration Reference

### YAML Frontmatter Properties

```yaml
---
name: agent-name              # Unique identifier (kebab-case)
description: Brief summary    # Shown in agent selector dropdown
tools: ["read", "edit", ...]  # Available tools (optional - omit for all tools)
---
```

### Available Tools

When configuring `tools` in an agent:

**File Operations:**
- `read` - Read files
- `edit` - Edit existing files
- `write` - Create new files
- `search` - Search codebase (Grep/Glob)

**Execution:**
- `bash` - Run shell commands

**Git Operations:**
- `git` - Git operations (commit, branch, etc.)

**Special:**
- `"*"` - All available tools
- `"mcp-server-name/*"` - All tools from specific MCP server

**Omit `tools` property entirely** to give agent access to all tools.

### Tool Access Strategy

**For UI/UX Implementation Specialist:**
```yaml
tools: ["read", "edit", "search", "bash", "write"]
```

This configuration allows:
- ✅ Reading existing code and design tokens
- ✅ Editing components systematically
- ✅ Searching for patterns to update
- ✅ Running tests and verification commands
- ✅ Creating new components (EmptyState, LoadingSpinner, etc.)

## Best Practices for Agent Prompts

### 1. Be Specific About Scope
```markdown
❌ Bad: "Fix the colors"
✅ Good: "Implement Issue #16: Migrate custom hex colors to Tailwind slate palette
following the migration guide in the issue description"
```

### 2. Reference Issue Numbers
```markdown
✅ Always include: "Implement Issue #14" or "Fix #14"
This helps the agent:
- Find the exact issue on GitHub
- Read the full problem description
- Follow the implementation checklist
- Use the recommended solution
```

### 3. Specify Testing Requirements
```markdown
✅ "After implementing Issue #15 (focus rings), verify:
- All interactive elements have visible focus
- Focus ring has 3:1 contrast ratio
- Keyboard navigation works
- No layout shift when focus applied"
```

### 4. Request Progress Updates
```markdown
✅ "Implement Issue #18 and provide:
- List of files modified
- Before/after comparison
- Testing results (typecheck, visual, a11y)
- Screenshots of changes"
```

## UI/UX Audit Implementation Roadmap

The custom agent follows this structured roadmap:

### Phase 1: Critical Fixes (Week 1) - 7.5 hours
| Issue | Priority | Description | Time |
|-------|----------|-------------|------|
| #14 | CRITICAL | Fix Shift B button contrast (WCAG) | 30 min |
| #15 | CRITICAL | Standardize focus ring indicators | 2 hours |
| #16 | HIGH | Migrate hex colors to Tailwind | 4 hours |
| #17 | HIGH | Document accent gradient | 1 hour |

### Phase 2: Visual Hierarchy (Week 2) - 11 hours
| Issue | Priority | Description | Time |
|-------|----------|-------------|------|
| #18 | HIGH | Enhance calendar cell hierarchy | 3 hours |
| #19 | HIGH | Strengthen typography scale | 2 hours |
| #20 | HIGH | Standardize spacing system | 4 hours |
| #21 | MEDIUM | Color-blind safe shift indicators | 2 hours |

### Phase 3: Component Consistency (Week 3) - 12 hours
| Issue | Priority | Description | Time |
|-------|----------|-------------|------|
| #22 | MEDIUM | Standardize modal overlays | 2 hours |
| #23 | MEDIUM | Enforce border radius hierarchy | 2 hours |
| #24 | MEDIUM | Standardize icon sizes | 2 hours |
| #25 | MEDIUM | Create unified loading states | 3 hours |
| #26 | MEDIUM | Implement elevation shadows | 3 hours |

### Phase 4-5: See Issues #27-#36

**Total Estimated Effort:** ~50 hours (1.5 weeks for single developer)

## Testing Checklist

Before closing ANY issue, verify:

- [ ] **WCAG Contrast:** WebAIM Contrast Checker shows ≥4.5:1 for text, ≥3:1 for UI
- [ ] **Keyboard Nav:** Tab through entire app, all interactive elements accessible
- [ ] **Screen Reader:** VoiceOver (macOS) or NVDA (Windows) announces correctly
- [ ] **Touch Targets:** Chrome DevTools mobile emulation shows ≥44px targets
- [ ] **Color-Blind:** DevTools "Emulate vision deficiencies" shows all 8 types clearly
- [ ] **Print Preview:** Print stylesheet renders correctly (if applicable)
- [ ] **Cross-Browser:** Works in Chrome, Firefox, Safari
- [ ] **Responsive:** Test at 375px, 768px, 1024px, 1920px breakpoints
- [ ] **Dark/Light Mode:** Both themes work correctly
- [ ] **Performance:** Lighthouse score not degraded

## Resources

### Accessibility Tools
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **axe DevTools:** Browser extension for automated a11y testing
- **pa11y-ci:** Command-line accessibility testing (installed in setup steps)

### Design System Documentation
- **Tailwind CSS:** https://tailwindcss.com/docs
- **FirefighterHub Color System:** `src/styles/colorSystem.ts`
- **FirefighterHub Tokens:** `src/styles/tokens.ts`
- **Project Documentation:** `CLAUDE.md`

### Testing Commands
```bash
# TypeScript validation
pnpm typecheck

# Linting
pnpm lint

# Unit tests
pnpm test:run

# E2E tests (with visible browser)
pnpm test:e2e:headed

# Build verification
pnpm build

# Development server
pnpm dev

# Accessibility audit (after installing pa11y-ci)
pnpm exec pa11y-ci http://localhost:5173
```

## Troubleshooting

### Agent Not Appearing in Dropdown
1. Verify file is in `.github/agents/` directory
2. Ensure file has `.md` extension
3. Check YAML frontmatter is valid (name, description)
4. Commit file to repository
5. Refresh agents page

### Agent Not Following Instructions
1. Check that instructions are in Markdown content (not YAML)
2. Verify agent has necessary tools in `tools` array
3. Ensure prompts are clear and specific
4. Try more explicit task descriptions

### Environment Setup Failing
1. Check `copilot-setup-steps.yml` syntax
2. Verify Node.js version matches (`node: "22"`)
3. Ensure pnpm is installed (`pnpm/action-setup@v4`)
4. Check GitHub Actions logs for specific errors
5. Test workflow manually from Actions tab

### TypeScript Errors During Implementation
1. Agent should run `pnpm typecheck` after changes
2. If errors occur, agent should read error messages and fix
3. Common issues: missing type imports, incorrect prop types
4. Verify `tsconfig.json` is properly configured

## Maintenance

### Updating the Agent

To improve or modify the custom agent:

1. Edit `.github/agents/ui-ux-implementation-specialist.md`
2. Update YAML frontmatter if changing name, description, or tools
3. Modify Markdown content for behavioral changes
4. Commit changes
5. Test with a sample issue to verify improvements

### Adding New Agents

To create additional specialized agents:

1. Create new file in `.github/agents/` (e.g., `performance-optimizer.md`)
2. Define YAML frontmatter with unique name
3. Write specialized instructions in Markdown
4. Commit to repository
5. Agent will appear in dropdown on next page refresh

## Examples

### Example Task: Implementing Issue #14 (WCAG Fix)

**Prompt:**
```
@ui-ux-implementation-specialist Implement Issue #14: Fix Shift B Button Contrast

Follow the issue implementation checklist:
1. Update src/components/ShiftBadge.tsx line 6
2. Change Shift B color from #7C2D12 to bg-red-600
3. Verify contrast ratio ≥4.5:1
4. Test visibility on multiple devices
5. Run typecheck and visual verification
6. Commit with proper message

Provide before/after comparison and testing results.
```

**Expected Agent Behavior:**
1. Reads Issue #14 from GitHub
2. Reads `ShiftBadge.tsx` current implementation
3. Updates color following recommended solution
4. Runs `pnpm typecheck` to verify no errors
5. Verifies contrast ratio using WCAG knowledge
6. Creates commit with conventional format
7. Reports back with testing results

### Example Task: Implementing Multiple Related Issues

**Prompt:**
```
@ui-ux-implementation-specialist Implement Phase 1 issues (#14, #15, #16, #17) in sequence:

For each issue:
1. Read the full issue description
2. Implement the recommended solution
3. Test thoroughly (typecheck, visual, a11y)
4. Commit separately with issue reference
5. Report results before moving to next issue

Start with Issue #14 (highest priority).
```

**Expected Agent Behavior:**
1. Implements issues one at a time (not all at once)
2. Tests after each implementation
3. Creates separate commits for each issue
4. Provides progress updates between issues
5. Stops if any issue fails testing
6. Reports completion summary at end

## Success Metrics

Track the agent's effectiveness:

### Quantitative Metrics
- [ ] 100% WCAG 2.1 AA compliance achieved
- [ ] 0 TypeScript errors introduced
- [ ] All unit tests passing
- [ ] 95%+ design token usage (< 5% arbitrary values)
- [ ] 44px+ minimum touch targets on mobile
- [ ] All issues completed with passing tests

### Qualitative Metrics
- [ ] Code follows FirefighterHub conventions
- [ ] Design system documentation updated
- [ ] Commit messages clear and detailed
- [ ] No visual regressions introduced
- [ ] Backward compatibility maintained
- [ ] Professional-grade implementation quality

## Support

### Getting Help
- **GitHub Copilot Docs:** https://docs.github.com/en/copilot
- **Custom Agents Guide:** https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
- **Troubleshooting:** https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/troubleshooting

### Feedback
If the agent isn't performing as expected:
1. Review the agent's Markdown instructions
2. Make prompts more specific and detailed
3. Reference exact issue numbers and file paths
4. Provide examples of expected behavior
5. Update agent configuration based on learnings

---

**Last Updated:** November 4, 2025
**Agent Version:** 1.0.0
**Audit Reference:** UI/UX Design Audit (Issue #37)
