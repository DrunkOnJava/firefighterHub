## GitHub Copilot Chat

- Extension Version: 0.32.4 (prod)
- VS Code: vscode/1.105.1
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.113.6 (1 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.6 (11 ms)
- Proxy URL: None (6 ms)
- Electron fetch (configured): HTTP 200 (24 ms)
- Node.js https: HTTP 200 (66 ms)
- Node.js fetch: HTTP 200 (76 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.22 (2 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.22 (4 ms)
- Proxy URL: None (6 ms)
- Electron fetch (configured): HTTP 200 (21 ms)
- Node.js https: HTTP 200 (80 ms)
- Node.js fetch: HTTP 200 (78 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).

## Tasks

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "dev",
      "label": "npm: dev",
      "isBackground": true,
      "problemMatcher": {
        "owner": "custom",
        "pattern": {
          "regexp": "^$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "VITE.*ready in",
          "endsPattern": "Local:.*http://localhost:5173"
        }
      }
    }
  ]
}
```