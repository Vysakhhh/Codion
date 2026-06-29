import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <style>{`
        .codion-wrap { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #ededed; min-height: 100vh; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.5; position: relative; }
        .codion-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .codion-wrap a { text-decoration: none; color: inherit; }

        .c-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 48px 48px; }
        .c-grid-fade { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,10,10,0) 0%, #0a0a0a 70%); }

        .c-nav { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 48px; border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(10,10,10,0.85); backdrop-filter: blur(12px); }
        .c-logo { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
        .c-logo-icon { width: 22px; height: 22px; border-radius: 5px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .c-nav-links { display: flex; gap: 24px; }
        .c-nav-links a { font-size: 13px; color: rgba(255,255,255,0.45); transition: color .1s; }
        .c-nav-links a:hover { color: #fff; }
        .c-nav-r { display: flex; align-items: center; gap: 14px; }
        .c-nav-r a { font-size: 13px; color: rgba(255,255,255,0.5); transition: color .1s; }
        .c-nav-r a:hover { color: #fff; }
        .c-btn-w { font-size: 12px; font-family: inherit; font-weight: 500; background: #fff; color: #0a0a0a; border: none; border-radius: 5px; padding: 6px 13px; cursor: pointer; }
        .c-btn-w:hover { background: #e5e5e5; }

        .c-page { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; padding: 0 28px; }

        /* CONSISTENT SECTION SPACING — every section gets exactly 40px top/bottom */
        .c-section { padding: 40px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .c-section:last-child { border-bottom: none; }

        .c-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 99px; padding: 3px 10px; margin-bottom: 20px; letter-spacing: 0.02em; }
        .c-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; }
        .c-h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; color: #fff; margin-bottom: 14px; }
        .c-h1 span { color: rgba(255,255,255,0.25); }
        .c-sub { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 400px; margin-bottom: 24px; }
        .c-btns { display: flex; align-items: center; gap: 10px; }
        .c-btn-solid { font-size: 13px; font-family: inherit; font-weight: 500; background: #fff; color: #0a0a0a; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; }
        .c-btn-solid:hover { background: #e5e5e5; }
        .c-btn-ghost { font-size: 13px; font-family: inherit; color: rgba(255,255,255,0.45); background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px 16px; cursor: pointer; }
        .c-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

        .c-metrics { display: flex; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.07); }
        .c-m { flex: 1; }
        .c-m + .c-m { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.07); }
        .c-m-n { font-size: 20px; font-weight: 600; letter-spacing: -0.03em; color: #fff; }
        .c-m-l { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }

        .c-win { border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden; background: #111; }
        .c-win-top { display: flex; align-items: center; gap: 7px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .c-dot { width: 10px; height: 10px; border-radius: 50%; }
        .c-win-file { margin-left: auto; font-size: 11px; font-family: 'SF Mono','Fira Code',monospace; color: rgba(255,255,255,0.25); }
        .c-code { padding: 18px 20px; font-family: 'SF Mono','Fira Code',monospace; font-size: 12px; line-height: 1.8; color: rgba(255,255,255,0.4); white-space: pre; overflow-x: auto; }
        .c-cm { color: rgba(255,255,255,0.18); }
        .c-kw { color: #fff; }
        .c-str { color: rgba(255,255,255,0.45); }
        .c-fn { color: rgba(255,255,255,0.6); }

        .c-alert { margin-top: 10px; display: flex; gap: 10px; align-items: flex-start; padding: 11px 14px; border: 1px solid rgba(239,68,68,0.25); border-radius: 6px; background: rgba(239,68,68,0.05); }
        .c-al-line { width: 2px; background: #ef4444; border-radius: 2px; align-self: stretch; flex-shrink: 0; }
        .c-al-tag { font-size: 10px; font-weight: 600; color: #ef4444; letter-spacing: 0.06em; text-transform: uppercase; }
        .c-al-msg { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        .c-s-label { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; }
        .c-feat-item { display: flex; justify-content: space-between; align-items: baseline; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .c-feat-item:last-child { border: none; }
        .c-fi-name { font-size: 13px; font-weight: 500; color: #fff; }
        .c-fi-desc { font-size: 12px; color: rgba(255,255,255,0.3); max-width: 260px; text-align: right; line-height: 1.5; }

        .c-logos-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .c-logos-row span { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.15); cursor: default; transition: color .1s; }
        .c-logos-row span:hover { color: rgba(255,255,255,0.4); }

        .c-h2 { font-size: clamp(24px, 4vw, 36px); font-weight: 600; letter-spacing: -0.035em; color: #fff; margin-bottom: 10px; }
        .c-cta-p { font-size: 13px; color: rgba(255,255,255,0.3); margin-bottom: 20px; line-height: 1.6; }

        .c-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
        .c-f-name { font-size: 12px; font-weight: 600; color: #fff; }
        .c-f-copy { font-size: 11px; color: rgba(255,255,255,0.2); }
        .c-f-links { display: flex; gap: 18px; }
        .c-f-links a { font-size: 11px; color: rgba(255,255,255,0.25); transition: color .1s; }
        .c-f-links a:hover { color: #fff; }
      `}</style>

      <div className="codion-wrap">
        <div className="c-grid" />
        <div className="c-grid-fade" />

        <nav className="c-nav">
          <div className="c-logo">
            <div className="c-logo-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 11L6.5 1.5L11.5 11" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H9.5" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            Codion
          </div>
          <div className="c-nav-links">
            <a href="#features">Platform</a>
            <a href="#">Docs</a>
            <a href="#">Pricing</a>
          </div>
          <div className="c-nav-r">
            <Link to="/login">Sign in</Link>
            <Link to="/login"><button className="c-btn-w">Get started</button></Link>
          </div>
        </nav>

        <div className="c-page">

          {/* HERO */}
          <section className="c-section" style={{ paddingTop: 64 }}>
            <div className="c-badge"><span className="c-badge-dot" />Public beta — V2.5</div>
            <h1 className="c-h1">Review code.<br /><span>Not each other's time.</span></h1>
            <p className="c-sub">Automated PR reviews using Groq, Gemini, and Mistral. Catches bugs and security flaws before they ship.</p>
            <div className="c-btns">
              <Link to="/login">
                <button className="c-btn-solid">
                  Start reviewing
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </Link>
              <button className="c-btn-ghost">View demo</button>
            </div>
            <div className="c-metrics">
              <div className="c-m"><div className="c-m-n">1.2M+</div><div className="c-m-l">Lines analyzed</div></div>
              <div className="c-m"><div className="c-m-n">45k</div><div className="c-m-l">Bugs caught</div></div>
              <div className="c-m"><div className="c-m-n">8k+</div><div className="c-m-l">Developers</div></div>
            </div>
          </section>

          {/* CODE */}
          <section className="c-section">
            <div className="c-win">
              <div className="c-win-top">
                <div className="c-dot" style={{ background: '#ff5f57' }} />
                <div className="c-dot" style={{ background: '#febc2e' }} />
                <div className="c-dot" style={{ background: '#28c840' }} />
                <span className="c-win-file">auth.js</span>
              </div>
              <div className="c-code">
                <span className="c-cm">{'// vulnerable — string interpolation\n'}</span>
                <span className="c-kw">const</span>{' user = '}<span className="c-kw">await</span>{' db.'}<span className="c-fn">query</span>{'(\n  '}<span className="c-str">{'`SELECT * FROM users WHERE id = ${userId}`'}</span>{'\n);\n\n'}
                <span className="c-cm">{'// fixed — parameterized query\n'}</span>
                <span className="c-kw">const</span>{' user = '}<span className="c-kw">await</span>{' db.'}<span className="c-fn">query</span>{'(\n  '}<span className="c-str">{"'SELECT * FROM users WHERE id = $1'"}</span>{',\n  [userId]\n);'}
              </div>
            </div>
            <div className="c-alert">
              <div className="c-al-line" />
              <div>
                <div className="c-al-tag">Security · High</div>
                <div className="c-al-msg">SQL injection via unsanitized interpolation. Replace with a parameterized query.</div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="c-section" id="features">
            <div className="c-s-label">Capabilities</div>
            {[
              ['Security scanning', 'Injections, exposed secrets, auth bypasses — every push.'],
              ['Triple-model validation', 'Groq, Gemini and Mistral cross-check each finding.'],
              ['Sub-second review', 'Results before your reviewer opens the PR.'],
              ['Refactor suggestions', 'Readability and modern patterns, not just bugs.'],
            ].map(([n, d]) => (
              <div className="c-feat-item" key={n}>
                <span className="c-fi-name">{n}</span>
                <span className="c-fi-desc">{d}</span>
              </div>
            ))}
          </section>

          {/* LOGOS */}
          <section className="c-section">
            <div className="c-logos-row">
              {['GitHub', 'GitLab', 'Vercel', 'Nvidia', 'Groq'].map(l => <span key={l}>{l}</span>)}
            </div>
          </section>

          {/* CTA */}
          <section className="c-section" style={{ textAlign: 'center', borderBottom: 'none' }}>
            <h2 className="c-h2">Ship with confidence.</h2>
            <p className="c-cta-p">Free for open source. Connect your repo and get your first review in under a minute.</p>
            <Link to="/login">
              <button className="c-btn-solid" style={{ margin: '0 auto' }}>
                Connect your repo
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </Link>
          </section>

        </div>

        <footer className="c-footer">
          <div className="c-f-name">Codion</div>
          <span className="c-f-copy">© 2025 Codion Technologies</span>
          <div className="c-f-links">
            <a href="#">Twitter</a><a href="#">Discord</a><a href="#">GitHub</a>
          </div>
        </footer>
      </div>
    </>
  );
}