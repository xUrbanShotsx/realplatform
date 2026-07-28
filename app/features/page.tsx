'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X, BarChart3, Users, AlertTriangle, GraduationCap, ClipboardCheck, Zap, Building2, FileText, ShieldCheck } from 'lucide-react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const Y  = '#FFD940'
const HL = '#1e1e1e'
const INK = '#5a5a5f'
const F  = `'Inter', Arial, sans-serif`
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const PAD = 'clamp(72px,10vh,120px) clamp(24px,6vw,80px)'

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, Number(el.dataset.delay ?? 0))
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const h = el as HTMLElement
      h.style.opacity = '0'; h.style.transform = 'translateY(26px)'
      h.style.transition = 'opacity .75s cubic-bezier(.23,1,.32,1), transform .75s cubic-bezier(.23,1,.32,1)'
      obs.observe(h)
    })
    return () => obs.disconnect()
  }, [])
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: 16, fontFamily: F }}>{children}</p>
)
const GoldLine = () => <div style={{ width: 28, height: 1, background: Y, marginBottom: 20 }} />

// ── Shared Nav ────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false)
  const [op, setOp] = useState(false)
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const lc = sc ? INK : 'rgba(255,255,255,0.6)', lh = sc ? '#000' : '#fff'
  const ls: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: lc, textDecoration: 'none', transition: 'color .3s', fontFamily: F }
  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sc ? '10px 48px' : '18px 48px', background: sc ? '#fff' : 'transparent', borderBottom: sc ? '1px solid #e8e8e8' : 'none', transition: 'all .4s ease', fontFamily: F }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.3px', fontFamily: F, color: sc ? '#000' : '#fff', transition: 'color .4s' }}>Briesa</span></Link>
        <div className="hidden md:flex items-center gap-8">
          {[['Features','/features'],['Product','/product'],['About','/about']].map(([l,h])=>(
            <Link key={l} href={h} style={ls} onMouseEnter={e=>(e.currentTarget.style.color=lh)} onMouseLeave={e=>(e.currentTarget.style.color=lc)}>{l}</Link>
          ))}
          <Link href="/pricing" style={ls} onMouseEnter={e=>(e.currentTarget.style.color=lh)} onMouseLeave={e=>(e.currentTarget.style.color=lc)}>Pricing</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" style={ls}>Log in</Link>
          <Link href="/login" style={{ fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:sc?'#000':'transparent',color:'#fff',border:sc?'none':'1px solid rgba(255,255,255,0.4)',padding:'11px 22px',textDecoration:'none',transition:'all .3s' }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background=Y;el.style.color='#000';el.style.borderColor='transparent'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=sc?'#000':'transparent';el.style.color='#fff';el.style.borderColor=sc?'transparent':'rgba(255,255,255,0.4)'}}>Get Started</Link>
        </div>
        <button onClick={()=>setOp(v=>!v)} className="md:hidden" style={{background:'none',border:'none',cursor:'pointer'}}>{op?<X size={22} color={sc?'#000':'#fff'}/>:<Menu size={22} color={sc?'#000':'#fff'}/>}</button>
      </nav>
      {op&&<div style={{position:'fixed',inset:0,zIndex:999,background:'#fff',paddingTop:64,fontFamily:F}}>
        {[['Features','/features'],['Product','/product'],['About','/about'],['Pricing','/pricing']].map(([l,h])=>(
          <Link key={l} href={h} onClick={()=>setOp(false)} style={{padding:'20px 28px',fontSize:13,fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:'#000',textDecoration:'none',borderBottom:'1px solid #f0f0f0',display:'flex',justifyContent:'space-between'}}>{l}<span style={{color:'#aaa'}}>→</span></Link>
        ))}
        <div style={{padding:28}}><Link href="/login" onClick={()=>setOp(false)} style={{display:'block',textAlign:'center',padding:16,background:'#000',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Get Started</Link></div>
      </div>}
    </>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{position:'relative',overflow:'hidden',minHeight:'78vh',display:'flex',alignItems:'flex-end'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:`url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')`,backgroundSize:'cover',backgroundPosition:'center 40%'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,.92) 100%)'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:GRAIN,opacity:.18,mixBlendMode:'overlay',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:2,padding:'clamp(28px,5vw,80px)',paddingBottom:'clamp(64px,9vh,110px)',paddingTop:'clamp(120px,16vh,160px)',maxWidth:900}}>
        <Eyebrow>Platform Features</Eyebrow>
        <GoldLine />
        <h1 style={{fontSize:'clamp(42px,6vw,82px)',fontWeight:900,textTransform:'uppercase',lineHeight:.88,letterSpacing:'-1.5px',color:'#fff',marginBottom:28,fontFamily:F}}>
          EVERY COMPLIANCE<br />TOOL YOU NEED,<br /><em style={{fontStyle:'normal',color:Y}}>IN ONE PLACE.</em>
        </h1>
        <p style={{fontSize:15,fontWeight:300,lineHeight:1.78,color:'rgba(255,255,255,.55)',maxWidth:500,marginBottom:44,fontFamily:F}}>
          From contractor onboarding to AI-generated SWMS — Briesa replaces every spreadsheet, email thread and manual checklist your team relies on today.
        </p>
        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:Y,color:'#000',padding:'15px 30px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Started <ArrowRight size={13}/></Link>
          <Link href="/pricing" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:'#fff',border:'1px solid rgba(255,255,255,.35)',padding:'15px 30px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>View Pricing</Link>
        </div>
      </div>
    </section>
  )
}

