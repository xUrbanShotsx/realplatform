'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X, Mail, Phone, MapPin, Send } from 'lucide-react'

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
      <div style={{position:'absolute',inset:0,backgroundImage:`url('https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1920&q=80')`,backgroundSize:'cover',backgroundPosition:'center 40%'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,.92) 100%)'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:GRAIN,opacity:.18,mixBlendMode:'overlay',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:2,padding:'clamp(28px,5vw,80px)',paddingBottom:'clamp(64px,9vh,110px)',paddingTop:'clamp(120px,16vh,160px)',maxWidth:860}}>
        <Eyebrow>About Briesa</Eyebrow>
        <GoldLine/>
        <h1 style={{fontSize:'clamp(42px,6vw,82px)',fontWeight:900,textTransform:'uppercase',lineHeight:.88,letterSpacing:'-1.5px',color:'#fff',marginBottom:28,fontFamily:F}}>
          BUILT BY PEOPLE<br />WHO LIVED THE<br /><em style={{fontStyle:'normal',color:Y}}>PROBLEM.</em>
        </h1>
        <p style={{fontSize:15,fontWeight:300,lineHeight:1.78,color:'rgba(255,255,255,.55)',maxWidth:520,marginBottom:44,fontFamily:F}}>
          Briesa was born out of frustration with the way compliance was being managed on Australian worksites — and a belief that it could be done far better.
        </p>
        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <Link href="/login" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,background:Y,color:'#000',padding:'15px 30px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Started <ArrowRight size={13}/></Link>
          <a href="#contact" style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:F,color:'#fff',border:'1px solid rgba(255,255,255,.35)',padding:'15px 30px',textDecoration:'none'}}>Get in Touch</a>
        </div>
      </div>
    </section>
  )
}

