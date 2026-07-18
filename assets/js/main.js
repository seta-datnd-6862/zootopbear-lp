/* ---------- i18n ---------- */
function setLang(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(function(el){
    el.innerHTML = el.getAttribute('data-' + lang);
  });
  document.getElementById('btn-vi').classList.toggle('active', lang==='vi');
  document.getElementById('btn-en').classList.toggle('active', lang==='en');
  try{ localStorage.setItem('zootop-lang', lang); }catch(e){}
}
try{ if(localStorage.getItem('zootop-lang')==='en') setLang('en'); }catch(e){}

/* ---------- Theme toggle ---------- */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  var b = document.getElementById('themeBtn');
  if(b) b.textContent = (t === 'light') ? '☾' : '☀';
}
function toggleTheme(){
  var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  var next = cur === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try{ localStorage.setItem('zootop-theme', next); }catch(e){}
}
(function(){
  var t = null;
  try{ t = localStorage.getItem('zootop-theme'); }catch(e){}
  if(!t) t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(t);
})();

/* ---------- Duplicate marquee tracks for seamless loop ---------- */
['tickerTrack','chanRow1','chanRow2'].forEach(function(id){
  var t = document.getElementById(id);
  if(t) t.innerHTML += t.innerHTML;
});

/* ---------- Header scroll state + back-to-top ---------- */
var hdr = document.getElementById('hdr'), toTop = document.getElementById('toTop');
addEventListener('scroll', function(){
  hdr.classList.toggle('scrolled', scrollY > 20);
  toTop.classList.toggle('show', scrollY > 700);
}, {passive:true});

/* ---------- Reveal on scroll ---------- */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

/* ---------- Animated counters ---------- */
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
var cio = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting) return;
    var el = e.target, to = +el.dataset.to, t0 = null;
    cio.unobserve(el);
    if(reduced){ el.textContent = to; return; }
    function tick(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts-t0)/1200, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1-p, 3)));
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
},{threshold:.6});
document.querySelectorAll('.count').forEach(function(el){ cio.observe(el); });

/* ---------- Hero mouse parallax ---------- */
var pv = document.getElementById('parallax');
if(pv && !reduced && matchMedia('(pointer:fine)').matches){
  var chips = pv.querySelectorAll('.chip'), zw = pv.querySelector('.zwrap');
  pv.closest('.hero').addEventListener('mousemove', function(ev){
    var r = pv.getBoundingClientRect();
    var dx = (ev.clientX - r.left - r.width/2)/r.width;
    var dy = (ev.clientY - r.top - r.height/2)/r.height;
    zw.style.translate = (dx*14)+'px '+(dy*14)+'px';
    chips.forEach(function(c,i){ c.style.translate = (dx*(22+i*8))+'px '+(dy*(16+i*6))+'px'; });
  });
}

/* ---------- Product card tilt + glow follow ---------- */
if(!reduced && matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.prod-card').forEach(function(card){
    card.addEventListener('mousemove', function(ev){
      var r = card.getBoundingClientRect();
      var x = ev.clientX - r.left, y = ev.clientY - r.top;
      card.style.setProperty('--mx', (x/r.width*100)+'%');
      card.style.setProperty('--my', (y/r.height*100)+'%');
      var rx = ((y/r.height)-.5)*-7, ry = ((x/r.width)-.5)*7;
      card.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
  });
}

/* ---------- Timeline progress ---------- */
var tl = document.getElementById('timeline'), tlFill = document.getElementById('tlFill');
var steps = tl ? tl.querySelectorAll('.tl-step') : [];
function updateTl(){
  if(!tl) return;
  var r = tl.getBoundingClientRect();
  var mid = innerHeight * .62;
  var p = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
  tlFill.style.height = (p*100)+'%';
  steps.forEach(function(s){
    var sr = s.getBoundingClientRect();
    s.classList.toggle('on', sr.top < mid);
  });
}
addEventListener('scroll', updateTl, {passive:true});
addEventListener('resize', updateTl);
updateTl();
