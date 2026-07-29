'use client'
import { useState, useEffect, useMemo } from 'react'
import { Phone, Mail, MessageSquare, Brain, MapPin, Heart, Home, Search, Users, ChevronDown, X, SlidersHorizontal, Check } from 'lucide-react'

const CARD = '#ffffff'; const BORDER = 'rgba(0,0,0,0.09)'; const BORDER2 = 'rgba(0,0,0,0.03)'
const BLUE = '#4361ee'; const PINK = '#e3008c'; const PINK_S = 'rgba(227,0,140,0.08)'
const GREEN = '#10b981'; const AMBER = '#f59e0b'; const RED = '#ef4444'
const TEAL = '#06b6d4'; const PURPLE = '#8b5cf6'
const TEXT = '#0f172a'; const TEXT2 = '#475569'; const TEXT3 = '#94a3b8'
const BG = '#f8fafc'

const AV = ['#4361ee','#8b5cf6','#06b6d4','#10b981','#ef4444','#e3008c','#f59e0b']
const avColor = (n: string) => AV[n.charCodeAt(0) % AV.length]
const initials = (n: string) => { const p = n.split(' '); return p.length >= 2 ? p[0][0]+p[p.length-1][0] : n.slice(0,2) }

function contactDays(s: string): number {
  if (!s) return 999
  const sl = s.toLowerCase()
  if (sl === 'today' || sl.includes('min ago') || sl.includes('hr ago') || sl.includes('hrs ago')) return 0
  if (sl === 'yesterday' || sl === '1 day ago') return 1
  const d = sl.match(/(\d+)\s*days? ago/); if (d) return parseInt(d[1])
  const w = sl.match(/(\d+)\s*wks? ago/);  if (w) return parseInt(w[1]) * 7
  if (sl.includes('wk ago')) return 7
  return 999
}

type Contact = {
  name: string; suburb: string; type: string; typeColor: string; score: number; scoreColor: string
  lastContact: string; phone: string; email: string
  properties: string[]; notes: string; family: string; commStyle: string; lifeEvent: string
  timeline: { date: string; event: string; color: string }[]
  aiMemory: string
}

