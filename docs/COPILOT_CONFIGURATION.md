# GitHub Copilot Configuration Guide

This document provides comprehensive configuration details for GitHub Copilot across all platforms and integrations in the FirefighterHub project.

## ✅ Configured Components

### 1. Copilot CLI (iTerm/Terminal)

**Location**: `~/.copilot/`

**Files**:
- `~/.copilot/config` - CLI configuration (model selection, logging)
- `~/.copilot/mcp-config.json` - MCP server configuration
- `~/.copilot/agents/` - Custom agents

**Current Configuration**:
```json
{
  "model": "claude-sonnet-4.5",
  "log_level": "info",
  "allow_all_paths": false,
  "default_session_mode": "interactive"
}
```

**Usage**:
```bash
copilot                    # Start interactive session
copilot --banner           # Start with animated banner
copilot --continue         # Resume most recent session
copilot --model claude-sonnet-4.5  # Use specific model
```

**Slash Commands**:
- `/login` - Authenticate with GitHub
- `/model` - List/switch AI models
- `/mcp add` - Add MCP server interactively
- `/agent <name>` - Switch to custom agent
- `/clear` - Clear conversation history
- `/usage` - View session statistics

### 2. VS Code Integration

**Settings File**: `~/Library/Application Support/Code/User/settings.json`

**Key Features Enabled**:
- ✅ Next edit suggestions
- ✅ Code actions
- ✅ Automatic rename suggestions
- ✅ Agent mode (max 20 requests)
- ✅ MCP server discovery
- ✅ Custom instructions from `.github/copilot-instructions.md`
- ✅ Prompt files support
- ✅ Mode files support
- ✅ Vision capabilities (GPT-4o)

**Chat Participants**:
- `@workspace` - Workspace context
- `@vscode` - VS Code features/settings
- `@terminal` - Terminal commands
- `@github` - GitHub operations

**Context Variables**:
- `#codebase` - Entire codebase context
- `#file` - Specific file
- `#selection` - Current selection
- `#changes` - Git changes
- `#problems` - Workspace issues

### 3. MCP Servers

**Repository Config**: `.github/copilot-mcp.json`
**CLI Config**: `~/.copilot/mcp-config.json`

**Configured Servers**:

#### Context7 (Documentation)
- Retrieves up-to-date library documentation
- Tools: `get-library-docs`, `resolve-library-id`

#### GitHub
- Repository operations
- Tools: `create_or_update_file`, `create_pull_request`, `search_repositories`
- Environment: Requires `COPILOT_MCP_GITHUB_TOKEN`

#### Playwright
- Browser automation for E2E testing
- Tools: `playwright_navigate`, `playwright_screenshot`, `playwright_click`

#### Puppeteer
- Browser automation alternative
- Tools: `puppeteer_navigate`, `puppeteer_screenshot`

#### Filesystem
- File operations within workspace
- Tools: `read_file`, `write_file`, `edit_file`, `search_files`

#### Memory
- Persistent context across sessions
- Tools: All memory operations

#### Web Fetch
- Fetch web content
- Tools: `fetch`

#### Supabase (Available)
- Database operations
- Tools: `query_database`, `list_tables`, `describe_table`
- Environment: Requires `COPILOT_MCP_SUPABASE_URL`, `COPILOT_MCP_SUPABASE_KEY`

### 4. Custom Agents

**Location**: 
- Global: `~/.copilot/agents/`
- Repository: `.github/agents/`

**Available Agents**:

#### my-agent (GitHub Specialist)
Expert in repository management, PR workflows, branch consolidation.

**Usage**:
```bash
copilot --agent my-agent
# Or in CLI: /agent my-agent
```

#### ui-ux-implementation-specialist
Expert in design systems, WCAG accessibility, Tailwind CSS.

**Usage**:
```bash
copilot --agent ui-ux-implementation-specialist
```

#### firefighter-specialist (New)
Expert in FirefighterHub rotation logic, shift filtering, Supabase real-time.

**Usage**:
```bash
copilot --agent firefighter-specialist
```

#### accessibility-auditor (New)
WCAG 2.1 AA/AAA expert for React applications.

**Usage**:
```bash
copilot --agent accessibility-auditor
```

### 5. Prompt Files

**Location**: `.github/prompts/`

**Available Prompts**:

#### rotation-fix.prompt.md
Fix rotation logic issues with proper shift filtering and position management.

**Usage in VS Code**:
```
@workspace use .github/prompts/rotation-fix.prompt.md to fix the rotation bug in useFirefighters.ts
```

#### accessibility-audit.prompt.md
Audit and fix WCAG 2.1 AA accessibility issues.

**Usage in VS Code**:
```
@workspace use .github/prompts/accessibility-audit.prompt.md to review ShiftBadge component
```

### 6. Mode Files

**Location**: `.github/modes/`

**Available Modes**:

#### planning.mode.md
Generate implementation plans without making code changes.

#### review.mode.md
Code review mode focusing on FirefighterHub best practices.

### 7. Custom Instructions

**Location**: `.github/copilot-instructions.md`

Comprehensive project-specific instructions covering:
- Critical architecture patterns (shift filtering, rotation logic)
- Database schema and constraints
- Real-time subscription patterns
- Date handling with ISO strings
- Testing requirements
- Known issues and technical debt

## Usage Examples

### CLI Examples

