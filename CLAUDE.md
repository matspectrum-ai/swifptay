# SWIFPTAY — gstack Project

## gstack is the absolute leader

This project operates under gstack as the primary and sole framework. All workflows, skills, and tooling are routed through gstack.

### How to use this project

- Invoke any gstack skill directly: `/gstack-<skill-name>` or `/<skill-name>`
- gstack handles planning, review, QA, shipping, debugging, docs, security, and design
- For browser/QA and dogfooding, use `/browse`
- For project-specific context, gstack reads `CLAUDE.md` first

### Project structure

- `.kilo/` — Kilo configuration (kilo.json, plans/)
- `.gstack/` — gstack project-level configuration
- `.claude/skills/gstack` — Symlink to global gstack installation
- `.git/` — Git repository

### gstack configuration

- **repo_mode**: solo
- **skill_prefix**: false (short names: /qa, /ship, etc.)
- **proactive**: true
- **checkpoint_mode**: explicit

### Skills available

All gstack skills are available:
- Planning: `/plan-ceo-review`, `/plan-design-review`, `/plan-eng-review`, `/plan-devex-review`
- Review: `/review`, `/design-review`, `/devex-review`
- QA: `/qa`, `/qa-only`, `/browse`
- Shipping: `/ship`, `/land-and-deploy`
- Debugging: `/investigate`, `/gstack-openclaw-investigate`
- Docs: `/document-generate`, `/document-release`
- Design: `/design-consultation`, `/design-html`, `/design-shotgun`
- And all other gstack skills

### Do not bypass gstack

All project work should go through gstack. Do not use alternative frameworks or workflows unless explicitly instructed by the user.