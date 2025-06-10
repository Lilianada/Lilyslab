# Automatic Last Updated Script

This feature automatically updates the `last-updated.json` file whenever you push changes to your repository.

## How it Works

1. A Git pre-push hook runs before each push
2. The hook executes the `update-timestamp.js` script
3. The script updates the `lastUpdated` field in the `last-updated.json` file with the current date and time
4. The changes are automatically committed with the message "Update last-updated.json timestamp [skip ci]"

## Installation

The Git hook is automatically installed when you run `npm install` due to the `postinstall` script.

You can also manually install it with:

```bash
npm run install-hooks
```

## Manual Update

If you want to update the timestamp without pushing:

```bash
node scripts/update-timestamp.js
```

## Configuration

The hook updates two fields in `last-updated.json`:

- `lastUpdated`: The current date and time in ISO format
- `source`: Set to "git-push" to indicate the update was triggered by a Git push

## Troubleshooting

If you encounter any issues:

1. Make sure the scripts are executable: 
   ```bash
   chmod +x scripts/install-hooks.sh scripts/pre-push scripts/update-timestamp.js
   ```

2. Check if the Git hooks directory exists:
   ```bash
   ls -la $(git rev-parse --git-dir)/hooks
   ```

3. Verify the pre-push hook is correctly linked:
   ```bash
   ls -la $(git rev-parse --git-dir)/hooks/pre-push
   ```
