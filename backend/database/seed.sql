-- Seed data for Singularity News
-- Sample topics and articles for development

-- Insert initial topics
INSERT INTO topics (name, slug) VALUES 
  ('Technology', 'technology'),
  ('Environment', 'environment'), 
  ('Economy', 'economy'),
  ('Politics', 'politics'),
  ('Health', 'health');

-- Insert sample articles
INSERT INTO articles (title, slug, summary, content, topic, tags, published_date, views, published) VALUES 
  (
    'AI Revolution in Healthcare: Machine Learning Transforms Medical Diagnosis',
    'ai-revolution-healthcare-machine-learning-transforms-medical-diagnosis',
    'Artificial Intelligence is transforming healthcare with unprecedented innovations. From diagnostic tools to personalized treatment plans, AI is revolutionizing how we approach medical care.',
    '<p>Artificial Intelligence is transforming healthcare with unprecedented innovations. From diagnostic tools to personalized treatment plans, AI is revolutionizing how we approach medical care.</p><p>Machine learning algorithms can now detect diseases earlier than human doctors in many cases, while robotic surgery systems provide precision beyond human capabilities. Recent studies show that AI-powered diagnostic tools have achieved up to 95% accuracy in detecting certain cancers, significantly outperforming traditional methods.</p><p>The integration of AI in healthcare extends beyond diagnosis. Treatment personalization, drug discovery, and patient monitoring systems are all benefiting from these technological advances. As we move forward, the collaboration between AI systems and healthcare professionals promises to deliver more effective, accessible, and personalized medical care to patients worldwide.</p>',
    'Technology',
    ARRAY['AI', 'healthcare', 'machine-learning', 'medical-innovation'],
    NOW() - INTERVAL '2 days',
    1250,
    TRUE
  ),
  (
    'Climate Change Solutions: Breakthrough Technologies Combat Global Warming',
    'climate-change-solutions-breakthrough-technologies-combat-global-warming',
    'Scientists propose new breakthrough technologies to combat climate change. Innovative carbon capture methods, renewable energy advances, and sustainable agriculture practices are showing promising results.',
    '<p>Scientists around the world are proposing new breakthrough technologies to combat climate change. These innovative solutions span multiple sectors and offer unprecedented hope in the fight against global warming.</p><p>Carbon capture and storage technologies have seen remarkable improvements, with new direct air capture facilities capable of removing millions of tons of CO2 from the atmosphere annually. Meanwhile, renewable energy continues to break efficiency records, with solar panel technology achieving over 40% efficiency in laboratory conditions.</p><p>Sustainable agriculture practices, including precision farming and vertical agriculture, are reducing the environmental impact of food production while increasing yields. These comprehensive approaches demonstrate that technological innovation, combined with policy changes, can create meaningful progress toward a sustainable future.</p>',
    'Environment',
    ARRAY['climate-change', 'sustainability', 'renewable-energy', 'carbon-capture'],
    NOW() - INTERVAL '1 day',
    890,
    TRUE
  ),
  (
    'Global Economic Outlook 2024: Markets Navigate Uncertainty and Opportunity',
    'global-economic-outlook-2024-markets-navigate-uncertainty-opportunity',
    'Market analysts are cautiously optimistic about recovery prospects, with emerging markets showing strong growth potential. However, inflation concerns and geopolitical tensions continue to pose challenges.',
    '<p>Global economic trends and predictions for 2024 present a complex picture of both opportunity and challenge. Market analysts are cautiously optimistic about recovery prospects, particularly in emerging markets that are showing strong growth potential despite ongoing global uncertainties.</p><p>Key factors shaping the economic landscape include persistent inflation concerns in developed economies, ongoing geopolitical tensions affecting supply chains, and the transformative impact of artificial intelligence on various industries. Central banks worldwide are carefully balancing monetary policy to support growth while containing inflation.</p><p>Emerging markets, particularly in Southeast Asia and parts of Africa, are demonstrating resilience and growth potential, driven by increasing digitalization, young demographics, and strategic investments in infrastructure. However, challenges remain, including debt sustainability concerns and the need for continued international cooperation to address global economic imbalances.</p>',
    'Economy',
    ARRAY['economy', 'market-analysis', 'global-trends', '2024-outlook'],
    NOW(),
    2100,
    TRUE
  ),
  (
    'Space Exploration Milestone: Mars Mission Reveals Groundbreaking Discoveries',
    'space-exploration-milestone-mars-mission-reveals-groundbreaking-discoveries',
    'Latest Mars rover missions have uncovered evidence of ancient water systems and potentially habitable environments, revolutionizing our understanding of the Red Planet.',
    '<p>The latest Mars rover missions have delivered groundbreaking discoveries that are revolutionizing our understanding of the Red Planet. Scientists have uncovered compelling evidence of ancient water systems and environments that could have supported microbial life billions of years ago.</p><p>Advanced spectroscopic analysis has revealed complex organic compounds in Martian soil samples, suggesting that the building blocks of life were present on Mars. The discovery of seasonal methane emissions adds another layer of intrigue to the possibility of current biological activity beneath the planet''s surface.</p><p>These findings have significant implications for future human missions to Mars and our broader search for life in the universe. The data collected is informing the design of next-generation rovers and the selection of landing sites for eventual crewed missions, bringing humanity one step closer to becoming a multi-planetary species.</p>',
    'Technology',
    ARRAY['space', 'mars', 'exploration', 'discovery', 'NASA'],
    NOW() - INTERVAL '3 hours',
    567,
    TRUE
  ),
  (
    'Mental Health in the Digital Age: Addressing Screen Time and Social Media Impact',
    'mental-health-digital-age-addressing-screen-time-social-media-impact',
    'Recent studies reveal the complex relationship between digital technology use and mental health, prompting new approaches to digital wellness and therapy.',
    '<p>As digital technology becomes increasingly integrated into our daily lives, mental health professionals are grappling with the complex effects of screen time and social media on psychological well-being. Recent comprehensive studies have revealed both concerning trends and promising therapeutic applications.</p><p>Research indicates that excessive social media use correlates with increased rates of anxiety and depression, particularly among teenagers and young adults. However, the relationship is nuanced, with positive online communities and digital mental health tools showing significant therapeutic benefits when used appropriately.</p><p>Mental health practitioners are developing new frameworks for digital wellness, incorporating screen time management, social media literacy, and digital detox strategies into treatment plans. Meanwhile, innovative apps and virtual reality therapies are expanding access to mental health support, especially in underserved communities.</p>',
    'Health',
    ARRAY['mental-health', 'digital-wellness', 'social-media', 'therapy', 'psychology'],
    NOW() - INTERVAL '6 hours',
    423,
    TRUE
  );