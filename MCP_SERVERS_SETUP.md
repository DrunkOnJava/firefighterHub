# MCP Servers Configuration for Copilot CLI

**Date**: November 7, 2025  
**Status**: ✅ Installed and Configured

---

## Installed MCP Servers

### 1. **Chrome DevTools MCP Server**
- **Version**: 0.10.0
- **Purpose**: Browser automation, inspection, and DevTools control
- **Command**: `chrome-devtools-mcp`
- **Repository**: https://github.com/ChromeDevTools/chrome-devtools-mcp

### 2. **Playwright MCP Server**
- **Version**: 0.0.45
- **Purpose**: End-to-end browser testing and automation
- **Command**: `npx @playwright/mcp@latest`
- **Repository**: https://github.com/microsoft/playwright-mcp

---

## Installation Summary

### Prerequisites Met
- ✅ Node.js v22.14.0 (requires v18+)
- ✅ npm v10.9.2
- ✅ npx available
- ✅ GitHub CLI v2.83.0
- ✅ GitHub Copilot authenticated (user: DrunkOnJava)

### Installation Commands Used
```bash
# Global installation for faster startup
npm install -g chrome-devtools-mcp @playwright/mcp

# Verification
chrome-devtools-mcp --version  # 0.10.0
npx @playwright/mcp --version  # 0.0.45
```

---

## Configuration File

**Location**: `~/.config/github-copilot/mcp.json`

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "chrome-devtools-mcp",
      "args": [],
      "description": "Chrome DevTools MCP server for browser automation and inspection"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "description": "Playwright MCP server for end-to-end browser testing"
    }
  }
}
```

---

## Usage with Copilot CLI

### Starting Chrome with Remote Debugging (Required for Chrome DevTools MCP)

**macOS**:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-copilot
```

**Linux**:
```bash
google-chrome --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-copilot
```

**Windows PowerShell**:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:TEMP\chrome-profile-copilot"
```

### Using MCP Servers in Copilot CLI

Once Chrome is running with remote debugging:

```bash
# Use Chrome DevTools MCP
copilot -p "Navigate to https://firefighter-hub.vercel.app and take a screenshot"

# Use Playwright MCP
copilot -p "Run E2E test for mobile viewport at 375px and verify touch targets are 44px"

# Combined usage
copilot -p "Open FirefighterHub in Chrome at mobile viewport, verify mobile scroll works, take screenshots"
```

---

## Available Tools

### Chrome DevTools MCP Tools
- Navigate to URLs
- Take screenshots
- Execute JavaScript
- Inspect DOM elements
- Monitor network requests
- Evaluate console expressions
- Manage cookies/storage
- Emulate device viewports

### Playwright MCP Tools
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile emulation (iPhone, Android devices)
- Network interception
- Screenshot and video recording
- Accessibility testing
- Performance profiling
- Visual regression testing
- Parallel test execution

---

## Troubleshooting

### Chrome DevTools MCP
**Issue**: "Unable to connect to Chrome"
**Solution**: Ensure Chrome is running with `--remote-debugging-port=9222`

**Issue**: "Connection refused"
**Solution**: Check firewall settings, ensure port 9222 is not blocked

### Playwright MCP
**Issue**: "Browser not found"
**Solution**: Run `npx playwright install` to download browsers

**Issue**: Slow startup
**Solution**: Use global installation instead of npx:
```bash
npm install -g @playwright/mcp
# Update config to use: "command": "playwright-mcp"
```

---

## Verification Checklist

- [x] ✅ Node.js v18+ installed (v22.14.0)
- [x] ✅ Chrome DevTools MCP installed globally (v0.10.0)
- [x] ✅ Playwright MCP installed globally (v0.0.45)
- [x] ✅ MCP config file created at `~/.config/github-copilot/mcp.json`
- [x] ✅ GitHub Copilot CLI authenticated
- [ ] ⏳ Chrome started with remote debugging (user to start when needed)
- [ ] ⏳ Playwright browsers installed (run `npx playwright install` if needed)

---

## Next Steps

1. **Test Chrome DevTools MCP**:
   ```bash
   # Start Chrome with remote debugging
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --remote-debugging-port=9222 \
     --user-data-dir=/tmp/chrome-profile-copilot &
   
   # Test with Copilot CLI
   copilot -p "Navigate to firefighter-hub.vercel.app and verify mobile scrolling"
   ```

2. **Install Playwright Browsers** (if not already installed):
   ```bash
   npx playwright install
   ```

3. **Test Playwright MCP**:
   ```bash
   copilot -p "Run mobile E2E test at 375px viewport for FirefighterHub"
   ```

---

## References

- [Chrome DevTools MCP Documentation](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp)
- [GitHub Copilot CLI Documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

---

**Configured By**: Copilot CLI Session  
**Date**: November 7, 2025  
**System**: macOS (Darwin) with Node.js v22.14.0
