-- Seed data for Singularity News database
-- Generated from current database state
-- Date: 2025-08-16

-- Clear existing data (optional - comment out if you want to append)
-- DELETE FROM articles;
-- DELETE FROM topics;

-- Insert topics with specific IDs
INSERT INTO topics (id, name, slug) VALUES 
  ('0ecb59aa-ff71-492e-8318-8dfc319d398d', 'Economy', 'economy'),
  ('30863aa9-d462-4d9c-9029-aae7ea7fc558', 'Environment', 'environment'),
  ('c2fb99ad-1f9c-44d1-bba8-fef867a3ce39', 'Health', 'health'),
  ('4c97cd55-62f4-4ea0-9140-9055fd5fca68', 'Politics', 'politics'),
  ('ff4db69a-cba4-4f61-b4ad-30be158c0b62', 'Technology', 'technology')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- Insert articles
INSERT INTO articles (
  id, title, slug, content, summary, author, topics, 
  tags, 
  created_at, updated_at, published_date, views, published
) VALUES 
(
  'affa247b-36b0-4494-96bb-e0530b6d9720',
  'Global Economic Outlook 2024: Markets Navigate Uncertainty and Opportunity',
  'global-economic-outlook-2024-markets-navigate-uncertainty-opportunity',
  '<p>Global economic trends and predictions for 2024 present a complex picture of both opportunity and challenge. Market analysts are cautiously optimistic about recovery prospects, particularly in emerging markets that are showing strong growth potential despite ongoing global uncertainties.</p><p>Key factors shaping the economic landscape include persistent inflation concerns in developed economies, ongoing geopolitical tensions affecting supply chains, and the transformative impact of artificial intelligence on labor markets.</p><p>Central banks worldwide continue to navigate a delicate balance between controlling inflation and supporting economic growth. The Federal Reserve''s recent policy decisions have sent ripples through global markets, while the European Central Bank maintains its cautious approach to monetary policy adjustments.</p><p>Emerging markets, particularly in Asia and Africa, are experiencing robust growth driven by technological adoption and demographic advantages. However, these regions also face challenges from climate change impacts and infrastructure development needs.</p>',
  'Market analysts are cautiously optimistic about recovery prospects, with emerging markets showing strong growth potential. However, inflation concerns and geopolitical tensions continue to pose challenges.',
  'Editorial Team',
  ARRAY['0ecb59aa-ff71-492e-8318-8dfc319d398d'::uuid], -- Economy
  ARRAY['economy', 'market-analysis', 'global-trends', '2024-outlook'],
  '2025-08-16 08:11:29.131952+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-16 08:11:29.131952+00',
  2100,
  true
),
(
  '37fcbfb1-b31b-409b-9fed-1859b92389c2',
  'Climate Change Solutions: Breakthrough Technologies Combat Global Warming',
  'climate-change-solutions-breakthrough-technologies-combat-global-warming',
  '<p>Scientists around the world are proposing new breakthrough technologies to combat climate change. These innovative solutions span multiple sectors and offer unprecedented hope in the fight against global warming.</p><p>Carbon capture and storage technologies have seen remarkable improvements, with new direct air capture facilities capable of removing millions of tons of CO2 from the atmosphere annually. Meanwhile, renewable energy continues to break efficiency records, with solar panel technology achieving unprecedented conversion rates.</p><p>Revolutionary agricultural practices, including precision farming and vertical agriculture, are reducing emissions while increasing food production. Ocean-based solutions, such as kelp farming and artificial upwelling systems, show promise in both carbon sequestration and ecosystem restoration.</p><p>The integration of artificial intelligence in climate modeling has enabled more accurate predictions and targeted interventions. Smart grid technologies and energy storage solutions are making renewable energy more viable than ever before.</p>',
  'Scientists propose new breakthrough technologies to combat climate change. Innovative carbon capture methods, renewable energy advances, and sustainable agriculture practices are showing promising results.',
  'Editorial Team',
  ARRAY['30863aa9-d462-4d9c-9029-aae7ea7fc558'::uuid], -- Environment
  ARRAY['climate-change', 'sustainability', 'renewable-energy', 'carbon-capture'],
  '2025-08-16 08:11:29.131952+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-15 08:11:29.131952+00',
  890,
  true
),
(
  '7b91c00e-1d08-4e24-b6cd-516e3a255594',
  'Space Exploration Milestone: Mars Mission Reveals Groundbreaking Discoveries',
  'space-exploration-milestone-mars-mission-reveals-groundbreaking-discoveries',
  '<p>The latest Mars rover missions have delivered groundbreaking discoveries that are revolutionizing our understanding of the Red Planet. Scientists have uncovered compelling evidence of ancient water systems and environments that could have supported microbial life billions of years ago.</p><p>Advanced spectroscopic analysis has revealed complex organic compounds in Martian soil samples, suggesting that the building blocks of life were present on Mars. The discovery of seasonal methane emissions continues to intrigue researchers, as it could indicate either geological or biological processes.</p><p>New high-resolution imaging has mapped extensive underground cave systems that could provide shelter for future human missions. These natural formations offer protection from radiation and extreme temperature variations, making them ideal candidates for establishing permanent research stations.</p><p>The successful demonstration of in-situ resource utilization, including oxygen production from the Martian atmosphere, marks a crucial step toward sustainable human presence on Mars.</p>',
  'Latest Mars rover missions have uncovered evidence of ancient water systems and potentially habitable environments, revolutionizing our understanding of the Red Planet.',
  'Editorial Team',
  ARRAY['ff4db69a-cba4-4f61-b4ad-30be158c0b62'::uuid], -- Technology
  ARRAY['space', 'mars', 'exploration', 'discovery', 'NASA'],
  '2025-08-16 08:11:29.131952+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-16 05:11:29.131952+00',
  567,
  true
),
(
  'd7119bd0-b6a1-4196-9f77-d9675a4b952b',
  'Mental Health in the Digital Age: Addressing Screen Time and Social Media Impact',
  'mental-health-digital-age-addressing-screen-time-social-media-impact',
  '<p>As digital technology becomes increasingly integrated into our daily lives, mental health professionals are grappling with the complex effects of screen time and social media on psychological well-being. Recent comprehensive studies have revealed both concerning trends and promising therapeutic applications.</p><p>Research indicates that excessive social media use correlates with increased rates of anxiety and depression, particularly among teenagers and young adults. However, the relationship is nuanced, with positive connections and support networks also emerging through digital platforms.</p><p>Innovative digital therapeutics are showing promise in treating various mental health conditions. Apps utilizing cognitive behavioral therapy techniques, mindfulness practices, and mood tracking have demonstrated measurable improvements in patient outcomes.</p><p>Mental health professionals are advocating for "digital wellness" approaches that balance technology use with offline activities. Schools and workplaces are implementing screen-time guidelines and promoting regular digital detoxes.</p>',
  'Recent studies reveal the complex relationship between digital technology use and mental health, prompting new approaches to digital wellness and therapy.',
  'Editorial Team',
  ARRAY['c2fb99ad-1f9c-44d1-bba8-fef867a3ce39'::uuid], -- Health
  ARRAY['mental-health', 'digital-wellness', 'social-media', 'therapy', 'psychology'],
  '2025-08-16 08:11:29.131952+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-16 02:11:29.131952+00',
  423,
  true
),
(
  '8237cc8c-901f-46cb-8722-9f19b4243416',
  'AI Revolution in Healthcare: Machine Learning Transforms Medical Diagnosis',
  'ai-revolution-healthcare-machine-learning-transforms-medical-diagnosis',
  '<p>Artificial Intelligence is transforming healthcare with unprecedented innovations. From diagnostic tools to personalized treatment plans, AI is revolutionizing how we approach medical care.</p><p>Machine learning algorithms can now detect diseases earlier than human doctors in many cases, while robotic surgery systems provide precision beyond human capabilities. Recent studies show that AI-powered diagnostic tools have achieved up to 95% accuracy in detecting certain cancers, significantly outperforming traditional screening methods.</p><p>Personalized medicine is becoming a reality through AI analysis of genetic data, lifestyle factors, and medical history. These systems can predict treatment responses and recommend tailored therapeutic approaches for individual patients.</p><p>The integration of AI in drug discovery has accelerated the development of new treatments, reducing the time from concept to clinical trials by up to 50%. Virtual health assistants and chatbots are improving patient engagement and providing 24/7 support for routine health queries.</p>',
  'Artificial Intelligence is transforming healthcare with unprecedented innovations. From diagnostic tools to personalized treatment plans, AI is revolutionizing how we approach medical care.',
  'Editorial Team',
  ARRAY['ff4db69a-cba4-4f61-b4ad-30be158c0b62'::uuid, 'c2fb99ad-1f9c-44d1-bba8-fef867a3ce39'::uuid], -- Technology, Health
  ARRAY['AI', 'healthcare', 'machine-learning', 'medical-innovation'],
  '2025-08-16 08:11:29.131952+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-14 08:11:29.131952+00',
  1250,
  true
),
(
  'a7cc1685-b51e-4ed5-a233-bec832c59b44',
  'Inside Tim Cook''s push to get Apple back in the AI race',
  'inside-tim-cooks-push-to-get-apple-back-in-the-ai-race',
  '<p>While other tech companies push out AI tools at full speed, Apple is taking its time. Its Apple Intelligence features – shown off at WWDC – won''t reach most users until at least 2025 or even 2026. Some see this as Apple falling behind in the AI race.</p><p>However, industry insiders suggest this measured approach reflects Apple''s commitment to privacy and user experience. Unlike competitors who rush to market with beta features, Apple is focusing on seamless integration and robust privacy protections.</p><p>The company''s strategy involves on-device processing for most AI tasks, reducing reliance on cloud services and protecting user data. This approach, while technically challenging, aligns with Apple''s long-standing privacy stance.</p><p>Tim Cook has reportedly restructured internal teams and increased AI research funding by 200% over the past year. The acquisition of several AI startups and partnerships with leading research institutions signal Apple''s serious commitment to catching up.</p>',
  'While other tech companies push out AI tools at full speed, Apple is taking its time. Its Apple Intelligence features – shown off at WWDC – won''t reach most users until at least 2025 or even 2026. Some see this as Apple falling behind.',
  'Editorial Team',
  ARRAY['ff4db69a-cba4-4f61-b4ad-30be158c0b62'::uuid], -- Technology
  ARRAY['apple', 'AI', 'technology', 'tim-cook', 'innovation'],
  '2025-08-16 08:13:27.906569+00',
  '2025-08-16 10:34:22.8043+00',
  '2025-08-16 08:13:27.846+00',
  6,
  true
),
(
  'cbb71a7f-563f-462e-b931-f3212eb4eae1',
  'Alaska Summit: Trump and Putin Confer on Ukraine, Yet No Ceasefire Agreement',
  'alaska-summit-trump-and-putin-confer-on-ukraine-yet-no-ceasefire-agreement',
  '<h3><strong>Venue and Symbolism</strong></h3><p>The summit, held at a U.S. military installation, marked the first high-level meeting between a U.S. host and the Russian head of state since 2007—notably, the first such meeting on U.S. soil since 1988. The choice of Alaska was strategic: historically tied to Russia and outside the jurisdiction of the International Criminal Court, which has issued an arrest warrant for Putin.</p><p>The leaders engaged in extensive discussions about the ongoing Ukraine conflict, with Trump reportedly presenting a framework for de-escalation. However, fundamental disagreements on territorial integrity and security guarantees prevented any breakthrough agreement.</p><p>Both leaders emphasized the importance of dialogue while acknowledging the complexity of reaching a resolution. The summit concluded with a joint statement calling for humanitarian corridors and prisoner exchanges, but no concrete ceasefire timeline was established.</p><p>International reactions have been mixed, with European allies expressing concern about any potential agreements made without Ukrainian representation at the table.</p>',
  'On August 15, 2025, Presidents Donald Trump and Vladimir Putin met at Joint Base Elmendorf-Richardson in Anchorage, Alaska to discuss the Ukraine conflict.',
  'Political Correspondent',
  ARRAY['4c97cd55-62f4-4ea0-9140-9055fd5fca68'::uuid], -- Politics
  ARRAY['Politics', 'Trump', 'Putin', 'Ukraine', 'Summit', 'Alaska'],
  '2025-08-16 10:38:40.068294+00',
  '2025-08-16 11:24:23.573027+00',
  '2025-08-15 10:38:40.044+00',
  12,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  author = EXCLUDED.author,
  topics = EXCLUDED.topics,
  tags = EXCLUDED.tags,
  updated_at = NOW(),
  published_date = EXCLUDED.published_date,
  views = EXCLUDED.views,
  published = EXCLUDED.published;

-- Verify seed data
SELECT 
  'Topics seeded: ' || COUNT(*) as result 
FROM topics
UNION ALL
SELECT 
  'Articles seeded: ' || COUNT(*) 
FROM articles;