#!/bin/bash

# Script to clean up commit messages: lowercase + truncate to 60 chars

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <commit-hash>"
    exit 1
fi

COMMIT_HASH=$1

# Get current message
MSG=$(git log --format=%B -n 1 $COMMIT_HASH)

# Clean: lowercase first line, truncate to 60
FIRST_LINE=$(echo "$MSG" | head -n1 | tr '[:upper:]' '[:lower:]' | cut -c1-60)
REST=$(echo "$MSG" | tail -n +2)

NEW_MSG="$FIRST_LINE
$REST"

# Rewrite the commit message
git filter-branch --msg-filter "if [[ \$GIT_COMMIT == $COMMIT_HASH ]]; then echo \"$NEW_MSG\"; else cat; fi" -- $COMMIT_HASH^..$COMMIT_HASH

echo "Rewrote commit $COMMIT_HASH with cleaned message."