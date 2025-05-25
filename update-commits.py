#!/usr/bin/env python3

import sys
from git_filter_repo import Blob, Filter, Reset, Reset

def rewrite_commit_message(commit):
    commit_messages = {
        "4660676": "fix(ai): resolve syntax errors in AIIntegrationRecipe",
        "f752c5c": "refactor(voice): remove voice crafting features",
        "6e0bd41": "fix(api): update education query endpoint paths",
        "056558b": "fix(config): update API_URL for production",
        "57506f8": "feat(api): enhance education query handling",
        "52e96bf": "chore(vercel): update serverless function config",
        "329be82": "feat(vercel): add serverless function entry point",
        "27dbfb2": "fix(vercel): update server configuration",
        "60ceb22": "fix(vercel): configure API routes",
        "9c51aad": "fix(vercel): update routing for React app",
        "03ef123": "chore(build): simplify package manager config",
        "474ccb4": "fix(build): configure pnpm version",
        "15aed01": "chore(build): optimize Vercel build config",
        "fa21725": "chore(vercel): add homepage field",
        "60f3d6c": "chore(build): update build script",
        "f779e2f": "chore(build): add Vercel build artifacts",
        "1334a8d": "fix(app): ensure correct React rendering",
        "5bf97aa": "fix(lint): resolve App.js linter errors",
        "4972829": "chore(build): update Vercel build script",
        "c5f656f": "chore(build): update package.json",
        "0bc11f6": "fix(build): add missing index.html",
        "8218d11": "fix(build): disable prebuild script",
        "4326a29": "chore(deps): remove pnpm-workspace.yaml",
        "2f72e2f": "chore(deps): update pnpm-lock.yaml",
        "a77e68b": "chore(deps): add Google Cloud TTS",
        "ae416ad": "fix(build): remove pnpm-workspace.yaml",
        "65eb55c": "fix(config): remove env reference",
        "ab050d9": "fix(vercel): remove functions property",
        "ebf89f3": "feat(release): Tolerable v1.2.0"
    }
    
    commit_hash = commit.id.decode('utf-8')[:7]
    if commit_hash in commit_messages:
        commit.message = commit_messages[commit_hash].encode('utf-8')

filter = Filter(commit_callback=rewrite_commit_message)
filter.run() 