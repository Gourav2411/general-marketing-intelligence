# Marketing knowledge graph

The canonical graph in `src/graph` supports Account, Campaign, Channel, Creative, Audience, Keyword, LandingPage, Content, Lead, Opportunity, Customer, RevenueEvent, Experiment, Hypothesis, Decision, Action, Outcome and Learning entities.

Relationships include `uses`, `targets`, `belongs_to`, `lands_on`, `originated_from`, `becomes`, `produces`, `tests`, `creates`, `updates`, `attributed_to` and `measured_by`.

Every entity and edge carries a stable ID, tenant and account scope, timestamps, confidence, source references and provenance. A governed canonical key can resolve the same entity across systems. For example, a normalized campaign name can merge Google Ads spend and HubSpot revenue while retaining both source records.

The first adapter creates campaign, channel, audience, landing-page and revenue relationships from normalized campaign evidence. Serialization is versioned. Deserialization and relationship creation reject tenant mismatches.

The graph does not assert identity merely because labels look similar. Production deployments should supply governed mapping keys, especially for campaigns, leads, opportunities and customers.
