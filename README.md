# IP-SAKTI Sahayak — 2-Hour MVP Starter

This is a **working retrieval-grounded prototype** designed for the urgent SIH submission.

## What works now
- FastAPI backend
- TF-IDF retrieval over a small curated corpus
- Evidence-grounded answer synthesis (local, deterministic; no paid API required)
- Source + section + page/web-section metadata
- Evidence viewer
- English/Hindi/Marathi UI selector
- Official IP India source links
- Health endpoint for demo/testing

## Important scope note
Because the team has no LLM API key right now, this starter does **not** claim to have an LLM generator. The "generator" is a local evidence-grounded synthesizer. That means the **retrieval + grounding + citation flow is real**, while the optional LLM layer is the next upgrade.

Do NOT tell judges that this version is an LLM-powered RAG if you have not connected an LLM.

## Run on Windows
1. Install Python 3.10+.
2. Open this folder in Terminal / PowerShell.
3. Create a virtual environment:
   `python -m venv .venv`
4. Activate:
   PowerShell: `.venv\Scripts\Activate.ps1`
5. Install:
   `pip install -r requirements.txt`
6. Run:
   `uvicorn app:app --reload`
7. Open:
   `http://127.0.0.1:8000`

## Recommended demo query
"Can traditional knowledge affect patentability of an Ayurvedic formulation?"

The MVP retrieves Section 3(p) and Section 64(1)(q) material from the curated corpus and shows the evidence.

## Next upgrade after submission
- Add an LLM API key
- Replace TF-IDF with embeddings + Qdrant/FAISS
- Add PDF ingestion with page-level metadata
- Add a real patent corpus
- Add multilingual answer generation
- Add Innovation Classification + IP Protection Map

## Source basis
The current demo corpus uses official IP India pages for the Patents Act, 1970, including Section 3 and Section 64 resources.