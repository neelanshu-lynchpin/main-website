/* Hosted admin (built into /admin by build-site.mjs). Stands in for claude.ai: a team sign-in,
   and data from MongoDB through /api/admin. Lists refresh every 20 seconds and after each change. */
(function(){
  var subs = {};
  var TEAM = ['Neelanshu', 'Prashant', 'Khushi'];
  var signedIn, ready = new Promise(function(r){ signedIn = r; });

  function call(body){
    return fetch('/api/admin', {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
      .then(function(r){
        return r.json().catch(function(){ return {}; }).then(function(j){
          if(r.ok) return j;
          if(r.status === 401 && body.op !== 'login' && body.op !== 'me') location.reload(); // signed out elsewhere
          var e = new Error(j.error || 'Request failed'); e.code = r.status === 401 ? 'not_granted' : 'failed'; throw e;
        });
      });
  }

  function colOf(p){ return p.split('/').slice(0, -1).join('/'); }
  function refresh(col){
    var cbs = subs[col]; if(!cbs || !cbs.length) return;
    call({op:'list', col:col}).then(function(j){
      var docs = j.docs.map(function(d){
        var id = d.id, data = Object.assign({}, d); delete data.id;
        return {id:id, exists:true, data:function(){ return data; }, metadata:{fromCache:false, hasPendingWrites:false}};
      });
      var snap = {docs:docs, size:docs.length, empty:!docs.length, metadata:{fromCache:false, hasPendingWrites:false}};
      cbs.forEach(function(c){ c.next(snap); });
    }).catch(function(e){ cbs.forEach(function(c){ if(c.error) c.error(e); }); });
  }
  function ref(path){
    var col = colOf(path), id = path.split('/').pop();
    function write(op, data){ return call({op:op, col:col, id:id, data:data}).then(function(){ refresh(col); }); }
    return {id:id, path:path,
      set:function(d){ return write('set', d); },
      update:function(d){ return write('update', d); },
      delete:function(){ return write('delete'); }};
  }
  var db = {
    doc:ref,
    collection:function(col){
      return {path:col,
        doc:function(id){ return id ? ref(col + '/' + id) : null; },
        add:function(d){ return call({op:'add', col:col, data:d}).then(function(j){ refresh(col); return ref(col + '/' + j.id); }); },
        onSnapshot:function(next, error){
          (subs[col] = subs[col] || []).push({next:next, error:error});
          refresh(col);
          return function(){};
        }};
    }
  };
  setInterval(function(){ if(!document.hidden) Object.keys(subs).forEach(refresh); }, 20000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) Object.keys(subs).forEach(refresh); });

  var downloads = {save:async function(r){
    var blob = r.data instanceof Blob ? r.data : new Blob([r.data]);
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = r.filename; a.click();
    return {status:'saved'};
  }};
  var me = null;
  var user = {
    me:async function(){ return {id:'team-' + me.toLowerCase(), name:me, avatarUrl:'assets/crew/mascot.webp', email:null, isOwner:true, canEdit:true}; },
    canEdit:async function(){ return true; }, isOwner:async function(){ return true; }, can:async function(){ return true; }
  };
  var caps = {db:db, user:user, downloads:downloads};
  window.claude = {use:function(n){ return ready.then(function(){ return caps[n] || null; }); }};

  function enter(name){
    me = name;
    signedIn();
    var out = document.createElement('button');
    out.type = 'button'; out.textContent = 'Sign out';
    out.style.cssText = 'margin-left:10px;font:600 13px var(--body);background:none;border:1px solid #5D6168;color:#E6E7E9;padding:4px 10px;cursor:pointer';
    out.onclick = function(){ call({op:'logout'}).finally(function(){ location.reload(); }); };
    var spot = document.getElementById('me');
    if(spot) spot.after(out);
  }

  function loginScreen(){
    var box = document.createElement('div');
    box.id = 'login';
    box.style.cssText = 'position:fixed;inset:0;z-index:100;background:var(--paper,#F3EFEE);display:grid;place-items:center;padding:16px';
    box.innerHTML =
      '<form style="display:grid;gap:14px;width:min(360px,100%);background:#fff;border:2px solid #16181B;padding:24px">' +
        '<img src="assets/logo.png" alt="Lynchpin" style="height:30px;width:auto;justify-self:start">' +
        '<h1 style="font-size:1.5rem">Team sign-in</h1>' +
        '<label style="display:grid;gap:4px;font-weight:600">Who are you?<select name="name" style="padding:10px;border:1.5px solid #C9C3C0;font-size:16px">' +
          TEAM.map(function(t){ return '<option>' + t + '</option>'; }).join('') + '</select></label>' +
        '<label style="display:grid;gap:4px;font-weight:600">Team password<input name="password" type="password" autocomplete="current-password" required style="padding:10px;border:1.5px solid #C9C3C0;font-size:16px"></label>' +
        '<button type="submit" style="background:#E3181F;color:#fff;border:0;padding:12px;font-weight:700;font-size:15px;cursor:pointer">Sign in</button>' +
        '<p role="status" style="color:#A9121A;min-height:1.2em;margin:0"></p>' +
      '</form>';
    document.body.appendChild(box);
    var f = box.querySelector('form'), msg = box.querySelector('p');
    try { var last = localStorage.getItem('lp-admin-name'); if(last) f.name.value = last; } catch(e){}
    f.password.focus();
    f.onsubmit = function(e){
      e.preventDefault();
      var btn = f.querySelector('button'); btn.disabled = true; msg.textContent = '';
      call({op:'login', name:f.name.value, password:f.password.value}).then(function(j){
        try { localStorage.setItem('lp-admin-name', j.name); } catch(e){}
        box.remove(); enter(j.name);
      }).catch(function(err){ msg.textContent = err.message; btn.disabled = false; f.password.select(); });
    };
  }

  function boot(){
    call({op:'me'}).then(function(j){ enter(j.name); }).catch(loginScreen);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
