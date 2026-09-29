// Aqua Doctor Solutions: site scripts
// Image paths used by the product list
var ADSI={"f_class":"images/f-class.jpg","f_fillet":"images/f-fillet.jpg","f_insure":"images/f-insure.jpg","f_solar":"images/f-solar.jpg","g_expo":"images/g-expo.jpg","g_group":"images/g-group.jpg","hero_aer":"images/hero-aer.jpg","hero_boy":"images/hero-boy.jpg","hero_net":"images/hero-net.jpg","hero_summit":"images/hero-summit.jpg","hero_village":"images/hero-village.jpg","matsya":"images/matsya.webp","p_drone":"images/p-drone.jpg","p_ne":"images/hero-summit.jpg","pr_airstone":"images/pr-airstone.webp","pr_bftank":"images/pr-bftank.webp","pr_do":"images/pr-do.webp","pr_feeder":"images/pr-feeder.webp","pr_fingerling":"images/pr-fingerling.webp","pr_floating":"images/pr-floating.webp","pr_gh":"images/pr-gh.webp","pr_liner":"images/pr-liner.webp","pr_meds":"images/pr-meds.webp","pr_mesh":"images/pr-mesh.webp","pr_no2":"images/pr-no2.webp","pr_ovafish":"images/pr-ovafish.webp","pr_pellet":"images/pr-pellet.webp","pr_ph":"images/pr-ph.webp","pr_powder":"images/pr-powder.webp","pr_pump":"images/pr-pump.webp","pr_seed":"images/pr-seed.webp","pr_sinking":"images/pr-sinking.webp","pr_solaraer":"images/pr-solaraer.webp","pr_vial":"images/pr-vial.webp","r_grant":"images/r-grant.jpg","r_mag":"images/r-mag.jpg","s_blue":"images/s-blue.jpg","v_boat":"images/v-boat.jpg","v_farmer":"images/v-farmer.jpg","v_fish":"images/v-fish.jpg","v_net":"images/v-net.jpg","v_visit":"images/v-visit.jpg"};

