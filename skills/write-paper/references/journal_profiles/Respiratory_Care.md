# Journal Profile: RESPIRATORY CARE

> **Provenance note.** The journal's author-guidelines page (`rcjournal.com`) was unreachable from
> the authoring environment (network egress blocked), so this profile was built under `add-journal`
> Path B from project-verified requirements only. Fields not verifiable from that source are marked
> `[TODO: verify at journal site]` rather than guessed. Verify all `[TODO]` fields before relying on
> this profile for a submission package.

## Journal Identity

- **Full name**: Respiratory Care
- **Abbreviation**: Respir Care
- **Publisher**: Daedalus Enterprises, on behalf of the American Association for Respiratory Care (AARC)
- **ISSN**: [TODO: verify at journal site]
- **Frequency**: Monthly
- **Impact Factor**: [TODO: verify at journal site]
- **Open Access**: [TODO: verify at journal site]
- **Acceptance rate**: [TODO: verify at journal site]
- **Peer review**: [TODO: verify at journal site]

---

## Manuscript Types and Word Limits

Word counts exclude abstract, references, figure legends, and tables.

| Type | Unsolicited | Abstract | Body Word Limit | References |
|------|-------------|----------|-----------------|------------|
| Original Research | Y | 300 (structured) | 5,000 | [TODO: verify] |
| Narrative / Systematic Review | [TODO: verify] | [TODO: verify] | [TODO: verify] | [TODO: verify] |
| Editorial | N (invited) | None | [TODO: verify] | [TODO: verify] |
| Letter to the Editor | Y | None | [TODO: verify] | [TODO: verify] |
| Case Report | [TODO: verify] | [TODO: verify] | [TODO: verify] | [TODO: verify] |

---

## Abstract Requirements

Original Research uses a **4-section structured abstract (300 words max)**:

```
Background: [Context and knowledge gap]
Methods: [Design, setting, participants, measurements, analytic approach]
Results: [Participant flow; primary and secondary findings with effect sizes,
    95% CIs, and P values]
Conclusions: [Main conclusion, clinical implication, key caveat]
```

The 300-word cap is hard. Keyword list follows the abstract.

---

## Required Sections (Original Article)

Standard IMRAD, plus one journal-specific element that authors most often omit:

1. Title page (title, running head, authors, affiliations, correspondence, conflicts, funding, ethics, trial registration)
2. Abstract (structured, 300 words) + keywords
3. **Quick Look box** — journal-specific, required for Original Research. Two fixed sub-headings:
   - `Current Knowledge` — what the field already knows, framed as the gap this paper enters
   - `What This Paper Contributes to Our Knowledge` — this study's specific increment, stated without overclaiming
   Each sub-section is a single short paragraph. This box is not the abstract restated: it is written for a reader deciding whether to read the paper.
4. Introduction
5. Methods
6. Results
7. Discussion (limitations required as an explicit passage)
8. Conclusions
9. References (numbered, AMA style)
10. Tables, figure legends, figures

---

## Statistical Reporting

Journal-specific statistical guidance was not verifiable from the available source
(`[TODO: verify at journal site]`). Apply the `add-journal` defaults, which also match
`analyze-stats` house standards:

- Report exact P values to 2-3 significant figures; use `P < .001` below that threshold.
- 95% CI for all primary outcome estimates.
- Effect sizes in **clinically meaningful units** (per 10 units, per 5 cm H2O — not per 1 unit for a variable spanning hundreds).
- Name the statistical software and version.
- Report the events-per-variable ratio for any multivariable model; EPV >= 10 minimum, >= 20 recommended.
- Report collinearity diagnostics (VIF) for multivariable models.
- For any "adds value beyond an existing tool" claim, report the nested-model comparison with an incremental metric; a standalone discrimination number does not support a "beyond X" claim (see `analyze-stats` `incremental_value.md`).
- Cutoffs derived in the same cohort in which they are tested must be labeled exploratory.

---

## Figures

- Figure and table count limits: [TODO: verify at journal site]
- Format/resolution requirements: [TODO: verify at journal site]
- A participant flow diagram is expected for observational cohorts and diagnostic-accuracy studies (STROBE / STARD).

---

## Common Rejection Reasons

- Single-center study with a small event count and no external validation, framed as a definitive predictor claim rather than an exploratory one.
- Cutoff derived and tested in the same cohort, then presented as a usable clinical threshold.
- Respiratory-therapy relevance not made explicit — the journal's readership is clinical respiratory care, so a paper must state what changes at the bedside.
- Quick Look box missing, or written as a duplicate of the abstract.
- Word limit exceeded (5,000 for Original Research).
- Measurements described without the ventilator settings and mode needed to reproduce them.

---

## Cover Letter

[TODO: verify journal-specific requirements at journal site]. Default structure:

- Statement that the work is original, not under consideration elsewhere, and approved by all authors.
- One paragraph on what the study adds to respiratory care practice.
- Ethics approval number and trial registration identifier.
- Conflicts of interest and funding.
- Suggested reviewers if the journal invites them.

---

## AI Writing Disclosure Policy

[TODO: verify at journal site]. No journal-specific AI policy was retrievable. In the absence of one,
follow **ICMJE**: disclose any generative-AI assistance in the Methods (or Acknowledgments), name the
tool and version, state that the authors reviewed and take responsibility for all content, and do not
list an AI tool as an author. AI-generated images and figures should be assumed disallowed unless the
journal states otherwise.

---

## Author Guidelines URL

`https://www.rcjournal.com/author-guidelines` [TODO: confirm current URL and re-extract all TODO fields]

---

## Positioning

**Submit here when**: the study is a bedside respiratory-care question — ventilator management, weaning and extubation, aerosol delivery, oxygen therapy, airway clearance, pulmonary function testing — and the primary audience is respiratory therapists and critical-care clinicians rather than pulmonologists as researchers. The journal is receptive to single-center physiological and device-focused work that a larger general journal would consider too narrow, provided the claim is scaled to the evidence.

**Do not submit here when**: the work is a large multicenter outcome trial or a mechanistic/basic-science study with no direct bedside respiratory-care application; or when the claim requires an impact factor tier the journal does not occupy.

| | Respiratory Care | CHEST | Critical Care Medicine |
|---|---|---|---|
| Body word limit (Original) | 5,000 | 3,200 | [TODO: verify] |
| Abstract | 300, structured (4 heads) | 300, structured (6 heads) | [TODO: verify] |
| Journal-specific box | **Quick Look** (required) | none | none |
| Audience | Respiratory therapists, critical-care clinicians | Pulmonary/critical care physicians | Intensivists |
| Fit for single-center physiological studies | Good | Moderate | Lower |
| Impact Factor | [TODO: verify] | ~9 | [TODO: verify] |
