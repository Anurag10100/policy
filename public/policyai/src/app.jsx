const { useState: _uS, useEffect: _uE, useRef: _uR } = React;

function LeftNav({ collapsed, setCollapsed, active, onNav, openCmdK }) {
  const w = collapsed ? 'w-[64px]' : 'w-[240px]';
  const items = [
    { id:'ask',        label:'Ask',        icon:<Icon.Sparkle size={16}/> },
    { id:'threads',    label:'Threads',    icon:<Icon.MessageSquare size={16}/>, badge: THREADS.length },
    { id:'corpus',     label:'Corpus',     icon:<Icon.Library size={16}/> },
    { id:'alerts',     label:'Alerts',     icon:<Icon.Bell size={16}/>, badge: '3 new', rust:true },
    { id:'workspaces', label:'Workspaces', icon:<Icon.Users size={16}/> },
    { id:'settings',   label:'Settings',   icon:<Icon.Settings size={16}/> },
  ];

  return (
    <aside className={`${w} shrink-0 border-r border-line bg-paper flex flex-col transition-[width] duration-200`}>
      {/* Brand */}
      <div className={`flex items-center gap-2 px-3 h-[52px] border-b border-line ${collapsed?'justify-center':''}`}>
        <Logomark/>
        {!collapsed && <div className="font-serif text-[16px] tracking-tightest text-ink-700">PolicyAI</div>}
        {!collapsed && <div className="ml-auto text-[10px] uppercase tracking-wider text-ink-400 border border-line px-1.5 py-[1px] rounded-sm">Enterprise</div>}
      </div>

      {/* Command */}
      <div className={`p-2.5 ${collapsed?'':''}`}>
        <button onClick={openCmdK}
          className={`w-full flex items-center gap-2 h-8 px-2 text-[12.5px] text-ink-500 hover:text-ink-700 border border-ink-100 bg-white hover:border-ink-200 rounded-sm`}>
          <Icon.Search size={14}/>
          {!collapsed && <>
            <span className="flex-1 text-left">Search everything</span>
            <span className="inline-flex items-center gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
          </>}
        </button>
      </div>

      {/* Items */}
      <nav className="px-1.5">
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={()=>onNav(it.id)}
              className={`relative w-full h-8 px-2 my-0.5 flex items-center gap-2.5 rounded-sm text-[13px] transition-colors
                ${isActive ? 'bg-bg2 text-ink-700 font-medium nav-active' : 'text-ink-500 hover:text-ink-700 hover:bg-bg2'}
                ${collapsed?'justify-center':''}`}>
              <span className={isActive?'text-ink-700':'text-ink-400'}>{it.icon}</span>
              {!collapsed && <>
                <span className="flex-1 text-left">{it.label}</span>
                {it.badge && (
                  <span className={`text-[10.5px] px-1.5 py-[1px] rounded-sm ${it.rust?'bg-rust-50 text-rust-600 border border-rust-100':'bg-ink-50 text-ink-500 border border-ink-100'} tnum`}>
                    {it.badge}
                  </span>
                )}
              </>}
            </button>
          );
        })}
      </nav>

      {/* Corpus ambient */}
      {!collapsed && (
        <div className="mx-2.5 mt-4 p-3 border border-line rounded-md bg-white">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
            <LiveDot/> Ingest
          </div>
          <div className="mt-1 font-serif text-[15px] tracking-tightest text-ink-700 tnum">12.4 M passages</div>
          <div className="text-[11px] text-ink-400 mt-0.5">+1,284 today · 47 regulators</div>
          <div className="mt-2 h-1 bg-ink-50 rounded-sm overflow-hidden">
            <div className="h-full bg-ink-700" style={{width:'68%'}}/>
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] text-ink-400">
            <span>SEBI</span><span>RBI</span><span>MCA</span><span>CBIC</span><span>+43</span>
          </div>
        </div>
      )}

      <div className="mt-auto">
        {/* Collapse */}
        <button onClick={()=>setCollapsed(!collapsed)}
          className={`w-full h-8 flex items-center gap-2 px-3 text-[12px] text-ink-400 hover:text-ink-700 border-t border-line ${collapsed?'justify-center':''}`}>
          {collapsed ? <Icon.ChevronRight size={14}/> : <><Icon.ChevronLeft size={14}/><span>Collapse</span></>}
        </button>

        {/* Avatar */}
        <div className={`flex items-center gap-2 px-3 py-3 border-t border-line ${collapsed?'justify-center':''}`}>
          <div className="h-7 w-7 rounded-full bg-ink-700 text-white text-[11px] flex items-center justify-center tracking-wide">AP</div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[12.5px] text-ink-800 truncate leading-tight">Aadhya Patel</div>
              <div className="text-[11px] text-ink-400 truncate leading-tight">GC · Kotak Mahindra</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ============ Command-K palette ============ */
