const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const L=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},W=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let fav=L('fav',[]),hist=L('hist',[]),pls=L('pls',{}),queue=[],qi=0;const T={},A=new Audio();A.volume=.8;
[...fav,...hist,...Object.values(pls).flat()].forEach(t=>T[t.id]=t);
const IT='https://itunes.apple.com/',en=encodeURIComponent,esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BG=['photo-1511671782779-c97d3d27a1d4','photo-1470225620780-dba8ba36b745','photo-1493225457124-a3eb161ffa5f','photo-1514320291840-2e0a9bf2a9ae','photo-1501386761578-eac5c94b800a','photo-1459749411175-04bf5292ceea'].map(i=>`https://images.unsplash.com/${i}?w=1600&q=70`);
const GEN=[['Pop','#ec4899,#8b5cf6'],['Hip-Hop/Rap','#f59e0b,#ef4444'],['Rock','#ef4444,#7f1d1d'],['Electronic','#22d3ee,#6366f1'],['R&B/Soul','#a855f7,#ec4899'],['Dance','#10b981,#22d3ee'],['Latin','#f97316,#eab308'],['Country','#ca8a04,#78350f'],['Jazz','#3b82f6,#1e3a8a'],['Classical','#94a3b8,#334155'],['Reggae','#22c55e,#eab308'],['Alternative','#14b8a6,#6366f1'],['K-Pop','#f472b6,#60a5fa'],['Metal','#52525b,#18181b'],['Blues','#0ea5e9,#1e293b'],['Indie','#fb7185,#fbbf24']];
const ARTISTS=['Taylor Swift','The Weeknd','Drake','Billie Eilish','Dua Lipa','Eminem','Coldplay','Ed Sheeran','Rihanna','Bruno Mars','BTS','Imagine Dragons','Shakira','Adele','Queen','Michael Jackson'];
const get=async u=>{try{return(await(await fetch(u)).json()).results||[]}catch(e){return[]}};
const big=u=>(u||'').replace(/\d+x\d+bb/,'400x400bb');
const nt=r=>{const t={id:'t'+r.trackId,title:r.trackName,artist:r.artistName,album:r.collectionName,genre:r.primaryGenreName,art:big(r.artworkUrl100),prev:r.previewUrl,video:r.kind==='music-video',year:(r.releaseDate||'').slice(0,4),aid:r.artistId,cid:r.collectionId,link:r.trackViewUrl};T[t.id]=t;return t};
const songs=(q,n=24)=>get(`${IT}search?term=${en(q)}&entity=song&limit=${n}`).then(r=>r.filter(x=>x.previewUrl&&x.kind==='song').map(nt));
const vids=(q,n=18)=>get(`${IT}search?term=${en(q)}&entity=musicVideo&limit=${n}`).then(r=>r.filter(x=>x.previewUrl).map(nt));
const albs=(q,n=18)=>get(`${IT}search?term=${en(q)}&entity=album&limit=${n}`);
const arts=(q,n=12)=>get(`${IT}search?term=${en(q)}&entity=musicArtist&limit=${n}`);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.remove('on'),1800)};
const card=t=>`<div class="card rv" data-a="play" data-id="${t.id}"><div class="art" style="background-image:url(${t.art})"><button>${t.video?'🎬':'▶'}</button></div><b>${esc(t.title)}</b><span>${esc(t.artist)}</span><span>${esc(t.genre)} · ${t.year}</span><div class="row"><button data-a="fav" data-id="${t.id}">${fav.some(f=>f.id===t.id)?'♥':'♡'}</button><button data-a="pl" data-id="${t.id}">＋</button></div></div>`;
const albCard=a=>`<div class="card rv" data-a="album" data-id="${a.collectionId}"><div class="art" style="background-image:url(${big(a.artworkUrl100)})"></div><b>${esc(a.collectionName)}</b><span>${esc(a.artistName)}</span><span>${esc(a.primaryGenreName)} · ${(a.releaseDate||'').slice(0,4)}</span></div>`;
const artCard=a=>`<div class="card circ rv" data-a="artist" data-id="${a.artistId}"><div class="art">${esc((a.artistName||'?')[0])}</div><b>${esc(a.artistName)}</b><span>${esc(a.primaryGenreName||'Artist')}</span></div>`;
const grid=l=>l.length?`<div class="grid">${l.join('')}</div>`:'<div class="empty">Hech narsa topilmadi 🎧</div>';
const sec=(h,b,s='')=>`<section><h2 class="rv">${h}<small>${s}</small></h2>${b}</section>`;
const head=(t,s)=>`<div class="hero" style="padding:40px 0 10px"><h1 class="rv" style="font-size:clamp(2rem,5vw,3.6rem)">${t}</h1><p class="rv">${s}</p></div>`;
const form=q=>`<form class="sf glass" id="sf"><input id="q" value="${esc(q)}" placeholder="Qo'shiq yoki ijrochi nomi..." autofocus><button class="btn">Qidirish</button></form>`;
const chips=l=>`<div class="chips">${l.map(x=>`<a class="chip" href="#/search/${en(x)}">${x}</a>`).join('')}</div>`;
const trending=async()=>{const f=await get('https://rss.applemarketingtools.com/api/v2/us/music/most-played/24/songs.json').catch(()=>[]);let ids=[];try{const j=await(await fetch('https://rss.applemarketingtools.com/api/v2/us/music/most-played/24/songs.json')).json();ids=j.feed.results.map(x=>x.id)}catch(e){}
if(ids.length){const r=await get(IT+'lookup?id='+ids.join(',')).then(r=>r.filter(x=>x.previewUrl).map(nt));if(r.length)return r}return songs('top hits 2026')};
const R={
async home(){const tr=(await trending()).slice(0,8);return`<div class="hero"><h1 class="rv">Musiqani <em>top</em>,<br>his qil.</h1><p class="rv">Millionlab qo'shiq, klip, albom va ijrochilar — bitta qidiruvda.</p>${form('')}<div style="margin-top:22px">${chips(['Taylor Swift','The Weeknd','Eminem','Dua Lipa','Rihanna'])}</div></div>`+sec('🔥 Trendda',grid(tr.map(card)))+sec('Janrlar',`<div class="chips">${GEN.map(g=>`<a class="chip" href="#/genre/${en(g[0])}">${g[0]}</a>`).join('')}</div>`)},
async search(q){if(!q)return head('Qidiruv','Qo\'shiq yoki ijrochi nomini yozing')+form('')+sec('Mashhur qidiruvlar',chips(ARTISTS));
const[s,v,a,r]=await Promise.all([songs(q),vids(q,12),albs(q,12),arts(q,8)]);return head(`"${esc(q)}"`,'Qidiruv natijalari')+form(q)+sec('Qo\'shiqlar',grid(s.map(card)),s.length)+sec('Klip videolar',grid(v.map(card)),v.length)+sec('Albomlar',grid(a.map(albCard)),a.length)+sec('Ijrochilar',grid(r.map(artCard)),r.length)},
async trending(){return head('Trending','Hozir eng ko\'p tinglanayotgan qo\'shiqlar')+grid((await trending()).map(card))},
async genres(){return head('Janrlar','O\'zingizga yoqqan janrni tanlang')+`<div class="grid">${GEN.map(g=>`<div class="gen rv" data-a="genre" data-id="${en(g[0])}" style="background:linear-gradient(135deg,${g[1]})">${g[0]}</div>`).join('')}</div>`},
async genre(n){n=decodeURIComponent(n);const[s,v]=await Promise.all([songs(n+' music',30),vids(n,12)]);return head(n,'Janr bo\'yicha tanlov')+sec('Qo\'shiqlar',grid(s.map(card)))+sec('Klip videolar',grid(v.map(card)))},
async artists(){const r=await Promise.all(ARTISTS.slice(0,12).map(a=>arts(a,1)));return head('Ijrochilar','Mashhur artistlar')+form('')+sec('Mashhur ijrochilar',grid(r.flat().map(artCard)))},
async artist(id){const[a,al]=await Promise.all([get(`${IT}lookup?id=${id}&entity=song&limit=24`),get(`${IT}lookup?id=${id}&entity=album&limit=12`)]);const s=a.filter(x=>x.previewUrl&&x.kind==='song').map(nt),n=a[0]?.artistName||'Artist';return head(esc(n),esc(a[0]?.primaryGenreName||''))+sec('Top qo\'shiqlar',grid(s.map(card)))+sec('Albomlar',grid(al.filter(x=>x.collectionType==='Album').map(albCard)))+sec('Klip videolar',grid((await vids(n,8)).map(card)))},
async albums(){const r=await albs('new album 2026',24);return head('Albomlar','Yangi va mashhur albomlar')+form('')+grid(r.map(albCard))},
async album(id){const r=await get(`${IT}lookup?id=${id}&entity=song`),c=r[0]||{},s=r.slice(1).filter(x=>x.previewUrl).map(nt);return`<div class="det glass rv vis"><img src="${big(c.artworkUrl100)}"><div><h1>${esc(c.collectionName)}</h1><p style="opacity:.7;margin:8px 0"><a href="#/artist/${c.artistId}">${esc(c.artistName)}</a> · ${esc(c.primaryGenreName)} · ${(c.releaseDate||'').slice(0,4)} · ${c.trackCount||s.length} track</p><button class="btn" data-a="playall">▶ Barchasini ijro etish</button></div></div>`+grid(s.map(card))},
async playlists(){const k=Object.keys(pls);return head('Playlistlar','O\'z to\'plamlaringiz')+`<button class="btn" data-a="pnew">＋ Yangi playlist</button>`+(k.length?k.map(n=>sec(`${esc(n)} <button class="btn" style="padding:5px 14px;font-size:.8rem" data-a="pdel" data-id="${esc(n)}">O'chirish</button>`,grid(pls[n].map(card)),pls[n].length)).join(''):'<div class="empty">Playlist yo\'q. Qo\'shiq kartasidagi ＋ tugmasini bosing.</div>')},
async favorites(){return head('Sevimlilar','♥ bosilgan qo\'shiqlar')+grid(fav.map(card))},
async history(){return head('Tarix','Oxirgi tinglanganlar')+(hist.length?`<button class="btn" data-a="hclr">Tarixni tozalash</button><br><br>`:'')+grid(hist.map(card))},
async videos(){const r=await Promise.all(['top hits','pop','hip hop','rock'].map(q=>vids(q,12)));const u=[...new Map(r.flat().map(x=>[x.id,x])).values()];return head('Music Videos','Eng yaxshi klip videolar')+form('')+grid(u.map(card))},
async about(){return head('Haqida','Music Finder nima?')+`<div class="glass det rv vis"><div><p style="max-width:720px;line-height:1.7;opacity:.85">Music Finder — iTunes Search API orqali real vaqtda musiqa qidiradigan sayt. Qo'shiqlarning 30 soniyalik audio namunasi, klip videolari, albom, ijrochi va janr ma'lumotlarini ko'rsatadi. Sevimlilar, tarix va playlistlar brauzeringizda (localStorage) saqlanadi.</p><br><div class="chips"><span class="chip">🔎 Real qidiruv</span><span class="chip">🎬 Klip</span><span class="chip">💿 Albom</span><span class="chip">♥ Sevimlilar</span><span class="chip">📱 Responsive</span></div></div></div>`}};
let bgi=0;async function route(){const[,p='home',...r]=location.hash.slice(1).split('/');const arg=r.join('/');const name=R[p]?p:'home';
$$('#links a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+name||a.getAttribute('href').startsWith('#/'+name+'/')));$('#links').classList.remove('open');
const app=$('#app');app.style.animation='none';app.innerHTML='<div class="empty">⏳ Yuklanmoqda...</div>';
bgi=(Object.keys(R).indexOf(name)+(arg?1:0))%BG.length;$('#bg').style.backgroundImage=`url(${BG[bgi]})`;
try{app.innerHTML=await R[name](arg)}catch(e){app.innerHTML='<div class="empty">Xatolik. Internetni tekshiring.</div>'}
app.offsetHeight;app.style.animation='';scrollTo(0,0);bind()}
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(x.target.classList.add('vis'),io.unobserve(x.target))),{threshold:.08});
function bind(){$$('.rv:not(.vis)').forEach((e,i)=>{e.style.transitionDelay=(i%6)*60+'ms';io.observe(e)});
const f=$('#sf');if(f)f.onsubmit=e=>{e.preventDefault();location.hash='#/search/'+en($('#q').value.trim())}}
const KEY=(window.CFG&&CFG.YT_KEY)||'',ytc=L('ytc',{});let yp=null,mode='a',ytimer,warned=0;
const loadYT=()=>new Promise(r=>{if(window.YT&&YT.Player)return r();window.onYouTubeIframeAPIReady=r;const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)});
async function vid(t){const k=t.id+(t.video?'v':'a');if(ytc[k])return ytc[k];if(!KEY)return null;
const q=`${t.artist} ${t.title} ${t.video?'official music video':'official audio'}`;
try{const j=await(await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${en(q)}&key=${KEY}`)).json();
if(j.error){toast('YouTube: '+j.error.message.slice(0,70));return null}const id=j.items&&j.items[0]&&j.items[0].id.videoId;if(id){ytc[k]=id;W('ytc',ytc)}return id||null}catch(e){return null}}
const noKey=()=>{if(!warned++)toast(KEY?'To\'liq versiya topilmadi — 30s namuna':'config.js ga YouTube kalitini qo\'ying — hozir 30s namuna')};
async function play(id,list){const t=T[id];if(!t)return;addH(t);const v=await vid(t);
if(t.video){A.pause();yp&&yp.pauseVideo&&yp.pauseVideo();$('#mt').textContent=t.title+' — '+t.artist;$('#modal').classList.remove('hide');
if(v){await loadYT();$('#ymw').innerHTML='<div id="ymv"></div>';new YT.Player('ymv',{videoId:v,width:'100%',height:'420',playerVars:{autoplay:1,playsinline:1},events:{onReady:e=>e.target.playVideo()}})}
else{$('#ymw').innerHTML=`<video src="${t.prev}" controls autoplay playsinline style="width:100%;border-radius:14px"></video>`;noKey()}return}
queue=list||[id];qi=Math.max(0,queue.indexOf(id));
$('#player').classList.remove('hide');$('#pa').style.backgroundImage=`url(${t.art})`;$('#pt').textContent=t.title;$('#pr').textContent=t.artist+' · '+t.album;
if(v){mode='y';A.pause();$('#yw').style.display='block';$('#pa').style.display='none';await loadYT();
if(yp&&yp.loadVideoById)yp.loadVideoById(v);else yp=new YT.Player('ypl',{videoId:v,width:128,height:72,playerVars:{autoplay:1,playsinline:1},events:{onReady:e=>{e.target.setVolume($('#vol').value*100);e.target.playVideo()},onStateChange:e=>{if(e.data===0)step(1);const p=e.data===1;$('#player').classList.toggle('play',p);$('#pp').textContent=p?'⏸':'▶'}}});
clearInterval(ytimer);ytimer=setInterval(()=>{if(yp&&yp.getDuration&&mode==='y'){const d=yp.getDuration();$('#seek').value=d?yp.getCurrentTime()/d*100:0}},500)}
else{mode='a';yp&&yp.pauseVideo&&yp.pauseVideo();$('#yw').style.display='none';$('#pa').style.display='block';A.src=t.prev;A.play();noKey()}}
const addH=t=>{hist=[t,...hist.filter(h=>h.id!==t.id)].slice(0,50);W('hist',hist)};
const step=d=>{if(queue.length)play(queue[(qi+d+queue.length)%queue.length],queue)};
A.onplay=()=>{$('#player').classList.add('play');$('#pp').textContent='⏸'};A.onpause=()=>{$('#player').classList.remove('play');$('#pp').textContent='▶'};
A.ontimeupdate=()=>$('#seek').value=A.duration?A.currentTime/A.duration*100:0;A.onended=()=>step(1);
$('#pp').onclick=()=>mode==='y'?(yp.getPlayerState()===1?yp.pauseVideo():yp.playVideo()):(A.paused?A.play():A.pause());$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);
$('#seek').oninput=e=>{const p=e.target.value/100;if(mode==='y'&&yp)yp.seekTo(yp.getDuration()*p,true);else A.duration&&(A.currentTime=p*A.duration)};$('#vol').oninput=e=>{A.volume=e.target.value;yp&&yp.setVolume&&yp.setVolume(e.target.value*100)};
$('#mx').onclick=()=>{$('#ymw').innerHTML='';$('#modal').classList.add('hide')};$('#modal').onclick=e=>e.target.id==='modal'&&$('#mx').click();
$('#burger').onclick=()=>$('#links').classList.toggle('open');
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el)return;e.stopPropagation();const a=el.dataset.a,id=el.dataset.id;
if(a==='play'){play(id,$$('.card[data-a=play]',el.closest('section')||document).map(c=>c.dataset.id))}
else if(a==='fav'){const t=T[id],i=fav.findIndex(f=>f.id===id);i<0?fav.unshift(t):fav.splice(i,1);W('fav',fav);el.textContent=i<0?'♥':'♡';toast(i<0?'Sevimlilarga qo\'shildi ♥':'Sevimlilardan olindi');if(location.hash==='#/favorites')route()}
else if(a==='pl'){const k=Object.keys(pls);const n=prompt('Playlist nomi'+(k.length?' (mavjud: '+k.join(', ')+')':'')+':');if(!n)return;(pls[n]=pls[n]||[]);if(!pls[n].some(x=>x.id===id))pls[n].push(T[id]);W('pls',pls);toast('"'+n+'" playlistga qo\'shildi')}
else if(a==='pnew'){const n=prompt('Yangi playlist nomi:');if(n){pls[n]=pls[n]||[];W('pls',pls);route()}}
else if(a==='pdel'){if(confirm('O\'chirilsinmi?')){delete pls[id];W('pls',pls);route()}}
else if(a==='hclr'){hist=[];W('hist',hist);route()}
else if(a==='playall'){const c=$$('.card[data-a=play]');c[0]&&play(c[0].dataset.id,c.map(x=>x.dataset.id))}
else location.hash=`#/${a}/${id}`});
addEventListener('hashchange',route);addEventListener('keydown',e=>e.code==='Space'&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&A.src&&(e.preventDefault(),$('#pp').click()));route();
