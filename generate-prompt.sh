#!/bin/bash

# Output file
OUTPUT="prompt.txt"

# Clear the file
> "$OUTPUT"

# Function to append file with delimiter
append_file() {
    echo -e "\n=== $1" >> "$OUTPUT"
    cat "$1" >> "$OUTPUT"
}

# Add all src/next files
append_file "/Users/badlogic/workspaces/mini-lit/src/next/index.ts"
append_file "/Users/badlogic/workspaces/mini-lit/src/next/component.ts"
append_file "/Users/badlogic/workspaces/mini-lit/src/next/signals.ts"
append_file "/Users/badlogic/workspaces/mini-lit/src/next/template.ts"
append_file "/Users/badlogic/workspaces/mini-lit/src/next/directives/directive.ts"
append_file "/Users/badlogic/workspaces/mini-lit/src/next/directives/repeat.ts"

# Add demo files
append_file "/Users/badlogic/workspaces/mini-lit/example/src/pages/next-demo.ts"
append_file "/Users/badlogic/workspaces/mini-lit/example/src/pages/react-todo-demo.ts"

# Add the prompt at the end
cat >> "$OUTPUT" << 'EOF'

================================================================================
PROMPT:

Review this reactive web framework implementation. It features:
- Fine-grained reactivity with signals/effects (like SolidJS)
- Runtime template compilation with component awareness
- No build step required
- ~1000 lines of code total

Compare it to existing frameworks (React, Vue, Solid, Lit, Svelte). What's good, what's bad, what's mid? Be brutally honest about the implementation quality, API design, and practical usability. Consider both the technical approach and real-world viability.

Key areas to evaluate:
1. The reactivity system and signal implementation
2. The runtime template compilation approach
3. Component model and lifecycle
4. Performance implications
5. Developer experience
6. Production readiness

Don't hold back - give me the real assessment.
EOF

echo "Generated prompt.txt"