let apiData = [];
const domain = window.location.origin;
const icons = {
    requests: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2.5"/></svg>`,
    latency: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>`,
    endpoints: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5"/></svg>`,
    categories: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2.5"/></svg>`,
    dash: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-width="2"/></svg>`,
    copy: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" stroke-width="2.5"/></svg>`,
    dl: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
    check: `<svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`,
    trash: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
    exe: `<svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    visit: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`
};
async function init() {
    const [cfg, sts] = await Promise.all([fetch('/api/config').then(r => r.json()), fetch('/api/stats').then(r => r.json())]);
    apiData = cfg; renderSidebar(); renderStats(sts);
}
function renderStats(sts) {
    const container = document.getElementById('dash-content');
    if(!container) return;
    const items = [{l:'Requests',v:sts.requests,i:icons.requests},{l:'Latency',v:sts.latency,i:icons.latency},{l:'Endpoints',v:sts.endpoints,i:icons.endpoints},{l:'Categories',v:sts.categories,i:icons.categories}];
    container.innerHTML = items.map(it => `<div class="dash-card"><div class="flex justify-between items-center mb-4"><p class="text-[10px] font-black uppercase opacity-40 tracking-widest">${it.l}</p><div class="p-2 border border-black">${it.i}</div></div><p class="text-3xl font-bold tracking-tighter">${it.v}</p></div>`).join('');
}
function renderSidebar() {
    const cats = [...new Set(apiData.map(i => i.category))];
    document.getElementById('cat-list').innerHTML = cats.map(c => {
        const count = apiData.filter(i => i.category === c).length;
        return `<div class="nav-link cat-trigger" data-cat="${c}"><span>📂 ${c}</span><span class="text-[9px] bg-black text-white px-1.5 py-0.5 border border-black font-black ml-auto">${count}</span></div>`;
    }).join('');
    document.querySelectorAll('.cat-trigger').forEach(el => el.onclick = (e) => switchView('cat', e.currentTarget.dataset.cat, e.currentTarget));
}
function switchView(type, name = '', target = null) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if(target) target.classList.add('active');
    document.getElementById('view-dash').classList.toggle('hidden', type !== 'dashboard');
    document.getElementById('view-cat').classList.toggle('hidden', type !== 'cat');
    if(type === 'cat') {
        const filtered = apiData.filter(i => i.category === name);
        document.getElementById('cat-title').innerText = name;
        document.getElementById('cat-label').innerText = `Total Endpoints: ${filtered.length}`;
        renderEnds(filtered);
    }
    if(window.innerWidth < 1024 && document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
}
function renderEnds(list) {
    document.getElementById('end-list').innerHTML = list.map((api, i) => {
        const isImg = api.category.includes("Random") || api.name.includes("SS Website");
        return `
        <div class="endpoint-card">
            <div class="endpoint-header" onclick="toggleAcc(${i})">
                <div class="flex items-center gap-2"><span class="badge-mini bg-black text-white">${api.method}</span><span class="font-bold text-[11px] uppercase tracking-tight">${api.name}</span></div>
                <svg id="ico-${i}" class="w-3 h-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3"/></svg>
            </div>
            <div id="box-${i}" class="hidden p-5 border-t border-black bg-white">
                <p class="text-[9px] font-black uppercase mb-1 opacity-30">Request URL</p>
                <div class="box-container mb-6"><div class="scroll-wrapper"><span id="url-${i}">${domain}${api.path}${api.params.length?'?'+api.params.map(p=>p.name+'=').join('&'):''}</span></div><button class="copy-fixed-single" data-target="url-${i}">${icons.copy}</button></div>
                <div class="space-y-4 mb-6">
                    ${api.params.length ? '<p class="text-[9px] font-black uppercase opacity-30 tracking-widest">Parameters</p>' : ''}
                    ${api.params.map(p => `
                        <div>
                            <label class="text-[10px] font-black uppercase block mb-1">${p.name}</label>
                            ${p.options ? `
                                <div class="relative custom-select-wrapper">
                                    <select class="p-input w-full border border-black p-2.5 text-[11px] outline-none bg-gray-50/50 focus:bg-white appearance-none transition" data-idx="${i}" data-path="${api.path}" id="in-${i}-${p.name}">
                                        ${p.options.map(opt => `<option value="${opt}">${opt.toUpperCase()}</option>`).join('')}
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black"><svg class="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></div>
                                </div>
                            ` : `
                                <input class="p-input w-full border border-black p-2.5 text-[11px] outline-none bg-gray-50/50 focus:bg-white transition" data-idx="${i}" data-path="${api.path}" id="in-${i}-${p.name}" type="text" placeholder="${p.placeholder || 'Masukkan value...'}">
                            `}
                        </div>
                    `).join('')}
                    <div class="flex gap-2">
                        <button class="exe-btn flex-1 bg-black text-white font-bold text-[10px] py-3 border border-black flex items-center justify-center gap-2 active:scale-95 transition-transform" data-idx="${i}" data-path="${api.path}" data-cat="${api.category}" data-name="${api.name}">${icons.exe} EXECUTE</button>
                        <button class="visit-btn flex-1 bg-white text-black font-bold text-[10px] py-3 border border-black flex items-center justify-center gap-2 active:scale-95 transition-transform" data-target="url-${i}">${icons.visit} VISIT</button>
                    </div>
                </div>
                <div class="flex justify-between items-center mb-1 bg-gray-50 p-1 px-2 border-x border-t border-black">
                    <div id="stat-part-${i}" class="text-[10px] font-black uppercase tracking-tighter">STATUS: <span class="text-gray-400">WAITING</span></div>
                    <div id="lat-part-${i}" class="text-[10px] font-black uppercase tracking-tighter w-24 text-right font-mono">LATENCY: 0ms</div>
                </div>
                <div class="aspect-square relative border-2 border-black bg-white overflow-hidden">
                    <div class="p-4 h-full overflow-auto text-[11px] font-mono leading-relaxed" id="res-content-${i}"><pre id="res-${i}" class="text-gray-400 italic font-mono">// Awaiting execution...</pre></div>
                    <div class="absolute top-2 right-2 flex gap-1.5"><button class="btn-tool-res" data-action="clear" data-idx="${i}" data-target="res-${i}">${icons.trash}</button><button class="btn-tool-res" data-action="${isImg?'dl':'copy'}" data-idx="${i}" data-target="res-${i}">${isImg?icons.dl:icons.copy}</button></div>
                </div>
            </div>
        </div>`;
    }).join('');
    attachLogic();
}
function attachLogic() {
    document.querySelectorAll('.p-input').forEach(input => {
        input.oninput = (e) => {
            const idx = e.target.dataset.idx, path = e.target.dataset.path, api = apiData.find(a => a.path === path);
            let query = api.params.map(p => {
                let val = document.getElementById(`in-${idx}-${p.name}`).value;
                if (p.name === 'url' && path.includes('ssweb') && val && !val.startsWith('http')) val = 'https://' + val;
                return `${p.name}=${val.replace(/\s+/g, '+')}`;
            }).join('&');
            document.getElementById(`url-${idx}`).innerText = `${domain}${path}${query?'?'+query:''}`;
        };
        if(input.tagName === 'SELECT') input.dispatchEvent(new Event('input'));
    });
    document.querySelectorAll('.exe-btn').forEach(b => {
        b.onclick = async (e) => {
            const { idx, path, cat, name } = e.currentTarget.dataset, resEl = document.getElementById(`res-${idx}`), content = document.getElementById(`res-content-${idx}`), api = apiData.find(a => a.path === path);
            const statPart = document.getElementById(`stat-part-${idx}`), latPart = document.getElementById(`lat-part-${idx}`);
            let query = api.params.map(p => {
                let val = document.getElementById(`in-${idx}-${p.name}`).value;
                if (p.name === 'url' && path.includes('ssweb') && val && !val.startsWith('http')) val = 'https://' + val;
                return `${p.name}=${encodeURIComponent(val)}`;
            }).join('&');
            const fullUrl = `${path}${query?'?'+query:''}`;
            content.innerHTML = `<pre id="res-${idx}" class="text-gray-500 font-mono italic">Executing...</pre>`;
            statPart.innerHTML = `STATUS: <span class="text-blue-500">PENDING</span>`;
            let latInt = setInterval(() => { latPart.innerHTML = `LATENCY: ${Math.floor(Math.random()*500)}ms`; }, 50);
            if (cat.includes("Random")) {
                content.innerHTML = `<div class="shimmer w-full h-full"></div>`;
                const img = new Image(); img.src = `${fullUrl}${fullUrl.includes('?')?'&':'?'}t=${Date.now()}`;
                img.className = "w-full h-full object-contain hidden"; content.appendChild(img);
                img.onload = () => { clearInterval(latInt); if(content.querySelector('.shimmer')) content.querySelector('.shimmer').remove(); img.classList.remove('hidden'); statPart.innerHTML = `STATUS: <span class="text-green-600">200 OK</span>`; };
                img.onerror = () => { clearInterval(latInt); statPart.innerHTML = `STATUS: <span class="text-red-600">ERROR</span>`; content.innerHTML = `<pre id="res-${idx}">// Error Loading Image</pre>`; };
            } else {
                const start = Date.now();
                try {
                    const r = await fetch(fullUrl), d = await r.json(), lat = Date.now() - start; clearInterval(latInt);
                    latPart.innerHTML = `LATENCY: ${lat}ms`;
                    content.innerHTML = `<pre id="res-${idx}" class="font-mono text-[11px] leading-relaxed">${JSON.stringify(d, null, 2)}</pre>`;
                    statPart.innerHTML = `STATUS: <span class="${r.ok?'text-green-600':'text-red-600'}">${r.status} ${r.statusText}</span>`;
                } catch (err) { clearInterval(latInt); statPart.innerHTML = `STATUS: <span class="text-red-600">FAIL</span>`; content.innerHTML = `<pre id="res-${idx}">// Connection Error</pre>`; }
            }
        };
    });
    document.querySelectorAll('.visit-btn').forEach(b => b.onclick = (e) => window.open(document.getElementById(e.currentTarget.dataset.target).innerText, '_blank'));
    document.querySelectorAll('.copy-fixed-single, .copy-btn-res').forEach(b => b.onclick = (e) => {
        navigator.clipboard.writeText(document.getElementById(b.dataset.target).innerText);
        const old = b.innerHTML; b.innerHTML = icons.check; setTimeout(() => b.innerHTML = old, 1500);
    });
    document.querySelectorAll('.btn-tool-res').forEach(b => {
        b.onclick = (e) => {
            const { action, target, idx } = b.dataset;
            if(action === 'copy') { navigator.clipboard.writeText(document.getElementById(target).innerText); const old = b.innerHTML; b.innerHTML = icons.check; setTimeout(() => b.innerHTML = old, 1500); }
            else if(action === 'dl') {
                const img = document.querySelector(`#res-content-${idx} img`);
                if(img && img.src) { const a = document.createElement('a'); a.href = img.src; a.download = `elaina-api-${Date.now()}.png`; a.click(); const old = b.innerHTML; b.innerHTML = icons.check; setTimeout(() => b.innerHTML = old, 1500); }
            } else { 
                document.getElementById(`res-content-${idx}`).innerHTML = `<pre id="res-${idx}" class="text-gray-400 italic font-mono">// Awaiting execution...</pre>`; 
                document.getElementById(`stat-part-${idx}`).innerHTML = `STATUS: <span class="text-gray-400">WAITING</span>`;
                document.getElementById(`lat-part-${idx}`).innerHTML = `LATENCY: 0ms`;
            }
        };
    });
}
function toggleAcc(i) { const b = document.getElementById(`box-${i}`), ic = document.getElementById(`ico-${i}`); const isH = b.classList.toggle('hidden'); ic.style.transform = isH ? 'rotate(0deg)' : 'rotate(180deg)'; }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }
document.getElementById('btn-dash').onclick = () => switchView('dashboard', '', document.getElementById('btn-dash'));
init();
