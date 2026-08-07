const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const out = __dirname;
const root = path.resolve(out, '../../..');

const style = `
  .sans{font-family:Inter,"Noto Sans SC","Source Han Sans SC","PingFang SC",sans-serif}
  .mono{font-family:"Space Mono","SFMono-Regular",monospace}
  .ink{fill:#111315}.muted{fill:#5b6066}.light{fill:#9aa0a6}.red{fill:#e4002b}.blue{fill:#1f77b4}
  .body{font-size:16px}.small{font-size:12px}.micro{font-size:10px;letter-spacing:1.6px}
  .hair{stroke:#d9dcdf;stroke-width:1}.rule{stroke:#111315;stroke-width:1.5}.redrule{stroke:#e4002b;stroke-width:2}
`;

function protocol(items, active, note) {
  const xs = [72, 436, 800, 1164, 1528];
  const lineEnd = xs[Math.max(0, Math.min(active, 4))];
  return `
    <g transform="translate(0,0)">
      <text x="72" y="812" class="mono muted micro">SCROLL PROTOCOL / ${String(active * 25).padStart(3,'0')}%</text>
      <line x1="72" y1="842" x2="1528" y2="842" class="hair"/>
      <line x1="72" y1="842" x2="${lineEnd}" y2="842" class="redrule"/>
      ${xs.map((x,i)=>`<circle cx="${x}" cy="842" r="${i===active?7:5}" fill="${i<=active?'#111315':'#ffffff'}" stroke="#111315" stroke-width="2"/>`).join('')}
      ${items.map((t,i)=>`<text x="${xs[i]}" y="880" class="mono ${i===active?'red':'muted'} small" ${i===4?'text-anchor="end"':''}>${String(i).padStart(2,'0')}</text><text x="${xs[i]}" y="908" class="sans ink" font-size="15" font-weight="700" ${i===4?'text-anchor="end"':''}>${t}</text>`).join('')}
      <line x1="72" y1="950" x2="1528" y2="950" class="rule"/>
      <text x="72" y="978" class="mono muted small">MOTION NOTE</text>
      <text x="210" y="978" class="sans muted" font-size="13">${note}</text>
      <text x="1528" y="978" class="mono red small" text-anchor="end">CONTINUE ↓</text>
    </g>`;
}

