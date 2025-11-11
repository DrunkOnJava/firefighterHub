# shadcn MCP Server Setup - Complete ✅

## Installation Summary

The shadcn MCP server has been successfully installed and configured for your FirefighterHub project.

### What Was Installed

1. **shadcn/ui Configuration** (`components.json`)
   - Style: New York (Recommended)
   - Base Color: Neutral
   - TypeScript: Enabled
   - CSS Variables: Enabled
   - Icon Library: Lucide

2. **MCP Server Configuration** (`.vscode/mcp.json`)
   - shadcn MCP server added to VS Code
   - Runs via: `npx shadcn@latest mcp`

3. **Dependencies Installed**
   - `class-variance-authority@0.7.1`
   - `clsx@2.1.1`
   - `tailwind-merge@3.3.1`

---

## How to Use

### 1. Start the MCP Server in VS Code

1. Open `.vscode/mcp.json` in VS Code
2. Click **Start** next to the `shadcn` server
3. Wait for the green status indicator

### 2. Test with GitHub Copilot

Try these example prompts in GitHub Copilot Chat:

```
Show me all available components in the shadcn registry
```

```
Add the button, dialog and card components to my project
```

```
Create a contact form using components from the shadcn registry
```

```
Install the dropdown-menu component from shadcn
```

---

## Available Commands

### Browse Components
- "Show me all available components"
- "List shadcn components"
- "What components are available from shadcn?"

### Install Components
- "Add the button component"
- "Install the dialog and dropdown-menu components"
- "Create a login form using shadcn components"

### Search Components
- "Find me a form component"
- "Search for navigation components"

---

## Configuration Files

### `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### `.vscode/mcp.json`
The shadcn server has been added to your existing MCP configuration alongside GitHub and Playwright servers.

---

## Troubleshooting

### MCP Server Not Responding

1. **Check VS Code MCP Panel**
   - Open `.vscode/mcp.json`
   - Verify shadcn server shows green status
   - Click "Restart" if needed

2. **Clear npx Cache**
   ```bash
   npx clear-npx-cache
   ```

3. **Re-enable Server**
   - Stop and restart the shadcn server in VS Code
   - Check Output panel: View → Output → "MCP: project-*"

### Components Not Installing

1. **Verify Project Setup**
   ```bash
   cat components.json
   ```

2. **Check Dependencies**
   ```bash
   pnpm list | grep -E "(class-variance-authority|clsx|tailwind-merge)"
   ```

3. **Test Manual Installation**
   ```bash
   pnpm dlx shadcn@latest add button
   ```

---

## Adding Private/Custom Registries

To add private or custom registries, edit `components.json`:

```json
{
  "registries": {
    "@company": "https://registry.company.com/{name}.json",
    "@custom": {
      "url": "https://custom.registry.io/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Then set environment variables in `.env.local`:
```bash
REGISTRY_TOKEN=your_token_here
```

---

## Next Steps

1. **Start the MCP Server** in VS Code (`.vscode/mcp.json`)
2. **Test with Copilot** using the example prompts above
3. **Install Your First Component** (e.g., "Add the button component")
4. **Check Installation** in `src/components/ui/`

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [shadcn Registry Documentation](https://ui.shadcn.com/docs/registry)

---

## Integration with FirefighterHub

The shadcn components will integrate seamlessly with your existing setup:

- ✅ **Tailwind CSS** - Already configured
- ✅ **TypeScript** - Fully typed components
- ✅ **Dark Mode** - Uses your existing `isDarkMode` state
- ✅ **Accessibility** - WCAG compliant components
- ✅ **Mobile-First** - Responsive by default

Components will be installed to `src/components/ui/` and can be imported like:

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
```

---

**Status:** ✅ Ready to use
**Last Updated:** 2025-11-09
