const store = require('../models/store');
const views = require('../views/html');
const names = {petitions:'petitions',depositions:'depositions','legal-aid':'legalAid'};
function route(req, res, url, body) {
 const chunks = url.pathname.split('/').filter(Boolean);
 const type = names[chunks[0]];
 if (!type) return false;
 const send=(status,html)=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html)};
 if (req.method==='GET' && chunks.length===1) {send(200, views.listing(type,store.all(type)));return true;}
 if (req.method==='GET' && chunks[1]==='new' && chunks.length===2) {send(200,views.form(type));return true;}
 if (req.method==='POST' && chunks.length===1) {
   const config=type==='petitions'?'applicant':type==='depositions'?'witness':'requester';
   const input={title:String(body.title||'').trim(), [config]:String(body[config]||'').trim(),description:String(body.description||'').trim(),status:'Open'};
   if (!input.title || !input[config] || !input.description || input.title.length>120 || input[config].length>120 || input.description.length>1000) {send(422,views.form(type,'Complete each field within its character limit.'));return true;}
   const item=store.create(type,input);res.writeHead(303,{Location:`/${chunks[0]}/${item.id}`});res.end();return true;
 }
 if (chunks.length>=2 && /^[0-9a-f-]{36}$/i.test(chunks[1])) {
   const record=store.all(type).find(r=>r.id===chunks[1]);
   if (!record) {send(404,views.layout('Not found','<h1>Record not found</h1>'));return true;}
   if (req.method==='GET' && chunks.length===2) {send(200,views.detail(type,record));return true;}
   if (req.method==='POST' && chunks[2]==='status' && chunks.length===3) {
     if (!views.statuses.includes(body.status)) {send(422,views.detail(type,record,'Invalid status'));return true;}
     store.update(type,record.id,{status:body.status});res.writeHead(303,{Location:`/${chunks[0]}/${record.id}`});res.end();return true;
   }
 }
 return false;
}
module.exports={route};