const CONTACTS: Contact[] = [
  { name: 'Marcus Thornton',    suburb: 'Cronulla',        type: 'Seller',    typeColor: PINK,   score: 91, scoreColor: RED,   lastContact: '2 days ago', phone: '0412 345 678', email: 'marcus@thorntongroup.com.au',  properties: ['14 Ocean St, Cronulla — estimated $2.8M–$3.2M'], notes: 'Pre-purchased in Balmoral. Needs to sell Ocean St to settle. Timeline is tight — September. High motivation.', family: 'Marcus (48), wife Jennifer (46), 2 adult children. Dog: Buddy.', commStyle: 'Direct, data-driven. Prefers text for quick updates, phone calls for strategy.', lifeEvent: 'Downsizing — kids moved out. Relocating closer to work (North Shore).', timeline: [{ date: '24 Jul', event: 'Appraisal booked for Tuesday', color: AMBER },{ date: '18 Jul', event: 'Introduced via David Chen (mutual contact)', color: BLUE },{ date: '5 Jul', event: 'First phone call — 22 min. Very engaged.', color: GREEN }], aiMemory: "Marcus responds well to suburb performance data. He benchmarks against Balmoral (his new suburb). Open with clearance rates and recent comparable sales. He was burned by an agent who over-promised and under-delivered in 2021 — build trust through honesty, not hype." },
  { name: 'Tom & Lucy Gardiner',suburb: 'Searching: Cronulla', type: 'Buyer', typeColor: BLUE,   score: 87, scoreColor: AMBER, lastContact: '14 min ago', phone: '0421 876 543', email: 'tom.gardiner@outlook.com',     properties: ['Pre-approved $2.3M. Searching Cronulla 4b+'], notes: 'Attended 3 open homes last weekend. Moving from Surry Hills after 2nd child. Motivated.', family: 'Tom (34), Lucy (33), daughter Mia (2), expecting in October.', commStyle: 'Lucy is the decision-maker. Tom handles finance. Call Lucy first.', lifeEvent: '2nd child due October — urgency is real. Needs to move before baby.', timeline: [{ date: '26 Jul', event: 'Enquired on 42 Foreshore Cres via realestate.com.au', color: RED },{ date: '19 Jul', event: 'Open home — 22 Kingsway, Cronulla', color: AMBER },{ date: '12 Jul', event: 'Open home — 14 Gwawley Pde, Miranda', color: BLUE },{ date: '1 Jul', event: 'First registered on database', color: GREEN }], aiMemory: "Always lead with 'family neighbourhood' framing — schools, parks, safety. Lucy is visual; send render-style listing images before descriptions. Tom will want comparable sales data. Their urgency is the October birth — gently reference it in timelines." },
  { name: 'Sandra Wilson',      suburb: 'Manly',           type: 'Seller',    typeColor: PINK,   score: 76, scoreColor: AMBER, lastContact: '3 days ago', phone: '0434 567 890', email: 'sandra.wilson@gmail.com',      properties: ['7 Park Rd, Manly — estimated $2.8M–$3.1M'], notes: 'Has not listed despite 2 previous appraisals. Partner Craig is overseas until August. Cautious but warming.', family: 'Sandra (59), partner Craig (62, retired). Children in Melbourne.', commStyle: 'Thoughtful and methodical. Needs time to decide. Do not pressure.', lifeEvent: 'Approaching retirement. Considering sea change to South Coast.', timeline: [{ date: '25 Jul', event: 'Appraisal booked for Tuesday 10am', color: AMBER },{ date: '20 Jul', event: 'Phone call — 18 min. More receptive than prior contact.', color: GREEN },{ date: '2022', event: '2nd appraisal — did not list', color: TEXT3 },{ date: '2021', event: '1st appraisal — did not list', color: TEXT3 }], aiMemory: "Sandra needs to feel in control. She walked away before because she felt pressured. Lead with 'here's what the data says' — not 'you should list now'. The $200K improvement since her last appraisal is your strongest card." },
  { name: 'James Wu',           suburb: 'Sutherland',      type: 'Investor',  typeColor: AMBER,  score: 79, scoreColor: AMBER, lastContact: '1 hr ago',   phone: '0405 234 678', email: 'james.wu@wucapital.com.au',    properties: ['IP1: Glebe, IP2: Marrickville. Budget $800K–$1.1M for 3rd IP'], notes: 'Referred by Michael Tran. High-yield focus. Pre-approved. Prefer 4% yield minimum.', family: 'James (41), wife Helen, 3 children. Family in Hong Kong.', commStyle: 'Very analytical. Spreadsheet-first. Respects data, not fluff.', lifeEvent: 'Building investment portfolio for early retirement at 50.', timeline: [{ date: '26 Jul', event: 'Referred by Michael Tran — warm intro call', color: GREEN }], aiMemory: "James will disqualify you fast if you waste his time with unsuitable properties. Only send properties with 3.8%+ gross rental yield in growth suburbs." },
  { name: 'Rachel & Ben Okafor',suburb: 'Bexley',          type: 'Buyer',     typeColor: BLUE,   score: 82, scoreColor: AMBER, lastContact: '3 hrs ago',  phone: '0411 223 344', email: 'r.okafor@icloud.com',          properties: ['Pre-approved $1.2M. Searching 3-bed Bexley/Hurstville'], notes: 'Instagram DM lead. Looking for granny flat potential.', family: '', commStyle: 'Prefer WhatsApp.', lifeEvent: 'First home buyers.', timeline: [], aiMemory: '' },
  { name: 'Paul & Deborah Starr',suburb: 'Caringbah',     type: 'Seller',    typeColor: PINK,   score: 88, scoreColor: AMBER, lastContact: 'Yesterday',  phone: '0417 556 677', email: 'pdstarr@bigpond.com',          properties: ['5-bed Caringbah — est. $1.8M+'], notes: 'Found via 5★ review on Rate My Agent. Waiting for market update.', family: 'Paul (57), Deb (54). 3 kids.', commStyle: 'Phone preferred.', lifeEvent: 'Retiring to QLD.', timeline: [], aiMemory: '' },
  { name: 'Nicki Lihou',        suburb: 'Shell Cove',      type: 'Buyer',     typeColor: BLUE,   score: 68, scoreColor: AMBER, lastContact: '4 hrs ago',  phone: '0424 998 001', email: 'nicki.lihou@gmail.com',        properties: ['Inspected 48 Woodford Ave Warilla — $695K range'], notes: 'Requested private inspection. FHB, pre-approval in progress.', family: '', commStyle: 'Text only.', lifeEvent: 'First home.', timeline: [], aiMemory: '' },
  { name: 'Raj & Priya Patel',  suburb: 'Cronulla',        type: 'Seller',    typeColor: PINK,   score: 94, scoreColor: RED,   lastContact: '1 wk ago',   phone: '0408 112 233', email: 'raj.patel@patelprop.com.au',   properties: ['9 Arcadia St, Cronulla — sold $2.55M'], notes: 'Sold above guide. Strong referral source — accountant network.', family: 'Raj (52), Priya (49).', commStyle: 'Email for documents, call for strategy.', lifeEvent: 'Bought acreage at Bowral.', timeline: [], aiMemory: '' },
  { name: 'Josephine Tran',     suburb: 'Balgowlah',       type: 'Seller',    typeColor: PINK,   score: 71, scoreColor: AMBER, lastContact: 'Today',      phone: '0432 667 889', email: 'jo.tran@outlook.com',          properties: ['8 Beatrice St, Balgowlah — est. $1.8M–$1.95M'], notes: 'Appraisal meeting confirmed Friday. 5-year ownership concern.', family: 'Josephine (44), 2 children.', commStyle: 'Prefers email.', lifeEvent: 'Divorcing — needs to sell.', timeline: [], aiMemory: '' },
  { name: 'David & Claire Ng',  suburb: 'Port Hacking',    type: 'Seller',    typeColor: PINK,   score: 85, scoreColor: AMBER, lastContact: '2 days ago', phone: '0419 334 556', email: 'd.ng@ngconsult.com.au',        properties: ['18 Marina Dr, Port Hacking — est. $3.2M–$3.6M'], notes: 'Downsizing. Both retired. No urgency but motivated.', family: 'David (67), Claire (64).', commStyle: 'Formal. Prefer written correspondence.', lifeEvent: 'Retirement downsizing.', timeline: [], aiMemory: '' },
  { name: 'Mark Spinelli',      suburb: 'Barrack Point',   type: 'Seller',    typeColor: PINK,   score: 90, scoreColor: RED,   lastContact: 'Yesterday',  phone: '0400 555 100', email: 'mark@spinellire.com.au',        properties: ['42A Headland Parade, Barrack Point — est. $1.6M–$1.75M'], notes: 'Off-market preferred. 2 buyer matches in database.', family: '', commStyle: 'Direct, phone.', lifeEvent: 'Upsizing to Bowral property.', timeline: [], aiMemory: '' },
  { name: 'Lisa Chen',          suburb: 'Mosman',           type: 'Seller',    typeColor: PINK,   score: 80, scoreColor: AMBER, lastContact: '2 days ago', phone: '0416 778 990', email: 'lisa.chen@designhaus.com.au',  properties: ['7 Raglan St, Mosman — est. $2.4M–$2.6M'], notes: 'Wants 8 weeks before listing. Prepare marketing materials.', family: 'Lisa (39), husband Kevin, son Felix (6).', commStyle: 'WhatsApp preferred.', lifeEvent: 'Relocating for work.', timeline: [], aiMemory: '' },
  { name: 'Anderson Family',    suburb: 'Mosman',           type: 'Seller',    typeColor: PINK,   score: 96, scoreColor: RED,   lastContact: 'Today',      phone: '0422 001 002', email: 'janderson@gmail.com',          properties: ['55 Awaba St, Mosman — $4.85M sold at auction'], notes: 'Counter-offer pending. Settlement underway.', family: '', commStyle: 'Through solicitor for settlement queries.', lifeEvent: 'Relocating overseas.', timeline: [], aiMemory: '' },
  { name: 'Rebecca Hart',       suburb: 'Cronulla',         type: 'Seller',    typeColor: PINK,   score: 73, scoreColor: AMBER, lastContact: '1 day ago',  phone: '0431 445 566', email: 'rebecca.hart@hotmail.com',     properties: ['3 Surf Rd, Cronulla — est. $1.6M–$1.9M'], notes: 'First contact via website enquiry. Appraisal Wed 30 Jul.', family: '', commStyle: 'Email.', lifeEvent: 'Relocating to Byron Bay.', timeline: [], aiMemory: '' },
  { name: 'Michael Tran',       suburb: 'Hurstville',       type: 'Investor',  typeColor: AMBER,  score: 83, scoreColor: AMBER, lastContact: '5 days ago', phone: '0403 667 004', email: 'michael.tran@trantax.com.au',  properties: ['4 IPs in Sutherland Shire. Next buy $600K–$750K.'], notes: 'Accountant. Refers investors regularly. High-value relationship.', family: '', commStyle: 'Email only.', lifeEvent: 'Growing portfolio.', timeline: [], aiMemory: '' },
  { name: 'Felicia Rosario',    suburb: 'Gymea Bay',        type: 'Seller',    typeColor: PINK,   score: 84, scoreColor: AMBER, lastContact: '32 min ago', phone: '0409 881 223', email: 'felicia.rosario@gmail.com',    properties: ['4-bed Gymea Bay — est. $1.4M+'], notes: "Filled \"What's my home worth?\" form. Wants call this week.", family: '', commStyle: 'Call or text.', lifeEvent: 'Separating from partner.', timeline: [], aiMemory: '' },
  { name: 'Steve Riordan',      suburb: 'Sylvania',         type: 'Buyer',     typeColor: BLUE,   score: 65, scoreColor: TEAL,  lastContact: '1 wk ago',   phone: '0418 334 112', email: 's.riordan@riordan.com.au',     properties: ['Searching 4-bed $1.5M–$1.8M Sutherland Shire'], notes: 'Accountant. Referred Josephine Tran.', family: '', commStyle: 'Professional, email.', lifeEvent: 'Upsizing.', timeline: [], aiMemory: '' },
  { name: 'Chloe & Daniel Park',suburb: 'Miranda',          type: 'Buyer',     typeColor: BLUE,   score: 77, scoreColor: AMBER, lastContact: '2 days ago', phone: '0426 554 772', email: 'chloed@gmail.com',             properties: ['Pre-approved $1.3M. 3-bed, garage, near school.'], notes: 'Attended 2 opens. Short-listed 3 properties.', family: 'Chloe (31), Daniel (33), son Leo (4).', commStyle: 'Text for quick updates.', lifeEvent: 'Upsizing from unit.', timeline: [], aiMemory: '' },
  { name: 'Gary & Helen Zhou',  suburb: 'Caringbah South',  type: 'Seller',    typeColor: PINK,   score: 78, scoreColor: AMBER, lastContact: '4 days ago', phone: '0415 990 332', email: 'gzhou@outlook.com',            properties: ['2-bed villa — est. $950K–$1.05M'], notes: 'Gary is driving the decision. Helen is hesitant.', family: 'Gary (62), Helen (59).', commStyle: 'Gary: direct. Helen: needs reassurance.', lifeEvent: 'Downsizing.', timeline: [], aiMemory: '' },
  { name: 'Aisha Morrow',       suburb: 'Engadine',         type: 'Buyer',     typeColor: BLUE,   score: 62, scoreColor: TEAL,  lastContact: '3 days ago', phone: '0437 002 118', email: 'aisha.morrow@icloud.com',      properties: ['FHB — pre-approval $750K. Engadine/Heathcote.'], notes: 'Applied for FHOG. Needs guidance on process.', family: '', commStyle: 'Prefers in-person or phone.', lifeEvent: 'First home buyer.', timeline: [], aiMemory: '' },
  { name: 'Tim & Jo Buchanan',  suburb: 'Cronulla',         type: 'Landlord',  typeColor: TEAL,   score: 70, scoreColor: TEAL,  lastContact: '1 wk ago',   phone: '0412 778 990', email: 't.buchanan@gmail.com',         properties: ['2 rental properties. Reviewing PM arrangement.'], notes: 'Considering switching PM. Price sensitive.', family: '', commStyle: 'Email.', lifeEvent: 'Passive income strategy.', timeline: [], aiMemory: '' },
  { name: 'Wendy Fahd',         suburb: 'Woolooware',       type: 'Seller',    typeColor: PINK,   score: 74, scoreColor: AMBER, lastContact: '6 days ago', phone: '0404 556 778', email: 'wendy.fahd@gmail.com',         properties: ['3-bed Woolooware — est. $1.55M'], notes: 'Inherited property. Wants quick sale.', family: '', commStyle: 'Phone only.', lifeEvent: 'Probate sale.', timeline: [], aiMemory: '' },
  { name: 'Oliver Huang',       suburb: 'Hurstville',       type: 'Investor',  typeColor: AMBER,  score: 86, scoreColor: AMBER, lastContact: '2 days ago', phone: '0421 003 441', email: 'oliver.h@huangcap.com',        properties: ['3 existing IPs. Targeting $1M–$1.3M dual-occ.'], notes: 'Highly motivated. Tax-driven purchase before EOFY.', family: '', commStyle: 'Data first, fast decisions.', lifeEvent: 'Portfolio expansion.', timeline: [], aiMemory: '' },
  { name: 'Angela & Ross Mead', suburb: 'Gymea',            type: 'Buyer',     typeColor: BLUE,   score: 69, scoreColor: TEAL,  lastContact: '5 days ago', phone: '0430 112 334', email: 'angela.mead@outlook.com',      properties: ['Pre-approved $1.1M. 3-bed. Near schools.'], notes: 'Looking for 12 months. Growing impatient.', family: 'Angela (36), Ross (38), 2 kids.', commStyle: 'Angela manages the search.', lifeEvent: 'Upsizing.', timeline: [], aiMemory: '' },
  { name: 'Sophie Nakamura',    suburb: 'Paddington',       type: 'Seller',    typeColor: PINK,   score: 88, scoreColor: AMBER, lastContact: 'Yesterday',  phone: '0416 223 005', email: 'sophie@nakamuradesign.com',    properties: ['42 Glenmore Rd, Paddington — est. $2.65M'], notes: 'Designer. High aesthetic standards for marketing material.', family: '', commStyle: 'Responds to visual content.', lifeEvent: 'Relocating to Melbourne.', timeline: [], aiMemory: '' },
  { name: 'Jason & Kim Tory',   suburb: 'Lilli Pilli',      type: 'Seller',    typeColor: PINK,   score: 75, scoreColor: AMBER, lastContact: '3 days ago', phone: '0408 998 001', email: 'jason.tory@icloud.com',        properties: ['Waterfront block — est. $2.2M–$2.5M'], notes: 'Recently divorced. Both must agree on agent and price.', family: '', commStyle: 'Separate comms required for each party.', lifeEvent: 'Divorce settlement.', timeline: [], aiMemory: '' },
  { name: 'Liam Forsythe',      suburb: 'Thirroul',         type: 'Buyer',     typeColor: BLUE,   score: 58, scoreColor: TEAL,  lastContact: '1 wk ago',   phone: '0433 778 112', email: 'liam.forsythe@gmail.com',      properties: ['Pre-approved $1.0M. Beachside Illawarra.'], notes: 'Work from home. Wants ocean views. Flexible on timing.', family: '', commStyle: 'Text / email.', lifeEvent: 'Sea change from Sydney.', timeline: [], aiMemory: '' },
  { name: 'Karen & Phil Doyle', suburb: 'Burraneer',        type: 'Landlord',  typeColor: TEAL,   score: 67, scoreColor: TEAL,  lastContact: '2 wks ago',  phone: '0419 556 001', email: 'phil.doyle@doyleconstruct.com',properties: ['3 rental IPs in Shire. Gross yield 3.6%.'], notes: 'Reviewing portfolio performance. Open to selling 1 underperformer.', family: '', commStyle: 'Phil decides, Karen admin.', lifeEvent: 'Portfolio review.', timeline: [], aiMemory: '' },
  { name: 'Vivian Ko',          suburb: 'Kogarah',          type: 'Buyer',     typeColor: BLUE,   score: 72, scoreColor: AMBER, lastContact: '4 days ago', phone: '0411 002 334', email: 'vivian.ko@anz.com.au',         properties: ['Pre-approved $900K. 2-bed + study near train.'], notes: 'Bank employee. Fast decision-maker when right property appears.', family: '', commStyle: 'Email with data summaries.', lifeEvent: 'Rightsizing after divorce.', timeline: [], aiMemory: '' },
  { name: 'Brett & Simone Earle',suburb: 'Sylvania Waters', type: 'Seller',    typeColor: PINK,   score: 89, scoreColor: AMBER, lastContact: '1 day ago',  phone: '0402 334 556', email: 'brett.earle@gmail.com',        properties: ['Waterfront 4-bed — est. $3.4M–$3.8M'], notes: 'High expectations on price. Had failed auction 18 months ago.', family: 'Brett (51), Simone (48), 3 kids.', commStyle: 'Brett leads, Simone supports.', lifeEvent: 'Upsizing to Gold Coast.', timeline: [], aiMemory: '' },
  { name: 'Mei Lin',            suburb: 'Hurstville',       type: 'Investor',  typeColor: AMBER,  score: 81, scoreColor: AMBER, lastContact: '3 days ago', phone: '0425 667 998', email: 'meilin@linholdings.com.au',    properties: ['2 IPs. Looking for 3rd in $700K–$900K range.'], notes: 'Connected to large investor network. High referral value.', family: '', commStyle: 'WeChat for informal, email for formal.', lifeEvent: 'Wealth preservation strategy.', timeline: [], aiMemory: '' },
  { name: 'Doug & Patricia Walsh',suburb: 'Cronulla',       type: 'Seller',    typeColor: PINK,   score: 66, scoreColor: TEAL,  lastContact: '2 wks ago',  phone: '0418 112 005', email: 'dp.walsh@optusnet.com.au',     properties: ['22 Kingsway, Cronulla — listed $1.4M–$1.6M'], notes: 'Long-term hold. Ready to move to retirement village.', family: 'Doug (71), Patricia (69).', commStyle: 'Formal. Prefer paper-based where possible.', lifeEvent: 'Moving to retirement village.', timeline: [], aiMemory: '' },
  { name: 'Camille Nguyen',     suburb: 'Rockdale',         type: 'Buyer',     typeColor: BLUE,   score: 60, scoreColor: TEAL,  lastContact: '1 wk ago',   phone: '0429 003 114', email: 'cami.ng@gmail.com',            properties: ['Pre-approved $800K. 2-bed apartment St George area.'], notes: 'REA.com.au enquiry. Still early stage.', family: '', commStyle: 'Text.', lifeEvent: 'Moving closer to parents.', timeline: [], aiMemory: '' },
  { name: 'Harpreet Singh',     suburb: 'Kirrawee',         type: 'Developer', typeColor: PURPLE, score: 93, scoreColor: RED,   lastContact: '2 days ago', phone: '0401 556 778', email: 'h.singh@singhdevco.com.au',    properties: ['Seeking R2/R3 zoned sites 600m²+ for townhouse dev.'], notes: 'Active developer. Can move fast. Cash buyer.', family: '', commStyle: 'Direct. Wants data on DA approvals and zoning.', lifeEvent: 'Scaling development business.', timeline: [], aiMemory: '' },
  { name: 'Tina & Alf De Luca', suburb: 'Cronulla',        type: 'Seller',    typeColor: PINK,   score: 77, scoreColor: AMBER, lastContact: '5 days ago', phone: '0433 224 881', email: 'alf.deluca@gmail.com',         properties: ["Unit 4/12 Gerrale St, Cronulla — est. $1.1M"], notes: "Inherited from Alf's late father. Need specialist advice.", family: 'Alf (45), Tina (43).', commStyle: 'Tina handles comms.', lifeEvent: 'Deceased estate.', timeline: [], aiMemory: '' },
  { name: 'Ryan & Ash Pemberton',suburb: 'Bondi Beach',    type: 'Buyer',     typeColor: BLUE,   score: 90, scoreColor: RED,   lastContact: '1 hr ago',   phone: '0424 887 002', email: 'ryan.pembro@mac.com',          properties: ['Pre-approved $2.5M. 4-bed Bondi or Cronulla.'], notes: 'Finance approved. Ready to buy within 30 days.', family: 'Ryan (38), Ash (36), twins (3).', commStyle: 'Ryan only. Fast.', lifeEvent: 'Needs to settle before school year.', timeline: [], aiMemory: '' },
  { name: 'Isabella Grant',     suburb: 'Manly',            type: 'Buyer',     typeColor: BLUE,   score: 64, scoreColor: TEAL,  lastContact: '6 days ago', phone: '0437 114 005', email: 'bella.grant@gmail.com',        properties: ['1-bed $650K–$750K. Manly / Freshwater.'], notes: 'Single buyer. Patient but motivated. Domain enquiry.', family: '', commStyle: 'Email.', lifeEvent: 'Investment apartment.', timeline: [], aiMemory: '' },
  { name: 'Connor Howell',      suburb: 'Sutherland',       type: 'Developer', typeColor: PURPLE, score: 87, scoreColor: AMBER, lastContact: '3 days ago', phone: '0412 991 334', email: 'c.howell@howellgroup.com.au',  properties: ['Looking for dual-occ or knock-down rebuild sites.'], notes: 'Done 3 projects in Shire. Reliable and fast.', family: '', commStyle: 'Phone for offers, email for contracts.', lifeEvent: 'Scaling builds.', timeline: [], aiMemory: '' },
  { name: 'Penny & Cam Frost',  suburb: 'Caringbah',        type: 'Buyer',     typeColor: BLUE,   score: 70, scoreColor: AMBER, lastContact: '4 days ago', phone: '0418 667 993', email: 'cam.frost@gmail.com',          properties: ['Pre-approved $1.4M. 4-bed Sutherland Shire.'], notes: 'Attended 4 opens. Narrowing down to Caringbah/Woolooware.', family: 'Penny (34), Cam (36), daughter Eva (1).', commStyle: 'Cam: phone. Penny: email.', lifeEvent: 'Upsizing from 2-bed.', timeline: [], aiMemory: '' },
  { name: 'Larry Obiang',       suburb: 'Rockdale',         type: 'Landlord',  typeColor: TEAL,   score: 63, scoreColor: TEAL,  lastContact: '2 wks ago',  phone: '0422 008 119', email: 'larry.ob@yahoo.com.au',        properties: ['2-bed unit in Rockdale. PM contract up for renewal.'], notes: 'Weighing up selling vs continuing to rent.', family: '', commStyle: 'Text.', lifeEvent: 'Reassessing investment.', timeline: [], aiMemory: '' },
  { name: 'Nina & Sven Larsson',suburb: 'Manly',            type: 'Seller',    typeColor: PINK,   score: 85, scoreColor: AMBER, lastContact: '2 days ago', phone: '0415 334 778', email: 'sven.larsson@gmail.com',       properties: ['22 Abbott St, Manly — est. $3.1M'], notes: 'Returning to Sweden. Must sell in 90 days.', family: 'Nina (41), Sven (44), 2 teenage kids.', commStyle: 'Sven handles all comms. Quick to respond.', lifeEvent: 'Emigrating.', timeline: [], aiMemory: '' },
]

