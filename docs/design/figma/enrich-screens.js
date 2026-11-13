const p=await figma.getNodeByIdAsync('6:2');await figma.setCurrentPageAsync(p);
const created=[],mutated=[];const V={};for(const v of await figma.variables.getLocalVariablesAsync())V[v.name]=v;
const fonts=new Map();for(const t of p.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const lib=await figma.getNodeByIdAsync('44:4739');
function mark(n){mutated.push(n.id);return n;}
function imageFill(key){return [{type:'IMAGE',imageHash:E.assets[key].hash,scaleMode:'FILL'}];}
function replaceArt(n,key){const w=n.width,h=n.height;for(const c of n.children){c.visible=false;mark(c);}n.layoutSizingVertical='FIXED';n.resize(w,h);n.fills=imageFill(key);n.clipsContent=true;mark(n);}
function art(parent,key,w,h,name,index){let n=parent.children.find(c=>c.name===name);if(n)return n;n=figma.createRectangle();n.name=name;n.resize(w,h);n.fills=imageFill(key);if(index!==undefined)parent.insertChild(index,n);else parent.appendChild(n);created.push(n.id);return n;}
async function icon(parent,key,tone='ink',index=0){if(parent.children.some(n=>n.name==='Accent icon / '+key))return;const c=await figma.getNodeByIdAsync(E.icons[key][tone]);const n=c.createInstance();n.name='Accent icon / '+key;parent.insertChild(index,n);created.push(n.id);mark(parent);}
// Replace generic symbols with meaningful service diagrams, preserving the cards and content.
for(const c of lib.findAllWithCriteria({types:['COMPONENT']}).filter(n=>/^Service\/[0-3]\/(Desktop|Mobile)$/.test(n.name))){const parts=c.name.split('/'),m=parts[2]==='Mobile';const old=c.children.find(n=>n.name==='Snowflake / brand geometry');if(old){old.visible=false;mark(old);}if(!c.children.some(n=>n.name==='Service illustration')){const master=await figma.getNodeByIdAsync(E.illustrations[parts[1]]);const n=master.createInstance();n.name='Service illustration';c.insertChild(2,n);n.rescale((m?294:576)/480);created.push(n.id);mark(c);}}
// Editorial cards keep their native titles, descriptions and component properties.
for(const id of ['9:175','9:191']){const c=await figma.getNodeByIdAsync(id);replaceArt(c.children.find(n=>n.name==='Editorial illustration'),'Clarity');}
const groups=['42:1708','42:1714','42:1720','42:1727'];const screens=[];
for(const gid of groups){const g=await figma.getNodeByIdAsync(gid);screens.push(...g.children.filter(n=>n.type==='FRAME'&&/ \/ (Desktop|Mobile)$/.test(n.name)));}
for(const s of screens){const m=s.width===390;const all=s.findAllWithCriteria({types:['FRAME']});
 for(const f of all){if(f.name==='Brand signature')replaceArt(f,'Craft');if(f.name==='Editorial brand visual'||f.name==='Editorial visual')replaceArt(f,'Clarity');}
 // Add composed artwork beside wide hero copy, with a stacked crop on mobile.
 const hero=s.children.find(n=>n.type==='FRAME'&&n.name.startsWith('Hero /'));
 if(hero&&/^(Services|Products|Pricing|Reviews) \//.test(s.name)){
  const key=s.name.startsWith('Reviews')?'Connection':s.name.startsWith('Services')?'Craft':'Systems';
  if(m){art(hero,key,342,220,'Campaign artwork / '+key);}
  else{for(const t of hero.children.filter(n=>n.type==='TEXT'&&n.width>880)){t.textAutoResize='HEIGHT';t.resize(880,t.height);mark(t);}const n=art(hero,key,380,280,'Campaign artwork / '+key);n.layoutPositioning='ABSOLUTE';n.x=1004;n.y=64;mark(n);}
  mark(hero);
 }
 if(s.name.startsWith('Contact /')){const inv=all.find(n=>n.name==='Invitation');const old=inv.children.find(n=>n.name==='Snowflake / brand geometry');if(old){const pos=inv.children.indexOf(old);old.visible=false;mark(old);art(inv,'Connection',m?342:600,m?210:330,'Collaboration / campaign artwork',pos);}}
 // Each editorial story gets a distinct illustration; copy remains editable.
 for(const inst of s.findAllWithCriteria({types:['INSTANCE']}).filter(n=>n.name==='Article/Desktop'||n.name==='Article/Mobile')){const title=inst.children.filter(n=>n.type==='TEXT').map(n=>n.characters).join(' ');const key=title.includes('Build less')?'Craft':title.includes('design system')?'Systems':title.includes('Launch is')?'Connection':'Clarity';const target=inst.children.find(n=>n.name==='Editorial illustration');target.fills=imageFill(key);mark(target);}
 const specs={Values:[['KeyRound','MessagesSquare','Layers'],'ice'],'Delivery process':[['Compass','PenTool','CodeXml','Rocket'],'ice'],Promises:[['KeyRound','ShieldCheck','MessagesSquare'],'ink'],'Product capabilities':[['CalendarDays','Workflow','MessagesSquare'],'ink'],Capabilities:[['CalendarDays','ChartNoAxesCombined','Cloud'],'ice'],Principles:[['Compass','Workflow','Layers'],'ink'],'Contact process':[['MessagesSquare','Compass','Rocket'],'ink']};
 for(const f of all){const cfg=specs[f.name];if(!cfg)continue;const cards=f.children.filter(n=>n.type==='FRAME');for(let i=0;i<cards.length;i++)await icon(cards[i],cfg[0][i%cfg[0].length],cfg[1]);}
 mark(s);
}
// Add a compact native product symbol beside each product's existing positioning copy.
for(const s of screens.filter(n=>n.name.startsWith('Products /')||n.name.startsWith('Product detail'))){for(const f of s.findAllWithCriteria({types:['FRAME']}).filter(n=>['FrostBook','FrostStock','FrostDesk'].includes(n.name))){const col=f.children.find(n=>n.type==='FRAME'&&n.layoutMode==='VERTICAL');if(col)await icon(col,f.name==='FrostBook'?'CalendarDays':f.name==='FrostStock'?'Package':'Headphones','ink');}}
// Reflow the one-page directory to accommodate longer mobile compositions.
for(const gid of groups){const g=await figma.getNodeByIdAsync(gid);let y=280;const children=[...g.children];for(let i=2;i<children.length;i++){const n=children[i];if(n.type==='TEXT'){n.y=y;mark(n);y+=86;const pair=[];while(i+1<children.length&&children[i+1].type==='FRAME'){pair.push(children[++i]);}for(const screen of pair){screen.y=y;mark(screen);}y+=Math.max(0,...pair.map(n=>n.height))+160;}}g.resizeWithoutConstraints(g.width,y);mark(g);}
return {createdNodeIds:created,mutatedNodeIds:[...new Set(mutated)],screens:screens.map(n=>({id:n.id,name:n.name,w:n.width,h:n.height})),newIcons:created.length};
