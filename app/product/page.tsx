'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X, CheckCircle2, ShieldCheck, Clock, TrendingUp, Zap, Lock, HeartHandshake } from 'lucide-react'

const Y   = '#FFD940'
const HL  = '#1e1e1e'
const INK = '#5a5a5f'
const F   = `'Inter', Arial, sans-serif`
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const PAD = 'clamp(72px,10vh,120px) clamp(24px,6vw,80px)'

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          setTimeout(() => { el.style.opacity='1'; el.style.transform='translateY(0)' }, Number(el.dataset.delay??0))
        }
      })
    }, { threshold:.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const h = el as HTMLElement
      h.style.opacity='0'; h.style.transform='translateY(26px)'
      h.style.transition='opacity .75s cubic-bezier(.23,1,.32,1),transform .75s cubic-bezier(.23,1,.32,1)'
      obs.observe(h)
    })
    return () => obs.disconnect()
  }, [])
}

const Eyebrow = ({children}:{children:React.ReactNode}) => <p style={{fontSize:9,letterSpacing:'4px',textTransform:'uppercase' as const,color:'rgba(255,255,255,.35)',marginBottom:16,fontFamily:F}}>{children}</p>
const GoldLine = () => <div style={{width:28,height:1,background:Y,marginBottom:20}}/>

function Nav() {
  const [sc,setSc]=useState(false),[op,setOp]=useState(false)
  useEffect(()=>{const fn=()=>setSc(window.scrollY>60);window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[])
  const lc=sc?INK:'rgba(255,255,255,.6)',lh=sc?'#000':'#fff'
  const ls:React.CSSProperties={fontSize:11,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:lc,textDecoration:'none',transition:'color .3s',fontFamily:F}
  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'space-between',padding:sc?'10px 48px':'18px 48px',background:sc?'#fff':'transparent',borderBottom:sc?'1px solid #e8e8e8':'none',transition:'all .4s',fontFamily:F}}>
        <Link href="/" style={{textDecoration:'none'}}><span style={{fontSize:18,fontWeight:900,letterSpacing:'-0.3px',fontFamily:F,color:sc?'#000':'#fff',transition:'color .4s'}}>Briesa</span></Link>
        <div className="hidden md:flex items-center gap-8">
          {[['Features','/features'],['Product','/product'],['About','/about']].map(([l,h])=>(
            <Link key={l} href={h} style={ls} onMouseEnter={e=>(e.currentTarget.style.color=lh)} onMouseLeave={e=>(e.currentTarget.style.color=lc)}>{l}</Link>
          ))}
          <Link href="/pricing" style={ls} onMouseEnter={e=>(e.currentTarget.style.color=lh)} onMouseLeave={e=>(e.currentTarget.style.color=lc)}>Pricing</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" style={ls}>Log in</Link>
          <Link href="/login" style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:sc?'#000':'transparent',color:'#fff',border:sc?'none':'1px solid rgba(255,255,255,.4)',padding:'11px 22px',textDecoration:'none',transition:'all .3s'}}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background=Y;el.style.color='#000';el.style.borderColor='transparent'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=sc?'#000':'transparent';el.style.color='#fff';el.style.borderColor=sc?'transparent':'rgba(255,255,255,.4)'}}>Get Started</Link>
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

