(()=>{
const current='16.3.0', release='Refresh Protection', key='gift-happens-last-version', changes='Prevents unattended page redraws and warns before updating with unsaved edits.';
const $=id=>document.getElementById(id), notice=$('updateNotice');
let checking=false, latest=null, mode='', dismissed=null;
function safe(){const u=new URL(location.href);return !u.searchParams.has('recovery')&&!u.searchParams.has('code')&&!u.hash}
function newer(a,b){const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]>y[i]}return false}
function status(t){if($('updateStatus'))$('updateStatus').textContent=t}
function show(kind,version){mode=kind;$('updateHeading').textContent=kind==='available'?'A little more chaos has arrived! 🎉':'What’s new in Gift Happens '+current;$('updateText').textContent=kind==='available'?'Gift Happens '+version+' is available. Save unfinished edits before updating.':changes;$('updateNow').textContent=kind==='available'?'Update now':'Let’s go!';$('updateLater').hidden=kind!=='available';notice.classList.remove('hidden')}
function read(k){try{return localStorage.getItem(k)}catch{return null}}
function write(k,v){try{localStorage.setItem(k,v)}catch{}}
async function check(manual=false){if(checking||document.hidden||!safe())return;checking=true;if(manual)status('Checking…');try{const r=await fetch(new URL('version.json?fresh='+Date.now(),location.href),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const v=await r.json();if(typeof v.version!=='string'||!/^\d+\.\d+\.\d+$/.test(v.version))throw Error('Invalid version file');if(newer(v.version,current)){latest=v.version;status('Update available: '+latest);if(manual||(dismissed!==latest&&read(key+'-dismissed')!==latest&&read(key+'-attempted')!==latest))show('available',latest)}else{latest=null;status('You are up to date ('+current+').');if(mode==='available'){notice.classList.add('hidden');mode=''}}}catch(e){status('Update check failed. Please try again.');if(manual&&!$('updateStatus'))alert('Update check failed. Please try again.')}finally{checking=false}}
$('updateNow').onclick=()=>{if(mode==='available'&&latest){if(window.GiftDraftGuard?.hasEdits()&&!confirm('You may have unsaved edits. Update anyway?'))return;write(key+'-attempted',latest);const u=new URL(location.href);u.searchParams.set('v',latest);u.searchParams.set('fresh',Date.now());location.replace(u.href)}else notice.classList.add('hidden')};
$('updateLater').onclick=()=>{dismissed=latest;if(latest)write(key+'-dismissed',latest);notice.classList.add('hidden')};
window.GiftUpdates={version:current,release,check,notes:()=>{if(safe())show('installed',current)}};
document.addEventListener('visibilitychange',()=>check());window.addEventListener('pageshow',()=>check());setInterval(()=>check(),60000);
if(safe()){write(key,current);check()}
})();