const TOTAL_DB = 2847
const ALL_TYPES  = ['Buyer', 'Seller', 'Investor', 'Landlord', 'Developer']
const SORT_OPTIONS = ['Score (high–low)', 'Score (low–high)', 'Name A–Z', 'Recent first']

const LAST_CONTACT_OPTIONS = [
  { label: 'Any time', maxDays: 9999 },
  { label: 'Today',    maxDays: 0 },
  { label: 'This week',maxDays: 7 },
  { label: 'This month',maxDays: 30 },
]

const TYPE_COLOR: Record<string, string> = { Buyer: BLUE, Seller: PINK, Investor: AMBER, Landlord: TEAL, Developer: PURPLE }
const DETAIL_TABS = ['AI Summary', 'Timeline', 'Family', 'AI Memory']

// ── Chip filter button ───────────────────────────────────────────────────────
function FilterChip({ label, active, count, onOpen }: {
  label: string; active: boolean; count?: number; onOpen: (rect: DOMRect) => void
}) {
  return (
    <button
      onClick={e => onOpen((e.currentTarget as HTMLElement).getBoundingClientRect())}
      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: active ? `${BLUE}12` : CARD, border: `1px solid ${active ? `${BLUE}40` : BORDER}`, color: active ? BLUE : TEXT2, fontSize: 11, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, whiteSpace: 'nowrap', userSelect: 'none' }}
    >
      {label}
      {count != null && count > 0 && (
        <span style={{ background: BLUE, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 9999, lineHeight: 1.4 }}>{count}</span>
      )}
      <ChevronDown size={11} style={{ opacity: 0.5 }} />
    </button>
  )
}

