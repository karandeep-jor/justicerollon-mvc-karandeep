const e = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titles = { petitions: 'Petitions', depositions: 'Depositions', legalAid: 'Legal-aid requests' };
const statuses = ['Open','In Review','Closed'];
const configs = {
 petitions: {fields:[['title','Petition title'],['applicant','Applicant alias'],['description','Summary']]},
 depositions: {fields:[['title','Deposition title'],['witness','Witness alias'],['description','Notes']]},
 legalAid: {fields:[['title','Request title'],['requester','Requester alias'],['description','Support requested']]}
};
function layout(title, content, flash='') {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)} | JusticeRollOn</title><link rel="stylesheet" href="/styles.css"></head><body><header><div class="shell nav"><a class="brand" href="/">⚖ JusticeRollOn <small>MVC Prototype</small></a><nav><a href="/">Dashboard</a><a href="/petitions">Petitions</a><a href="/depositions">Depositions</a><a href="/legal-aid">Legal Aid</a></nav></div></header><main class="shell"><div class="eyebrow">DNC · Prototype environment</div>${flash ? `<div class="notice">${e(flash)}</div>` : ''}${content}</main><footer class="shell">Demo only · Synthetic records · Not approved for real legal or personal information</footer></body></html>`;
}
function dashboard(db) {
 const cards = [['petitions','Petitions'],['depositions','Depositions'],['legalAid','Legal-aid requests']].map(([key,label])=>`<a class="stat" href="${key==='legalAid'?'/legal-aid':'/'+key}"><strong>${db[key].length}</strong><span>${label}</span><small>View records →</small></a>`).join('');
 return layout('Dashboard',`<section class="hero"><div><span class="pill">Working prototype</span><h1>Justice workflows,<br>made accessible.</h1><p>A lightweight demonstration of petition management, deposition records and legal-aid coordination.</p><a class="primary" href="/petitions/new">Create a petition →</a></div><div class="hero-icon">⚖</div></section><h2>Activity overview</h2><div class="stats">${cards}</div><div class="notice">Use pseudonyms and synthetic content. This prototype uses local JSON persistence and has no user authentication unless DEMO_PASSWORD is configured.</div>`);
}
function listing(type, records) {
 const route = type==='legalAid'?'legal-aid':type;
 const table=records.length?`<div class="tablewrap"><table><thead><tr><th>Title</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${records.slice().reverse().map(r=>`<tr><td><strong>${e(r.title)}</strong><div class="muted">${e(r.applicant||r.witness||r.requester)}</div></td><td><span class="tag">${e(r.status)}</span></td><td>${e(r.createdAt.slice(0,10))}</td><td><a href="/${route}/${encodeURIComponent(r.id)}">Details →</a></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No records yet. Create your first demonstration record.</div>';
 return layout(titles[type], `<div class="heading"><div><span class="eyebrow">Case management</span><h1>${titles[type]}</h1><p>Manage example records and track their current status.</p></div><a class="primary" href="/${route}/new">+ Add record</a></div>${table}`);
}
function form(type, error='') {
 const fields=configs[type].fields.map(([key,label])=>`<label>${label}${key==='description'?`<textarea name="${key}" maxlength="1000" required></textarea>`:`<input name="${key}" maxlength="120" required>`}</label>`).join('');
 return layout('Create '+titles[type], `<div class="heading"><div><span class="eyebrow">New demonstration record</span><h1>Create ${titles[type].toLowerCase()}</h1></div></div>${error?`<p class="error">${e(error)}</p>`:''}<form class="panel" method="post" action="/${type==='legalAid'?'legal-aid':type}">${fields}<button class="primary" type="submit">Save record</button></form>`);
}
function detail(type, record, error='') {
 const route=type==='legalAid'?'legal-aid':type;
 const person=record.applicant||record.witness||record.requester;
 return layout(record.title,`<a href="/${route}">← Back to ${titles[type]}</a><section class="panel detail"><span class="eyebrow">${e(titles[type])} · ${e(record.id.slice(0,8))}</span><h1>${e(record.title)}</h1><p><strong>Subject:</strong> ${e(person)}</p><p class="description">${e(record.description)}</p><p class="muted">Created ${e(record.createdAt)}</p>${error?`<p class="error">${e(error)}</p>`:''}<form method="post" action="/${route}/${encodeURIComponent(record.id)}/status"><label>Record status<select name="status">${statuses.map(s=>`<option ${s===record.status?'selected':''}>${e(s)}</option>`).join('')}</select></label><button class="primary" type="submit">Update status</button></form></section>`);
}
module.exports={e,layout,dashboard,listing,form,detail,statuses};
