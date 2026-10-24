const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'jro-test-'));
process.env.DATA_DIR=tmp;
const store=require('../src/models/store');
const views=require('../src/views/html');
const server=require('../src/server');
test('MVC persistence and status updates',()=>{
 const rec=store.create('petitions',{title:'Synthetic petition',applicant:'Person A',description:'Test record',status:'Open'});
 assert.equal(store.all('petitions').length,1);
 assert.equal(store.update('petitions',rec.id,{status:'Closed'}).status,'Closed');
 assert.equal(JSON.parse(fs.readFileSync(path.join(tmp,'records.json'))).petitions[0].status,'Closed');
});
test('HTML escapes user text',()=>assert.match(views.e('<script>'),/&lt;script&gt;/));
test('dashboard and health endpoint',async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const h=await fetch(base+'/health');assert.equal(h.status,200);assert.equal((await h.json()).status,'ok');
  const d=await fetch(base+'/');assert.match(await d.text(),/JusticeRollOn/);
  const form=await fetch(base+'/petitions',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({title:'Sample',applicant:'Demo',description:'Mock'}) ,redirect:'manual'});
  assert.equal(form.status,303);
  assert.match(form.headers.get('location'),/^\/petitions\//);
 } finally {await new Promise(resolve=>server.close(resolve));}
});