```bash
# Start interactive session with specific model
copilot --model claude-sonnet-4.5

# Use custom agent for rotation logic fix
copilot --agent firefighter-specialist "Fix the rotation logic in useScheduledHolds.ts"

# Reference files with @
@src/hooks/useFirefighters.ts review this hook for shift filtering

# Execute commands directly with !
!pnpm test

# Enable all GitHub MCP tools
copilot --enable-all-github-mcp-tools
```

### VS Code Examples

```
# Use workspace context
@workspace what's the current test coverage?

# Use file context
@src/utils/rotationLogic.ts explain how position recalculation works

# Use changes context
#changes review my uncommitted changes for shift filtering issues

# Use custom prompt
@workspace use .github/prompts/accessibility-audit.prompt.md for Calendar.tsx

# Ask GitHub-related questions
@github what PRs are waiting for review?
```

### Vision Capabilities

```bash
# In CLI
@screenshots/error.png what's wrong in this screenshot?
@diagrams/architecture.png explain this architecture diagram

# In VS Code
@screenshot.png What accessibility issues do you see?
@mockup.png Review this design for WCAG compliance
```

## Environment Variables

Required for full functionality:

```bash
# GitHub access (for MCP GitHub server)
export COPILOT_MCP_GITHUB_TOKEN="ghp_your_token_here"

# Supabase access (for MCP Supabase server)
export COPILOT_MCP_SUPABASE_URL="https://your-project.supabase.co"
export COPILOT_MCP_SUPABASE_KEY="your_service_key_here"

# Context7 API (already configured)
# CONTEXT7_API_KEY is in ~/.copilot/mcp-config.json
```

## Testing Configuration

### Verify CLI Setup

```bash
copilot --version
cat ~/.copilot/config
cat ~/.copilot/mcp-config.json
ls -la ~/.copilot/agents/
```

### Verify VS Code Setup

```bash
code --list-extensions | grep copilot
cat ~/Library/Application\ Support/Code/User/settings.json
```

### Verify Repository Setup

```bash
ls -la .github/
cat .github/copilot-mcp.json
ls .github/agents/
ls .github/prompts/
ls .github/modes/
```

### Test MCP Servers

```bash
# In Copilot CLI
/mcp list  # Should show all configured servers

# Test specific server
@workspace what MCP servers are available?
```

## Keyboard Shortcuts (VS Code)

- `Ctrl+I` / `Cmd+I` - Open inline chat
- `Ctrl+Shift+I` / `Cmd+Shift+I` - Open chat sidebar
- `Ctrl+Enter` / `Cmd+Enter` - Send chat message
- `Alt+\` / `Option+\` - Trigger inline suggestion
- `Tab` - Accept suggestion
- `Esc` - Dismiss suggestion

## Best Practices

### 1. Use the Right Tool
- **CLI**: File operations, git workflows, batch processing
- **VS Code Chat**: Code understanding, refactoring, targeted changes
- **Custom Agents**: Specialized tasks (rotation logic, accessibility)
- **MCP Servers**: External integrations (GitHub, Playwright, Supabase)

### 2. Leverage Context
- Use `@workspace` for codebase-wide questions
- Use `#file` for specific file context
- Use `#changes` to review uncommitted work
- Use custom prompts for repeated workflows

### 3. Project-Specific Patterns
- **Always** mention shift filtering requirements
- Reference rotation logic utilities
- Check activity logging requirements
- Verify date handling with `formatHoldDate()`

### 4. Accessibility
- Use `accessibility-auditor` agent for WCAG issues
- Test contrast with WebAIM Checker
- Verify keyboard navigation
- Check touch target sizes (44px minimum)

## Troubleshooting

### MCP Server Not Working

```bash
# Check server status in CLI
/mcp list

# Restart VS Code
# Check logs: ~/.copilot/logs/

# Verify environment variables
echo $COPILOT_MCP_GITHUB_TOKEN
```

### Agent Not Found

```bash
# List available agents
ls ~/.copilot/agents/
ls .github/agents/

# Verify JSON syntax
cat ~/.copilot/agents/firefighter-specialist.json | python3 -m json.tool
```

### VS Code Settings Not Applied

```bash
# Reload window
# CMD+Shift+P > "Reload Window"

# Check settings
code ~/Library/Application\ Support/Code/User/settings.json
```

## Additional Resources

- [Copilot CLI Documentation](https://github.com/github/copilot-cli)
- [VS Code Copilot Docs](https://code.visualstudio.com/docs/copilot/overview)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [FirefighterHub Instructions](.github/copilot-instructions.md)

## Quick Reference

### File Locations

```
~/.copilot/
├── config                          # CLI config
├── mcp-config.json                 # MCP servers (CLI)
└── agents/
    ├── firefighter-specialist.json
    └── accessibility-auditor.json

.github/
├── copilot-instructions.md         # Custom instructions
├── copilot-mcp.json               # MCP servers (VS Code)
├── agents/
│   ├── my-agent.md
│   └── ui-ux-implementation-specialist.md
├── prompts/
│   ├── rotation-fix.prompt.md
│   └── accessibility-audit.prompt.md
└── modes/
    ├── planning.mode.md
    └── review.mode.md

~/Library/Application Support/Code/User/
└── settings.json                   # VS Code settings
```

### Model Selection

```bash
# Available models
- claude-sonnet-4.5 (recommended for complex tasks)
- gpt-4o (vision capabilities)
- claude-haiku-4.5 (fast responses)
- gpt-5 (experimental)
```

---

**Last Updated**: November 9, 2025
**Maintained by**: FirefighterHub Team