// ── Dropdown shell (fixed positioning to escape overflow:hidden) ─────────────
function Dropdown({ top, left, minWidth = 200, children }: { top: number; left: number; minWidth?: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', top, left, zIndex: 9999, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', minWidth, padding: '6px 0' }}>
      {children}
    </div>
  )
}

export default function ContactsPage() {
  const [sel, setSel]               = useState(CONTACTS[0])
  const [detailTab, setDetailTab]   = useState(0)
  const [search, setSearch]         = useState('')
  const [selectedTypes, setTypes]   = useState<string[]>([])
  const [lastContactIdx, setLCI]    = useState(0)
  const [scoreMin, setScoreMin]     = useState(0)
  const [scoreMax, setScoreMax]     = useState(100)
  const [selectedSuburbs, setSuburbs] = useState<string[]>([])
  const [sortBy, setSortBy]         = useState(SORT_OPTIONS[0])
  const [openDrop, setOpenDrop]     = useState<string | null>(null)
  const [dropAnchor, setDropAnchor] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [showAdvanced, setShowAdv]  = useState(false)
  const [suburbSearch, setSuburbSearch] = useState('')

  const openDropdown = (name: string, rect: DOMRect) => {
    if (openDrop === name) { setOpenDrop(null); return }
    setDropAnchor({ top: rect.bottom + 6, left: rect.left })
    setOpenDrop(name)
  }

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    if (t) {
      const map: Record<string, string> = { buyers: 'Buyer', sellers: 'Seller', investors: 'Investor', landlords: 'Landlord', developers: 'Developer' }
      if (map[t]) setTypes([map[t]])
    }
  }, [])

  const allSuburbs = useMemo(() =>
    Array.from(new Set(CONTACTS.map(c => c.suburb.replace(/^(Searching:|Investing:)\s*/i, '').trim()))).sort()
  , [])

  const filtered = useMemo(() => {
    const maxDays = LAST_CONTACT_OPTIONS[lastContactIdx].maxDays
    let list = CONTACTS.filter(c => {
      if (selectedTypes.length && !selectedTypes.includes(c.type)) return false
      if (contactDays(c.lastContact) > maxDays) return false
      if (c.score < scoreMin || c.score > scoreMax) return false
      if (selectedSuburbs.length) {
        const sub = c.suburb.replace(/^(Searching:|Investing:)\s*/i, '').trim()
        if (!selectedSuburbs.some(s => sub.toLowerCase().includes(s.toLowerCase()))) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!c.name.toLowerCase().includes(q) && !c.suburb.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
      }
      return true
    })
    if (sortBy === 'Score (high–low)')  list = [...list].sort((a, b) => b.score - a.score)
    if (sortBy === 'Score (low–high)')  list = [...list].sort((a, b) => a.score - b.score)
    if (sortBy === 'Name A–Z')          list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'Recent first')      list = [...list].sort((a, b) => contactDays(a.lastContact) - contactDays(b.lastContact))
    return list
  }, [search, selectedTypes, lastContactIdx, scoreMin, scoreMax, selectedSuburbs, sortBy])

  const hasActiveFilters = selectedTypes.length > 0 || lastContactIdx !== 0 || scoreMin > 0 || scoreMax < 100 || selectedSuburbs.length > 0

  const clearAll = () => { setTypes([]); setLCI(0); setScoreMin(0); setScoreMax(100); setSuburbs([]); setSortBy(SORT_OPTIONS[0]); setSearch('') }

  const toggleType = (t: string) => setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleSuburb = (s: string) => setSuburbs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const filtSuburbs = allSuburbs.filter(s => s.toLowerCase().includes(suburbSearch.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* Backdrop to close any open dropdown */}
      {openDrop && <div onClick={() => setOpenDrop(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998 }} />}

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {/* Row 1: title + meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>Contacts</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT3 }}>
              <Users size={11} />{TOTAL_DB.toLocaleString()} total
            </span>
          </div>
          {hasActiveFilters && (
            <button onClick={clearAll} style={{ fontSize: 11, color: PINK, background: `${PINK}10`, border: `1px solid ${PINK}25`, padding: '3px 10px', borderRadius: 9999, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              Clear all filters
            </button>
          )}
        </div>

        {/* Row 2: search + chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={12} color={TEXT3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, suburb, email…"
              style={{ width: '100%', padding: '6px 10px 6px 28px', border: `1px solid ${BORDER}`, fontSize: 11, color: TEXT, background: BG, fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: TEXT3 }}><X size={11} /></button>}
          </div>

          {/* Type multi-select */}
          <FilterChip label="Type" active={selectedTypes.length > 0} count={selectedTypes.length} onOpen={r => openDropdown('type', r)} />
          {openDrop === 'type' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {ALL_TYPES.map(t => (
                <div key={t} onClick={e => { e.stopPropagation(); toggleType(t) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: TEXT2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = BG)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 16, height: 16, border: `2px solid ${selectedTypes.includes(t) ? TYPE_COLOR[t] : BORDER}`, background: selectedTypes.includes(t) ? TYPE_COLOR[t] : 'transparent', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedTypes.includes(t) && <Check size={10} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ color: selectedTypes.includes(t) ? TYPE_COLOR[t] : TEXT2, fontWeight: selectedTypes.includes(t) ? 700 : 400, flex: 1 }}>{t}</span>
                  <span style={{ fontSize: 10, color: TEXT3 }}>{CONTACTS.filter(c => c.type === t).length}</span>
                </div>
              ))}
            </Dropdown>
          )}

          {/* Last Contact */}
          <FilterChip label={lastContactIdx === 0 ? 'Last Contact' : LAST_CONTACT_OPTIONS[lastContactIdx].label} active={lastContactIdx !== 0} onOpen={r => openDropdown('contact', r)} />
          {openDrop === 'contact' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {LAST_CONTACT_OPTIONS.map((opt, i) => (
                <div key={opt.label} onClick={() => { setLCI(i); setOpenDrop(null) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: lastContactIdx === i ? BLUE : TEXT2, fontWeight: lastContactIdx === i ? 700 : 400, background: lastContactIdx === i ? `${BLUE}08` : 'transparent' }}
                  onMouseEnter={e => { if (lastContactIdx !== i) e.currentTarget.style.background = BG }} onMouseLeave={e => { if (lastContactIdx !== i) e.currentTarget.style.background = 'transparent' }}>
                  {opt.label}
                  {lastContactIdx === i && <Check size={12} color={BLUE} />}
                </div>
              ))}
            </Dropdown>
          )}

          {/* Score range */}
          <FilterChip label={scoreMin > 0 || scoreMax < 100 ? `Score ${scoreMin}–${scoreMax}` : 'Score'} active={scoreMin > 0 || scoreMax < 100} onOpen={r => openDropdown('score', r)} />
          {openDrop === 'score' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left} minWidth={240}>
              <div style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10 }}>AI SCORE RANGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <input type="number" min={0} max={scoreMax} value={scoreMin} onChange={e => setScoreMin(Math.min(Number(e.target.value), scoreMax))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: TEXT3, fontSize: 12 }}>to</span>
                  <input type="number" min={scoreMin} max={100} value={scoreMax} onChange={e => setScoreMax(Math.max(Number(e.target.value), scoreMin))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[['🔴 Hot (80–100)', 80, 100], ['🟡 Warm (60–79)', 60, 79], ['🔵 Cold (0–59)', 0, 59]].map(([l, mn, mx]) => (
                    <button key={String(l)} onClick={() => { setScoreMin(Number(mn)); setScoreMax(Number(mx)); setOpenDrop(null) }}
                      style={{ fontSize: 11, padding: '5px 10px', border: `1px solid ${scoreMin === Number(mn) && scoreMax === Number(mx) ? `${BLUE}40` : BORDER}`, background: scoreMin === Number(mn) && scoreMax === Number(mx) ? `${BLUE}10` : BG, color: scoreMin === Number(mn) && scoreMax === Number(mx) ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, textAlign: 'left', fontWeight: scoreMin === Number(mn) && scoreMax === Number(mx) ? 700 : 400 }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </Dropdown>
          )}

          {/* Sort */}
          <FilterChip label={`Sort: ${sortBy.split('(')[0].trim()}`} active={false} onOpen={r => openDropdown('sort', r)} />
          {openDrop === 'sort' && (
            <Dropdown top={dropAnchor.top} left={dropAnchor.left}>
              {SORT_OPTIONS.map(opt => (
                <div key={opt} onClick={() => { setSortBy(opt); setOpenDrop(null) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: sortBy === opt ? BLUE : TEXT2, fontWeight: sortBy === opt ? 700 : 400, background: sortBy === opt ? `${BLUE}08` : 'transparent' }}
                  onMouseEnter={e => { if (sortBy !== opt) e.currentTarget.style.background = BG }} onMouseLeave={e => { if (sortBy !== opt) e.currentTarget.style.background = 'transparent' }}>
                  {opt}
                  {sortBy === opt && <Check size={12} color={BLUE} />}
                </div>
              ))}
            </Dropdown>
          )}

          {/* Advanced filters toggle */}
          <button onClick={() => { setShowAdv(v => !v); setOpenDrop(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: showAdvanced ? `${PURPLE}12` : 'transparent', border: `1px solid ${showAdvanced ? `${PURPLE}40` : BORDER}`, color: showAdvanced ? PURPLE : TEXT3, fontSize: 11, fontWeight: showAdvanced ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, marginLeft: 'auto' }}>
            <SlidersHorizontal size={12} /> Advanced
          </button>
        </div>

        {/* Advanced filters panel */}
        {showAdvanced && (
          <div style={{ padding: '12px 20px 14px', borderTop: `1px solid ${BORDER}`, background: `${PURPLE}04` }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Suburb */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>SUBURB</div>
                <div style={{ position: 'relative', marginBottom: 6 }}>
                  <Search size={10} color={TEXT3} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input value={suburbSearch} onChange={e => setSuburbSearch(e.target.value)} placeholder="Filter suburbs…"
                    style={{ width: '100%', padding: '5px 8px 5px 24px', border: `1px solid ${BORDER}`, fontSize: 11, color: TEXT, background: '#fff', fontFamily: 'inherit', outline: 'none', borderRadius: 6, boxSizing: 'border-box' }} />
                </div>
                <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {filtSuburbs.map(s => {
                    const on = selectedSuburbs.includes(s)
                    return (
                      <button key={s} onClick={() => toggleSuburb(s)}
                        style={{ padding: '3px 9px', fontSize: 10, fontWeight: on ? 700 : 400, border: `1px solid ${on ? `${PURPLE}40` : BORDER}`, background: on ? `${PURPLE}12` : '#fff', color: on ? PURPLE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>
                        {s} {on && '×'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Score range (repeated here for convenience) */}
              <div>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>AI SCORE RANGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <input type="number" min={0} max={scoreMax} value={scoreMin} onChange={e => setScoreMin(Math.min(Number(e.target.value), scoreMax))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                  <span style={{ color: TEXT3, fontSize: 12 }}>–</span>
                  <input type="number" min={scoreMin} max={100} value={scoreMax} onChange={e => setScoreMax(Math.max(Number(e.target.value), scoreMin))}
                    style={{ width: 64, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: 12, color: TEXT, borderRadius: 6, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[['Hot (80–100)', 80, 100], ['Warm (60–79)', 60, 79], ['Cold (0–59)', 0, 59]].map(([l, mn, mx]) => (
                    <button key={String(l)} onClick={() => { setScoreMin(Number(mn)); setScoreMax(Number(mx)) }}
                      style={{ fontSize: 10, padding: '4px 10px', border: `1px solid ${BORDER}`, background: scoreMin === mn && scoreMax === mx ? `${BLUE}12` : '#fff', color: scoreMin === mn && scoreMax === mx ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, fontWeight: scoreMin === mn && scoreMax === mx ? 700 : 400, textAlign: 'left' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Last contact (repeated for convenience) */}
              <div>
                <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>LAST CONTACT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {LAST_CONTACT_OPTIONS.map((opt, i) => (
                    <button key={opt.label} onClick={() => setLCI(i)}
                      style={{ fontSize: 11, padding: '5px 12px', border: `1px solid ${lastContactIdx === i ? `${BLUE}40` : BORDER}`, background: lastContactIdx === i ? `${BLUE}10` : '#fff', color: lastContactIdx === i ? BLUE : TEXT2, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, fontWeight: lastContactIdx === i ? 700 : 400, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {lastContactIdx === i && <Check size={11} color={BLUE} />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active suburb tags */}
              {selectedSuburbs.length > 0 && (
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>SELECTED SUBURBS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {selectedSuburbs.map(s => (
                      <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, color: PURPLE, fontSize: 10, fontWeight: 700, borderRadius: 9999 }}>
                        {s}
                        <button onClick={() => toggleSuburb(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: PURPLE, display: 'flex' }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: contact list */}
        <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Result count */}
          <div style={{ padding: '6px 16px', borderBottom: `1px solid ${BORDER}`, background: BG, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: TEXT3 }}>
              Showing <strong style={{ color: TEXT2 }}>{filtered.length}</strong> of <strong style={{ color: TEXT2 }}>{TOTAL_DB.toLocaleString()}</strong> contacts
              {hasActiveFilters && <span style={{ color: BLUE }}> · filtered</span>}
            </span>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((c, i) => (
              <div key={i} onClick={() => { setSel(c); setDetailTab(0) }}
                style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: sel.name === c.name ? `${BLUE}05` : 'transparent', borderLeft: `2px solid ${sel.name === c.name ? c.typeColor : 'transparent'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 30, height: 30, background: avColor(c.name), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(c.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: TEXT3 }}>{c.suburb}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.scoreColor, letterSpacing: '-0.03em', flexShrink: 0 }}>{c.score}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: c.typeColor, background: `${c.typeColor}18`, padding: '1px 6px', fontWeight: 700, borderRadius: 9999 }}>{c.type.toUpperCase()}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3 }}>{c.lastContact}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: TEXT3, fontSize: 12 }}>
                <Users size={28} color={TEXT3} style={{ opacity: 0.2, marginBottom: 8 }} />
                <div>No contacts match your filters.</div>
                <button onClick={clearAll} style={{ marginTop: 10, fontSize: 11, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Clear filters</button>
              </div>
            )}
          </div>
        </div>

        {/* Right: contact detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, background: avColor(sel.name), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials(sel.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{sel.name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: sel.typeColor, background: `${sel.typeColor}15`, padding: '2px 8px', fontWeight: 700, borderRadius: 9999 }}>{sel.type.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: TEXT3 }}>{sel.suburb}</span>
                  <span style={{ fontSize: 10, color: sel.scoreColor, fontWeight: 700 }}>Score: {sel.score}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ label: 'Call', color: GREEN, icon: Phone }, { label: 'Email', color: BLUE, icon: Mail }, { label: 'SMS', color: PURPLE, icon: MessageSquare }].map(a => {
                  const Icon = a.icon
                  const href = a.label === 'Call' ? `tel:${sel.phone}` : a.label === 'Email' ? `mailto:${sel.email}` : `sms:${sel.phone}`
                  return <button key={a.label} onClick={() => window.location.href = href} style={{ background: a.color, border: 'none', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 9999 }}><Icon size={11} />{a.label}</button>
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {DETAIL_TABS.map((t, i) => (
                <button key={t} onClick={() => setDetailTab(i)} style={{ padding: '4px 12px', background: detailTab === i ? `${PINK}15` : 'rgba(0,0,0,0.03)', border: `1px solid ${detailTab === i ? `${PINK}30` : BORDER}`, color: detailTab === i ? PINK : TEXT3, fontSize: 11, fontWeight: detailTab === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 9999 }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {detailTab === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>CONTACT DETAILS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Phone size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.phone}</span></div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Mail size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.email}</span></div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MapPin size={10} color={TEXT3} /><span style={{ fontSize: 12, color: TEXT }}>{sel.suburb}</span></div>
                    </div>
                  </div>
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>LIFE EVENT</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <Heart size={12} color={PINK} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>{sel.lifeEvent || '—'}</span>
                    </div>
                  </div>
                </div>
                {sel.notes && (
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>NOTES</div>
                    <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.notes}</p>
                  </div>
                )}
                {sel.properties.length > 0 && (
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 14, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>PROPERTIES</div>
                    {sel.properties.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Home size={11} color={BLUE} /><span style={{ fontSize: 12, color: TEXT }}>{p}</span></div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {detailTab === 1 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Relationship Timeline</div>
                {sel.timeline.length === 0 ? <div style={{ color: TEXT3, fontSize: 12 }}>No timeline recorded yet.</div> : (
                  <div style={{ position: 'relative', paddingLeft: 20 }}>
                    <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: BORDER }} />
                    {sel.timeline.map((t, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                        <div style={{ position: 'absolute', left: -18, top: 3, width: 10, height: 10, background: t.color, borderRadius: 9999, border: '2px solid #fff' }} />
                        <div style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>{t.date}</div>
                        <div style={{ fontSize: 12.5, color: TEXT2 }}>{t.event}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {detailTab === 2 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Family & Communication Style</div>
                {sel.family || sel.commStyle ? <>
                  {sel.family && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>FAMILY</div><p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.family}</p></div>}
                  {sel.commStyle && <div><div style={{ fontSize: 10, color: TEXT3, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>COMMUNICATION STYLE</div><p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>{sel.commStyle}</p></div>}
                </> : <div style={{ color: TEXT3, fontSize: 12 }}>No family or communication notes recorded yet.</div>}
              </div>
            )}
            {detailTab === 3 && (
              <div style={{ background: PINK_S, border: '1px solid rgba(227,0,140,0.2)', padding: 20, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Brain size={14} color={PINK} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>AI Memory — {sel.name}</span>
                </div>
                {sel.aiMemory
                  ? <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.9 }}>{sel.aiMemory}</p>
                  : <p style={{ margin: 0, fontSize: 13, color: TEXT3, lineHeight: 1.9, fontStyle: 'italic' }}>AI memory builds automatically from calls, emails and interactions. Start engaging with this contact to populate their memory profile.</p>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
