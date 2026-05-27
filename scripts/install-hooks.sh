#!/bin/sh

# Get the Git hooks directory for the current repository
HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel)"

# Make sure the hooks directory exists
mkdir -p "$HOOKS_DIR"
