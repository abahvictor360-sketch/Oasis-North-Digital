-- =============================================================================
-- Oasis North Digital: copy now covers individuals as well as businesses.
-- Updates studio identity, hero, about, contact, SEO, services, skills and
-- pricing. Portfolio, testimonials, clients and submissions are NOT touched.
-- Profile email, phone, socials, headshot and logo are kept as stored.
-- =============================================================================

update site_settings set
  profile = coalesce(profile, '{}'::jsonb) || '{"name":"Oasis North Digital","role":"Web, App & Automation Studio","location":"Canada","handle":"oasisnorthdigital","founder":"Victor Abah","founderRole":"Founder & Lead Developer"}'::jsonb,
  hero = '{"eyebrow":"WEB · APPS · AUTOMATION — CANADA","headline":"Websites, apps and automation for Canadian businesses and individuals.","subtext":"Oasis North Digital is a Canadian digital studio. Whether you run a company, work for yourself or have an idea you want to launch, we design and build fast websites, custom web and mobile apps, and automated workflows that take repetitive work off your plate, then stay on to support everything we launch.","stats":[{"value":6,"suffix":"+","label":"Years of Experience"},{"value":20,"suffix":"+","label":"Sites & Apps Shipped"}]}'::jsonb,
  about = '{"eyebrow":"ABOUT THE STUDIO","headline":"A focused studio with senior hands on every project.","body":"Oasis North Digital gives Canadian businesses, entrepreneurs and individuals a digital partner they can actually reach. The studio was founded by developer Victor Abah and builds on more than six years of shipping websites, business applications and the technical support that keeps them running, for clients in real estate, hospitality, healthcare, retail, logistics and SaaS. We explain decisions in plain language, agree scope, milestones and a fixed quote in Canadian dollars before work begins, and build with Canadian expectations in mind: privacy, accessibility, bilingual readiness and the payment methods your customers already use."}'::jsonb,
  contact = '{"headline":"Tell us what you''re ready to build.","whatsappMessage":"Hi Oasis North Digital, I saw your website and I''d like to talk about a project."}'::jsonb,
  seo = coalesce(seo, '{}'::jsonb) || '{"metaTitle":"Oasis North Digital | Web Development, Apps & Automation in Canada","metaDescription":"Oasis North Digital is a Canadian studio building fast websites, custom web and mobile apps, and automation for businesses and individuals. Fixed quotes in CAD and support after launch.","keywords":"Oasis North Digital, web development Canada, web design Canada, website developer Canada, custom app development Canada, mobile app developer Canada, business automation Canada, workflow automation agency, AI automation for small business, CRM integration, Next.js developer Canada, React Native developer Canada, small business website Canada, personal website Canada, portfolio website for freelancers, website for individuals, e-commerce website Canada, bilingual website English French, website support and hosting Canada, MVP development Canada","ogImage":"/og.png","aiSummary":"Oasis North Digital is a Canadian digital studio offering website development, custom web and mobile app development, and business automation, including AI assistants grounded in a company''s own data. It works remotely with businesses, entrepreneurs and individuals across Canada, quotes fixed prices in Canadian dollars, and supports what it launches with hosting, maintenance and technical support. The studio was founded by developer Victor Abah, who brings 6+ years of building production websites and applications. Portfolio work includes a point-of-sale and inventory app (Xpel POS), a school management system (SchoolHub), a hospital website with appointment booking (Deem Hospital), a freight and logistics website (Jhflogistics), restaurant ordering (Everything Food), e-commerce storefronts (Ajusti, Lume), a multi-property hospitality group site with direct booking (Gateway Lodge Group) and SaaS product sites (FoxyAI, Leadloop, BizGrowth, Finbolt, NexaConnect). Technologies: Next.js, React, React Native, TypeScript, Supabase and Postgres, WordPress, Framer, APIs, webhooks and workflow automation."}'::jsonb,
  updated_at = now()
where id = 1;

delete from services;
insert into services (title, description, icon, sort_order) values
('Website Development','Fast, accessible websites for businesses and personal brands that explain your offer and turn visitors into enquiries, bookings or sales. Design, development, content management, search setup and launch, with English and French versions when you need them.','code',0),
('App Development','Custom web and mobile apps built around how your business actually runs: customer portals, booking and ordering, dashboards, point of sale and internal tools, with the interface, API and database designed together.','smartphone',1),
('Business Automation & AI','Automated workflows that connect the tools you already use, so leads, invoices, bookings and reports move on their own. Where it helps, AI assistants that answer from your own data, with clear limits and human hand-offs.','workflow',2),
('Support & Hosting','Hosting, domains, email, integrations and the fixes that keep everything running after launch. We trace issues to the cause, explain the fix and document it, on call-outs or a monthly plan.','cpu',3);

delete from skills;
insert into skills (name, level, sort_order) values
('Next.js & React',82,0),('React Native',75,1),('TypeScript',78,2),('Supabase & Postgres',76,3),('WordPress',90,4),('Framer',88,5),('Workflow Automation & APIs',80,6),('AI Assistants & Retrieval',75,7),('Hosting & Technical Support',88,8);

delete from pricing_tiers;
insert into pricing_tiers (name, price, blurb, features, highlighted, sort_order) values
('Project','Fixed quote in CAD','A focused, fixed-scope piece of work: a website, an app, an automation or a specific technical problem that needs solving.',
  array['Defined scope & timeline','Fixed price before work starts','2 revision rounds','Source code and documentation on delivery'],false,0),
('Growth Partnership','Monthly plan in CAD','Ongoing development, automation and support, working as an embedded part of your team rather than a one-off vendor.',
  array['Continuous improvements and releases','New automations as your workflows change','Hosting, integrations and monitoring','Priority turnaround','Monthly roadmap check-in'],true,1);
