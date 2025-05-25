#!/bin/bash

# Function to update a single commit message
update_commit() {
    local commit_hash=$1
    local new_message=$2
    
    # Checkout the commit
    git checkout $commit_hash
    
    # Amend the commit message
    git commit --amend -m "$new_message" --no-edit
    
    # Go back to the updated-commits branch
    git checkout updated-commits
}

# Example usage:
# update_commit "4660676" "fix(ai): resolve syntax errors in AIIntegrationRecipe" 