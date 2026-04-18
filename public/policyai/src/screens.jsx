const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

/* ================================================================
 *  ASK  (home)
 * ================================================================ */
function AskScreen({ onSubmit, onNav }) {
  const [q, setQ] = uS('');
  const ta = uR(null);
  uE(() => { ta.current?.focus(); }, []);

  const submit = (text) => {
    const t = (text ?? q).trim();
    if (!t) return;
    onSubmit(t);
  };

  return (
    <div className="h-full overflow-y-auto nice-scroll">
      <div className="max-w-[860px] mx-auto px-10 pt-24 pb-20">
        {/* Masthead */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <Logomark />
            <div className="font-serif text-[22px] tracking-tightest text-ink-700">PolicyAI</div>
          </div>
          <div className="ml-auto flex items-center gap-3 text-[12px] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <LiveDot/> Corpus live — last sync <span className="text-ink-700 tnum">14 min ago</span>
            </span>
          </div>
        </div>

        <h1 className="font-serif text-[34px] leading-[1.15] tracking-tightest text-ink-700">
          Research Indian regulation with citations,
          <span className="text-ink-400"> not vibes.</span>
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-[62ch]">
          Ask a question in plain English. Every answer is grounded in the original
          notification, circular, or ruling — with section, date, and full excerpt.
        </p>

        {/* Search input */}
        <div className="mt-8 group relative">
          <div className="flex items-start gap-3 border border-ink-200 bg-white rounded-md px-4 py-3.5 focus-within:border-ink-500 transition-colors shadow-card">
            <div className="pt-1 text-ink-400"><Icon.Search size={18}/></div>
            <textarea
              ref={ta}
              value={q}
              onChange={e=>setQ(e.target.value)}
              onKeyDown={e=>{ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Ask about any Indian regulation, circular, or ruling…"
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.55] placeholder:text-ink-300 text-ink-800 pt-0.5"
            />
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 text-[11px] text-ink-400">
                <Kbd>↵</Kbd> to ask
              </div>
              <Btn variant="primary" size="md" onClick={()=>submit()}
                iconRight={<Icon.ArrowRight size={14}/>}>
                Ask
              </Btn>
            </div>
          </div>
          {/* Sub-controls */}
          <div className="mt-3 flex items-center gap-4 text-[12px] text-ink-500">
            <button className="inline-flex items-center gap-1.5 hover:text-ink-700">
              <Icon.Filter size={13}/> Scope: <span className="text-ink-700 font-medium">All regulators</span>
              <Icon.ChevronDown size={12}/>
            </button>
            <button className="inline-flex items-center gap-1.5 hover:text-ink-700">
              <Icon.Calendar size={13}/> Date: <span className="text-ink-700 font-medium">Last 24 months</span>
              <Icon.ChevronDown size={12}/>
            </button>
            <button className="inline-flex items-center gap-1.5 hover:text-ink-700">
              <Icon.FileText size={13}/> Doc type: <span className="text-ink-700 font-medium">Any</span>
              <Icon.ChevronDown size={12}/>
            </button>
            <div className="ml-auto text-ink-400">
              Answers grounded in primary sources; model output never used as authority.
            </div>
          </div>
        </div>

        {/* Example chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {EXAMPLE_CHIPS.map(c => (
            <Chip key={c} onClick={()=>submit(c)}>{c}</Chip>
          ))}
        </div>

        {/* Corpus stat row */}
        <div className="mt-10 border-t border-line pt-5">
          <div className="grid grid-cols-4 gap-6 text-[13px]">
            <Stat label="Passages indexed" value="12.4 M" hint="full-text + tabular"/>
            <Stat label="Regulators covered" value="47" hint="central, state, SRO"/>
            <Stat label="Documents tracked" value="1.68 M" hint="since 1949"/>
            <Stat label="Last sync" value="14 min ago" hint="continuous ingest" rust/>
          </div>
        </div>

        {/* This week in regulation */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-serif text-[18px] tracking-tightest text-ink-700">This week in regulation</div>
            <button className="text-[12px] text-ink-500 hover:text-ink-700 inline-flex items-center gap-1"
              onClick={()=>onNav('corpus')}>
              Open corpus browser <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[CORPUS_ROWS[0], CORPUS_ROWS[1], CORPUS_ROWS[7]].map((r, i) => (
              <WeekCard key={i} row={r}/>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-serif text-[18px] tracking-tightest text-ink-700">Recent threads</div>
            <button className="text-[12px] text-ink-500 hover:text-ink-700 inline-flex items-center gap-1"
              onClick={()=>onNav('threads')}>
              All threads <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <div className="border border-line rounded-md bg-white overflow-hidden">
            {THREADS.slice(0,5).map((t,i) => (
              <button key={t.id} onClick={()=>onSubmit(t.q)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-bg2 transition-colors ${i>0?'border-t border-line2':''}`}>
                <Icon.MessageSquare size={14} className="text-ink-300"/>
                <div className="flex-1 min-w-0 truncate text-[13px] text-ink-700">{t.q}</div>
                <div className="flex items-center gap-2">
                  {t.regs.map(r => <RegPill key={r} code={r} size="xs"/>)}
                </div>
                <div className="w-[88px] text-right text-[11.5px] text-ink-400 tnum">{t.last}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, rust=false }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`mt-1 font-serif text-[22px] tracking-tightest ${rust?'text-rust-600':'text-ink-700'} tnum`}>{value}</div>
      {hint && <div className="text-[11.5px] text-ink-400 mt-0.5">{hint}</div>}
    </div>
  );
}

function WeekCard({ row }) {
  return (
    <div className="border border-line bg-white rounded-md p-3.5 hover:border-ink-200 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <RegPill code={row.regulator} size="xs"/>
        <span className="text-[11px] text-ink-400">{row.type}</span>
        <span className="ml-auto text-[11px] text-ink-400 tnum">{row.issued}</span>
      </div>
      <div className="font-serif text-[14.5px] leading-[1.35] text-ink-800 tracking-tightest">{row.title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {row.tags.slice(0,3).map(t => <Tag key={t}>{t}</Tag>)}
      </div>
    </div>
  );
}

function Logomark() {
  // Simple, serious mark — monogram inside a hairline rule
  return (
    <div className="relative h-6 w-6 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="absolute inset-0" width="24" height="24">
        <rect x="1.5" y="1.5" width="21" height="21" rx="2" fill="#1A2847"/>
        <path d="M7 17V7h4.2c2 0 3.3 1.2 3.3 3s-1.3 3-3.3 3H9v4H7z" fill="#FAFAF7"/>
        <circle cx="17" cy="16.5" r="1.2" fill="#B54A2C"/>
      </svg>
    </div>
  );
}

/* ================================================================
 *  ANSWER
 * ================================================================ */
function AnswerScreen({ question, onBack, onNav }) {
  const [streaming, setStreaming] = uS(true);
  const [progress, setProgress] = uS(0);
  const [activeCite, setActiveCite] = uS(null);

  uE(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 28) { setStreaming(false); clearInterval(id); }
    }, 45);
    return () => clearInterval(id);
  }, []);

  // Streamed answer paragraphs — split into word groups with cite markers
  const paragraphs = [
    {
      h: 'Summary',
      w: [
        'As of 14 April 2026, three material changes govern Category II AIFs that originate or acquire unlisted debt securities.',
        'First, valuation of such holdings must follow a methodology approved by a recognised Association of Investment Managers, with dispersion across independent valuers disclosed quarterly to investors',
        { cite: 1 },
        '. Second, the Private Placement Memorandum must now carry a dedicated "Dispersion and Redressal" annexure where valuation variance exceeds 20% across valuers',
        { cite: 2 },
        '. Third, a credit-specialist Investment Committee is sufficient — a separate "credit risk manager" role is not mandated',
        { cite: 3 },
        '.',
      ],
    },
    {
      h: 'What changed vs. the 2024 regime',
      w: [
        'The earlier regime permitted fair-value marking by the investment manager with only annual independent validation. The Second Amendment Regulations, 2026 move valuation to a standardised methodology effective 1 May 2026, and require pre-transition reconciliation to be completed before 30 September 2026',
        { cite: 1 },
        '. The Board has also signalled, through the 14 April 2026 press release, that co-investment through a separate vehicle and differential rights within the same class will be formally recognised in forthcoming amendments',
        { cite: 5 },
        '.',
      ],
    },
    {
      h: 'Under consultation',
      w: [
        'SEBI\'s 28 March 2026 consultation paper proposes reducing the minimum commitment for Accredited Investors into Category II AIFs from ₹1 crore to ₹25 lakh, subject to a ₹7.5 crore net-worth threshold',
        { cite: 4 },
        '. Comments close 30 April 2026; the proposal is likely to be combined with the co-investment framework.',
      ],
    },
  ];

  // Flatten into tokens with progressive reveal
  const tokens = uM(() => {
    const out = [];
    paragraphs.forEach((para, pi) => {
      out.push({ kind:'h', text: para.h, pi });
      para.w.forEach((chunk, ci) => {
        if (typeof chunk === 'string') {
          const words = chunk.split(/(\s+)/);
          words.forEach(w => out.push({ kind:'w', text:w, pi, ci }));
        } else if (chunk.cite) {
          out.push({ kind:'c', cite: chunk.cite, pi, ci });
        }
      });
      out.push({ kind:'br', pi });
    });
    return out;
  }, []);

  const revealCount = streaming ? Math.floor(tokens.length * Math.min(progress/28, 1)) : tokens.length;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-3 border-b border-line bg-paper flex items-center gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-500 hover:text-ink-700">
          <Icon.ChevronLeft size={14}/> Ask
        </button>
        <Breadcrumb items={['Threads', 'SEBI AIF — Category II amendments']} />
        <div className="ml-auto flex items-center gap-2">
          <Btn size="sm" variant="ghost" iconLeft={<Icon.Save size={13}/>}>Save to workspace</Btn>
          <Btn size="sm" variant="ghost" iconLeft={<Icon.Share size={13}/>}>Share</Btn>
          <Btn size="sm" variant="ghost" iconLeft={<Icon.Copy size={13}/>}>Copy with citations</Btn>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* LEFT 60% — Answer column */}
        <div className="flex-1 min-w-0 overflow-y-auto nice-scroll">
          <div className="max-w-[720px] mx-auto px-8 pt-6 pb-20">
            {/* Question */}
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Question · 14 Apr 2026, 16:22 IST</div>
              <h2 className="font-serif text-[22px] leading-[1.25] tracking-tightest text-ink-800">{question}</h2>
            </div>

            {/* Confidence + filters */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <ConfidencePill level="High"/>
              <Tag>5 primary sources</Tag>
              <Tag>Reviewed ≤ 24 months</Tag>
              <div className="ml-auto flex items-center gap-2">
                <FilterChip label="Date" value="Since 1 Jan 2024"/>
                <FilterChip label="Regulators" value="SEBI"/>
                <FilterChip label="Doc type" value="Any"/>
                <Btn size="sm" variant="ghost" iconLeft={<Icon.Plus size={13}/>}>Filter</Btn>
              </div>
            </div>

            {/* Answer body */}
            <div className="font-serif text-[15.5px] leading-[1.75] text-ink-800 tracking-[0.002em]">
              {renderTokens(tokens.slice(0, revealCount), activeCite, setActiveCite)}
              {streaming && <span className="caret"/>}
            </div>

            {/* Follow-ups */}
            <div className="mt-8 border-t border-line pt-4">
              <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-2">Follow-up</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Draft a PPM clause reflecting the new dispersion disclosure',
                  'Compare against Category III AIF valuation rules',
                  'What does "AIM-approved methodology" mean in practice?',
                  'Timeline of AIF Regulation amendments since 2020',
                ].map(f => <Chip key={f}>{f}</Chip>)}
              </div>
            </div>

            {/* Action bar */}
            <div className="mt-8 flex items-center justify-between border border-line bg-white rounded-md px-4 py-3">
              <div className="text-[12.5px] text-ink-500">
                Answer composed from <span className="text-ink-700 font-medium">5 passages</span> across <span className="text-ink-700 font-medium">5 documents</span>.
                <span className="mx-2 text-ink-200">|</span>
                Generated in <span className="tnum text-ink-700">1.24s</span>
              </div>
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="outlineAccent" iconLeft={<Icon.Bell size={13}/>}>Watch this topic</Btn>
                <Btn size="sm" variant="secondary" iconLeft={<Icon.FileText size={13}/>}>Export memo (.docx)</Btn>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 40% — Citations */}
        <CitationPanel citations={CITATIONS} activeCite={activeCite} setActiveCite={setActiveCite} />
      </div>
    </div>
  );
}

function renderTokens(tokens, activeCite, setActiveCite) {
  const byPara = {};
  tokens.forEach(t => { (byPara[t.pi] ||= []).push(t); });
  return Object.keys(byPara).map(pi => {
    const list = byPara[pi];
    return (
      <div key={pi} className="mb-5">
        {list.map((t, i) => {
          if (t.kind === 'h') return (
            <div key={i} className="text-[12px] uppercase tracking-wider text-ink-400 mb-2 font-sans fade-up">{t.text}</div>
          );
          if (t.kind === 'br') return null;
          if (t.kind === 'c') return (
            <a key={i} onClick={()=>{
                setActiveCite(t.cite);
                const el = document.getElementById(`cite-${t.cite}`);
                if (el) el.scrollIntoView && el.scrollIntoView({block:'center', behavior:'smooth'});
              }}
              className={`cite-mark stream-word ${activeCite===t.cite?'underline':''}`}
              style={{animationDelay:`${i*8}ms`}}>
              [{t.cite}]
            </a>
          );
          return (
            <span key={i} className="stream-word" style={{animationDelay:`${i*8}ms`}}>{t.text}</span>
          );
        })}
      </div>
    );
  });
}

function FilterChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 h-6 rounded-sm border border-ink-100 bg-white text-[11.5px] whitespace-nowrap">
      <span className="text-ink-400">{label}:</span>
      <span className="text-ink-700">{value}</span>
      <Icon.Close size={11} className="text-ink-300 hover:text-ink-700 cursor-pointer"/>
    </span>
  );
}

function CitationPanel({ citations, activeCite, setActiveCite }) {
  return (
    <div className="w-[44%] min-w-[500px] max-w-[680px] border-l border-line bg-bg2 flex flex-col">
      <div className="px-5 py-3 border-b border-line bg-paper flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-ink-400">Sources</div>
          <div className="text-[13px] text-ink-700 font-medium whitespace-nowrap"><span className="tnum">{citations.length}</span> primary documents</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value="Relevance" onChange={()=>{}} options={['Relevance','Most recent','Authority']} className="w-[140px]"/>
          <Btn size="sm" variant="ghost" iconLeft={<Icon.Columns size={13}/>}>Compare</Btn>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll divide-y divide-line2">
        {citations.map(c => (
          <CitationCard key={c.id} c={c} active={activeCite===c.id}
            onClick={()=>setActiveCite(c.id)}/>
        ))}
      </div>
    </div>
  );
}

function CitationCard({ c, active, onClick }) {
  return (
    <div id={`cite-${c.id}`} onClick={onClick}
      className={`px-5 py-4 cursor-pointer transition-colors ${active?'bg-rust-50 border-l-2 border-l-rust-600':'bg-paper hover:bg-bg2 border-l-2 border-l-transparent'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 font-serif text-[13px] tnum ${active?'text-rust-600':'text-ink-400'}`}>[{c.id}]</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <RegPill code={c.regulator} size="xs"/>
            <span className="text-[11px] text-ink-400 whitespace-nowrap">{c.type}</span>
            <span className="text-[11px] text-ink-300">·</span>
            <span className="text-[11px] text-ink-400 whitespace-nowrap">{c.section}</span>
            <span className="ml-auto text-[11px] tnum text-ink-400 whitespace-nowrap">{c.issued}</span>
          </div>
          <div className="font-serif text-[14px] leading-[1.35] tracking-tightest text-ink-800">{c.title}</div>
          <div className="text-[11.5px] text-ink-400 mt-0.5 font-mono">{c.ref}</div>

          <div className="mt-2 font-serif text-[13.5px] leading-[1.6] text-ink-700 border-l-2 border-ink-100 pl-3">
            "{c.excerpt}"
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11.5px] flex-wrap">
            <button className="inline-flex items-center gap-1 text-rust-600 hover:text-rust-700 whitespace-nowrap">
              Open full text <Icon.External size={11}/>
            </button>
            <span className="text-ink-300">·</span>
            <button className="text-ink-500 hover:text-ink-700 whitespace-nowrap">Quote</button>
            <span className="text-ink-300">·</span>
            <button className="text-ink-500 hover:text-ink-700 whitespace-nowrap">Add to workspace</button>
            <span className="ml-auto text-ink-400 whitespace-nowrap">
              Relevance <span className="text-ink-700 tnum">{(c.score*100).toFixed(0)}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
 *  CORPUS BROWSER
 * ================================================================ */
function CorpusScreen({ openDrawer }) {
  const [regs, setRegs]   = uS(new Set(['SEBI','RBI','CBIC']));
  const [types, setTypes] = uS(new Set());
  const [sectors, setSectors] = uS(new Set());
  const [state, setState] = uS(new Set());
  const [q, setQ] = uS('');
  const [hovered, setHovered] = uS(null);
  const [sortBy, setSortBy] = uS('Most recent');

  const toggle = (set, setter) => (k) => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    setter(n);
  };

  const filtered = uM(() => {
    return CORPUS_ROWS.filter(r => {
      if (regs.size && !regs.has(r.regulator)) return false;
      if (types.size && !types.has(r.type)) return false;
      if (sectors.size && !sectors.has(r.sector)) return false;
      if (state.size && !state.has(r.state)) return false;
      if (q && !((r.title+' '+r.excerpt+' '+r.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [regs, types, sectors, state, q]);

  return (
    <div className="h-full flex min-h-0">
      {/* Facet rail */}
      <aside className="w-[272px] shrink-0 border-r border-line bg-paper overflow-y-auto nice-scroll">
        <div className="px-5 py-4 border-b border-line">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Corpus</div>
          <div className="font-serif text-[18px] tracking-tightest text-ink-700">12,432,890 passages</div>
          <div className="text-[11.5px] text-ink-400 mt-0.5">across 47 regulators · updated continuously</div>
        </div>

        <FacetBlock title="Regulator" items={FACETS.regulator} selected={regs} onToggle={toggle(regs,setRegs)} showPill/>
        <FacetBlock title="Document type" items={FACETS.docType} selected={types} onToggle={toggle(types,setTypes)}/>
        <FacetBlock title="Sector" items={FACETS.sector} selected={sectors} onToggle={toggle(sectors,setSectors)}/>
        <FacetBlock title="State / jurisdiction" items={FACETS.state} selected={state} onToggle={toggle(state,setState)}/>

        <div className="px-5 py-4 border-t border-line">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-2">Date range</div>
          <div className="flex items-center gap-1.5">
            <input className="h-8 w-full border border-ink-200 rounded-sm px-2 text-[12.5px] bg-white tnum" defaultValue="01 Jan 2024"/>
            <span className="text-ink-300">→</span>
            <input className="h-8 w-full border border-ink-200 rounded-sm px-2 text-[12.5px] bg-white tnum" defaultValue="19 Apr 2026"/>
          </div>
        </div>
      </aside>

      {/* Main list */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-6 pt-4 pb-3 border-b border-line bg-paper">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[520px]">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"><Icon.Search size={14}/></div>
              <input
                value={q}
                onChange={e=>setQ(e.target.value)}
                placeholder="Search title, excerpt, tag, or document number…"
                className="h-9 w-full pl-8 pr-3 border border-ink-200 rounded-sm text-[13px] bg-white focus:outline-none focus:border-ink-500"/>
            </div>
            <Select value={sortBy} onChange={setSortBy}
              options={['Most recent','Effective date','Relevance','Most cited']}/>
            <Btn size="sm" variant="secondary" iconLeft={<Icon.Save size={13}/>}>Save view</Btn>
            <Btn size="sm" variant="outlineAccent" iconLeft={<Icon.Bell size={13}/>}>Alert on new matches</Btn>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[12px] text-ink-500">
            <span className="tnum">{filtered.length}</span> of <span className="tnum">{CORPUS_ROWS.length}</span> shown
            <span className="text-ink-200">·</span>
            <ActiveFacets selected={[...regs,...types,...sectors,...state]}
              onClear={() => { setRegs(new Set()); setTypes(new Set()); setSectors(new Set()); setState(new Set()); }}/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto nice-scroll">
          {/* Column headers */}
          <div className="sticky top-0 z-10 grid grid-cols-[72px_1fr_92px_92px_180px] gap-3 px-6 py-2 border-b border-line bg-paper/90 backdrop-blur text-[10.5px] uppercase tracking-wider text-ink-400">
            <div>Regulator</div>
            <div>Title</div>
            <div className="text-right">Issued</div>
            <div className="text-right">Effective</div>
            <div>Topics</div>
          </div>

          <div className="divide-y divide-line2">
            {filtered.map((r, i) => (
              <CorpusRow key={i} row={r}
                hovered={hovered===i}
                onHover={()=>setHovered(i)}
                onLeave={()=>setHovered(null)}
                onOpen={()=>openDrawer(r)}/>
            ))}
            {filtered.length===0 && (
              <div className="px-6 py-10 text-center text-[13px] text-ink-400">No matches for the current facets.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FacetBlock({ title, items, selected, onToggle, showPill=false }) {
  return (
    <div className="px-5 py-4 border-b border-line">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-wider text-ink-400">{title}</div>
        {selected.size>0 && <button onClick={()=>[...selected].forEach(onToggle)} className="text-[11px] text-rust-600 hover:underline">Clear</button>}
      </div>
      <div>
        {items.slice(0, 8).map(it => (
          <div key={it.k}>
            <Checkbox
              on={selected.has(it.k)}
              onChange={()=>onToggle(it.k)}
              count={it.n}
              label={showPill
                ? <span className="inline-flex items-center gap-2 min-w-0">
                    <RegPill code={it.k} size="xs"/>
                    <span className="text-ink-500 truncate" title={REGULATORS[it.k]?.name}>{REGULATORS[it.k]?.name}</span>
                  </span>
                : <span className="truncate" title={it.k}>{it.k}</span>}/>
          </div>
        ))}
        {items.length > 8 && (
          <button className="mt-1 text-[11.5px] text-ink-500 hover:text-ink-700 inline-flex items-center gap-1">
            Show {items.length-8} more <Icon.ChevronDown size={11}/>
          </button>
        )}
      </div>
    </div>
  );
}

function ActiveFacets({ selected, onClear }) {
  if (!selected.length) return <span className="text-ink-400">No filters applied</span>;
  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className="text-ink-400">Filters:</span>
      {selected.slice(0,6).map(s => (
        <span key={s} className="inline-flex items-center gap-1 px-1.5 h-5 rounded-sm border border-ink-100 bg-white text-[11px] text-ink-700">
          {s}
        </span>
      ))}
      {selected.length>6 && <span className="text-ink-400">+{selected.length-6}</span>}
      <button onClick={onClear} className="text-[11px] text-rust-600 hover:underline ml-1">Clear all</button>
    </span>
  );
}

function CorpusRow({ row, hovered, onHover, onLeave, onOpen }) {
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onOpen}
      className="grid grid-cols-[72px_1fr_92px_92px_180px] gap-3 px-6 py-3.5 cursor-pointer hover:bg-bg2 transition-colors">
      <div className="pt-0.5"><RegPill code={row.regulator} size="xs"/></div>
      <div className="min-w-0">
        <div className="font-serif text-[14px] leading-[1.35] tracking-tightest text-ink-800">{row.title}</div>
        <div className="mt-0.5 text-[11.5px] text-ink-400 font-mono truncate">{row.type} · {row.ref}</div>
        {hovered && (
          <div className="mt-2 font-serif text-[12.5px] leading-[1.55] text-ink-500 border-l-2 border-ink-100 pl-2.5 italic fade-up">
            "{row.excerpt}"
          </div>
        )}
      </div>
      <div className="text-right text-[12px] tnum text-ink-700">{row.issued}</div>
      <div className="text-right text-[12px] tnum text-ink-500">{row.effective}</div>
      <div className="flex flex-wrap gap-1 content-start">
        {row.tags.slice(0,2).map(t => <Tag key={t}>{t}</Tag>)}
        {row.tags.length>2 && <span className="text-[11px] text-ink-400">+{row.tags.length-2}</span>}
      </div>
    </div>
  );
}

/* ================================================================
 *  DOCUMENT DRAWER
 * ================================================================ */
function DocDrawer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/20 backdrop-blur-[1px]" onClick={onClose}/>
      <div className="relative w-[780px] max-w-[92vw] h-full bg-paper shadow-drawer flex flex-col fade-up">
        <div className="px-6 py-3.5 border-b border-line bg-paper flex items-center gap-3">
          <RegPill code={doc.regulator}/>
          <span className="text-[11.5px] text-ink-400">{doc.type}</span>
          <span className="text-ink-200">·</span>
          <span className="text-[11.5px] tnum text-ink-500">Issued {doc.issued}</span>
          <span className="text-ink-200">·</span>
          <span className="text-[11.5px] tnum text-ink-500">Effective {doc.effective}</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Btn size="sm" variant="ghost" iconLeft={<Icon.Bookmark size={13}/>}>Save</Btn>
            <Btn size="sm" variant="ghost" iconLeft={<Icon.Sparkle size={13}/>}>Summarise</Btn>
            <Btn size="sm" variant="ghost" iconLeft={<Icon.External size={13}/>}>Open on regulator site</Btn>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center text-ink-500 hover:text-ink-700 border border-transparent hover:border-ink-200 rounded-sm">
              <Icon.Close size={14}/>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto nice-scroll px-10 py-8">
          <div className="max-w-[640px] mx-auto">
            <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-2 font-mono">{doc.ref}</div>
            <h1 className="font-serif text-[26px] leading-[1.2] tracking-tightest text-ink-800">{doc.title}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {doc.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 p-3 border border-line bg-white rounded-md text-[12px]">
              <MiniStat label="Sector" value={doc.sector}/>
              <MiniStat label="Jurisdiction" value={doc.state}/>
              <MiniStat label="Cited by" value="14 threads"/>
            </div>

            <div className="mt-8 font-serif text-[15.5px] leading-[1.8] text-ink-800 space-y-5">
              <p className="text-ink-400 uppercase tracking-wider text-[11px] font-sans">Preamble</p>
              <p>
                In exercise of the powers conferred by section 30 of the Securities and Exchange Board of India Act, 1992 (15 of 1992),
                read with section 11 and section 12 thereof, the Board hereby makes the following regulations to further amend
                the {doc.title.split('—')[0] || doc.title}.
              </p>
              <p className="text-ink-400 uppercase tracking-wider text-[11px] font-sans mt-6">¶ 1. Short title and commencement</p>
              <p>
                These regulations may be called the {doc.title}. They shall come into force on {doc.effective}.
              </p>
              <p className="text-ink-400 uppercase tracking-wider text-[11px] font-sans mt-6">¶ 2. Substantive provision</p>
              <p>
                "{doc.excerpt}" Where such methodology is unavailable for a class of debt security, the investment manager shall
                determine valuation in accordance with the fallback principles set out in Annexure A, with full disclosure to investors
                within fifteen working days from the date of determination.
              </p>
              <p className="text-ink-400 uppercase tracking-wider text-[11px] font-sans mt-6">¶ 3. Transition</p>
              <p>
                Every scheme of a Category II AIF in existence immediately before the commencement of these regulations shall
                complete the transition to the methodology approved hereunder on or before 30 September 2026. Schemes unable
                to complete such transition shall file a reasoned representation before the Board not later than 31 August 2026.
              </p>
            </div>

            <div className="mt-10 border-t border-line pt-5">
              <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-2">Amendments & history</div>
              <div className="space-y-2">
                {[
                  { d:'08 Apr 2026', t:'Second Amendment, 2026 — valuation and dispersion', cur:true },
                  { d:'22 Nov 2024', t:'First Amendment, 2024 — reporting cadence' },
                  { d:'10 Aug 2012', t:'Parent regulation notified in Gazette' },
                ].map((h,i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px]">
                    <div className={`h-1.5 w-1.5 rounded-full ${h.cur?'bg-rust-600':'bg-ink-200'}`}/>
                    <div className="tnum text-ink-400 w-[80px]">{h.d}</div>
                    <div className={h.cur?'text-ink-800 font-medium':'text-ink-500'}>{h.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className="text-[13px] text-ink-800 mt-0.5">{value}</div>
    </div>
  );
}

/* ================================================================
 *  ALERTS
 * ================================================================ */
function AlertsScreen() {
  const [expanded, setExpanded] = uS('a1');
  const [alerts, setAlerts] = uS(ALERTS);

  const toggle = (id) => setAlerts(a => a.map(x => x.id===id ? {...x, active:!x.active} : x));

  return (
    <div className="h-full overflow-y-auto nice-scroll">
      <div className="max-w-[1080px] mx-auto px-8 pt-6 pb-20">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Alerts</div>
            <h1 className="font-serif text-[26px] tracking-tightest text-ink-700">Saved queries firing on new corpus additions</h1>
            <p className="mt-1 text-[13px] text-ink-500">Alerts re-run every 4 minutes against the live ingest stream. Matches are diffed against the previous known version.</p>
          </div>
          <div className="flex items-center gap-2">
            <Btn size="sm" variant="secondary" iconLeft={<Icon.Filter size={13}/>}>Filter</Btn>
            <Btn size="sm" variant="primary" iconLeft={<Icon.Plus size={13}/>}>New alert</Btn>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <SummaryTile label="Active alerts" value={alerts.filter(a=>a.active).length}/>
          <SummaryTile label="Hits (7 days)" value={alerts.reduce((s,a)=>s+a.hits7d,0)}/>
          <SummaryTile label="Total hits" value={alerts.reduce((s,a)=>s+a.hitsTotal,0)} rust/>
          <SummaryTile label="Regulators watched" value={new Set(alerts.flatMap(a=>a.topics)).size}/>
        </div>

        {/* Table */}
        <div className="border border-line bg-white rounded-md">
          <div className="grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-2 border-b border-line text-[10.5px] uppercase tracking-wider text-ink-400">
            <div>Query</div>
            <div className="text-right">Last hit</div>
            <div className="text-right">7-day hits</div>
            <div className="text-right">Total</div>
            <div></div>
          </div>
          {alerts.map((a, i) => (
            <AlertRow key={a.id} a={a} open={expanded===a.id}
              onToggle={()=>setExpanded(expanded===a.id?null:a.id)}
              onToggleActive={()=>toggle(a.id)}/>
          ))}
        </div>

        {/* Suggested */}
        <div className="mt-10">
          <div className="font-serif text-[18px] tracking-tightest text-ink-700 mb-2">Suggested alerts, based on your threads</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { t:'SEBI co-investment framework', r:'SEBI', n:'Likely notification in May 2026' },
              { t:'RBI NBFC-P2P exposure cap', r:'RBI', n:'Press release hinted last week' },
              { t:'DPDP Rules final notification', r:'MeitY', n:'Consultation closed 18 Mar' },
            ].map((s, i) => (
              <div key={i} className="border border-line bg-white rounded-md p-3.5 hover:border-ink-300 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5">
                  <RegPill code={s.r} size="xs"/>
                  <span className="ml-auto text-[11px] text-ink-400">Suggested</span>
                </div>
                <div className="font-serif text-[15px] tracking-tightest text-ink-800">{s.t}</div>
                <div className="text-[12px] text-ink-400 mt-1">{s.n}</div>
                <div className="mt-3">
                  <Btn size="sm" variant="outlineAccent" iconLeft={<Icon.Bell size={12}/>}>Create alert</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, rust=false }) {
  return (
    <div className="border border-line bg-white rounded-md px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`mt-1 font-serif text-[22px] tracking-tightest tnum ${rust?'text-rust-600':'text-ink-700'}`}>{value}</div>
    </div>
  );
}

function AlertRow({ a, open, onToggle, onToggleActive }) {
  return (
    <div className="border-t border-line2 first:border-t-0">
      <button onClick={onToggle}
        className="w-full grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-3 text-left hover:bg-bg2 transition-colors">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <LiveDot on={a.active}/>
            <span className="font-serif text-[14.5px] tracking-tightest text-ink-800">{a.name}</span>
            <Icon.ChevronDown size={12} className={`text-ink-300 transition-transform ${open?'rotate-180':''}`}/>
          </div>
          <div className="mt-1 text-[11.5px] text-ink-500 font-mono truncate">{a.query}</div>
          <div className="mt-1.5 flex gap-1.5 flex-wrap">
            {a.topics.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
        <div className="text-right tnum text-[12.5px] text-ink-700 self-center">{a.lastHit}</div>
        <div className="text-right tnum text-[12.5px] self-center"><span className={a.hits7d>0?'text-rust-600 font-medium':'text-ink-400'}>{a.hits7d}</span></div>
        <div className="text-right tnum text-[12.5px] text-ink-500 self-center">{a.hitsTotal}</div>
        <div className="self-center flex justify-end" onClick={e=>e.stopPropagation()}>
          <Toggle on={a.active} onChange={onToggleActive} size="sm"/>
        </div>
      </button>

      {open && (
        <div className="bg-bg2 border-t border-line2 px-4 py-4 fade-up">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-2">
            Recent matches <span className="text-ink-200">·</span> <span className="inline-flex items-center gap-1"><Icon.Diff size={12}/> diffed against prior version</span>
          </div>
          {a.matches.length===0 && (
            <div className="text-[12.5px] text-ink-400 border border-dashed border-line rounded-md p-4 bg-white">No matches in the current window.</div>
          )}
          <div className="space-y-2">
            {a.matches.map((m, i) => (
              <div key={i} className="border border-line bg-white rounded-md p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <RegPill code={m.regulator} size="xs"/>
                  <span className="font-serif text-[13.5px] tracking-tightest text-ink-800">{m.title}</span>
                  <span className="ml-auto text-[11.5px] tnum text-ink-400">{m.when}</span>
                </div>
                <DiffLine parts={m.diff}/>
                <div className="mt-2 flex items-center gap-3 text-[11.5px]">
                  <button className="inline-flex items-center gap-1 text-rust-600 hover:text-rust-700">Open diff <Icon.External size={11}/></button>
                  <span className="text-ink-300">·</span>
                  <button className="text-ink-500 hover:text-ink-700">Cite in thread</button>
                  <span className="text-ink-300">·</span>
                  <button className="text-ink-500 hover:text-ink-700">Add to workspace</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
 *  THREADS (list)
 * ================================================================ */
function ThreadsScreen({ onOpen }) {
  return (
    <div className="h-full overflow-y-auto nice-scroll">
      <div className="max-w-[980px] mx-auto px-8 pt-6 pb-20">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Threads</div>
            <h1 className="font-serif text-[26px] tracking-tightest text-ink-700">Your research history</h1>
          </div>
          <Btn size="sm" variant="primary" iconLeft={<Icon.Plus size={13}/>} onClick={()=>onOpen(null)}>New thread</Btn>
        </div>

        <div className="border border-line bg-white rounded-md overflow-hidden">
          {THREADS.map((t, i) => (
            <button key={t.id} onClick={()=>onOpen(t.q)}
              className={`w-full grid grid-cols-[1fr_140px_100px] items-center gap-3 px-4 py-3 text-left hover:bg-bg2 transition-colors ${i>0?'border-t border-line2':''}`}>
              <div className="min-w-0">
                <div className="font-serif text-[14.5px] tracking-tightest text-ink-800">{t.q}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  {t.regs.map(r => <RegPill key={r} code={r} size="xs"/>)}
                  <span className="text-[11.5px] text-ink-400">· 3 sources · 2 follow-ups</span>
                </div>
              </div>
              <div className="text-[12px] tnum text-ink-500">{t.last}</div>
              <div className="text-right text-[11.5px] text-ink-400">High confidence</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
 *  WORKSPACES
 * ================================================================ */
function WorkspacesScreen() {
  return (
    <div className="h-full overflow-y-auto nice-scroll">
      <div className="max-w-[1080px] mx-auto px-8 pt-6 pb-20">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Workspaces</div>
            <h1 className="font-serif text-[26px] tracking-tightest text-ink-700">Shared research projects</h1>
          </div>
          <Btn size="sm" variant="primary" iconLeft={<Icon.Plus size={13}/>}>New workspace</Btn>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {WORKSPACES.map((w, i) => (
            <div key={i} className="border border-line bg-white rounded-md p-4 hover:border-ink-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-sm bg-bg2 border border-line flex items-center justify-center text-ink-500">
                  <Icon.Folder size={16}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[15.5px] tracking-tightest text-ink-800">{w.name}</div>
                  <div className="mt-0.5 text-[12px] text-ink-500">{w.items} saved items · updated {w.updated}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {w.members.map((m, mi) => (
                        <div key={mi} className="h-5 w-5 rounded-full border border-white bg-ink-700 text-white text-[9.5px] flex items-center justify-center tracking-wide">{m}</div>
                      ))}
                    </div>
                    <span className="text-[11.5px] text-ink-400">{w.members.length} member{w.members.length>1?'s':''}</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <Btn size="sm" variant="ghost">Open</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
 *  SETTINGS (light)
 * ================================================================ */
function SettingsScreen() {
  return (
    <div className="h-full overflow-y-auto nice-scroll">
      <div className="max-w-[820px] mx-auto px-8 pt-6 pb-20">
        <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">Settings</div>
        <h1 className="font-serif text-[26px] tracking-tightest text-ink-700">Workspace preferences</h1>

        <div className="mt-6 grid gap-3">
          <SettingRow icon={<Icon.Building size={14}/>} title="Organisation" value="Kotak Mahindra Bank — Legal & Compliance"/>
          <SettingRow icon={<Icon.Users size={14}/>} title="Seats in use" value="14 / 25 enterprise seats"/>
          <SettingRow icon={<Icon.MapPin size={14}/>} title="Default jurisdiction" value="Pan-India · Maharashtra"/>
          <SettingRow icon={<Icon.Clock size={14}/>} title="Alert cadence" value="Every 4 min · Digest at 08:00 IST"/>
          <SettingRow icon={<Icon.Link size={14}/>} title="Citation style" value="Bluebook (India) — section, date, issuing authority"/>
          <SettingRow icon={<Icon.Moon size={14}/>} title="Theme" value="Light (default)"/>
        </div>
      </div>
    </div>
  );
}
function SettingRow({ icon, title, value }) {
  return (
    <div className="flex items-center gap-3 border border-line bg-white rounded-md px-4 py-3">
      <div className="h-7 w-7 rounded-sm bg-bg2 border border-line flex items-center justify-center text-ink-500">{icon}</div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-ink-400">{title}</div>
        <div className="text-[13.5px] text-ink-800">{value}</div>
      </div>
      <Btn size="sm" variant="ghost" className="ml-auto" iconLeft={<Icon.Edit size={12}/>}>Edit</Btn>
    </div>
  );
}

Object.assign(window, {
  AskScreen, AnswerScreen, CorpusScreen, DocDrawer, AlertsScreen,
  ThreadsScreen, WorkspacesScreen, SettingsScreen, Logomark,
});
