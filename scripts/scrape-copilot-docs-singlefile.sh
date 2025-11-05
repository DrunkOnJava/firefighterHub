#!/bin/bash
# Scrape GitHub Copilot documentation using SingleFile CLI
# Saves complete HTML files with embedded resources

OUTPUT_DIR="$HOME/Library/Application Support/Development-Documentation/github-copilot"
mkdir -p "$OUTPUT_DIR"

echo "Creating output directory: $OUTPUT_DIR"
echo ""
echo "Scraping GitHub Copilot documentation..."
echo ""

URLS=(
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/manage-agents"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-a-pr"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/make-changes-to-an-existing-pr"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/track-copilot-sessions"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/review-copilot-prs"
  "https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-slack"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-teams"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-linear"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/troubleshoot-coding-agent"
  "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents"
)

FILENAMES=(
  "01-use-copilot-agents.html"
  "02-manage-agents.html"
  "03-coding-agent.html"
  "04-create-a-pr.html"
  "05-make-changes-to-existing-pr.html"
  "06-track-copilot-sessions.html"
  "07-review-copilot-prs.html"
  "08-extending-with-mcp.html"
  "09-integrate-with-slack.html"
  "10-integrate-with-teams.html"
  "11-integrate-with-linear.html"
  "12-customize-agent-environment.html"
  "13-customize-agent-firewall.html"
  "14-troubleshoot-coding-agent.html"
  "15-create-custom-agents.html"
)

SUCCESS=0
FAILED=0

for i in "${!URLS[@]}"; do
  url="${URLS[$i]}"
  filename="${FILENAMES[$i]}"
  output="$OUTPUT_DIR/$filename"

  echo "[$((i+1))/${#URLS[@]}] Scraping: $url"

  if single-file "$url" "$output" > /dev/null 2>&1; then
    echo "✅ Saved: $filename"
    ((SUCCESS++))
  else
    echo "❌ Failed: $filename"
    ((FAILED++))
  fi

  echo ""

  # Rate limiting - wait 2 seconds between requests
  sleep 2
done

# Create index file
INDEX_FILE="$OUTPUT_DIR/INDEX.html"
cat > "$INDEX_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Copilot Agents Documentation Index</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f6f8fa;
        }
        h1 {
            color: #24292f;
            border-bottom: 2px solid #d0d7de;
            padding-bottom: 10px;
        }
        .meta {
            color: #57606a;
            margin-bottom: 30px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #d0d7de;
        }
        a {
            color: #0969da;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #d0d7de;
            margin-top: 30px;
        }
        .success { color: #1a7f37; }
        .failed { color: #cf222e; }
    </style>
</head>
<body>
    <h1>GitHub Copilot Agents Documentation</h1>
    <p class="meta">Scraped on: DATE_PLACEHOLDER</p>

    <h2>Documentation Files</h2>
    <ul>
EOF

# Add links to index
for i in "${!URLS[@]}"; do
  filename="${FILENAMES[$i]}"
  url="${URLS[$i]}"
  cat >> "$INDEX_FILE" << EOF
        <li>
            <a href="$filename">$filename</a><br>
            <small style="color: #57606a;">Source: <a href="$url" target="_blank">$url</a></small>
        </li>
EOF
done

# Add summary
cat >> "$INDEX_FILE" << EOF
    </ul>

    <div class="summary">
        <h2>Summary</h2>
        <ul style="list-style: disc; padding-left: 20px;">
            <li>Total URLs: ${#URLS[@]}</li>
            <li class="success">Successful: $SUCCESS</li>
            <li class="failed">Failed: $FAILED</li>
        </ul>
    </div>
</body>
</html>
EOF

# Replace date placeholder
DATE=$(date "+%B %d, %Y at %I:%M %p")
sed -i '' "s/DATE_PLACEHOLDER/$DATE/" "$INDEX_FILE"

echo "================================"
echo "Scraping complete!"
echo "================================"
echo "📁 Location: $OUTPUT_DIR"
echo "✅ Successful: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""
echo "Open INDEX.html to browse all documentation"