function shell({index, kicker, title, subtitle, progress, body, stages, active, note}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#ffffff"/>
  <style>${style}</style>
  <rect x="72" y="52" width="1456" height="4" fill="#e4002b"/>
  <text x="72" y="92" class="mono red" font-size="12" letter-spacing="2">${kicker} / FRAME ${index}</text>
  <text x="72" y="164" class="sans ink" font-size="54" font-weight="800">${title}</text>
  <text x="76" y="205" class="sans muted body">${subtitle}</text>
  <text x="1290" y="92" class="mono muted small">SCROLL-DRIVEN</text>
  <text x="1290" y="116" class="mono ink small">FRAME ${String(progress).padStart(3,'0')} / 100</text>
  <line x1="1290" y1="132" x2="1528" y2="132" class="hair"/>
  <line x1="1290" y1="132" x2="${1290 + 238 * progress / 100}" y2="132" class="redrule"/>
  <line x1="72" y1="264" x2="1528" y2="264" class="rule"/>
  ${body}
  ${protocol(stages, active, note)}
  </svg>`;
}

function annualBars() {
  const months = [
    ['01',35],['02',42],['03',34],['04',43],['05',79],['06',83],['07',54],['08',6]
  ];
  return months.map(([m,v],i)=>{
    const y = 352 + i * 45;
    const w = Math.round(v / 83 * 250);
    const hot = m === '06';
    return `<text x="82" y="${y+17}" class="mono ${hot?'red':'muted'} small">${m}</text>
      <rect x="122" y="${y}" width="250" height="24" fill="#f1f2f3"/>
      <rect x="122" y="${y}" width="${w}" height="24" fill="${hot?'#e4002b':'#c9cccf'}"/>
      <text x="${Math.max(134,122+w-8)}" y="${y+17}" class="mono" fill="${w>55?'#ffffff':'#5b6066'}" font-size="10" text-anchor="end">${v}</text>`;
  }).join('');
}

function juneCalendar() {
  const counts = {1:5,2:7,3:1,4:1,6:2,7:1,8:5,9:4,10:6,11:1,13:5,14:1,16:6,17:1,18:10,19:4,20:1,21:1,22:5,23:2,24:5,25:1,28:3,29:1,30:4};
  let h = '';
  const x0 = 448, y0 = 376, cw = 74, ch = 59;
  ['MON','TUE','WED','THU','FRI','SAT','SUN'].forEach((d,i)=> h += `<text x="${x0+i*cw+cw/2}" y="350" class="mono muted" font-size="9" text-anchor="middle">${d}</text>`);
  for (let day=1; day<=30; day++) {
    const idx = day-1;
    const col = idx%7, row = Math.floor(idx/7);
    const x = x0+col*cw, y=y0+row*ch;
    const count=counts[day]||0, peak=day===18;
    const fill=count ? (count>=5?'#5b6066':'#e6e8ea') : '#fafafa';
    const color=count>=5?'#ffffff':'#111315';
    h += `<rect x="${x}" y="${y}" width="70" height="55" fill="${fill}" ${peak?'stroke="#e4002b" stroke-width="3"':'stroke="#e4e5e6"'}/>
      <text x="${x+8}" y="${y+18}" class="mono" fill="${color}" font-size="10">${day}</text>
      ${count?`<text x="${x+60}" y="${y+43}" class="mono" fill="${peak?'#e4002b':color}" font-size="${peak?18:11}" font-weight="700" text-anchor="end">${count}</text>`:''}`;
  }
  return h;
}

const peakTitles = [
  ['时政','北京CBD何以影响世界？'],
  ['时政','北京CBD何以影响世界？'],
  ['民生','小心雷阵雨！端午假期天气预报来啦'],
  ['CBD','来听听这YOUNG的声音'],
  ['文明办','@朝阳少年，“成长搭子”已就位'],
  ['王四营','购车、潮玩和演出！就在汽车消费季'],
  ['时政','国家文化产业创新实验区发展大会'],
  ['民生','全市启动防汛四级响应，三预警齐发'],
  ['民生','暴雨蓝警+雷电黄警！假期出行请注意'],
  ['活动','端午倒计时！这份朝阳攻略快收好']
];

const body02 = `
  <g>
    <text x="72" y="304" class="mono muted micro">01 / YEAR OVERVIEW</text>
    <text x="72" y="335" class="sans ink" font-size="24" font-weight="750">2026 · 已记录内容</text>
    ${annualBars()}
    <text x="72" y="745" class="mono muted small">JAN—AUG / TOTAL 376</text>
  </g>
  <line x1="410" y1="264" x2="410" y2="770" class="hair"/>
  <g>
    <text x="448" y="304" class="mono red micro">02 / PEAK MONTH</text>
    <text x="448" y="335" class="sans ink" font-size="24" font-weight="750">六月 · 83条</text>
    ${juneCalendar()}
    <path d="M350 600 C410 580 420 520 446 510" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/>
    <text x="448" y="745" class="mono muted small">RED OUTLINE = PEAK DAY</text>
  </g>
  <line x1="1000" y1="264" x2="1000" y2="770" class="hair"/>
  <g>
    <text x="1036" y="304" class="mono red micro">03 / PEAK DAY</text>
    <text x="1036" y="344" class="sans ink" font-size="32" font-weight="800">06.18</text>
    <text x="1450" y="344" class="mono red" font-size="44" font-weight="700" text-anchor="end">10</text>
    <text x="1456" y="366" class="mono muted small" text-anchor="end">ITEMS / ONE DAY</text>
    ${peakTitles.map((d,i)=>{const y=395+i*34;return `<line x1="1036" y1="${y+14}" x2="1528" y2="${y+14}" class="hair"/><text x="1036" y="${y}" class="mono ${i===8?'red':'muted'}" font-size="9">${String(i+1).padStart(2,'0')} · ${d[0]}</text><text x="1110" y="${y}" class="sans ink" font-size="12" font-weight="${i===8?700:500}">${d[1]}</text>`;}).join('')}
    <path d="M965 500 C1010 490 1015 458 1032 440" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/>
  </g>`;

const body03 = `
  <g>
    <text x="72" y="304" class="mono muted micro">01 / RAW MATERIAL</text>
    <text x="72" y="340" class="sans ink" font-size="24" font-weight="750">原始来稿</text>
    <rect x="72" y="370" width="418" height="248" fill="#f4f5f6"/>
    <text x="96" y="405" class="mono muted small">朝阳区商务局 / 待编辑</text>
    <text x="96" y="454" class="sans ink" font-size="19" font-weight="700">关于进一步支持“一人公司”</text>
    <text x="96" y="484" class="sans ink" font-size="19" font-weight="700">高质量发展的若干政策措施发布</text>
    <text x="96" y="536" class="sans muted body">政策覆盖办公空间、资金奖补、</text>
    <text x="96" y="564" class="sans muted body">资源对接与创业服务等内容。</text>
    <line x1="96" y1="586" x2="278" y2="586" class="hair"/>
    <text x="96" y="607" class="mono muted" font-size="9">SOURCE COPY / 86 CHARS</text>
  </g>
  <path d="M490 494 C530 494 536 494 568 494" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/>
  <polygon points="568,494 555,487 555,501" fill="#e4002b"/>
  <g>
    <text x="582" y="304" class="mono muted micro">02 / EDITORIAL CUT</text>
    <text x="582" y="340" class="sans ink" font-size="24" font-weight="750">编辑切口</text>
    <line x1="582" y1="370" x2="898" y2="370" class="rule"/>
    <circle cx="588" cy="404" r="4" fill="#1f77b4"/><text x="602" y="409" class="mono blue small">事实核验通过</text>
    ${[['用户最关心什么？','最高奖励500万'],['谁能获得？','一人公司'],['背景是否进标题？','不进入'],['阅读动作是什么？','快速理解政策价值']].map((d,i)=>{const y=452+i*72;return `<text x="582" y="${y}" class="sans ink body" font-weight="700">${d[0]}</text><text x="898" y="${y}" class="mono ${i===0?'red':'muted'} small" text-anchor="end">${d[1]}</text><line x1="582" y1="${y+22}" x2="898" y2="${y+22}" class="hair"/>`;}).join('')}
    <text x="582" y="741" class="mono muted small">REMOVE BACKGROUND · KEEP VALUE</text>
  </g>
  <path d="M898 494 C930 494 940 494 972 494" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/>
  <polygon points="972,494 959,487 959,501" fill="#e4002b"/>
  <g>
    <text x="986" y="304" class="mono red micro">03 / USER-FACING TITLE</text>
    <text x="986" y="340" class="sans ink" font-size="24" font-weight="750">面向用户的表达</text>
    <rect x="986" y="370" width="542" height="248" fill="#ffffff" stroke="#111315" stroke-width="2"/>
    <rect x="986" y="370" width="542" height="5" fill="#e4002b"/>
    <text x="1014" y="413" class="mono red small">WECHAT PUSH / FINAL</text>
    <text x="1014" y="477" class="sans ink" font-size="33" font-weight="800">最高奖励500万！</text>
    <text x="1014" y="525" class="sans ink" font-size="33" font-weight="800">朝阳支持“一人公司”</text>
    <line x1="1014" y1="545" x2="1265" y2="545" class="redrule"/>
    <text x="1014" y="587" class="mono muted small">数字重点 / 信息直给 / 用户价值</text>
    <text x="1510" y="597" class="mono red" font-size="20" text-anchor="end">48%</text>
  </g>
  <text x="72" y="750" class="mono muted small">THE TITLE CHANGES; THE FACTS DO NOT.</text>`;

function sourceTags() {
  const tags = ['商务局 15','文旅局 12','科信局 11','文旅集团 7','发改委 7','东坝乡 6','CBD管委会 6','教委 5','组织部 5','水务局 4','联合来源 11','温榆河 1'];
  return tags.map((t,i)=>{const col=i%2,row=Math.floor(i/2);const x=72+col*160,y=362+row*55;return `<rect x="${x}" y="${y}" width="144" height="38" fill="${i===0?'#ffffff':'#f4f5f6'}" ${i===0?'stroke="#e4002b" stroke-width="2"':''}/><text x="${x+12}" y="${y+24}" class="sans ${i===0?'red':'ink'}" font-size="13" font-weight="650">${t}</text>`;}).join('');
}

const body04 = `
  <g>
    <text x="72" y="304" class="mono muted micro">01 / HETEROGENEOUS SUPPLY</text>
    <text x="72" y="340" class="sans ink" font-size="24" font-weight="750">51种来源</text>
    ${sourceTags()}
    <text x="72" y="728" class="mono muted small">147 MARKED RECORDS</text>
  </g>
  <path d="M388 480 C420 480 430 480 456 480" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/><polygon points="456,480 444,473 444,487" fill="#e4002b"/>
  <line x1="420" y1="264" x2="420" y2="770" class="hair"/>
  <g>
    <text x="456" y="304" class="mono muted micro">02 / SOURCE TYPING</text>
    <text x="456" y="340" class="sans ink" font-size="24" font-weight="750">四条供给轨道</text>
    ${[
      ['区级机关 / 专业部门','104条','专业校验优先'],
      ['街乡 / 基层','23条','人物与生活场景'],
      ['联合来源','11条','先统一责任边界'],
      ['企业 / 项目机构','9条','弱化宣传表达']
    ].map((d,i)=>{const y=382+i*84;const hot=i===0;return `<rect x="456" y="${y}" width="332" height="62" fill="${hot?'#111315':'#f4f5f6'}"/><text x="474" y="${y+26}" class="sans" fill="${hot?'#ffffff':'#111315'}" font-size="15" font-weight="700">${d[0]}</text><text x="770" y="${y+26}" class="mono" fill="${hot?'#e4002b':'#5b6066'}" font-size="11" text-anchor="end">${d[1]}</text><text x="474" y="${y+48}" class="mono" fill="${hot?'#cfd2d4':'#5b6066'}" font-size="9">${d[2]}</text>`;}).join('')}
    <text x="456" y="728" class="mono red small">SELECTED / 区级机关</text>
  </g>
  <path d="M788 414 C820 414 830 414 854 414" fill="none" stroke="#e4002b" stroke-width="2" stroke-dasharray="5 6"/><polygon points="854,414 842,407 842,421" fill="#e4002b"/>
  <line x1="824" y1="264" x2="824" y2="770" class="hair"/>
  <g>
    <text x="860" y="304" class="mono red micro">03 / JUDGMENT &amp; DECISION</text>
    <text x="860" y="340" class="sans ink" font-size="24" font-weight="750">选中一条，逐项判断</text>
    <rect x="860" y="370" width="668" height="96" fill="#ffffff" stroke="#e4002b" stroke-width="2"/>
    <text x="880" y="400" class="mono red small">朝阳区商务局 / POLICY</text>
    <text x="880" y="435" class="sans ink" font-size="19" font-weight="750">最高奖励500万！朝阳支持“一人公司”</text>
    ${[
      ['权威性',.92],['用户价值',.78],['时效',.64],['完整度',.82],['风险',.30],['转化成本',.48]
    ].map((d,i)=>{const col=i%3,row=Math.floor(i/3);const x=860+col*224,y=500+row*76;return `<text x="${x}" y="${y}" class="sans ink" font-size="14" font-weight="700">${d[0]}</text><rect x="${x}" y="${y+14}" width="190" height="5" fill="#e6e7e8"/><rect x="${x}" y="${y+14}" width="${190*d[1]}" height="5" fill="${i===0?'#e4002b':'#111315'}"/><text x="${x+190}" y="${y}" class="mono muted" font-size="9" text-anchor="end">${String(Math.round(d[1]*100)).padStart(2,'0')}</text>`;}).join('')}
    <line x1="860" y1="650" x2="1528" y2="650" class="hair"/>
    <text x="860" y="681" class="mono muted micro">OUTPUT STATE</text>
    ${['发布','改写','核实','延后','替换'].map((t,i)=>{const x=860+i*132;const hot=i===1;return `<rect x="${x}" y="699" width="116" height="38" fill="${hot?'#e4002b':'#f4f5f6'}"/><text x="${x+58}" y="724" class="sans" fill="${hot?'#ffffff':'#5b6066'}" font-size="14" font-weight="700" text-anchor="middle">${t}</text>`;}).join('')}
  </g>`;

const body05 = `
  <g>
    <text x="72" y="304" class="mono muted micro">01 / EVIDENCE TIMELINE</text>
    <text x="72" y="340" class="sans ink" font-size="24" font-weight="750">五条真实记录</text>
    <line x1="94" y1="382" x2="94" y2="718" stroke="#d9dcdf" stroke-width="2"/>
    <line x1="94" y1="382" x2="94" y2="550" stroke="#e4002b" stroke-width="2"/>
    ${[
      ['01','专业数据','07.06 · 商务局'],
      ['02','活动场景','05.29 · 文旅集团'],
      ['03','联合来源','04.03 · 三方协同'],
      ['04','民生预警','06.08 · 民生提示'],
      ['05','峰值调度','06.18 · 单日10条']
    ].map((d,i)=>{const y=392+i*82;const hot=i===2;return `<circle cx="94" cy="${y}" r="${hot?9:6}" fill="${hot?'#e4002b':'#ffffff'}" stroke="${hot?'#e4002b':'#111315'}" stroke-width="2"/><text x="124" y="${y-3}" class="mono ${hot?'red':'muted'} small">${d[0]} / ${d[2]}</text><text x="124" y="${y+23}" class="sans ink" font-size="17" font-weight="${hot?800:650}">${d[1]}</text>`;}).join('')}
  </g>
  <line x1="474" y1="264" x2="474" y2="770" class="hair"/>
  <g>
    <text x="516" y="304" class="mono red micro">02 / ACTIVE CASE 03</text>
    <text x="516" y="340" class="sans ink" font-size="24" font-weight="750">联合来源先拆责任，再统一主线。</text>
    <rect x="516" y="372" width="1012" height="94" fill="#111315"/>
    <text x="542" y="405" class="mono red small">2026-04-03 · 园林绿化局 × 北京公交集团 × 朝阳文旅集团</text>
    <text x="542" y="441" class="sans" fill="#ffffff" font-size="23" font-weight="750">“免费！朝阳花园节接驳巴士发车喽——”</text>
    <g transform="translate(516,506)">
      <text x="0" y="0" class="mono muted micro">JUDGMENT</text>
      <text x="0" y="40" class="sans ink" font-size="19" font-weight="750">谁确认什么？</text>
      <text x="0" y="76" class="sans muted body">活动体验、交通信息与公共服务，</text>
      <text x="0" y="104" class="sans muted body">分别由不同来源承担事实责任。</text>
      <line x1="0" y1="138" x2="280" y2="138" class="hair"/>
      <text x="344" y="0" class="mono muted micro">PROCESS</text>
      <text x="344" y="40" class="sans ink" font-size="19" font-weight="750">先确定用户主线</text>
      <text x="344" y="76" class="sans muted body">按责任边界逐项核对，</text>
      <text x="344" y="104" class="sans muted body">再合并为一个发布口径。</text>
      <line x1="344" y1="138" x2="624" y2="138" class="hair"/>
      <text x="688" y="0" class="mono red micro">TRANSFER</text>
      <text x="688" y="40" class="sans ink" font-size="19" font-weight="750">反馈边界清晰</text>
      <text x="688" y="76" class="sans muted body">面对多角色作者或业务方时，</text>
      <text x="688" y="104" class="sans muted body">判断与协同可以同时落地。</text>
      <line x1="688" y1="138" x2="1012" y2="138" class="redrule"/>
    </g>
    <text x="516" y="724" class="mono muted small">EVERY CLAIM RETURNS TO A DATE, A TITLE AND A SOURCE.</text>
    <text x="1528" y="724" class="mono red" font-size="30" font-weight="700" text-anchor="end">03 / 05</text>
  </g>`;

const files = [
  {
    name:'02_年度到峰值日',
    svg:shell({index:'02',kicker:'WORKLOAD DRILL-DOWN',title:'峰值不是一个数字，是十条同时抵达的决定。',subtitle:'滚动把年度总览逐层放大到峰值月份，再落到一天之内的十条具体内容。',progress:68,body:body02,stages:['年度总览','锁定峰值月','展开日期格','列出十条内容','恢复可交互日历'],active:3,note:'由滚动进度切换三层尺度；完成后释放固定画面，日历恢复点击与筛选。'})
  },
  {
    name:'03_标题语言转换',
    svg:shell({index:'03',kicker:'TITLE TRANSFORMATION',title:'同一条信息，需要换一种语言抵达用户。',subtitle:'事实保持不变；滚动只展示编辑如何提炼数字、对象和用户价值。',progress:56,body:body03,stages:['原始来稿','识别事实','寻找用户切口','生成标题','进入风格数据'],active:2,note:'文字在8px范围内交叉淡入；不使用逐字打字机效果，避免把编辑判断变成装饰。'})
  },
  {
    name:'04_来源分型与判断决策',
    svg:shell({index:'04',kicker:'SOURCE TYPING &amp; DECISION',title:'来源不同，判断标准不能相同。',subtitle:'滚动先把多来源供给分成四类，再让一条内容通过六项判断并进入明确状态。',progress:64,body:body04,stages:['来源进入','归入四类','选中一条','完成六项判断','输出处理状态'],active:3,note:'只移动来源标签和选中卡片；数据条与策略文字在落位后保持静止，便于阅读。'})
  },
  {
    name:'05_真实记录复盘',
    svg:shell({index:'05',kicker:'EVIDENCE-BASED REVIEW',title:'每一次判断，都能回到一条真实记录。',subtitle:'案例正常向上滚动，右侧固定摘要只随当前案例切换，证据始终可见。',progress:52,body:body05,stages:['专业数据','活动场景','联合来源','民生预警','峰值调度'],active:2,note:'红点跟随案例位置移动；右侧摘要用220ms淡入切换，不改变案例正文的自然阅读。'})
  }
];

async function main(){
  const firstSource = path.join(root, '微信推送作品集_滚动排期方案.svg');
  const firstSvg = fs.readFileSync(firstSource, 'utf8');
  const all = [{name:'01_选题库到发布日历',svg:firstSvg}, ...files];
  for (const item of all) {
    const svgPath = path.join(out, item.name + '.svg');
    const pngPath = path.join(out, item.name + '.png');
    fs.writeFileSync(svgPath, item.svg);
    await sharp(Buffer.from(item.svg)).png().toFile(pngPath);
    console.log(path.basename(pngPath));
  }
}

main().catch(err=>{console.error(err);process.exit(1);});
