const $=s=>document.querySelector(s),V=$('#view'),B=window.KJV,P=window.PLAN;
const S=Object.assign({book:42,ch:1,rate:1,dark:false,large:false,start:null,done:{},days:[],read:{}},JSON.parse(localStorage.getItem('dw')||'{}'));
const save=()=>localStorage.setItem('dw',JSON.stringify(S));
const today=()=>new Date().toLocaleDateString('en-CA');
if(!S.start){S.start=today();save()}
if(!S.read||typeof S.read!=='object')S.read={};if(!Array.isArray(S.notes))S.notes=[];let selV=null;
const hasNote=(bk,ch,v)=>S.notes.some(n=>n.bk==bk&&n.ch==ch&&(v===undefined||n.v==v));
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const refT=(bk,ch,v)=>B[bk].n+' '+ch+(v?':'+v:'');
const key=(bk,ch)=>bk+':'+ch,isRead=(bk,ch)=>!!S.read[key(bk,ch)];
function markRead(bk,ch,listened){const k=key(bk,ch),o=S.read[k]||{};S.read[k]={d:today(),l:!!(o.l||listened)};markToday();save();updMark()}
function unmark(bk,ch){delete S.read[key(bk,ch)];save();updMark()}
function cnt(a,z){let n=0,t=0;for(let i=a;i<z;i++){t+=B[i].c.length;for(let c=1;c<=B[i].c.length;c++)if(isRead(i,c))n++}return [n,t]}
const pct=([n,t])=>Math.round(n/t*1000)/10;
const bar=(n,t)=>`<div class="bar"><i style="width:${t?n/t*100:0}%"></i></div>`;
function updMark(){const m=$('#markBtn');if(m&&Q){const r=isRead(Q.bk,Q.ch),o=S.read[key(Q.bk,Q.ch)];m.textContent=r?('✓ Read'+(o.l?' · listened':'')+' (tap to undo)'):'Mark chapter read';m.classList.toggle('alt',!r)}}
window.toggleRead=()=>{if(!Q)return;isRead(Q.bk,Q.ch)?unmark(Q.bk,Q.ch):markRead(Q.bk,Q.ch,false)};
let scrollMarked=false;addEventListener('scroll',()=>{if(location.hash.startsWith('#read')&&Q&&!scrollMarked&&innerHeight+scrollY>=document.body.scrollHeight-40){scrollMarked=true;if(!isRead(Q.bk,Q.ch))markRead(Q.bk,Q.ch,false)}},{passive:true});
const bi=n=>B.findIndex(b=>b.n===n);
function applyPrefs(){document.body.classList.toggle('dark',S.dark);document.body.classList.toggle('large',S.large)}
function markToday(){const t=today();if(!S.days.includes(t)){S.days.push(t);save()}}
function streak(){let n=0,d=new Date();const set=new Set(S.days);if(!set.has(today()))d.setDate(d.getDate()-1);
 while(set.has(d.toLocaleDateString('en-CA'))){n++;d.setDate(d.getDate()-1)}return n}
