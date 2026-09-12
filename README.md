# IP-SAKTI Sahayak

### Multilingual, Evidence-Grounded Intellectual Property Assistant for Ayurveda

IP-SAKTI Sahayak is a web-based prototype designed to help Ayurveda innovators, researchers, startups, students, and MSMEs explore intellectual-property information across supported languages and jurisdictions.

The system combines multilingual query normalization, jurisdiction-aware retrieval, source-grounded explanations, patent similarity search, and a lightweight knowledge-base ingestion workflow.

---

## Problem

Ayurveda innovators often need to understand intellectual-property requirements before investing in research, product development, branding, and commercialization.

However, relevant information is distributed across:

- Patent and IP authorities
- Regulatory sources
- International IP resources
- Different legal jurisdictions
- Different languages

This makes information discovery difficult, especially for users who are more comfortable communicating in Indian languages.

IP-SAKTI Sahayak aims to make this information easier to discover and verify through a single evidence-oriented interface.

---

## What the Prototype Does

The current prototype demonstrates four main capabilities:

### 1. ASK

Users can ask IP-related questions in supported languages and select a jurisdiction.

The system:

1. Normalizes multilingual terminology
2. Retrieves relevant source material
3. Identifies relevant sections
4. Generates a preliminary source-grounded explanation
5. Displays supporting sources and evidence

The response is intentionally presented as preliminary information rather than a legal determination.

---

### 2. EXPLORE

Users can describe an innovation and search for potentially similar patent records.

The prototype uses TF-IDF cosine similarity to identify relevant patent records from the available patent corpus.

This is intended as an early prior-art / similarity exploration aid, not a substitute for professional patent searching.

---

### 3. VERIFY

The prototype emphasizes source traceability.

Users can inspect:

- Retrieved source
- Relevant section
- Supporting evidence
- Source metadata
- Uploaded documents

This supports an evidence-first interaction model rather than presenting unsupported answers.

---

### 4. KNOWLEDGE BASE

The prototype includes a lightweight knowledge-base ingestion flow.

A user can:

1. Open Knowledge Base
2. Click `+ Add Source`
3. Upload a PDF
4. Enter authority
5. Select document type
6. Enter jurisdiction
7. Add and index the source

The uploaded PDF is text-extracted, added to the searchable corpus, and the retrieval index is rebuilt.

The newly indexed source can then appear in the Knowledge Base and participate in retrieval.

---

## Supported Languages

The prototype UI supports:

- English
- Hindi
- Marathi
- Bengali
- Tamil
- Telugu
- Kannada
- Gujarati
- Malayalam
- Punjabi
- Sanskrit

The primary demonstration focus can be kept on the strongest validated language flows.

---

## Supported Jurisdictions

The prototype includes jurisdiction-aware handling for selected regions, including:

- India
- United Kingdom
- United States
- International / WIPO-oriented sources

Coverage depends on the documents currently available in the prototype corpus.

The system should not be interpreted as providing complete legal coverage of every country or every IP record.

---

## Intellectual Property Types

The prototype can be used to explore different IP concepts, including:

- Patents
- Trademarks
- Copyright
- Designs
- Related IP and regulatory topics where supported by the available sources

The relevance and quality of an answer depend on the source material available for the selected jurisdiction and topic.

---

## Retrieval Architecture

The current prototype uses a lightweight local retrieval pipeline.

```text
User Query
    |
    v
Multilingual Query Normalization
    |
    v
TF-IDF Vectorization
    |
    v
Cosine Similarity Retrieval
    |
    v
Jurisdiction Filtering
    |
    v
Relevant Evidence
    |
    v
Localized Explanation
    |
    v
Answer + Sources