function Story() {
  const milestones = [
    {year:'2021',text:'Our founders spent years working across construction, labour hire and manufacturing — watching compliance failures happen not because people didn\'t care, but because the tools weren\'t good enough.'},
    {year:'2022',text:'After watching a close colleague\'s business face a six-figure fine following a missed contractor induction — despite doing everything they thought was right — we decided to build the platform we always wished existed.'},
    {year:'2023',text:'Briesa launched in private beta with a small group of construction and labour hire businesses. Within six months, not one had failed an audit. We knew we were onto something.'},
    {year:'2024',text:'We added AI tools, expanded to manufacturing and industrial clients, and launched the contractor portal — giving the entire supply chain visibility for the first time.'},
    {year:'Today',text:'Briesa serves businesses across Australia, from single-site operators to national enterprises. Our mission hasn\'t changed: make compliance simple enough that no business ever fails an audit again.'},
  ]
  return (
    <section style={{padding:PAD,background:'#000',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'start'}} className="split-grid">
          <div style={{position:'sticky',top:120}}>
            <GoldLine/>
            <Eyebrow>Our Story</Eyebrow>
            <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:28,fontFamily:F}}>
              WHY WE<br />BUILT<br /><em style={{fontStyle:'normal',color:Y}}>BRIESA.</em>
            </h2>
            <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,marginBottom:24,fontFamily:F}}>
              Compliance in Australia isn't optional — but the tools available to manage it have always been generic, clunky, or built for industries that look nothing like construction or labour hire.
            </p>
            <p data-reveal data-delay="180" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,fontFamily:F}}>
              We built Briesa because the workers, contractors and businesses doing the hard work of keeping Australia running deserve software that works for them — not against them.
            </p>
          </div>
          <div>
            {milestones.map(({year,text},i)=>(
              <div key={i} data-reveal data-delay={`${i*70}`} style={{display:'flex',gap:28,paddingBottom:i<milestones.length-1?36:0,marginBottom:i<milestones.length-1?36:0,borderBottom:i<milestones.length-1?`1px solid ${HL}`:undefined}}>
                <div style={{flexShrink:0,paddingTop:2}}><span style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:Y,fontFamily:F}}>{year}</span></div>
                <p style={{fontSize:13,fontWeight:300,lineHeight:1.75,color:'rgba(255,255,255,.55)',fontFamily:F}}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Values() {
  const values = [
    {title:'Honesty over hype',       body:'We don\'t oversell. If a feature isn\'t ready, we don\'t ship it. If Briesa isn\'t the right fit, we\'ll tell you.'},
    {title:'Built for the field',     body:'Every feature is designed with the person in the hi-vis vest in mind, not just the compliance manager at a desk.'},
    {title:'Australian by design',    body:'WHS legislation, ISO standards, Fair Work — we\'re built for the Australian regulatory environment, not adapted from a US product.'},
    {title:'Safety is not optional',  body:'We believe compliance done right protects people. That\'s not a marketing line — it\'s why we come to work every day.'},
  ]
  return (
    <section style={{padding:PAD,background:'#0a0a0a',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <GoldLine/>
        <Eyebrow>What We Stand For</Eyebrow>
        <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:64,fontFamily:F}}>
          OUR<br /><em style={{fontStyle:'normal',color:Y}}>VALUES.</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:2}}>
          {values.map(({title,body},i)=>(
            <div key={i} data-reveal data-delay={`${i*70}`} style={{padding:'36px 32px',background:'#000',border:`1px solid ${HL}`,borderTop:`2px solid ${Y}`,transition:'background .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#080808'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#000'}>
              <div style={{width:6,height:6,background:Y,marginBottom:20}}/>
              <p style={{fontSize:12,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#fff',marginBottom:14,fontFamily:F}}>{title}</p>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:INK,fontFamily:F}}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form,setForm]=useState({name:'',email:'',company:'',subject:'',message:''})
  const [sent,setSent]=useState(false)
  const [focused,setFocused]=useState<string|null>(null)
  const iStyle=(field:string):React.CSSProperties=>({width:'100%',background:'transparent',border:'none',borderBottom:`1px solid ${focused===field?Y:'#2a2a2a'}`,color:'#fff',fontSize:13,fontWeight:300,fontFamily:F,padding:'12px 0',outline:'none',transition:'border-color .3s',boxSizing:'border-box'})
  const lStyle:React.CSSProperties={fontSize:9,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:INK,display:'block',marginBottom:8,fontFamily:F}
  return (
    <section id="contact" style={{padding:PAD,background:'#000',borderTop:`1px solid ${HL}`,fontFamily:F}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'start'}} className="split-grid">
          <div>
            <GoldLine/>
            <Eyebrow>Get In Touch</Eyebrow>
            <h2 data-reveal style={{fontSize:'clamp(28px,3.5vw,50px)',fontWeight:900,textTransform:'uppercase',lineHeight:.92,color:'#fff',marginBottom:28,fontFamily:F}}>
              LET'S TALK<br /><em style={{fontStyle:'normal',color:Y}}>COMPLIANCE.</em>
            </h2>
            <p data-reveal data-delay="100" style={{fontSize:14,fontWeight:300,lineHeight:1.8,color:INK,marginBottom:48,fontFamily:F}}>
              Whether you're ready to get started, have questions about the platform, or want to explore enterprise options — we'd love to hear from you.
            </p>
            <div data-reveal data-delay="180" style={{display:'flex',flexDirection:'column',gap:28}}>
              {[{icon:Mail,label:'Email',value:'hello@briesa.com.au'},{icon:Phone,label:'Phone',value:'+61 2 0000 0000'},{icon:MapPin,label:'Location',value:'Sydney, NSW, Australia'}].map(({icon:Icon,label,value})=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:18}}>
                  <div style={{width:40,height:40,border:`1px solid #222`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={15} style={{color:Y}}/></div>
                  <div>
                    <p style={{fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:INK,marginBottom:3,fontFamily:F}}>{label}</p>
                    <p style={{fontSize:13,fontWeight:300,color:'rgba(255,255,255,.7)',fontFamily:F}}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal data-delay="120">
            {sent?(
              <div style={{padding:'52px 44px',border:`1px solid ${Y}30`,background:'rgba(255,217,64,.03)',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:16}}>
                <div style={{width:48,height:48,border:`1px solid ${Y}`,display:'flex',alignItems:'center',justifyContent:'center'}}><Send size={18} style={{color:Y}}/></div>
                <p style={{fontSize:14,fontWeight:700,color:'#fff',fontFamily:F}}>Message sent.</p>
                <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:INK,fontFamily:F}}>Thanks for reaching out — we'll get back to you within one business day.</p>
                <button onClick={()=>{setSent(false);setForm({name:'',email:'',company:'',subject:'',message:''})}} style={{marginTop:8,fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',background:'transparent',border:`1px solid #2a2a2a`,color:INK,padding:'10px 24px',cursor:'pointer',fontFamily:F,transition:'all .3s'}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=Y;el.style.color=Y}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='#2a2a2a';el.style.color=INK}}>Send another</button>
              </div>
            ):(
              <form onSubmit={e=>{e.preventDefault();setSent(true)}} style={{display:'flex',flexDirection:'column',gap:28}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
                  <div><label style={lStyle}>Full name</label><input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} placeholder="Jane Smith" style={iStyle('name')}/></div>
                  <div><label style={lStyle}>Email</label><input type="email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} placeholder="jane@company.com.au" style={iStyle('email')}/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
                  <div><label style={lStyle}>Company</label><input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} onFocus={()=>setFocused('company')} onBlur={()=>setFocused(null)} placeholder="Apex Civil Group" style={iStyle('company')}/></div>
                  <div><label style={lStyle}>Subject</label><input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} onFocus={()=>setFocused('subject')} onBlur={()=>setFocused(null)} placeholder="Demo request" style={iStyle('subject')}/></div>
                </div>
                <div><label style={lStyle}>Message</label><textarea required rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)} placeholder="Tell us about your business and what you're looking for..." style={{...iStyle('message'),resize:'none',borderBottom:'none',border:`1px solid ${focused==='message'?Y:'#2a2a2a'}`,padding:'14px 16px'}}/></div>
                <button type="submit" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'15px 0',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',background:Y,color:'#000',border:'none',cursor:'pointer',fontFamily:F,transition:'opacity .25s'}}
                  onMouseEnter={e=>((e.currentTarget as HTMLElement).style.opacity='.85')}
                  onMouseLeave={e=>((e.currentTarget as HTMLElement).style.opacity='1')}>
                  Send Message <ArrowRight size={13}/>
                </button>
              </form>
            )}
          </div>
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
  return <style>{`.split-grid{grid-template-columns:1fr 1fr!important}@media(max-width:900px){.split-grid{grid-template-columns:1fr!important;gap:48px!important}.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}@media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}}input::placeholder,textarea::placeholder{color:#2a2a2a}`}</style>
}

export default function AboutPage() {
  useReveal()
  return (
    <><GlobalStyles/>
    <div style={{minHeight:'100vh',background:'#000',fontFamily:F}}>
      <Nav/><main><Hero/><Story/><Values/><Contact/></main><Footer/>
    </div></>
  )
}