function Hero() {
  return (
    <section style={{position:'relative',overflow:'hidden',minHeight:'78vh',display:'flex',alignItems:'flex-end'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:`url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')`,backgroundSize:'cover',backgroundPosition:'center'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,.92) 100%)'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:GRAIN,opacity:.18,mixBlendMode:'overlay',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:2,padding:'clamp(28px,5vw,80px)',paddingBottom:'clamp(64px,9vh,110px)',paddingTop:'clamp(120px,16vh,160px)',maxWidth:880}}>
        <Eyebrow>Why Briesa</Eyebrow>
        <GoldLine/>
        <h1 style={{fontSize:'clamp(42px,6vw,82px)',fontWeight:900,textTransform:'uppercase',lineHeight:.88,letterSpacing:'-1.5px',color:'#fff',marginBottom:28,fontFamily:F}}>
          COMPLIANCE<br />THAT ACTUALLY<br /><em style={{fontStyle:'normal',color:Y}}>WORKS.</em>
        </h1>
        <p style={{fontSize:15,fontWeight:300,lineHeight:1.78,color:'rgba(255,255,255,.55)',maxWidth:520,marginBottom:44,fontFamily:F}}>
          Built from the ground up for Australian industry — Briesa replaces the spreadsheets, email chains and manual checklists that put your business at risk every single day.
        </p>
        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:Y,color:'#000',padding:'15px 30px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Started <ArrowRight size={13}/></Link>
          <Link href="/features" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:'#fff',border:'1px solid rgba(255,255,255,.35)',padding:'15px 30px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>See All Features</Link>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const pains = [
    'Compliance documents scattered across emails, USB drives and shared folders',
    'Contractor licences and insurances expiring without anyone noticing',
    'Incident reports filled out on paper — then lost before an audit',
    'Hours wasted pulling together records every time a regulator shows up',
    'No real-time visibility across multiple sites — until something goes wrong',
    'SWMS and toolbox talks created from scratch every time, by whoever has time',
  ]
  return (
    <section style={{padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}} className="split-grid">
          <div>
            <GoldLine/>
            <Eyebrow>The Problem</Eyebrow>
            <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:24,fontFamily:F}}>
              COMPLIANCE IS<br />BROKEN FOR<br /><em style={{fontStyle:'normal',color:Y}}>MOST BUSINESSES.</em>
            </h2>
            <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,fontFamily:F}}>
              Most Australian businesses are still managing compliance the same way they did 20 years ago. The tools haven't kept up — and the cost of getting it wrong has never been higher.
            </p>
          </div>
          <div>
            {pains.map((pain,i)=>(
              <div key={i} data-reveal data-delay={`${i*50}`} style={{display:'flex',alignItems:'flex-start',gap:16,padding:'15px 0',borderBottom:`1px solid ${HL}`}}>
                <div style={{width:6,height:6,background:'#ef4444',borderRadius:'50%',flexShrink:0,marginTop:5}}/>
                <p style={{fontSize:13,fontWeight:300,lineHeight:1.65,color:'rgba(255,255,255,.55)',fontFamily:F}}>{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Solution() {
  return (
    <section style={{padding:PAD,background:'#000',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}} className="split-grid">
          <div>
            <GoldLine/>
            <Eyebrow>The Solution</Eyebrow>
            <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:24,fontFamily:F}}>
              ONE PLATFORM.<br />TOTAL<br /><em style={{fontStyle:'normal',color:Y}}>CONTROL.</em>
            </h2>
            <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,marginBottom:36,fontFamily:F}}>
              Briesa brings every compliance workflow into one intelligent platform. Incidents, contractors, training, audits, AI tools — all connected, all visible, all automatic.
            </p>
            <Link href="/features" data-reveal data-delay="200" style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:Y,textDecoration:'none',transition:'gap .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.gap='14px'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.gap='8px'}>Explore all features <ArrowRight size={13}/></Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
            {[['Incident tracking','Log and close hazards fast with auto-triggered corrective actions.'],['Contractor hub','Every licence, insurance and induction — tracked and alerted.'],['AI document tools','Generate SWMS, risk assessments and toolbox talks in seconds.'],['Audit-ready records','Export full compliance packs any time, for any inspection.'],['Training records','Never miss an expiry across your entire workforce.'],['Real-time scoring','Live compliance score across WHS, ISO, training and contractors.']].map(([title,desc],i)=>(
              <div key={i} data-reveal data-delay={`${i*50}`} style={{padding:'22px 20px',background:'#0a0a0a',border:`1px solid ${HL}`,transition:'all .3s'}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#111';el.style.borderColor=Y+'30'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#0a0a0a';el.style.borderColor=HL}}>
                <div style={{width:5,height:5,background:Y,marginBottom:12}}/>
                <p style={{fontSize:11,fontWeight:700,color:'#fff',marginBottom:8,fontFamily:F}}>{title}</p>
                <p style={{fontSize:11,fontWeight:300,lineHeight:1.55,color:INK,fontFamily:F}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyBriesa() {
  const reasons = [
    {icon:ShieldCheck,  color:'#22c55e', title:'Purpose-built for compliance',       body:'Every other tool is a generic project app with compliance bolted on. Briesa was built from day one for WHS, ISO, contractor and training compliance.'},
    {icon:Zap,          color:Y,         title:'AI that actually saves time',         body:'Generating a SWMS used to take half a day. With Briesa AI, it takes five minutes — using your actual project data and site conditions.'},
    {icon:Clock,        color:'#3b82f6', title:'Audit-ready in minutes, not weeks',   body:'When a regulator asks for your compliance records, Briesa keeps everything current and exports full audit packs on demand.'},
    {icon:TrendingUp,   color:'#f59e0b', title:'Real-time visibility, every site',    body:'Compliance scores, open incidents, expiring documents and contractor statuses — all visible from one dashboard, updated live.'},
    {icon:Lock,         color:'#a855f7', title:'Enterprise security, Australian data',body:'SOC 2 compliant, Australian data hosting, role-based permissions and full audit trails. Your compliance data never leaves Australia.'},
    {icon:HeartHandshake,color:'#ef4444',title:'A team behind you, not just a product',body:'Every plan includes a free onboarding call. Our specialists help you configure Briesa for your industry and workflows.'},
  ]
  return (
    <section style={{padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>Why Briesa</Eyebrow>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:64,flexWrap:'wrap',gap:32}}>
          <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',fontFamily:F}}>
            THE PLATFORM<br />THAT PUTS YOU<br /><em style={{fontStyle:'normal',color:Y}}>AHEAD.</em>
          </h2>
          <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,maxWidth:380,fontFamily:F}}>
            Compliance isn't just about avoiding fines. It's about protecting your people, winning better clients and running a business that scales.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:2}}>
          {reasons.map(({icon:Icon,color,title,body},i)=>(
            <div key={i} data-reveal data-delay={`${i*60}`} style={{padding:'36px 32px',background:'#000',border:`1px solid ${HL}`,borderTop:`2px solid ${color}`,transition:'background .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#080808'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#000'}>
              <div style={{width:40,height:40,background:color+'15',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}><Icon size={18} style={{color}}/></div>
              <p style={{fontSize:12,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#fff',marginBottom:12,fontFamily:F}}>{title}</p>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:INK,fontFamily:F}}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section style={{position:'relative',overflow:'hidden',padding:PAD,background:'#000',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{position:'absolute',inset:0,backgroundImage:`url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80')`,backgroundSize:'cover',backgroundPosition:'center',opacity:.06}}/>
      <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2,marginBottom:2}} className="proof-grid">
          {[{stat:'98%',label:'Audit pass rate',sub:'Across active Briesa customers'},{stat:'5 min',label:'To generate a full SWMS',sub:'Down from 4+ hours manually'},{stat:'60%',label:'Less time on admin',sub:'Reported by compliance teams'}].map(({stat,label,sub},i)=>(
            <div key={i} data-reveal data-delay={`${i*70}`} style={{padding:'clamp(32px,4vw,52px)',borderRight:i<2?`1px solid ${HL}`:undefined,textAlign:'center'}}>
              <p style={{fontSize:'clamp(44px,5vw,68px)',fontWeight:900,lineHeight:1,letterSpacing:'-2px',color:Y,fontFamily:F}}>{stat}</p>
              <p style={{fontSize:12,fontWeight:700,color:'#fff',margin:'12px 0 6px',fontFamily:F}}>{label}</p>
              <p style={{fontSize:11,fontWeight:300,color:INK,fontFamily:F}}>{sub}</p>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:2}}>
          {[{quote:"Briesa cut our audit prep from two weeks to two days. It's the compliance platform we've been waiting for.",author:'Michael Torres',role:'HSE Manager · Apex Civil Group'},{quote:"We used to lose track of contractor docs constantly. Now everything is in one place and we get alerts before anything expires.",author:'Lisa Chen',role:'Operations Director · Premier Labour Hire'},{quote:"The AI tools are a game changer. Generating a SWMS used to take half a day — now it's five minutes.",author:'James Walters',role:'Site Manager · Stronghold Construction'}].map(({quote,author,role},i)=>(
            <div key={i} data-reveal data-delay={`${i*70}`} style={{padding:'36px 32px',background:'#0a0a0a',border:`1px solid ${HL}`}}>
              <span style={{fontSize:28,lineHeight:1,color:Y,display:'block',marginBottom:16,fontFamily:F}}>"</span>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.75,color:'rgba(255,255,255,.7)',marginBottom:24,fontStyle:'italic',fontFamily:F}}>{quote}</p>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:Y,marginBottom:4,fontFamily:F}}>{author}</p>
              <p style={{fontSize:10,fontWeight:300,letterSpacing:'1px',textTransform:'uppercase',color:INK,fontFamily:F}}>{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const rows = [
    ['Purpose-built for compliance',true,false],['Australian data hosting',true,false],['AI document generation',true,false],
    ['Real-time compliance score',true,false],['Contractor portal (free)',true,false],['Audit-ready export packs',true,false],
    ['ISO + WHS + training in one system',true,false],['Dedicated onboarding on every plan',true,false],
  ]
  return (
    <section style={{padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>Vs. The Alternatives</Eyebrow>
        <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:52,fontFamily:F}}>
          NOTHING ELSE<br /><em style={{fontStyle:'normal',color:Y}}>COMES CLOSE.</em>
        </h2>
        <div data-reveal data-delay="100">
          <div style={{display:'grid',gridTemplateColumns:'1fr 140px 140px',borderBottom:`1px solid ${HL}`,paddingBottom:12,marginBottom:2}}>
            <span/><span style={{fontSize:9,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:Y,fontFamily:F,textAlign:'center'}}>Briesa</span>
            <span style={{fontSize:9,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:INK,fontFamily:F,textAlign:'center'}}>Others</span>
          </div>
          {rows.map(([label,briesa,others],i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 140px 140px',padding:'13px 0',borderBottom:`1px solid ${HL}`,background:i%2===0?'transparent':'rgba(255,255,255,.015)'}}>
              <span style={{fontSize:13,fontWeight:300,color:'rgba(255,255,255,.6)',fontFamily:F}}>{label}</span>
              <span style={{textAlign:'center'}}>{briesa?<CheckCircle2 size={15} style={{color:'#22c55e',margin:'0 auto',display:'block'}}/>:<span style={{color:'#2a2a2a',fontFamily:F,fontSize:16,display:'block',textAlign:'center'}}>—</span>}</span>
              <span style={{textAlign:'center'}}>{others?<CheckCircle2 size={15} style={{color:'#22c55e',margin:'0 auto',display:'block'}}/>:<span style={{color:'#2a2a2a',fontFamily:F,fontSize:16,display:'block',textAlign:'center'}}>—</span>}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section style={{padding:PAD,background:Y,fontFamily:F}}>
      <div style={{maxWidth:860,margin:'0 auto',textAlign:'center'}}>
        <p data-reveal style={{fontSize:9,letterSpacing:'4px',textTransform:'uppercase',color:'rgba(0,0,0,.4)',marginBottom:20,fontFamily:F}}>Ready to get started?</p>
        <h2 data-reveal data-delay="80" style={{fontSize:'clamp(32px,5vw,68px)',fontWeight:900,textTransform:'uppercase',lineHeight:.88,color:'#000',marginBottom:24,fontFamily:F}}>YOUR NEXT AUDIT<br />STARTS TODAY.</h2>
        <p data-reveal data-delay="160" style={{fontSize:14,fontWeight:300,color:'rgba(0,0,0,.5)',marginBottom:44,fontFamily:F}}>No lock-in contracts. Set up in under 30 minutes.</p>
        <div data-reveal data-delay="240" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:'#000',color:Y,padding:'16px 36px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Started <ArrowRight size={13}/></Link>
          <Link href="/pricing" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:'#000',border:'2px solid rgba(0,0,0,.2)',padding:'16px 36px',textDecoration:'none'}}>View Pricing</Link>
        </div>
      </div>
    </section>
  )
}

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
              <ul style={{listStyle:'none',padding:0,margin:0}}>{links.map(([l,href])=>(
                <li key={l} style={{marginBottom:12}}><Link href={href} style={{fontSize:13,fontWeight:300,color:INK,textDecoration:'none',fontFamily:F,transition:'color .3s'}} onMouseEnter={e=>(e.currentTarget.style.color=Y)} onMouseLeave={e=>(e.currentTarget.style.color=INK)}>{l}</Link></li>
              ))}</ul>
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
  return <style>{`.split-grid{grid-template-columns:1fr 1fr!important}@media(max-width:900px){.split-grid,.proof-grid{grid-template-columns:1fr!important;gap:48px!important}.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}@media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
}

export default function ProductPage() {
  useReveal()
  return (
    <><GlobalStyles/>
    <div style={{minHeight:'100vh',background:'#000',fontFamily:F}}>
      <Nav/><main><Hero/><Problem/><Solution/><WhyBriesa/><Proof/><Comparison/><CTA/></main><Footer/>
    </div></>
  )
}
