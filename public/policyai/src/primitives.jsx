const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Compact IST-ish number formatting (lakh/crore aware for big counts)
function fmtIN(n) {
  if (n >= 10000000) return (n/10000000).toFixed(n%10000000===0?0:2) + ' Cr';
  if (n >= 100000)   return (n/100000).toFixed(n%100000===0?0:1) + ' L';
  if (n >= 1000)     return n.toLocaleString('en-IN');
  return String(n);
}
function fmtRupee(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// Regulator pill — small, serious, uppercase
function RegPill({ code, size='sm' }) {
  const pad = size==='xs' ? 'px-1.5 py-[1px] text-[10px]' : 'px-1.5 py-[2px] text-[10.5px]';
  return (
    <span className={`inline-flex items-center whitespace-nowrap ${pad} font-medium tracking-wider uppercase rounded-sm border border-ink-200 bg-bg2 text-ink-700`}>
      {code}
    </span>
  );
}

// Confidence pill
function ConfidencePill({ level }) {
  const map = {
    High:  { bg:'bg-moss-100',   fg:'text-moss-600',   dot:'bg-moss-600' },
    Medium:{ bg:'bg-amber2-100', fg:'text-amber2-600', dot:'bg-amber2-600' },
    Low:   { bg:'bg-ruby-100',   fg:'text-ruby-600',   dot:'bg-ruby-600' },
  };
  const s = map[level] || map.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-[2px] rounded-sm border border-ink-100 ${s.bg} ${s.fg} text-[11px] tracking-wide`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`}/>
      <span className="font-medium">{level}</span>
      <span className="text-ink-400">confidence</span>
    </span>
  );
}

// Generic small tag (doc type, topic)
function Tag({ children, tone='neutral' }) {
  const map = {
    neutral:'border-ink-100 text-ink-500 bg-white',
    rust:   'border-rust-100 text-rust-600 bg-rust-50',
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap px-1.5 py-[2px] rounded-sm border ${map[tone]} text-[11px]`}>
      {children}
    </span>
  );
}

function Kbd({ children }) { return <kbd>{children}</kbd>; }

function Divider() { return <div className="h-px bg-line my-3" />; }

// Button
function Btn({ children, onClick, variant='secondary', size='md', iconLeft, iconRight, className='', ...rest }) {
  const sizes = {
    sm: 'h-7 px-2 text-[12px]',
    md: 'h-8 px-3 text-[13px]',
    lg: 'h-9 px-3.5 text-[13px]',
  };
  const variants = {
    primary:   'bg-ink-700 text-white hover:bg-ink-800 border border-ink-700',
    secondary: 'bg-white text-ink-700 hover:bg-bg2 border border-ink-200',
    ghost:     'bg-transparent text-ink-500 hover:text-ink-700 hover:bg-bg2 border border-transparent',
    accent:    'bg-rust-600 text-white hover:bg-rust-700 border border-rust-600',
    outlineAccent: 'bg-white text-rust-600 hover:bg-rust-50 border border-rust-600',
  };
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm font-medium tracking-[0.005em] transition-colors whitespace-nowrap ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}>
      {iconLeft}<span className="whitespace-nowrap">{children}</span>{iconRight}
    </button>
  );
}

// Field
function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-ink-400 mb-1">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-ink-400 mt-1">{hint}</div>}
    </label>
  );
}

// Select (native-looking)
function Select({ value, onChange, options, className='' }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="appearance-none h-8 w-full pl-2.5 pr-7 text-[13px] border border-ink-200 bg-white rounded-sm text-ink-700 focus:outline-none focus:border-ink-500">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
        <Icon.ChevronDown size={14}/>
      </div>
    </div>
  );
}

// Toggle
function Toggle({ on, onChange, size='md' }) {
  const w = size==='sm' ? 'w-7 h-4' : 'w-9 h-5';
  const k = size==='sm' ? 'h-3 w-3' : 'h-4 w-4';
  const off = size==='sm' ? 'translate-x-0.5' : 'translate-x-0.5';
  const onX = size==='sm' ? 'translate-x-3.5' : 'translate-x-[18px]';
  return (
    <button onClick={()=>onChange(!on)}
      className={`relative ${w} rounded-full transition-colors border ${on?'bg-ink-700 border-ink-700':'bg-ink-100 border-ink-200'}`}>
      <span className={`absolute top-1/2 -translate-y-1/2 ${k} rounded-full bg-white shadow-card transition-transform ${on?onX:off}`}/>
    </button>
  );
}

// Checkbox
function Checkbox({ on, onChange, label, count }) {
  return (
    <button onClick={()=>onChange(!on)} className="flex items-center justify-between gap-2 w-full group py-1">
      <span className="flex items-center gap-2 text-[12.5px] text-ink-700 min-w-0">
        <span className={`shrink-0 h-3.5 w-3.5 rounded-sm border flex items-center justify-center ${on?'bg-ink-700 border-ink-700 text-white':'border-ink-200 bg-white group-hover:border-ink-400'}`}>
          {on && <Icon.Check size={10} stroke={2.5}/>}
        </span>
        <span className="min-w-0 truncate">{label}</span>
      </span>
      {count!=null && <span className="shrink-0 text-[11px] tnum text-ink-400">{fmtIN(count)}</span>}
    </button>
  );
}

// Pill-shaped chip used in suggestions
function Chip({ children, onClick, active=false }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 h-7 text-[12.5px] rounded-full border transition-colors
        ${active ? 'border-ink-700 bg-ink-700 text-white'
                 : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'}`}>
      {children}
    </button>
  );
}

// Active/Inactive dot
function LiveDot({ on=true }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${on?'bg-moss-600':'bg-ink-200'}`} />;
}

// Diff span renderer — shared by Answer & Alerts
function DiffLine({ parts }) {
  return (
    <span className="font-serif text-[14px] leading-[1.65] text-ink-700">
      {parts.map((p, i) => {
        if (p.k === 'add') return <span key={i} className="diff-add px-[2px]">{p.t}</span>;
        if (p.k === 'del') return <span key={i} className="diff-del px-[2px]">{p.t}</span>;
        return <span key={i}>{p.t}</span>;
      })}
    </span>
  );
}

// Breadcrumb
function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-ink-400">
      {items.map((x, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon.ChevronRight size={12} />}
          <span className={i === items.length - 1 ? 'text-ink-700' : ''}>{x}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// Export to globals
Object.assign(window, {
  fmtIN, fmtRupee,
  RegPill, ConfidencePill, Tag, Kbd, Divider, Btn, Field, Select, Toggle, Checkbox, Chip, LiveDot, DiffLine, Breadcrumb,
});
