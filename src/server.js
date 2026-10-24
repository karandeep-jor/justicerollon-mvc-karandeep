const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const store=require('./models/store');
const views=require('./views/html');
const controller=require('./controllers/cases');
const PORT=Number(process.env.PORT||3000);
const HOST=process.env.HOST||'0.0.0.0';
const password=process.env.DEMO_PASSWORD||'';
const css=fs.readFileSync(path.join(__dirname,'public/styles.css'));
function unauthorized(res) {res.writeHead(401,{'WWW-Authenticate':'Basic realm="JusticeRollOn demo"','Content-Type':'text/plain'});res.end('Authorization required');}
function authenticated(req){
 if (!password) return true;
 const header=req.headers.authorization||'';
 if (!header.startsWith('Basic ')) return false;
 let raw='';try {raw=Buffer.from(header.slice(6),'base64').toString('utf8');}catch{return false;}
 const expected=Buffer.from('demo:'+password);
 const actual=Buffer.from(raw);
 return actual.length===expected.length && crypto.timingSafeEqual(actual,expected);
}
const server=http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  if (url.pathname==='/health' && req.method==='GET') {res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({status:'ok',service:'justicerollon-mvc',version:'1.0.0'}));}
  if (url.pathname==='/styles.css') {res.writeHead(200,{'Content-Type':'text/css; charset=utf-8'});return res.end(css);}
  if (!authenticated(req)) return unauthorized(res);
  const method=req.method||'GET';
  if (method==='POST' && req.headers.origin) {
    // Normal browser forms often omit Origin. When it is supplied, compare the request Host.
    const expected = new URL(`http://${req.headers.host||'localhost'}`).host;
    try {if(req.headers.origin && new URL(req.headers.origin).host!==expected){res.writeHead(403);return res.end('Origin rejected');}}catch{res.writeHead(403);return res.end('Origin rejected');}
  }
  if (method==='GET' && url.pathname==='/') {res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(views.dashboard(store.load()));}
  let body={};
  if(method==='POST'){
    if(!(req.headers['content-type']||'').startsWith('application/x-www-form-urlencoded')) {res.writeHead(415);return res.end('Unsupported content type');}
    let data='';for await (const chunk of req){data+=chunk;if(data.length>8192){res.writeHead(413);return res.end('Request too large');}}
    body=Object.fromEntries(new URLSearchParams(data));
  }
  if(controller.route(req,res,url,body)) return;
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(views.layout('Not found','<h1>Page not found</h1>'));
 } catch(error){console.error(error); if(!res.headersSent){res.writeHead(500,{'Content-Type':'text/plain'});res.end('Unexpected server error');}}
});
if(require.main===module) server.listen(PORT,HOST,()=>console.log(`JusticeRollOn prototype listening on ${HOST}:${PORT}`));
module.exports=server;
