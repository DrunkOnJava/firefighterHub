# GitHub Copilot Quick Start Guide

Get up and running with GitHub Copilot across all platforms in 5 minutes.

## 🚀 Quick Setup

### 1. Verify Installation

```bash
# Check Copilot CLI
copilot --version

# Check VS Code extensions
code --list-extensions | grep copilot
```

**Expected output**:
- CLI: `0.0.354` or higher
- Extensions: `github.copilot`, `github.copilot-chat`

### 2. Authentication

```bash
# Launch CLI and authenticate
copilot
/login
```

Follow the browser prompt to authenticate with GitHub.

### 3. Test Configuration

**In Terminal**:
```bash
copilot "What's the test coverage for rotation logic?"
```

**In VS Code**:
1. Open any TypeScript file
2. Press `Ctrl+I` (Windows/Linux) or `Cmd+I` (macOS)
3. Type: `@workspace explain the shift filtering pattern`

## 📋 Essential Commands

### CLI Commands

```bash
# Interactive session
copilot

# Use specific agent
copilot --agent firefighter-specialist

# Reference files
@src/hooks/useFirefighters.ts review this hook

# Execute commands
!pnpm test

# List models
/model
```

### VS Code Commands

```
# Workspace context
@workspace what are the critical architecture patterns?

# File-specific
@src/utils/rotationLogic.ts explain position recalculation

# Review changes
#changes check for shift filtering issues

# Use custom prompt
@workspace use .github/prompts/accessibility-audit.prompt.md
```

## 🎯 Common Tasks

### Fix Rotation Logic Issue

**CLI**:
```bash
copilot --agent firefighter-specialist "Review useScheduledHolds.ts for shift filtering"
```

**VS Code**:
```
@workspace use .github/prompts/rotation-fix.prompt.md to fix rotation bug in useScheduledHolds.ts
```

### Accessibility Audit

**CLI**:
```bash
copilot --agent accessibility-auditor "Audit ShiftBadge component for WCAG compliance"
```

**VS Code**:
```
@workspace use .github/prompts/accessibility-audit.prompt.md for Calendar.tsx
```

### Code Review

**CLI**:
```bash
copilot --agent my-agent "Review PR #123 for merge readiness"
```

**VS Code**:
```
@workspace use .github/modes/review.mode.md
#changes
```

### Plan Implementation

**VS Code**:
```
@workspace use .github/modes/planning.mode.md
Create implementation plan for offline mode feature
```

## 🔧 Available Tools

### Custom Agents

- `firefighter-specialist` - Rotation logic, shift filtering, Supabase
- `accessibility-auditor` - WCAG 2.1 AA/AAA compliance
- `my-agent` - GitHub workflows, PR management
- `ui-ux-implementation-specialist` - Design systems, Tailwind CSS

### MCP Servers

- **GitHub** - Repository operations
- **Playwright** - E2E testing automation
- **Context7** - Library documentation
- **Filesystem** - File operations
- **Supabase** - Database queries

### Prompt Files

- `rotation-fix.prompt.md` - Fix rotation logic issues
- `accessibility-audit.prompt.md` - WCAG compliance audit

### Mode Files

- `planning.mode.md` - Generate implementation plans
- `review.mode.md` - Code review checklist

## 📚 Project-Specific Context

### Critical Patterns to Remember

1. **Shift Filtering** (⚠️ CRITICAL):
   ```typescript
   // Always filter by currentShift
   .eq("shift", currentShift)
   ```

2. **Rotation Logic**:
   ```typescript
   // Use utilities, never manual positions
   import { sortFirefighters, recalculatePositions } from '../utils/rotationLogic';
   ```

3. **Activity Logging**:
   ```typescript
   // Log all mutations
   await logActivity(name, "action_type", "details");
   ```

4. **Date Handling**:
   ```typescript
   // Use utility to prevent timezone bugs
   import { formatHoldDate } from '../utils/dateUtils';
   ```

### Ask Copilot About

- "How does the rotation position system work?"
- "What are the shift filtering requirements?"
- "How do I set up real-time subscriptions?"
- "What's the activity logging pattern?"
- "How do I handle dates correctly?"

## 🐛 Troubleshooting

### MCP Servers Not Working

```bash
# In CLI
/mcp list

# Check environment variables
echo $COPILOT_MCP_GITHUB_TOKEN
```

### Agent Not Found

```bash
# List available agents
ls ~/.copilot/agents/
ls .github/agents/

# Use full path
copilot --agent ~/.copilot/agents/firefighter-specialist
```

### VS Code Not Using Instructions

1. Reload window: `Cmd+Shift+P` > "Reload Window"
2. Check: `.vscode/settings.json` exists
3. Verify: `.github/copilot-instructions.md` exists

## 📖 Next Steps

1. Read full configuration: `COPILOT_CONFIGURATION.md`
2. Review custom instructions: `.github/copilot-instructions.md`
3. Explore prompts: `.github/prompts/`
4. Try agents: `copilot --agent <name>`
5. Configure MCP servers: `.github/copilot-mcp.json`

## 🆘 Need Help?

- Full docs: `COPILOT_CONFIGURATION.md`
- Project patterns: `.github/copilot-instructions.md`
- GitHub Copilot docs: https://docs.github.com/copilot

---

**Ready to code?** Start with: `copilot` or `Ctrl+I` in VS Code! 🚀