function planDay(){return (Math.floor((new Date(today())-new Date(S.start))/864e5)%P.length)+1}
const bhC=b=>`https://biblehub.com/${b.bh}/`, ew=(b,c)=>`https://enduringword.com/bible-commentary/${b.ew}-${c}/`;
const blbV=(b,c,v)=>`https://www.blueletterbible.org/kjv/${b.blb}/${c}/${v}/`, bhV=(b,c,v)=>`https://biblehub.com/${b.bh}/${c}-${v}.htm`, bhCm=(b,c,v)=>`https://biblehub.com/commentaries/${b.bh}/${c}-${v}.htm`;
const A=(h,t)=>`<a href="${h}" target="_blank" rel="noopener">${t} ↗</a>`;
function go(h){location.hash=h}
function route(){stop();selV=null;$('#fab').classList.toggle('hidden',!/^#(read|study)/.test(location.hash));const [r,a,b]=location.hash.slice(1).split('/');window.scrollTo(0,0);
 if(r==='read')read(+a,+b);else if(r==='study')study(+a);else if(r==='books')books(a);else if(r==='history')history();else if(r==='notes')notesPage();else if(r==='search')search(decodeURIComponent(a||''));else home()}
function home(){$('#title').textContent='Daily Word';const d=planDay(),p=P[d-1],b=B[S.book];
 V.innerHTML=`<form class="card" onsubmit="event.preventDefault();go('search/'+encodeURIComponent(this.q.value))"><div class="k">Search a topic or word</div><div class="row"><input name="q" class="inp" placeholder="e.g. forgiveness, anxiety, hope"><button class="btn">Search</button></div></form><div class="card"><div class="k">Today · Day ${d} of ${P.length}</div><h2>${p[0]}</h2><p>${p[1]} ${p[2]}:${p[3]}-${p[4]}</p><button class="btn" onclick="go('study/${d}')">Start today's study</button></div>
 <div class="card row"><div class="stat"><b>${streak()}</b><span class="k">day streak</span></div><div class="stat"><b>${Object.keys(S.done).length}</b><span class="k">studies done</span></div></div>
 <div class="card"><div class="k">Continue reading</div><h2>${b.n} ${S.ch}</h2><button class="btn" onclick="go('read/${S.book}/${S.ch}')">Open</button><button class="btn alt" onclick="go('books')">Choose a book</button></div>
 <div class="card"><div class="k">Bible progress</div>${(()=>{const a=cnt(0,66),o=cnt(0,39),n=cnt(39,66);return `<h2>${pct(a)}% <small class="k">${a[0]}/${a[1]} chapters</small></h2>${bar(...a)}<p class="k">Old Testament ${pct(o)}% (${o[0]}/${o[1]})</p>${bar(...o)}<p class="k">New Testament ${pct(n)}% (${n[0]}/${n[1]})</p>${bar(...n)}`})()}<button class="btn alt" onclick="go('history')">History</button><button class="btn alt" onclick="go('notes')">📝 My Notes (${S.notes.length})</button></div>
 <div class="card"><div class="k">30-day plan</div><div class="days">${P.map((x,i)=>`<button class="${S.done[i+1]?'done':''} ${i+1===d?'today':''}" onclick="go('study/${i+1}')">${i+1}</button>`).join('')}</div></div>`}
function books(sel){$('#title').textContent='Books';if(sel!==undefined&&sel!==''){const b=B[+sel];
 V.innerHTML=`<div class="card"><h2>${b.n}</h2>${(()=>{const [n,t]=cnt(+sel,+sel+1);return `<p class="k">${n}/${t} chapters read</p>${bar(n,t)}`})()}<div class="grid">${b.c.map((_,i)=>{const o=S.read[key(+sel,i+1)];return `<button class="${o?'rd':''}" onclick="go('read/${sel}/${i+1}')">${o?(o.l?'🎧':'✓')+' ':''}${i+1}${hasNote(+sel,i+1)?'📝':''}</button>`}).join('')}</div></div>`;return}
 const sec=(t,a,z)=>`<div class="card"><div class="k">${t}</div><div class="links">${B.slice(a,z).map((b,i)=>{const [n,t]=cnt(a+i,a+i+1);return `<a href="#books/${a+i}"><span class="bk"><span>${n===t?'✓ ':''}${b.n}</span><span class="k">${n}/${t}</span></span>${bar(n,t)}</a>`}).join('')}</div></div>`;
 V.innerHTML=sec('Old Testament',0,39)+sec('New Testament',39,66)}
function read(bk,ch){const b=B[bk];if(!b||!b.c[ch-1])return go('');S.book=bk;S.ch=ch;save();markToday();$('#title').textContent=`${b.n} ${ch}${hasNote(bk,ch)?' 📝':''}`;
 const prev=ch>1?[bk,ch-1]:bk>0?[bk-1,B[bk-1].c.length]:null,next=ch<b.c.length?[bk,ch+1]:bk<65?[bk+1,1]:null;
 V.innerHTML=`<div class="nav"><button class="btn alt" ${prev?`onclick="go('read/${prev}'.replace(',','/'))"`:'disabled'}>‹ Prev</button>
 <select onchange="go('read/'+this.value+'/1')">${B.map((x,i)=>`<option value="${i}" ${i===bk?'selected':''}>${x.n}</option>`).join('')}</select>
 <button class="btn alt" ${next?`onclick="go('read/${next}'.replace(',','/'))"`:'disabled'}>Next ›</button></div>
 <div class="card">${b.c[ch-1].map((t,i)=>`<span class="verse" id="v${i+1}" onclick="verse(${bk},${ch},${i+1})"><sup>${i+1}${hasNote(bk,ch,i+1)?'📝':''}</sup>${t}</span> `).join('')}</div>
 <button id="markBtn" class="btn" style="width:100%;margin-bottom:14px" onclick="toggleRead()"></button><div class="card"><div class="k">Study this chapter</div><div class="links">${A(blbV(b,ch,1).replace(/1\/$/,''),'Blue Letter Bible – '+b.n+' '+ch+' (Hebrew/Greek tools)')}
 ${A(`https://biblehub.com/${b.bh}/${ch}-1.htm`,'Bible Hub – parallel versions & cross-refs')}${A(bhCm(b,ch,1),'Bible Hub – commentaries')}${A(ew(b,ch),'Enduring Word – '+b.n+' '+ch+' commentary')}</div></div>`;
 $('#player').classList.remove('hidden');Q={bk,ch,i:0};scrollMarked=false;updMark();const jv=+location.hash.split('/')[3];if(jv){const e=$('#v'+jv);if(e){e.classList.add('on');setTimeout(()=>e.scrollIntoView({block:'center'}),50);setTimeout(()=>e.classList.remove('on'),2500)}}}
function history(){$('#title').textContent='History';const h=Object.entries(S.read).sort((a,b)=>b[1].d.localeCompare(a[1].d)).slice(0,50);
 V.innerHTML=`<div class="card"><div class="k">Recently read</div><div class="links">${h.length?h.map(([k,o])=>{const [bk,ch]=k.split(':');return `<a href="#read/${bk}/${ch}"><span class="bk"><span>${o.l?'🎧':'✓'} ${B[bk].n} ${ch}</span><span class="k">${o.d}</span></span></a>`}).join(''):'<p>No chapters yet.</p>'}</div></div>`}
window.verse=(bk,ch,v)=>{const b=B[bk];selV=v;$('#sheetBox').innerHTML=`<div class="k">${b.n} ${ch}:${v}</div><p>${b.c[ch-1][v-1]}</p><div class="links">
 ${A(blbV(b,ch,v),'Blue Letter Bible – interlinear & Strong\'s')}${A(bhV(b,ch,v),'Bible Hub – this verse in all versions')}${A(bhCm(b,ch,v),'Bible Hub – commentaries on this verse')}
 ${A(ew(b,ch),'Enduring Word – chapter commentary')}</div><button class="btn" onclick="noteSheet()">📝 Add note</button><button class="btn" onclick="playFrom(${v})">🔊 Read from here</button><button class="btn alt" onclick="closeSheet()">Close</button>`;$('#sheet').classList.remove('hidden')};
window.closeSheet=()=>$('#sheet').classList.add('hidden');$('#sheet').onclick=e=>{if(e.target.id==='sheet')closeSheet()};
function study(d){const p=P[d-1];if(!p)return go('');const bk=bi(p[1]),b=B[bk];$('#title').textContent='Day '+d;
 V.innerHTML=`<div class="card"><div class="k">Day ${d} · ${p[1]} ${p[2]}:${p[3]}-${p[4]}</div><h2>${p[0]}</h2><div class="passage">${b.c[p[2]-1].slice(p[3]-1,p[4]).map((t,i)=>`<span class="verse" id="v${p[3]+i}"><sup>${p[3]+i}</sup>${t}</span> `).join('')}</div>
 <button class="btn alt" onclick="go('read/${bk}/${p[2]}')">Read full chapter</button></div>
 <div class="card"><h3>Reflection</h3><p>${p[5]}</p><h3>Questions</h3><ol>${p[6].map(q=>`<li>${q}</li>`).join('')}</ol><h3>Prayer</h3><p><i>${p[7]}</i></p></div>
 <div class="card"><div class="k">Go deeper</div><div class="links">${A(bhCm(b,p[2],p[3]),'Bible Hub commentaries')}${A(ew(b,p[2]),'Enduring Word commentary')}${A(blbV(b,p[2],p[3]),'Blue Letter Bible word study')}</div></div>
 <button class="btn" style="width:100%" onclick="finish(${d})">${S.done[d]?'✓ Completed':'Mark complete'}</button>`;
 $('#player').classList.remove('hidden');Q={bk,ch:p[2],i:p[3]-1,end:p[4]}}
window.noteSheet=(id)=>{const n=id?S.notes.find(x=>x.id==id):null;const bk=n?n.bk:Q.bk,ch=n?n.ch:Q.ch,v=n?n.v:selV;
 $('#sheetBox').innerHTML=`<div class="k">Note · ${refT(bk,ch,v)}</div><textarea id="noteT" class="inp" rows="7" placeholder="What is God showing you here?">${n?esc(n.t):''}</textarea>
 <button class="btn" onclick="saveNote(${id||0},${bk},${ch},${v||0})">Save note</button>${n?`<button class="btn alt" onclick="delNote(${id})">Delete</button>`:''}<button class="btn alt" onclick="closeSheet()">Cancel</button>`;$('#sheet').classList.remove('hidden');setTimeout(()=>$('#noteT').focus(),50)};
window.saveNote=(id,bk,ch,v)=>{const t=$('#noteT').value.trim();if(!t)return closeSheet();const now=new Date().toISOString();
 if(id){const n=S.notes.find(x=>x.id==id);n.t=t;n.u=now}else S.notes.push({id:Date.now(),bk,ch,v:v||null,t,d:now});save();closeSheet();if(location.hash==='#notes')notesPage();else refreshNoteIcons()};
window.delNote=id=>{if(!confirm('Delete this note?'))return;S.notes=S.notes.filter(x=>x.id!=id);save();closeSheet();if(location.hash==='#notes')notesPage();else refreshNoteIcons()};
function refreshNoteIcons(){if(!/^#read/.test(location.hash)||!Q)return;document.querySelectorAll('.verse').forEach((e,i)=>{e.querySelector('sup').textContent=(i+1)+(hasNote(Q.bk,Q.ch,i+1)?'📝':'')});$('#title').textContent=refT(Q.bk,Q.ch)+(hasNote(Q.bk,Q.ch)?' 📝':'')}
function notesPage(){$('#title').textContent='My Notes';const L=[...S.notes].sort((a,b)=>b.d.localeCompare(a.d));
 V.innerHTML=L.length?L.map(n=>`<div class="card"><div class="k">${refT(n.bk,n.ch,n.v)} · ${new Date(n.d).toLocaleDateString()}</div><p>${esc(n.t).replace(/\n/g,'<br>')}</p>
 <button class="btn" onclick="go('read/${n.bk}/${n.ch}${n.v?'/'+n.v:''}')">Open</button><button class="btn alt" onclick="noteSheet(${n.id})">Edit</button><button class="btn alt" onclick="delNote(${n.id})">Delete</button></div>`).join(''):'<div class="card"><p>No notes yet. Tap 📝 Note while reading.</p></div>'}
function search(q){$('#title').textContent='Search';const ql=q.toLowerCase().trim(),T=window.TOPICS||[];
 const tm=ql?T.filter(t=>t.t.toLowerCase().includes(ql)||t.s.some(s=>s.includes(ql)||ql.includes(s))):[];
 const prev=([bk,ch,v])=>`<a href="#read/${bk}/${ch}/${v}"><b>${refT(bk,ch,v)}</b><br><span class="pv">${B[bk].c[ch-1][v-1]}</span></a>`;
 let kw=[];if(ql.length>2){const re=new RegExp('\\b'+ql.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');outer:for(let b=0;b<66;b++)for(let c=0;c<B[b].c.length;c++)for(let v=0;v<B[b].c[c].length;v++)if(re.test(B[b].c[c][v])){kw.push([b,c+1,v+1]);if(kw.length>=50)break outer}}
 V.innerHTML=`<form class="card" onsubmit="event.preventDefault();go('search/'+encodeURIComponent(this.q.value))"><div class="row"><input name="q" class="inp" value="${esc(q)}"><button class="btn">Search</button></div></form>
 ${tm.map(t=>`<div class="card"><div class="k">Topic</div><h2>${t.t}</h2><div class="k">Key chapters</div><div class="row">${t.c.map(([bk,ch])=>`<button class="btn alt" onclick="go('read/${bk}/${ch}')">${refT(bk,ch)}</button>`).join('')}</div><div class="links">${t.v.map(prev).join('')}</div></div>`).join('')}
 <div class="card"><div class="k">Verses containing “${esc(q)}” (${kw.length}${kw.length>=50?'+':''})</div><div class="links">${kw.map(prev).join('')||'<p>No word matches.</p>'}</div></div>`}
window.finish=d=>{S.done[d]=today();markToday();save();home()};
// Read-aloud
let Q=null,playing=false;const syn=speechSynthesis;
let gen=0;const enV=()=>syn.getVoices().filter(v=>/^en/i.test(v.lang));
function pickVoice(){const vs=enV();return vs.find(v=>v.voiceURI===S.voice)||vs.find(v=>/natural|samantha|premium|enhanced/i.test(v.name))||vs[0]}
const LN={'en-US':'US','en-GB':'UK','en-AU':'Australia','en-IE':'Ireland','en-IN':'India','en-ZA':'South Africa','en-CA':'Canada','en-NZ':'New Zealand'};
function friendly(v){let n=v.name.replace(/^(Microsoft|Google|Apple)\s+/i,'').replace(/\s*Online\s*\(Natural\)/i,' (Natural)').replace(/\s*-\s*English.*$/i,'').replace(/English\s*\(.*?\)/i,'').trim()||v.name;return n+' · '+(LN[v.lang.replace('_','-')]||v.lang)}
function voiceOpts(){const vs=enV(),cur=pickVoice();if(!vs.length)return '<option value="">Default voice (loading…)</option>';
 const g={};vs.forEach(v=>{const k=(v.name.match(/^(Microsoft|Google|Apple)/i)||['Device'])[0];(g[k]=g[k]||[]).push(v)});
 return Object.keys(g).sort().map(k=>`<optgroup label="${k} voices">${g[k].sort((a,b)=>friendly(a).localeCompare(friendly(b))).map(v=>`<option value="${esc(v.voiceURI)}" ${cur&&v.voiceURI===cur.voiceURI?'selected':''}>${esc(friendly(v))}</option>`).join('')}</optgroup>`).join('')}
function fillVoices(){document.querySelectorAll('select.voiceSel').forEach(e=>e.innerHTML=voiceOpts())}
syn.addEventListener?syn.addEventListener('voiceschanged',fillVoices):syn.onvoiceschanged=fillVoices;
const clamp=r=>Math.round(Math.min(1.5,Math.max(0.6,r))*100)/100;
function syncRate(){document.querySelectorAll('.rateLbl').forEach(e=>e.textContent=S.rate.toFixed(2)+'x');document.querySelectorAll('.rateRng').forEach(e=>e.value=S.rate)}
function restart(){if(playing){gen++;syn.cancel();setTimeout(speak,60)}}
window.setRate=r=>{S.rate=clamp(r);save();syncRate();restart()};
window.setVoice=uri=>{S.voice=uri;save();fillVoices();restart()};
const vsHTML=()=>`<div class="k">Voice</div><select class="voiceSel inp" onchange="setVoice(this.value)">${voiceOpts()}</select>
 <div class="k">Reading speed</div><div class="speed"><button class="sbtn" onclick="setRate(S.rate-0.05)">−</button><b class="rateLbl">${S.rate.toFixed(2)}x</b><button class="sbtn" onclick="setRate(S.rate+0.05)">+</button></div>
 <input type="range" class="rateRng" min="0.6" max="1.5" step="0.05" value="${S.rate}" oninput="setRate(+this.value)"><div class="speed k"><span>0.60x slower</span><button class="btn alt" onclick="setRate(1)">Reset 1.00x</button><span>1.50x faster</span></div>`;
window.voiceSheet=()=>{$('#sheetBox').innerHTML=`<h3>Voice &amp; speed</h3>${vsHTML()}<button class="btn" onclick="closeSheet()">Done</button>`;$('#sheet').classList.remove('hidden')};
function speak(){if(!Q||!playing)return;const b=B[Q.bk],vs=b.c[Q.ch-1];
 if(Q.i>=(Q.end||vs.length)){if(Q.end){stop();return}markRead(Q.bk,Q.ch,true);const n=Q.ch<b.c.length?[Q.bk,Q.ch+1]:Q.bk<65?[Q.bk+1,1]:null;if(!n)return stop();
  location.hash=`read/${n[0]}/${n[1]}`;setTimeout(()=>{playing=true;setBtn();speak()},300);return}
 document.querySelectorAll('.verse.on').forEach(e=>e.classList.remove('on'));const el=$('#v'+(Q.i+1));if(el){el.classList.add('on');el.scrollIntoView({block:'center',behavior:'smooth'})}
 const u=new SpeechSynthesisUtterance((Q.i===0&&!Q.end?`${b.n} chapter ${Q.ch}. `:'')+vs[Q.i]);u.rate=S.rate;const v=pickVoice();if(v)u.voice=v;
 const g0=gen;u.onend=()=>{if(playing&&g0===gen){Q.i++;speak()}};syn.speak(u)}
function setBtn(){$('#pPlay').textContent=playing?'⏸':'▶'}
function stop(){playing=false;syn.cancel();setBtn();$('#player').classList.add('hidden')}
$('#pPlay').onclick=()=>{if(playing){playing=false;gen++;syn.cancel()}else{playing=true;speak()}setBtn()};
$('#pNext').onclick=()=>{if(!Q)return;gen++;syn.cancel();Q.i++;if(playing)setTimeout(speak,50)};
$('#pPrev').onclick=()=>{if(!Q)return;gen++;syn.cancel();Q.i=Math.max(0,Q.i-1);if(playing)setTimeout(speak,50)};
S.rate=clamp(+S.rate||1);syncRate();$('#pMinus').onclick=()=>setRate(S.rate-0.05);$('#pPlus').onclick=()=>setRate(S.rate+0.05);$('#pRateBtn').onclick=voiceSheet;$('#pVoice').onclick=voiceSheet;
window.playFrom=v=>{closeSheet();gen++;syn.cancel();Q.i=v-1;playing=true;setBtn();speak()};
$('#homeBtn').onclick=()=>go('');$('#fab').onclick=()=>{selV=null;noteSheet()};
$('#setBtn').onclick=()=>{$('#sheetBox').innerHTML=`<h3>Settings</h3><label class="toggle">Large text<input type="checkbox" ${S.large?'checked':''} onchange="S.large=this.checked;save();applyPrefs()"></label>
 <label class="toggle">Dark mode<input type="checkbox" ${S.dark?'checked':''} onchange="S.dark=this.checked;save();applyPrefs()"></label><h3>Read-aloud</h3>${vsHTML()}<p class="k">Text: King James Version (public domain). Study links open external sites.</p><button class="btn" onclick="closeSheet()">Done</button>`;$('#sheet').classList.remove('hidden')};
window.S=S;window.save=save;window.applyPrefs=applyPrefs;window.go=go;
addEventListener('hashchange',route);applyPrefs();route();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
