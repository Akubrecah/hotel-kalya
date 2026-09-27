# DOC-024: Development & Coding Standards Manual

**Document ID:** `DOC-024`  
**Version:** `1.0`  
**Status:** `MANDATORY INTERNAL STANDARD`  

---

## 1. Professional Vibe Coding Loop

For every single feature or bug fix, developers must strictly adhere to the 9-step loop:
1. **READ:** Read project context, requirements (`SRS`), and architecture docs.
2. **UNDERSTAND:** Understand constraints and failure modes before writing code.
3. **PLAN:** Formulate a concrete vertical slice plan.
4. **IMPLEMENT:** Write minimal, focused code without modifying unrelated files.
5. **TEST:** Run `npm run lint` and `npx tsc --noEmit`. Prove execution.
6. **REVIEW:** Inspect git diff for security loopholes, unhandled edge cases, or hallucinated packages.
7. **FIX:** Address any compiler, linter, or runtime regressions immediately.
8. **COMMIT:** Make small, atomic commits using Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`).
9. **UPDATE DOCUMENTATION:** Keep project docs, task logs, and task manifests updated.

---

## 2. Framework Specific Rules

- **Next.js & Clerk / Auth:** Never use `middleware.ts` if Clerk is on modern proxy routing (`proxy.ts`).
- **No Untyped Any:** TypeScript strict mode enabled. No `any` type escapes.
- **Separation of Concerns:** UI components must never contain direct database logic.

---

## 3. Sign-Off

**Lead Engineer:** `___________________________` Date: `__________`  
