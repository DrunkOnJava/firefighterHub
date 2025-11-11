# Copilot CLI + shadcn MCP - Quick Start Guide

**Status:** ✅ Configured and ready to use

---

## 🚀 Using shadcn MCP in Copilot CLI

You're now in a Copilot CLI session with the shadcn MCP server connected. Here's how to use it:

### Example Prompts

Try asking any of these:

#### Browse Components
```
"Show me all available shadcn components"
"What UI components can I install?"
"List all form components in the shadcn registry"
```

#### Install Components
```
"Add a badge component to my project"
"Install the tabs and accordion components"
"Add all navigation components (breadcrumb, pagination, etc)"
```

#### Build Features
```
"Create a user profile form using shadcn components"
"Build a dashboard layout with cards and badges"
"Make a settings page with tabs and switches"
```

#### Search
```
"Find me a date picker component"
"Search for data table components"
"Show me all dialog/modal options"
```

---

## 🎯 What You Can Ask Me To Do

### Component Installation
- "Add the toast component"
- "Install alert-dialog, badge, and popover"
- "Give me all the form components"

### UI Creation
- "Build a login form with email/password fields"
- "Create a navigation sidebar"
- "Make a pricing card component"

### Migration Help
- "Convert this custom button to use shadcn Button"
- "Migrate this modal to use shadcn Dialog"
- "Replace my form inputs with shadcn components"

### Documentation
- "Show me how to use the Select component"
- "What props does the Button component accept?"
- "How do I use the Dialog component?"

---

## 🔧 Available MCP Servers

Your Copilot CLI session has access to:

1. **shadcn** - Component registry & installation
2. **github** - Repository operations
3. **playwright** - Browser automation & testing

---

## 📋 Current Project Status

### Installed shadcn Components (12)
- ✅ button
- ✅ card
- ✅ dialog
- ✅ input
- ✅ label
- ✅ select
- ✅ separator
- ✅ tooltip
- ✅ checkbox
- ✅ skeleton
- ✅ dropdown-menu
- ✅ alert-dialog

### Migration Progress
- **58/63 components** migrated to shadcn/ui (92.1%)
- **5 complex components** remaining
- Build: ✅ Passing (2.31s)

---

## 💡 Pro Tips

### 1. Natural Language Works
Don't overthink it - just describe what you want:
- ❌ "Execute shadcn CLI with add command for button component"
- ✅ "Add a button component"

### 2. Batch Operations
Install multiple components at once:
```
"Add button, input, label, select, and textarea components"
```

### 3. Context-Aware
I can see your project structure and existing components, so I'll:
- Avoid duplicate installations
- Follow your project's style (New York)
- Use your configured aliases (@/components/ui)

### 4. Ask for Explanations
```
"Add a tabs component and show me how to use it"
"Install the calendar component and give me an example"
```

---

## 🐛 Troubleshooting

### "MCP Server Not Connected"
1. Restart your Copilot CLI session
2. Verify: `cat .vscode/mcp.json`
3. Test: `npx shadcn@latest --help`

### "Component Already Exists"
Use `--overwrite` flag:
```
"Add the button component with --overwrite flag"
```

### "Build Errors After Installation"
1. Run `pnpm install`
2. Check `src/lib/utils.ts` exists
3. Verify imports in the new component

---

## 📚 Documentation

- **Main Setup:** `SHADCN_MCP_SETUP_COMPLETE.md`
- **Migration Status:** `SHADCN_MIGRATION_CHECKLIST.md`
- **AI Guidelines:** `AI_RULES.md`
- **MCP Config:** `.vscode/mcp.json`

---

## ✨ Ready to Go!

I'm ready to help you with:
- 🎨 Adding new shadcn components
- 🔄 Migrating custom components to shadcn
- 🏗️ Building new UI features
- 📝 Updating existing components
- 🐛 Fixing styling issues

**Just ask me in natural language!** 🚀
