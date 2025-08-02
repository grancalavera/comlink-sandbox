# comlink-sandbox

## Milestone 1

Remove all files created by the Vite template, leaving only main.tsx and a blank stylesheet.

### Steps

1. **Remove template component files**

   - Delete `src/App.tsx`
   - Delete `src/App.css`

2. **Remove template assets**

   - Delete `src/assets/react.svg`
   - Delete `public/vite.svg`

3. **Clean up stylesheets**

   - Replace content of `src/index.css` with empty file (keep as blank stylesheet)

4. **Update main.tsx**

   - Remove import of `App.tsx`
   - Remove import of `index.css` (temporarily)
   - Simplify render to minimal React app without App component

5. **Verify clean state**
   - Ensure project builds without errors
   - Confirm only essential files remain: `main.tsx` and blank `index.css`
