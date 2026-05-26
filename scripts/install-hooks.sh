#!/bin/sh

# Get the Git hooks directory for the current repository
HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel)"

# Make sure the hooks directory exists
mkdir -p "$HOOKS_DIR"

# Create a symbolic link to the pre-push script
ln -sf "$REPO_ROOT/scripts/pre-push" "$HOOKS_DIR/pre-push"

# Make the pre-push script executable
chmod +x "$REPO_ROOT/scripts/pre-push"
chmod +x "$REPO_ROOT/scripts/update-timestamp.js"

echo "✅ Git pre-push hook installed successfully!"