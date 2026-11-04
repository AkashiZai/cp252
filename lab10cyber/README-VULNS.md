# Inventory Tracker — Vulnerability Training Guide

> ⚠️ EDUCATION ONLY. This fork is deliberately vulnerable, modeled on
> DVWA / OWASP WebGoat. Every vulnerability here is a textbook class
> (documented in OWASP Top 10). Never run this on a public or shared
> network: it is trivially exploitable. Start with `npm start` — it binds
> to `127.0.0.1` only. There is no need to expose it; everything here
> works from the training machine itself.

**Kill switch:** start with `TRAINING_VULNS=off npm start` to run the
"fixed" class demonstration (all vulnerable routes return 404).

---

## VULN-1 — Command injection (CWE-78)
Route: `GET /api/tools/ping?host=...`

User input is concatenated into a `child_process.exec` shell command.

Exploit:
```bash
curl "localhost:3000/api/tools/ping?host=8.8.8.8;id"
curl "localhost:3000/api/tools/ping?host=8.8.8.8%3Bcat%20package.json"
```
The response shows the output of the injected `id` / `cat` commands.

**Fix:** never pass user input to a shell. Use `execFile('ping',
['-c','1', validatedHost])` (arg array = no shell interpolation) and
validate `host` against `^[a-zA-Z0-9.-]+$`.

---

## VULN-2 — Code injection via `eval` (CWE-94)
Route: `GET /api/tools/calc?expr=...`

Exploit:
```bash
curl "localhost:3000/api/tools/calc?expr=6%20%2A%207"        # 6 * 7 -> 42
curl "localhost:3000/api/tools/calc?expr=require('child_process').execSync('ls').toString()"
```

**Fix:** delete `eval`. Parse a math expression with a safe parser
(`mathjs.evaluate`) or build a tiny tokenizer. If dynamic code is truly
unavoidable, `vm.runInNewContext` in a sandbox with no `require` — and
still treat it as hostile input.

---

## VULN-3 — Path traversal (CWE-22)
Route: `GET /api/files/report?name=...`

Exploit:
```bash
curl "localhost:3000/api/files/report?name=summary.txt"          # legitimate file
curl "localhost:3000/api/files/report?name=../../package.json"   # reads app source
```

**Fix:** `const safe = path.resolve(filesDir, name); if (!safe.startsWith(filesDir + path.sep)) return res.status(400).send('invalid path');` — then send `safe`.

---

## VULN-4 — Reflected XSS (CWE-79)
Route: `GET /api/search?q=...`

The query is reflected into the HTML response without escaping.

Exploit (open in a browser):
```
http://localhost:3000/api/search?q=<img src=x onerror=alert(1)>
http://localhost:3000/api/search?q=<h1>DOM defaced</h1>
```

**Fix:** rebuild the response with escaped interpolation, or render via
the EJS views where the percent-equals tag escapes. If HTML must be
assembled, encode `& < > " ' /`.

---

## VULN-5 — Stored XSS (CWE-79)
Location: comments on every item page (`views/items/show.ejs`).

Comments are stored raw and rendered with the percent-minus tag
(unescaped). The comment API is a plain curl target:

```bash
# 1. create an item (no auth in the training app)
curl -X POST localhost:3000/items -d 'name=Lab Widget&category=Electronics&detail=training-item'
# 2. plant a stored XSS in its comments
curl -X POST localhost:3000/api/items/1/comments \
     -H 'Content-Type: application/json' \
     -d '{"comment":"<img src=x onerror=alert(1)>"}'
# 3. any visitor of http://localhost:3000/items/1 executes the payload
open http://localhost:3000/items/1
```

Fix is annotated inline in `views/items/show.ejs`: switch back to the
escaped interpolation tag (the code comment marks the exact line).

---

## VULN-6 — Broken access control / secrets in code (CWE-285, CWE-798)
Route: `GET /api/admin?token=...`

The admin "gate" is a hard-coded token compared with `==`.
```bash
grep -rn "sup3rs3cr3t" routes/          # secret readable in source (CWE-798)
curl "localhost:3000/api/admin?token=sup3rs3cr3t"
```
Also worth showing the class: `==` compares loose types — the same
pattern historically enabled type-juggling bypasses in similar code.

**Fix:** real auth middleware + sessions; store secrets in
environment/config; use timing-safe comparison (`crypto.timingSafeEqual`).

---

## Teaching tips
- Each fix is one commit away: `git diff` / keep the "secure" branch
  prepared so students patch, then diff, then re-verify with the curl
  commands above.
- Map each vulnerability to MITRE CWE / OWASP Top 10 category during the
  lesson; ask students to name the category *before* you reveal it.