// ── Feature cards ─────────────────────────────────────────────────────────────
function Features() {
  const items = [
    {icon:BarChart3,     color:'#22c55e', title:'Compliance Score',      desc:'Real-time scoring across WHS, ISO, contractor and training compliance. Always know your audit readiness at a glance.'},
    {icon:Users,         color:'#3b82f6', title:'Contractor Management', desc:'Track insurance, licences, inductions and compliance scores for every contractor and subcontractor automatically.'},
    {icon:AlertTriangle, color:'#ef4444', title:'Incidents & Hazards',   desc:'Log, investigate and close incidents fast. Auto-trigger corrective actions and track every item to completion.'},
    {icon:GraduationCap, color:'#f59e0b', title:'Training Records',      desc:'Monitor staff training completion, expiry dates and competency records across your entire workforce.'},
    {icon:ClipboardCheck,color:'#a855f7', title:'Inspections & Audits',  desc:'Digital checklists, site inspections, SWMS and pre-start forms — captured, stored and searchable automatically.'},
    {icon:Zap,           color:Y,         title:'AI-Powered Tools',      desc:'Generate SWMS, toolbox talks, risk assessments and compliance reports in seconds with Briesa\'s built-in AI.'},
  ]
  return (
    <section id="features" style={{padding:PAD,background:'#000',fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>Core Modules</Eyebrow>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center',marginBottom:64}} className="split-grid">
          <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',fontFamily:F}}>
            EVERYTHING YOU<br />NEED TO STAY<br /><em style={{fontStyle:'normal',color:Y}}>COMPLIANT.</em>
          </h2>
          <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,fontFamily:F}}>
            Six purpose-built compliance modules that work together in one platform — no integrations, no data gaps, no manual handoffs between systems.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:2}}>
          {items.map(({icon:Icon,color,title,desc},i)=>(
            <div key={i} data-reveal data-delay={`${i*60}`} style={{padding:'36px 32px',background:'#0a0a0a',border:`1px solid ${HL}`,borderTop:`2px solid ${color}`,transition:'background .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#111'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#0a0a0a'}>
              <div style={{width:40,height:40,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}><Icon size={18} style={{color}}/></div>
              <p style={{fontSize:12,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#fff',marginBottom:12,fontFamily:F}}>{title}</p>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:INK,fontFamily:F}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── AI section ────────────────────────────────────────────────────────────────
function AISection() {
  return (
    <section style={{position:'relative',overflow:'hidden',padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{position:'absolute',inset:0,backgroundImage:`url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80')`,backgroundSize:'cover',backgroundPosition:'center 60%',opacity:.06}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:GRAIN,opacity:.1,mixBlendMode:'overlay',pointerEvents:'none'}}/>
      <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
        <GoldLine/>
        <Eyebrow>AI Tools</Eyebrow>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}} className="split-grid">
          <div>
            <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:24,fontFamily:F}}>
              GENERATE IN<br />SECONDS WHAT<br /><em style={{fontStyle:'normal',color:Y}}>TOOK HOURS.</em>
            </h2>
            <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,marginBottom:36,fontFamily:F}}>
              Briesa AI uses your live project data, site conditions and team details to generate compliant documents instantly — not blank templates you have to fill in yourself.
            </p>
            <ul style={{listStyle:'none',padding:0,margin:'0 0 40px'}}>
              {['AI SWMS generator — full Safe Work Method Statements in 5 minutes','Toolbox talk builder — ready-to-use site safety briefings','Risk assessment AI — hazard identification and control measures','Compliance report generator — audit-ready summaries on demand'].map((item,i)=>(
                <li key={i} data-reveal data-delay={`${i*60}`} style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:14,fontSize:13,fontWeight:300,color:'rgba(255,255,255,.6)',fontFamily:F}}>
                  <span style={{width:1,height:14,background:Y,flexShrink:0,marginTop:3}}/>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:Y,color:'#000',padding:'14px 28px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Try AI Tools Free <ArrowRight size={13}/></Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:2}}>
            {[{label:'Average SWMS generation time',before:'4+ hours',after:'5 minutes'},{label:'Toolbox talks per month',before:'1–2 manual',after:'Unlimited, instant'},{label:'Risk assessment accuracy',before:'Varies by person',after:'Consistent & compliant'},{label:'Audit report preparation',before:'1–2 weeks',after:'On demand'}].map(({label,before,after},i)=>(
              <div key={i} data-reveal data-delay={`${i*60}`} style={{padding:'22px 24px',background:'#000',border:`1px solid ${HL}`,display:'grid',gridTemplateColumns:'1fr auto auto',gap:16,alignItems:'center'}}>
                <p style={{fontSize:12,fontWeight:300,color:'rgba(255,255,255,.55)',fontFamily:F}}>{label}</p>
                <p style={{fontSize:11,fontWeight:300,color:INK,textAlign:'right',fontFamily:F}}>{before}</p>
                <p style={{fontSize:11,fontWeight:700,color:'#22c55e',textAlign:'right',fontFamily:F,whiteSpace:'nowrap'}}>→ {after}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── By Industry ───────────────────────────────────────────────────────────────
function Industries() {
  const items = [
    {icon:Building2, title:'Construction & Building',   sub:'From single-site builders to national contractors.',points:['SWMS & JSEA management','Subcontractor compliance','Site inspection forms','Permit-to-work workflows','Pre-start safety checks']},
    {icon:Users,     title:'Labour Hire & Staffing',    sub:'Full visibility across a distributed workforce.',points:['Worker licence tracking','Induction management','Training expiry alerts','Compliance dashboards','Multi-client reporting']},
    {icon:FileText,  title:'Manufacturing & Industrial', sub:'ISO-ready compliance for regulated environments.',points:['ISO 9001 / 45001 readiness','Plant & equipment registers','Chemical registers (SDS)','Audit trail documentation','Corrective action workflows']},
    {icon:ShieldCheck,title:'Facilities & Property',    sub:'Keep multi-site operations consistently compliant.',points:['Site-by-site compliance scores','Contractor vetting & onboarding','OH&S incident management','Document version control','Scheduled inspection reminders']},
  ]
  return (
    <section id="solutions" style={{padding:PAD,background:'#000',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>By Industry</Eyebrow>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:64,flexWrap:'wrap',gap:32}}>
          <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',fontFamily:F}}>
            BUILT FOR INDUSTRIES<br />THAT CAN'T<br /><em style={{fontStyle:'normal',color:Y}}>AFFORD TO FAIL.</em>
          </h2>
          <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,maxWidth:360,fontFamily:F}}>
            Compliance looks different in construction than it does in manufacturing. Briesa is configured for the way your industry actually works.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:2}}>
          {items.map(({icon:Icon,title,sub,points},i)=>(
            <div key={i} data-reveal data-delay={`${i*70}`} style={{padding:'40px 32px',background:'#0a0a0a',border:`1px solid ${HL}`,transition:'background .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#111'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#0a0a0a'}>
              <div style={{width:44,height:44,border:`1px solid ${Y}30`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24}}><Icon size={18} style={{color:Y}}/></div>
              <p style={{fontSize:12,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#fff',marginBottom:8,fontFamily:F}}>{title}</p>
              <p style={{fontSize:12,fontWeight:300,color:INK,marginBottom:20,fontFamily:F}}>{sub}</p>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {points.map(p=>(
                  <li key={p} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,fontSize:12,fontWeight:300,color:'rgba(255,255,255,.5)',fontFamily:F}}>
                    <span style={{width:1,height:12,background:Y,flexShrink:0}}/>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ──────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    {num:'01',title:'Onboard in 30 min',body:'Set up your company, invite your team and configure your compliance areas. Most customers are live the same day.'},
    {num:'02',title:'Configure to fit',  body:'Customise inspection forms, SWMS templates and notification rules to match your operations and industry.'},
    {num:'03',title:'Let Briesa run',    body:'Briesa chases expiries, triggers corrective actions and generates compliance reports automatically.'},
    {num:'04',title:'Audit-ready',       body:'Export full audit packs, compliance reports and records in seconds — any time, any regulator, any inspection.'},
  ]
  return (
    <section style={{padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>How It Works</Eyebrow>
        <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:64,fontFamily:F}}>
          THE BRIESA<br /><em style={{fontStyle:'normal',color:Y}}>EXPERIENCE.</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0}} className="process-grid">
          {steps.map(({num,title,body},i)=>(
            <div key={i} data-reveal data-delay={`${i*90}`} style={{padding:i===0?'0 40px 0 0':'0 40px',borderRight:i<3?`1px solid ${HL}`:undefined,position:'relative'}}>
              <p style={{fontSize:72,fontWeight:900,lineHeight:1,color:'#2a2a2a',letterSpacing:'-3px',marginBottom:24,fontFamily:F}}>{num}</p>
              <p style={{fontSize:12,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#fff',marginBottom:14,fontFamily:F}}>{title}</p>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.8,color:INK,fontFamily:F}}>{body}</p>
              {i<3&&<div style={{position:'absolute',top:36,right:-1,width:1,height:80,background:`linear-gradient(to bottom,${Y},transparent)`}}/>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{padding:PAD,background:Y,fontFamily:F}}>
      <div style={{maxWidth:860,margin:'0 auto',textAlign:'center'}}>
        <p data-reveal style={{fontSize:9,letterSpacing:'4px',textTransform:'uppercase',color:'rgba(0,0,0,.4)',marginBottom:20,fontFamily:F}}>Ready to see it in action?</p>
        <h2 data-reveal data-delay="80" style={{fontSize:'clamp(32px,5vw,68px)',fontWeight:900,textTransform:'uppercase',lineHeight:.88,color:'#000',marginBottom:24,fontFamily:F}}>
          GET STARTED TODAY.
        </h2>
        <p data-reveal data-delay="160" style={{fontSize:14,fontWeight:300,color:'rgba(0,0,0,.5)',marginBottom:44,fontFamily:F}}>No lock-in contracts. Set up in under 30 minutes.</p>
        <div data-reveal data-delay="240" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:'#000',color:Y,padding:'16px 36px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Started <ArrowRight size={13}/></Link>
          <Link href="/about" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:'#000',border:'2px solid rgba(0,0,0,.2)',padding:'16px 36px',textDecoration:'none'}}>Talk to Sales</Link>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:'#0a0a0a',borderTop:`1px solid ${HL}`,padding:'clamp(48px,7vh,80px) clamp(24px,6vw,80px) 32px',fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:56,marginBottom:56}} className="footer-grid">
          <div>
            <p style={{fontSize:18,fontWeight:900,color:'#fff',marginBottom:4,fontFamily:F}}>Briesa</p>
            <p style={{fontSize:9,fontWeight:400,letterSpacing:'3px',textTransform:'uppercase',color:Y,marginBottom:18,fontFamily:F}}>Compliance Platform</p>
            <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:INK,maxWidth:260,fontFamily:F}}>Australia's leading AI-powered compliance management platform for high-risk industries.</p>
          </div>
          {[{h:'Product',links:[['Features','/features'],['Product','/product'],['Pricing','/pricing']]},{h:'Solutions',links:[['Construction','#'],['Labour Hire','#'],['Manufacturing','#']]},{h:'Company',links:[['About','/about'],['Contact','/about'],['Log in','/login']]}].map(({h,links})=>(
            <div key={h}>
              <p style={{fontSize:9,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#fff',marginBottom:22,fontFamily:F}}>{h}</p>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {links.map(([l,href])=>(
                  <li key={l} style={{marginBottom:12}}>
                    <Link href={href} style={{fontSize:13,fontWeight:300,color:INK,textDecoration:'none',fontFamily:F,transition:'color .3s'}} onMouseEnter={e=>(e.currentTarget.style.color=Y)} onMouseLeave={e=>(e.currentTarget.style.color=INK)}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:28,borderTop:`1px solid ${HL}`,flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:11,fontWeight:300,color:INK,fontFamily:F}}>© 2025 Briesa Pty Ltd. All rights reserved. ABN 12 345 678 901</p>
          <div style={{display:'flex',gap:24}}>{['Privacy Policy','Terms','Cookie Policy'].map(t=><a key={t} href="#" style={{fontSize:11,fontWeight:300,color:INK,textDecoration:'none',fontFamily:F,transition:'color .3s'}} onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color=INK)}>{t}</a>)}</div>
        </div>
      </div>
    </footer>
  )
}

function GlobalStyles() {
  return <style>{`.split-grid{grid-template-columns:1fr 1fr!important}@media(max-width:900px){.split-grid{grid-template-columns:1fr!important;gap:48px!important}.process-grid{grid-template-columns:1fr 1fr!important;gap:40px!important}.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}@media(max-width:600px){.process-grid,.footer-grid{grid-template-columns:1fr!important}}`}</style>
}

export default function FeaturesPage() {
  useReveal()
  return (
    <><GlobalStyles/>
    <div style={{minHeight:'100vh',background:'#000',fontFamily:F}}>
      <Nav/><main><Hero/><Features/><AISection/><Industries/><Process/><CTA/></main><Footer/>
    </div></>
  )
}
