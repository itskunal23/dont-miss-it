<div align="center">

## Dont Miss It

**The anti-planner that turns overwhelm into one calm next step.**  
Enterprise-ready, privacy-first, and built for real human workloads.

No guilt. No noise. Measurable progress.

</div>

---

## 1. Overview

**Dont Miss It** is a mobile-first, production-ready PWA that transforms unstructured “brain dumps” into **one actionable step you can complete in 10–20 minutes**.

- Instead of long backlogs, you see **one active tile**.
- Instead of nudging users with guilt, it **shrinks work** when avoidance patterns show up.
- Instead of opaque AI, it ships with a **deterministic rules engine**, plus **optional server-side AI (Ollama)** for messy inputs.

This makes it suitable both as:
- A **consumer-facing product** for overwhelmed knowledge workers and students.
- A **reference implementation** for teams exploring calm, behaviorally-informed productivity tools.

---

## 2. How it works

### 2.1 Brain dump

Users can enter anything, in any order, for example:

> “Reply to Sarah, pay electric bill by Friday, study for chem exam”

### 2.2 From chaos → one tile

The app parses the text, classifies intent, detects deadlines, and surfaces **one “next step” tile**:

```
┌───────────────────────────────────────────────┐
│  ONE TILE (single visible task)               │
│                                               │
│  📧 Reply to Sarah                            │
│  Next step: Open the thread and write 1 line. │
│                                               │
│  ⏱️ 10 min   📅 Due: Friday   🟢 Low effort  │
│                                               │
│  [Start] [Snooze] [Make smaller] [Done]       │
└───────────────────────────────────────────────┘
```

All other derived tasks quietly move into a **queue**—accessible, but not demanding attention.

### 2.3 Anti-avoidance logic

If a user keeps snoozing the same tile, the system automatically **reduces activation energy**:

- **Snooze 0** → normal step  
- **Snooze 2** → “setup-only” step (e.g., open the doc, locate section)  
- **Snooze 4+** → “just open it” step  

This mirrors evidence-based behavior design: make the first action trivially small to unlock momentum.

---

## 3. Why it works (backed by research)

The product is designed around well-documented realities:

- **Interruptions & context switching:** Microsoft’s research on the “infinite workday” shows knowledge workers are interrupted every few minutes, fragmenting focus and extending work hours.
- **Switching costs:** Cognitive psychology consistently finds that task switching carries **non-trivial performance penalties**, especially for complex work.
- **Implementation intentions:** Pre-committing to a specific, small next action improves follow-through rates in controlled studies.
- **Stress & overwhelm (especially Gen Z / young adults):** High reported stress correlates with avoidance and shutdown, not with “doing more planning”.

**Dont Miss It** is built to:
- Reduce decision load (one tile, not dozens).
- Reduce friction to start (micro-steps).
- Remove shame from the loop (no “you failed” language, only “let’s make it smaller”).