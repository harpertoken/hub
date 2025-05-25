commit_messages = {
    "46606764fc605d93f20878ced1a3af7e56175b6d": "fix(ai): resolve syntax errors in AIIntegrationRecipe",
    "f752c5c1da5d0dd478885494da8e550e0f555c57": "refactor(voice): remove voice crafting features",
    "6e0bd41530c9018f009a604e40c8d3b0d6a79856": "fix(api): update education query endpoint paths",
    "056558bb6db68fd033d88259804c8eb07141d28d": "fix(api): update API_URL to use relative URLs in production"
}

def message_callback(commit):
    orig = commit.original_id.decode('utf-8') if hasattr(commit.original_id, 'decode') else commit.original_id
    if orig in commit_messages:
        commit.message = commit_messages[orig].encode('utf-8') 