(function(){
  "use strict";
  var WA_NUMBER = "919875402885"; // confirm the WhatsApp number with the company

  /* ---------- product list: add a product by adding one entry ---------- */
  var CATS = ["Fish seed","Fish feed","Medicines and hormones","Water testing kits","Aerators and machinery","Biofloc and pond","Value-added products"];
  var PRODUCTS = [
    {name:"Fish spawn and fry", cat:"Fish seed", img:"pr_seed", desc:"Quality spawn and fry of Indian major carps and other culture species for nursery ponds.", features:["Healthy, active stock","Species: [Rohu, Catla, Mrigal, others]"], pack:"[Per lakh / per kg]", mrp:"[On request]"},
    {name:"Fingerlings", cat:"Fish seed", img:"pr_fingerling", desc:"Stocking-size fingerlings for grow-out ponds, counted and packed for transport.", features:["Graded by size","Delivered with stocking guidance"], pack:"[Per 1,000 pcs]", mrp:"[On request]"},
    {name:"Floating pellet feed", cat:"Fish feed", img:"pr_floating", desc:"Floating pellets that let you see how much the fish eat, reducing waste.", features:["Protein: [__%]","Pellet size: [__ mm]"], pack:"[25 kg bag]", mrp:"₹ [MRP]"},
    {name:"Sinking pellet feed", cat:"Fish feed", img:"pr_sinking", desc:"Sinking pellets for bottom and column feeders.", features:["Protein: [__%]","Pellet size: [__ mm]"], pack:"[25 kg bag]", mrp:"₹ [MRP]"},
    {name:"Nursery powder feed", cat:"Fish feed", img:"pr_powder", desc:"Fine powder feed for spawn and fry in nursery ponds.", features:["For early stages","Protein: [__%]"], pack:"[Pack size]", mrp:"₹ [MRP]"},
    {name:"Ovafish hormone injection", cat:"Medicines and hormones", img:"pr_ovafish", desc:"Fish hormone (GnRH analogue) injection for induced breeding in hatcheries.", features:["For induced breeding","Use under expert guidance"], pack:"[10 ml vial]", mrp:"₹ [MRP]"},
    {name:"Fish health medicines", cat:"Medicines and hormones", img:"pr_meds", desc:"A range of disinfectants, immunity boosters, probiotics and treatments for common fish diseases.", features:["Prescribed after diagnosis","Dosage advice from our experts"], pack:"[Various]", mrp:"₹ [MRP]"},
    {name:"pH test kit", cat:"Water testing kits", img:"pr_ph", desc:"Quick test for pond water pH at the pond side.", features:["Colour-chart reading","Results in minutes"], pack:"[No. of tests]", mrp:"₹ [MRP]"},
    {name:"Dissolved oxygen test kit", cat:"Water testing kits", img:"pr_do", desc:"Check oxygen levels before they stress your fish.", features:["Pond-side testing","Simple steps"], pack:"[No. of tests]", mrp:"₹ [MRP]"},
    {name:"Nitrite test kit", cat:"Water testing kits", img:"pr_no2", desc:"Detect toxic nitrite build-up early.", features:["Colour-chart reading","Pond-side testing"], pack:"[No. of tests]", mrp:"₹ [MRP]"},
    {name:"General hardness test kit", cat:"Water testing kits", img:"pr_gh", desc:"Measure water hardness for better liming and pond preparation.", features:["Colour-chart reading","Pond-side testing"], pack:"[No. of tests]", mrp:"₹ [MRP]"},
    {name:"Solar paddlewheel aerator", cat:"Aerators and machinery", img:"pr_solaraer", desc:"Paddlewheel aerator powered by solar panels — oxygen without grid power or diesel.", features:["No fuel cost","Climate-resilient"], pack:"[HP / panel rating]", mrp:"[On request]"},
    {name:"Floating fish feeder", cat:"Aerators and machinery", img:"pr_feeder", desc:"Automatic feeder on floats that spreads feed across the pond on a schedule.", features:["Solar-assisted","Timed feeding"], pack:"[Capacity]", mrp:"[On request]"},
    {name:"Water pump", cat:"Aerators and machinery", img:"pr_pump", desc:"Pump for filling, exchanging and draining pond water.", features:["Motor: [HP]","[Single / three phase]"], pack:"[1 unit]", mrp:"[On request]"},
    {name:"Fish feed pellet machine", cat:"Aerators and machinery", img:"pr_pellet", desc:"Make your own feed pellets on the farm from local ingredients.", features:["Output: [kg/hr]","Die sizes: [__ mm]"], pack:"[1 unit]", mrp:"[On request]"},
    {name:"Biofloc tank", cat:"Biofloc and pond", img:"pr_bftank", desc:"Circular tank with tarpaulin lining and frame for Biofloc culture.", features:["Diameter: [__ m]","Easy to set up"], pack:"[1 set]", mrp:"[On request]"},
    {name:"Air stones", cat:"Biofloc and pond", img:"pr_airstone", desc:"Diffuser stones for fine bubbles in Biofloc and hatchery tanks.", features:["Fine bubbles","Assorted sizes"], pack:"[Pack of __]", mrp:"₹ [MRP]"},
    {name:"Wire mesh", cat:"Biofloc and pond", img:"pr_mesh", desc:"Welded mesh for Biofloc tank frames and pond fencing.", features:["Rust-resistant","Roll length: [__ m]"], pack:"[Per roll]", mrp:"₹ [MRP]"},
    {name:"Pond liner sheet", cat:"Biofloc and pond", img:"pr_liner", desc:"HDPE liner to stop seepage in ponds and tanks.", features:["Thickness: [__ micron]","Roll size: [__]"], pack:"[Per roll]", mrp:"₹ [MRP]"},
    {name:"Fish fillets and dressed prawn", cat:"Value-added products", img:"f_fillet", full:true, desc:"Hygienically processed tilapia, basa and bhetki fillets and dressed prawn, made with women-led enterprises.", features:["Tilapia, basa, bhetki fillets","Dressed prawn"], pack:"[Pack size]", mrp:"₹ [MRP]"}
  ];
  var IMGS = {"f_fillet":ADSI.f_fillet,"pr_sinking":ADSI.pr_sinking,"pr_floating":ADSI.pr_floating,"pr_powder":ADSI.pr_powder,"pr_bftank":ADSI.pr_bftank,"pr_mesh":ADSI.pr_mesh,"pr_ph":ADSI.pr_ph,"pr_gh":ADSI.pr_gh,"pr_no2":ADSI.pr_no2,"pr_do":ADSI.pr_do,"pr_airstone":ADSI.pr_airstone,"pr_ovafish":ADSI.pr_ovafish,"pr_meds":ADSI.pr_meds,"pr_vial":ADSI.pr_vial,"pr_liner":ADSI.pr_liner,"pr_feeder":ADSI.pr_feeder,"pr_pump":ADSI.pr_pump,"pr_pellet":ADSI.pr_pellet,"pr_solaraer":ADSI.pr_solaraer,"pr_seed":ADSI.pr_seed,"pr_fingerling":ADSI.pr_fingerling};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  var fbox=document.getElementById("filters"), grid=document.getElementById("pgrid"), q=document.getElementById("psearch");
  var current="All";
  ["All"].concat(CATS).forEach(function(c){
    var b=document.createElement("button");b.type="button";b.textContent=c;b.setAttribute("aria-pressed",c==="All"?"true":"false");
    b.addEventListener("click",function(){current=c;Array.prototype.forEach.call(fbox.children,function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});renderProducts();});
    fbox.appendChild(b);
  });
  function renderProducts(){
    var term=(q.value||"").trim().toLowerCase();
    var list=PRODUCTS.filter(function(p){return (current==="All"||p.cat===current)&&(!term||(p.name+" "+p.cat+" "+p.desc).toLowerCase().indexOf(term)>-1);});
    if(!list.length){grid.innerHTML='<div class="empty-state"><h3 style="margin-bottom:8px">No products match “'+esc(term||current)+'”</h3><p style="margin:0 0 18px">Try another word, or ask us — we may stock it.</p><a class="btn btn-petrol" href="#join" data-link data-enquiry="Product enquiry">Ask about a product</a></div>';return;}
    grid.innerHTML=list.map(function(p){
      return '<article class="prod"><div class="pic"><img '+(p.full?'class="full" ':'')+'src="'+IMGS[p.img]+'" alt="'+esc(p.name)+'" loading="lazy"><span class="cat">'+esc(p.cat)+'</span></div><div class="body"><h3>'+esc(p.name)+'</h3><p class="desc">'+esc(p.desc)+'</p><ul>'+p.features.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul><dl><div><dt>Pack size</dt><dd>'+esc(p.pack)+'</dd></div><div><dt>Price / MRP</dt><dd>'+esc(p.mrp)+'</dd></div></dl><a class="btn btn-cyan" href="#join" data-link data-enquiry="Product enquiry" data-product="'+esc(p.name)+'">Enquire now</a></div></article>';
    }).join("");
  }
  q.addEventListener("input",renderProducts);
  renderProducts();

  /* ---------- routing ---------- */
  var pages=["home","about","services","products","careers","media","join"];
  var nav=document.getElementById("mainnav"), openBtn=document.querySelector("[data-open]");
  function closeMenu(){nav.classList.remove("open");openBtn.setAttribute("aria-expanded","false");}
  function show(id,anchor){
    if(pages.indexOf(id)<0){id="home";}
    document.querySelectorAll(".page").forEach(function(p){p.classList.toggle("is-active",p.id==="page-"+id);});
    document.querySelectorAll("nav.main a").forEach(function(a){a.getAttribute("href")==="#"+id?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current");});
    var pg=document.getElementById("page-"+id);document.title=pg.getAttribute("data-title");
    closeMenu();
    var target=anchor&&document.getElementById(anchor);
    if(target){requestAnimationFrame(function(){target.scrollIntoView({block:"start"});});}else{window.scrollTo(0,0);}
  }
  function fromHash(){var h=(location.hash||"#home").slice(1);if(pages.indexOf(h)>-1){show(h);}else if(document.getElementById(h)){var pg=document.getElementById(h).closest(".page");if(pg){show(pg.id.replace("page-",""),h);}}else{show("home");}}
  document.addEventListener("click",function(e){
    var a=e.target.closest("a[data-link]");
    if(a){
      e.preventDefault();
      var id=a.getAttribute("href").slice(1);
      if(a.dataset.enquiry){setEnquiry(a.dataset.enquiry,a.dataset.product);}
      try{history.pushState(null,"","#"+id);}catch(err){}
      show(id,a.dataset.anchor);
      return;
    }
    var j=e.target.closest("a[data-jump]");
    if(j){
      e.preventDefault();var t=document.getElementById(j.getAttribute("href").slice(1));
      if(j.dataset.position){document.getElementById("c-pos").value=j.dataset.position;}
      if(t){t.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
      return;
    }
    var w=e.target.closest("[data-wa]");
    if(w){e.preventDefault();window.open("https://wa.me/"+WA_NUMBER,"_blank","noopener");}
  });
  window.addEventListener("popstate",fromHash);
  openBtn.addEventListener("click",function(){nav.classList.add("open");openBtn.setAttribute("aria-expanded","true");nav.querySelector("a").focus();});
  nav.querySelector("[data-close]").addEventListener("click",function(){closeMenu();openBtn.focus();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();openBtn.focus();}});

  /* ---------- services side index ---------- */
  var svcLinks=document.querySelectorAll(".svc-nav a");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){svcLinks.forEach(function(l){l.classList.toggle("cur",l.getAttribute("href")==="#"+en.target.id);});}});},{rootMargin:"-30% 0px -60% 0px"});
    document.querySelectorAll("#page-services article[id]").forEach(function(s){io.observe(s);});
  }

  /* ---------- hero slider ---------- */
  var slides=document.querySelectorAll("#slider .slide"), dots=document.querySelectorAll("#slider .dots button"), idx=0, timer=null;
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scT=document.getElementById("sc-title"),scD=document.getElementById("sc-desc"),scC=document.getElementById("sc-count"),scL=document.getElementById("sc-link");
  function go(n){idx=(n+slides.length)%slides.length;slides.forEach(function(s,i){s.classList.toggle("on",i===idx);s.setAttribute("aria-hidden",i===idx?"false":"true");});dots.forEach(function(d,i){d.setAttribute("aria-current",i===idx?"true":"false");});
    var s=slides[idx];scT.textContent=s.dataset.t;scD.textContent=s.dataset.d;scC.textContent=(idx+1)+" / "+slides.length;scL.textContent=s.dataset.l;scL.setAttribute("href",s.dataset.href);if(s.dataset.anchor){scL.dataset.anchor=s.dataset.anchor;}else{delete scL.dataset.anchor;}}
  function play(){if(reduce)return;stop();timer=setInterval(function(){go(idx+1);},6500);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  document.querySelector("[data-prev]").addEventListener("click",function(){go(idx-1);play();});
  document.querySelector("[data-next]").addEventListener("click",function(){go(idx+1);play();});
  dots.forEach(function(d,i){d.addEventListener("click",function(){go(i);play();});});
  var card=document.querySelector(".slide-card");
  card.addEventListener("mouseenter",stop);card.addEventListener("mouseleave",play);
  card.addEventListener("focusin",stop);card.addEventListener("focusout",play);
  go(0);play();

  /* ---------- in-page sub navigation ---------- */
  if("IntersectionObserver" in window){
    document.querySelectorAll(".subnav").forEach(function(sn){
      var links=sn.querySelectorAll("a");
      var io2=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.toggle("cur",l.getAttribute("href")==="#"+en.target.id);});}});},{rootMargin:"-35% 0px -55% 0px"});
      links.forEach(function(l){var t=document.getElementById(l.getAttribute("href").slice(1));if(t)io2.observe(t);});
    });
  }

  /* ---------- media filters + lightbox ---------- */
  var mf=document.querySelectorAll("#mfilters button");
  mf.forEach(function(b){b.addEventListener("click",function(){var f=b.dataset.f;mf.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});document.querySelectorAll("#gallery2 figure").forEach(function(fig){fig.hidden=!(f==="all"||fig.dataset.c===f);});});});
  var lb=document.getElementById("lightbox"),lbImg=lb.querySelector("img"),lbCap=lb.querySelector("p"),lbClose=lb.querySelector("button"),lastZoom=null;
  document.querySelectorAll("#gallery2 .zoom").forEach(function(z){z.setAttribute("aria-label","Enlarge: "+z.querySelector("img").alt);z.addEventListener("click",function(){lastZoom=z;var im=z.querySelector("img");lbImg.src=im.src;lbImg.alt=im.alt;lbCap.textContent=z.parentNode.querySelector("figcaption").textContent;lb.classList.add("open");lbClose.focus();});});
  function closeLb(){lb.classList.remove("open");if(lastZoom)lastZoom.focus();}
  lbClose.addEventListener("click",closeLb);lb.addEventListener("click",function(e){if(e.target===lb)closeLb();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&lb.classList.contains("open"))closeLb();});

  /* ---------- media tabs ---------- */
  var tabs=document.querySelectorAll('[role="tab"]');
  function selTab(t){tabs.forEach(function(x){var on=x===t;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute("aria-controls")).hidden=!on;});t.focus();}
  tabs.forEach(function(t,i){t.addEventListener("click",function(){selTab(t);});t.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();selTab(tabs[(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length]);}});});

  /* ---------- join options + forms ---------- */
  var sel=document.getElementById("e-type");
  function setEnquiry(type,product){
    sel.value=type;
    document.querySelectorAll("#joinopts .opt").forEach(function(o){o.setAttribute("aria-pressed",o.dataset.type===type||(type==="Product enquiry"&&o.dataset.type==="Service enquiry")?"true":"false");});
    if(product){document.getElementById("e-msg").value="I would like to know more about: "+product;}
  }
  document.querySelectorAll("#joinopts .opt").forEach(function(o){o.addEventListener("click",function(){setEnquiry(o.dataset.type);document.getElementById("e-name").focus();});});
  sel.addEventListener("change",function(){setEnquiry(sel.value);});

  document.querySelectorAll("form[data-form]").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var ok=true,first=null;
      f.querySelectorAll("[required]").forEach(function(inp){
        var v=(inp.type==="file")?inp.files.length:inp.value.trim();
        var bad=!v||(inp.type==="tel"&&inp.value.replace(/\D/g,"").slice(-10).length<10);
        inp.closest(".field").classList.toggle("bad",!!bad);inp.setAttribute("aria-invalid",bad?"true":"false");
        if(bad){ok=false;first=first||inp;}
      });
      var msg=f.querySelector(".sent");
      if(!ok){msg.classList.remove("show");first.focus();return;}
      var name=f.querySelector('[name="name"]').value.trim().split(" ")[0];
      msg.textContent=f.dataset.form==="cv"?("Thank you, "+name+". Your CV has been sent to our team."):("Thank you, "+name+". Your enquiry has been sent — our team will call you back.");
      msg.classList.add("show");f.reset();
      if(f.dataset.form==="enquiry"){setEnquiry("");}
    });
  });

  fromHash();
})();
