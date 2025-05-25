#!/usr/bin/env python3

from git_filter_repo import Blob, Filter, Reset
import sys

# Map of full commit hashes to their new messages
commit_messages = {
    "46606764fc605d93f20878ced1a3af7e56175b6d": "fix(ai): resolve syntax errors in AIIntegrationRecipe",
    "f752c5c1da5d0dd478885494da8e550e0f555c57": "refactor(voice): remove voice crafting features",
    "6e0bd41530c9018f009a604e40c8d3b0d6a79856": "fix(api): update education query endpoint paths",
    "056558bb6db68fd033d88259804c8eb07141d28d": "fix(api): update API_URL to use relative URLs in production"
}

class CommitMessageRewriter(Filter):
    def commit_callback(self, commit, metadata):
        # Get the full commit hash
        commit_hash = commit.id.decode('utf-8')
        
        # If this commit's hash is in our map, update its message
        if commit_hash in commit_messages:
            commit.message = commit_messages[commit_hash].encode('utf-8')
        
        return commit

if __name__ == "__main__":
    # Create and run the filter
    filter = CommitMessageRewriter()
    filter.run() 