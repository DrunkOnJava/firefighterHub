# Scripts Directory

This directory contains utility scripts for the FirefighterHub project.

## Directory Structure

- **database/** - Database management and migration scripts
- **maintenance/** - Ongoing maintenance and cleanup scripts
- **development/** - Development utilities and tools
- **one-time/** - Historical one-time scripts (archived)
- **archive/** - Old scripts no longer in use

## Active Scripts

### Database Scripts
- `apply-schema.ts` - Apply database schema changes
- `verify-database.ts` - Verify database integrity
- `test-db-connection.ts` - Test database connectivity

### Maintenance Scripts
- `bump-cache-version.js` - Increment cache version for PWA updates
- `validate-headers.sh` - Validate file headers
- `check-env-security.sh` - Security check for environment variables

### Development Scripts
- `generate-icons.js` - Generate icon assets
- `generate-pwa-icons.sh` - Generate PWA icons
- `fix-imports.sh` - Fix import statements

## Usage

Most scripts can be run directly:

```bash
# TypeScript scripts (requires ts-node)
npx ts-node scripts/verify-database.ts

# Shell scripts
bash scripts/validate-headers.sh

# Node scripts
node scripts/bump-cache-version.js
```

## One-Time Scripts

Scripts in the `one-time/` directory were created for specific migrations or fixes and are kept for historical reference only.

## Archive

The `archive/` directory contains old database restoration scripts and other obsolete utilities.