function CommandK({ open, onClose, onNav, onAsk }) {
  const [q, setQ] = _uS('');
  const inp = _uR(null);
  _uE(() => { if (open) setTimeout(()=>inp.current?.focus(), 10); }, [open]);

  const groups = [
    {
      name:'Navigate',
      items:[
        { label:'Ask a new question', hint:'Home', icon:<Icon.Sparkle size={14}/>, do:()=>onNav('ask') },
        { label:'Threads', hint:'Your research history', icon:<Icon.MessageSquare size={14}/>, do:()=>onNav('threads') },
        { label:'Corpus browser', hint:'12.4M passages', icon:<Icon.Library size={14}/>, do:()=>onNav('corpus') },
        { label:'Alerts', hint:'3 new hits', icon:<Icon.Bell size={14}/>, do:()=>onNav('alerts') },
        { label:'Workspaces', hint:'4 shared', icon:<Icon.Users size={14}/>, do:()=>onNav('workspaces') },
      ],
    },
    {
      name:'Ask',
      items: EXAMPLE_CHIPS.map(c => ({
        label: c, hint:'Ask', icon:<Icon.ArrowRight size={14}/>, do:()=>onAsk(c),
      })),
    },
    {
      name:'Recent threads',
      items: THREADS.slice(0,4).map(t => ({
        label: t.q, hint: t.last, icon:<Icon.MessageSquare size={14}/>, do:()=>onAsk(t.q), regs:t.regs,
      })),
    },
    {
      name:'Documents',
      items: CORPUS_ROWS.slice(0,3).map(r => ({
        label: r.title, hint: `${r.regulator} · ${r.issued}`, icon:<Icon.FileText size={14}/>, do:()=>onNav('corpus'), regs:[r.regulator],
      })),
    },
  ];

  const filt = (lst) => q ? lst.filter(x => x.label.toLowerCase().includes(q.toLowerCase())) : lst;

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-[2px]"/>
      <div className="relative w-[640px] max-w-[92vw] bg-paper border border-line rounded-md shadow-pop overflow-hidden fade-up"
        onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-2 px-3.5 h-12 border-b border-line">
          <Icon.Search size={16} className="text-ink-400"/>
          <input ref={inp} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search threads, documents, regulators, or ask a new question…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-300"/>
          <Kbd>esc</Kbd>
        </div>
        <div className="max-h-[56vh] overflow-y-auto nice-scroll">
          {groups.map((g, gi) => {
            const items = filt(g.items);
            if (items.length === 0) return null;
            return (
              <div key={gi} className="px-1.5 py-1.5">
                <div className="px-3 py-1 text-[10.5px] uppercase tracking-wider text-ink-400">{g.name}</div>
                {items.map((it, i) => (
                  <button key={i} onClick={()=>{ it.do(); onClose(); }}
                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-sm text-[13px] text-ink-700 hover:bg-bg2">
                    <span className="text-ink-400">{it.icon}</span>
                    <span className="flex-1 text-left truncate">{it.label}</span>
                    {it.regs && it.regs.map(r => <RegPill key={r} code={r} size="xs"/>)}
                    <span className="text-[11px] text-ink-400">{it.hint}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="px-3.5 h-9 border-t border-line flex items-center gap-3 text-[11px] text-ink-400">
          <span className="inline-flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> Navigate</span>
          <span className="inline-flex items-center gap-1"><Kbd>↵</Kbd> Open</span>
          <span className="inline-flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>↵</Kbd> Ask</span>
          <span className="ml-auto inline-flex items-center gap-1"><Logomark/> PolicyAI</span>
        </div>
      </div>
    </div>
  );
}

/* ============ App shell ============ */
function App() {
  const [collapsed, setCollapsed] = _uS(false);
  const [screen, setScreen]       = _uS('answer'); // land on answer to show the hero view
  const [question, setQuestion]   = _uS('What has changed in the SEBI AIF regulations for Category II in 2026?');
  const [cmdK, setCmdK]           = _uS(false);
  const [drawer, setDrawer]       = _uS(null);

  // ⌘K handler
  _uE(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdK(v => !v);
      } else if (e.key === 'Escape') {
        setCmdK(false);
        setDrawer(null);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const ask = (q) => { setQuestion(q); setScreen('answer'); };

  let body;
  if (screen === 'ask')        body = <AskScreen onSubmit={ask} onNav={setScreen}/>;
  else if (screen === 'answer') body = <AnswerScreen question={question} onBack={()=>setScreen('ask')} onNav={setScreen}/>;
  else if (screen === 'corpus') body = <CorpusScreen openDrawer={setDrawer}/>;
  else if (screen === 'alerts') body = <AlertsScreen/>;
  else if (screen === 'threads') body = <ThreadsScreen onOpen={(q)=>{ if (q) ask(q); else setScreen('ask'); }}/>;
  else if (screen === 'workspaces') body = <WorkspacesScreen/>;
  else if (screen === 'settings') body = <SettingsScreen/>;

  return (
    <div className="h-screen flex overflow-hidden bg-paper">
      <LeftNav collapsed={collapsed} setCollapsed={setCollapsed}
        active={screen} onNav={setScreen} openCmdK={()=>setCmdK(true)}/>
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top utility bar — only when NOT on Ask (Ask has its own masthead) */}
        {screen !== 'ask' && (
          <header className="h-[52px] border-b border-line bg-paper flex items-center gap-3 px-5">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] text-ink-500 capitalize font-medium">
                {screen === 'answer' ? 'Answer' : screen}
              </span>
              {screen === 'answer' && <>
                <span className="text-ink-200">·</span>
                <span className="text-[12px] text-ink-400 truncate max-w-[520px]">{question}</span>
              </>}
            </div>
            <button onClick={()=>setCmdK(true)}
              className="ml-auto flex items-center gap-2 h-8 px-2.5 text-[12.5px] text-ink-500 hover:text-ink-700 border border-ink-100 bg-white hover:border-ink-200 rounded-sm w-[340px]">
              <Icon.Search size={14}/>
              <span className="flex-1 text-left">Search threads, documents, regulators…</span>
              <span className="inline-flex items-center gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
            </button>
            <div className="flex items-center gap-1.5">
              <Btn size="sm" variant="ghost" iconLeft={<Icon.Bell size={13}/>}>3</Btn>
              <Btn size="sm" variant="ghost" iconLeft={<Icon.Plus size={13}/>}>New</Btn>
            </div>
          </header>
        )}
        <div className="flex-1 min-h-0">{body}</div>
      </main>

      <DocDrawer doc={drawer} onClose={()=>setDrawer(null)}/>
      <CommandK open={cmdK} onClose={()=>setCmdK(false)} onNav={setScreen} onAsk={ask}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
