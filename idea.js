// Idea list: combinations the customer saves on this device (shared by the earring and ring pages)
(function(){
  const KEY='mutaIdeaList', MAX=30;
  const JA=(document.documentElement.lang||'ja').indexOf('ja')===0;
  const T=JA?{
    needAll:'すべての色を選んでから保存してください',dup:'すでに保存済みです',full:'保存できるのは'+MAX+'件までです',
    fail:'この端末では保存できませんでした',ok:'アイデアリストに保存しました'
  }:{
    needAll:'Choose every color before saving',dup:'Already in your idea list',full:'You can save up to '+MAX+' ideas',
    fail:'Could not save on this device',ok:'Saved to your idea list'
  };

  function load(){
    try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}
  }
  function store(list){
    try{localStorage.setItem(KEY,JSON.stringify(list));return true;}catch(e){return false;}
  }
  function toast(msg){
    let t=document.getElementById('ideaToast');
    if(!t){
      t=document.createElement('div');t.id='ideaToast';t.setAttribute('role','status');
      t.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#EDF2FC;color:#000;padding:10px 18px;border-radius:999px;font-size:.8rem;font-weight:600;z-index:1000;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.5)';
      document.body.appendChild(t);
    }
    t.textContent=msg;t.style.opacity='1';
    clearTimeout(t._h);t._h=setTimeout(()=>{t.style.opacity='0';},2200);
  }
  function refresh(){
    const n=load().length;
    document.querySelectorAll('[data-idea-count]').forEach(el=>{el.textContent=n;});
  }
  // type: 'earring' (parts A,B,C,D) or 'ring' (parts S,L); values are texture ids
  function save(type,parts){
    if(Object.keys(parts).some(k=>!parts[k])){toast(T.needAll);return;}
    const list=load(),key=JSON.stringify(parts);
    if(list.some(x=>x.type===type&&JSON.stringify(x.parts)===key)){toast(T.dup);return;}
    if(list.length>=MAX){toast(T.full);return;}
    list.push({id:Date.now().toString(36),type:type,parts:parts,at:Date.now()});
    if(!store(list)){toast(T.fail);return;}
    refresh();toast(T.ok);
  }
  function param(name){
    try{return new URLSearchParams(location.search).get(name);}catch(e){return null;}
  }
  window.Idea={load:load,store:store,save:save,toast:toast,refresh:refresh,param:param};
  document.addEventListener('DOMContentLoaded',refresh);
  window.addEventListener('pageshow',refresh);   // count stays right after the back button
})();
