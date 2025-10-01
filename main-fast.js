// RAJ Image Studio – SPEED edition  (main-fast.js)
class ImageGenerator {
  constructor(){
    this.isGen=false;
    this.previewTO=null;
    this.history=JSON.parse(localStorage.getItem('raj-img-hist')||'[]');
    this.init();
  }
  init(){
    this.initTypewriter();
    this.bindEvents();
    this.loadReloadedPrompt();
    this.animateEntry();
  }
  initTypewriter(){
    new Typed('#typed-text',{
      strings:['Create Amazing Images','Generate AI Art','Design with AI','Visualise Your Ideas'],
      typeSpeed:80,backSpeed:50,loop:true,cursorChar:'|'
    });
  }
  animateEntry(){
    anime({targets:'.hero-bg',opacity:[0,1],duration:1e3,easing:'easeOutQuad'});
    anime({targets:['.bg-white'],opacity:[0,1],translateY:[20,0],delay:anime.stagger(100),duration:800,easing:'easeOutQuad'});
  }
  bindEvents(){
    document.getElementById('generateBtn').addEventListener('click',()=>this.generateBatch());
    ['prompt','style','model'].forEach(id=>{
      document.getElementById(id).addEventListener('input',()=>this.schedulePreview());
    });
    document.getElementById('cfgScale').addEventListener('input',e=>{
      document.getElementById('cfgValue').textContent=e.target.value;
    });
    document.getElementById('randomSeed').addEventListener('click',()=>this.genRandomSeed());
    document.getElementById('advancedToggle').addEventListener('click',()=>this.toggleAdvanced());
    // keyboard
    document.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();this.generateBatch();}
      if(e.key==='Escape')this.closeEditor();
    });
  }
  loadReloadedPrompt(){
    const d=sessionStorage.getItem('reloadPrompt');
    if(!d)return;
    try{const p=JSON.parse(d);this.populateForm(p);sessionStorage.removeItem('reloadPrompt');this.toast('Prompt loaded from history','success');}
    catch{}
  }
  populateForm(p){
    Object.keys(p).forEach(k=>{
      const el=document.getElementById(k);
      if(el)el.value=p[k];
    });
    if(p.cfgScale)document.getElementById('cfgValue').textContent=p.cfgScale;
  }
  toggleAdvanced(){
    const s=document.getElementById('advancedSettings'),t=document.getElementById('advancedToggle');
    s.classList.toggle('hidden');
    t.textContent=s.classList.contains('hidden')?'Advanced Settings ▼':'Advanced Settings ▲';
    if(!s.classList.contains('hidden'))anime({targets:s,opacity:[0,1],translateY:[-10,0],duration:300,easing:'easeOutQuad'});
  }
  schedulePreview(){
    if(this.previewTO)clearTimeout(this.previewTO);
    this.previewTO=setTimeout(()=>this.updatePreview(),600);
  }
  async updatePreview(){
    const p=document.getElementById('prompt').value.trim();
    const c=document.getElementById('previewContainer');
    if(!p){c.innerHTML='<div class="text-center text-gray-500"><p>Start typing to see preview</p></div>';return;}
    c.innerHTML='<div class="text-center"><div class="loading-spinner mx-auto mb-2"></div><p class="text-sm text-gray-500">Generating preview...</p></div>';
    const url=await this.buildURL({prompt:p,model:'photon',resolution:'256x256'});
    c.innerHTML=`<img src="${url}" class="max-w-full max-h-full object-contain rounded-lg">`;
    anime({targets:c.querySelector('img'),opacity:[0,1],scale:[.9,1],duration:500,easing:'easeOutQuad'});
  }
  buildURL({prompt,model,resolution,seed,negative,style}){
    const[wid,hei]=resolution.split('x').map(Number);
    const sp=new URLSearchParams({
      prompt,model,width:wid,height:hei,nologo:'true',
      seed:seed||Math.floor(Math.random()*1e6)
    });
    if(negative)sp.set('negative',negative);
    if(style&&style!=='General')sp.set('style',style.toLowerCase());
    return`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${sp.toString()}`;
  }
  async generateBatch(){
    if(this.isGen)return;
    const p=document.getElementById('prompt').value.trim();
    if(!p){this.toast('Please enter a prompt','error');return;}
    this.setGenState(true);
    const params=this.getParams();
    const container=document.getElementById('resultsContainer');
    // optimistic skeleton
    container.innerHTML=`<div class="grid grid-cols-2 md:grid-cols-2 gap-4" id="genGrid">
      ${[...Array(params.numOutputs)].map((_,i)=>`
        <div class="skeleton pulse rounded-lg h-64 bg-gray-200" id="sk-${i}"></div>`).join('')}
    </div>`;
    // fire all requests in parallel
    const urls=await Promise.all([...Array(params.numOutputs)].map((_,i)=>this.buildURL({
      prompt:params.prompt,negative:params.negativePrompt,model:params.model,
      resolution:params.resolution,seed:params.seed==='random'?Math.floor(Math.random()*1e6):params.seed,
      style:params.style
    })));
    // replace skeletons with real images
    urls.forEach((src,i)=>{
      const img=new Image();img.src=src;img.className='w-full h-full object-cover rounded-lg';
      img.onload=()=>{
        const sk=document.getElementById(`sk-${i}`);if(!sk)return;
        anime({targets:img,opacity:[0,1],scale:[.95,1],duration:400,easing:'easeOutQuad'});
        sk.replaceWith(img);
      };
    });
    this.saveToHistory(params,urls);
    this.setGenState(false);
    this.toast(`Generated ${urls.length} image${urls.length>1?'s':''}!`,'success');
  }
  getParams(){
    return{
      prompt:document.getElementById('prompt').value.trim(),
      negativePrompt:document.getElementById('negativePrompt').value.trim(),
      style:document.getElementById('style').value,
      model:document.getElementById('model').value,
      cfgScale:parseInt(document.getElementById('cfgScale').value),
      numOutputs:parseInt(document.getElementById('numOutputs').value),
      resolution:document.getElementById('resolution').value,
      seed:document.getElementById('seed').value.trim()||'random'
    };
  }
  saveToHistory(p,imgs){
    const entry={id:Date.now().toString(),timestamp:Date.now(),...p,images:imgs};
    this.history.unshift(entry);
    if(this.history.length>50)this.history=this.history.slice(0,50);
    localStorage.setItem('raj-img-hist',JSON.stringify(this.history));
  }
  setGenState(v){
    this.isGen=v;
    const btn=document.getElementById('generateBtn');
    const txt=document.getElementById('generateText');
    const loader=document.getElementById('generateLoader');
    btn.disabled=v;
    txt.textContent=v?'Creating...':'Generate Images';
    loader.classList.toggle('hidden',!v);
  }
  genRandomSeed(){
    const s=Math.floor(Math.random()*1e6);
    document.getElementById('seed').value=s;
  }
  closeEditor(){
    document.getElementById('editorModal').classList.add('hidden');
  }
  toast(msg,type='success'){
    const t=document.getElementById('toast');
    t.textContent=msg;t.className=`toast ${type}`;t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),3000);
  }
}

// boot
const imageGenerator=new ImageGenerator();
