import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0a0a0a', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        :root {
          --black: #0a0a0a;
          --white: #ffffff;
          --g50: #fafafa;
          --g100: #f5f5f5;
          --g200: #e5e5e5;
          --g300: #d4d4d4;
          --g500: #737373;
          --g700: #404040;
          --mono: 'SF Mono', 'Fira Code', monospace;
        }
        body { font-size: 15px; line-height: 1.5; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 99;
          height: 52px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid var(--g200);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
        }
        .logo { font-size: 14px; font-weight: 500; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
        .logo-sq { width: 20px; height: 20px; background: var(--black); border-radius: 4px; }
        .nav-mid { display: flex; gap: 28px; }
        .nav-mid a { font-size: 13px; color: var(--g500); transition: color .12s; }
        .nav-mid a:hover { color: var(--black); }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .n-sign { font-size: 13px; color: var(--g700); }
        .n-btn {
          font-size: 13px; font-family: inherit; font-weight: 500;
          background: var(--black); color: #fff;
          border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer;
        }

        /* LAYOUT */
        .page { max-width: 640px; margin: 0 auto; padding: 0 24px; }

        /* HERO */
        .hero { padding: 120px 0 72px; border-bottom: 1px solid var(--g200); }
        .eyebrow {
          display: inline-block; font-size: 12px; font-weight: 500;
          color: var(--g500); letter-spacing: 0.04em;
          border: 1px solid var(--g200); border-radius: 99px;
          padding: 3px 10px; margin-bottom: 28px;
        }
        h1 {
          font-size: clamp(32px, 5vw, 48px); font-weight: 500;
          line-height: 1.1; letter-spacing: -0.035em;
          margin-bottom: 18px;
        }
        h1 em { font-style: normal; color: var(--g500); }
        .sub { font-size: 15px; color: var(--g500); line-height: 1.65; max-width: 420px; margin-bottom: 32px; }
        .cta-row { display: flex; align-items: center; gap: 12px; }
        .btn-dark {
          font-size: 13px; font-family: inherit; font-weight: 500;
          background: var(--black); color: #fff;
          border: none; border-radius: 7px; padding: 9px 18px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-light {
          font-size: 13px; font-family: inherit; color: var(--g500);
          background: none; border: 1px solid var(--g200);
          border-radius: 7px; padding: 9px 18px; cursor: pointer;
          transition: border-color .12s, color .12s;
        }
        .btn-light:hover { border-color: var(--g300); color: var(--black); }
        .stats-row { display: flex; gap: 40px; padding-top: 40px; margin-top: 40px; border-top: 1px solid var(--g200); }
        .stat-n { font-size: 20px; font-weight: 500; letter-spacing: -0.02em; }
        .stat-l { font-size: 12px; color: var(--g500); margin-top: 2px; }

        /* CODE */
        .code-sec { padding: 56px 0; border-bottom: 1px solid var(--g200); }
        .win { border: 1px solid var(--g200); border-radius: 8px; overflow: hidden; background: var(--g50); }
        .win-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px; border-bottom: 1px solid var(--g200); background: #fff;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .fn { margin-left: auto; font-size: 11px; font-family: var(--mono); color: var(--g500); }
        .win-code {
          padding: 20px; font-family: var(--mono); font-size: 12.5px;
          line-height: 1.75; color: var(--g700); overflow-x: auto;
          white-space: pre;
        }
        .cm { color: var(--g300); }
        .kw { color: var(--black); font-weight: 500; }
        .str { color: var(--g500); }
        .flag {
          margin-top: 12px; display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border: 1px solid #fecaca; border-radius: 7px; background: #fff5f5;
        }
        .flag-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; margin-top: 5px; flex-shrink: 0; }
        .flag-title { font-size: 11px; font-weight: 500; color: #dc2626; letter-spacing: 0.04em; text-transform: uppercase; }
        .flag-body { font-size: 13px; color: var(--g700); margin-top: 2px; }

        /* FEATURES */
        .feat { padding: 56px 0; border-bottom: 1px solid var(--g200); }
        .sec-label { font-size: 11px; font-weight: 500; color: var(--g500); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 32px; }
        .feat-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 16px 0; border-bottom: 1px solid var(--g200);
        }
        .feat-row:last-child { border-bottom: none; }
        .feat-name { font-size: 14px; font-weight: 500; }
        .feat-desc { font-size: 13px; color: var(--g500); max-width: 280px; text-align: right; line-height: 1.5; }

        /* LOGOS */
        .logos { padding: 32px 0; border-bottom: 1px solid var(--g200); }
        .logos-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .logos-row span { font-size: 13px; font-weight: 500; color: var(--g300); letter-spacing: -0.01em; transition: color .12s; cursor: default; }
        .logos-row span:hover { color: var(--g700); }

        /* CTA */
        .cta-sec { padding: 80px 0; text-align: center; }
        h2 { font-size: clamp(24px, 4vw, 36px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 14px; }
        .cta-sub { font-size: 14px; color: var(--g500); margin-bottom: 28px; }

        /* FOOTER */
        footer {
          padding: 28px 24px; border-top: 1px solid var(--g200);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
          max-width: 640px; margin: 0 auto;
        }
        .f-logo { font-size: 13px; font-weight: 500; }
        .f-copy { font-size: 12px; color: var(--g500); }
        .f-links { display: flex; gap: 20px; }
        .f-links a { font-size: 12px; color: var(--g500); transition: color .12s; }
        .f-links a:hover { color: var(--black); }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="logo"><div className="logo-sq" />Codion</div>
        <div className="nav-mid">
          <a href="#features">Platform</a>
          <a href="#demo">Docs</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="nav-right">
          <Link to="/login" className="n-sign">Sign in</Link>
          <Link to="/login"><button className="n-btn">Get started</button></Link>
        </div>
      </nav>

      <div className="page">

        {/* HERO */}
        <section className="hero">
          <div className="eyebrow">Now in public beta</div>
          <h1>Review code.<br /><em>Not each other's time.</em></h1>
          <p className="sub">
            Automated PR reviews powered by Groq, Gemini, and Mistral.
            Catches bugs and security issues before they reach production.
          </p>
          <div className="cta-row">
            <Link to="/login">
              <button className="btn-dark">
                Start reviewing
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5H10.5M7.5 3.5L10.5 6.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
            <button className="btn-light">View demo</button>
          </div>
          <div className="stats-row">
            <div><div className="stat-n">1.2M+</div><div className="stat-l">Lines analyzed</div></div>
            <div><div className="stat-n">45k</div><div className="stat-l">Bugs caught</div></div>
            <div><div className="stat-n">8k+</div><div className="stat-l">Developers</div></div>
          </div>
        </section>

        {/* CODE PREVIEW */}
        <section className="code-sec">
          <div className="win">
            <div className="win-bar">
              <div className="dot" style={{ background: '#ff5f57' }} />
              <div className="dot" style={{ background: '#febc2e' }} />
              <div className="dot" style={{ background: '#28c840' }} />
              <span className="fn">auth.js</span>
            </div>
            <div className="win-code">
              <span className="cm">{'// vulnerable — string interpolation\n'}</span>
              <span className="kw">const </span>
              {'user = '}
              <span className="kw">await </span>
              {'db.query(\n  '}
              <span className="str">{'`SELECT * FROM users WHERE id = ${userId}`'}</span>
              {'\n);\n\n'}
              <span className="cm">{'// fixed — parameterized query\n'}</span>
              <span className="kw">const </span>
              {'user = '}
              <span className="kw">await </span>
              {'db.query(\n  '}
              <span className="str">{"'SELECT * FROM users WHERE id = $1'"}</span>
              {',\n  [userId]\n);'}
            </div>
          </div>
          <div className="flag">
            <div className="flag-dot" />
            <div>
              <div className="flag-title">Security · High</div>
              <div className="flag-body">SQL injection via unsanitized interpolation. Use parameterized queries.</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="feat" id="features">
          <div className="sec-label">What it does</div>
          {[
            ['Security scanning', 'Injections, exposed secrets, and auth bypasses on every push.'],
            ['Triple-model validation', 'Groq, Gemini, and Mistral cross-check to cut false positives.'],
            ['Sub-second review', 'Results before your reviewer opens the PR.'],
            ['Refactor suggestions', 'Readability wins and outdated patterns, not just bugs.'],
          ].map(([name, desc]) => (
            <div className="feat-row" key={name}>
              <div className="feat-name">{name}</div>
              <div className="feat-desc">{desc}</div>
            </div>
          ))}
        </section>

        {/* LOGOS */}
        <section className="logos">
          <div className="logos-row">
            {['GitHub', 'GitLab', 'Vercel', 'Nvidia', 'Groq'].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec">
          <h2>Ship with confidence.</h2>
          <p className="cta-sub">Free for open source. Connect your repo and get your first review in under a minute.</p>
          <Link to="/login">
            <button className="btn-dark" style={{ margin: '0 auto' }}>
              Connect your repo
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5H10.5M7.5 3.5L10.5 6.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        </section>

      </div>

      {/* FOOTER */}
      <footer>
        <div className="f-logo">Codion</div>
        <span className="f-copy">© 2025 Codion Technologies</span>
        <div className="f-links">
          <a href="#">Twitter</a>
          <a href="#">Discord</a>
          <a href="#">GitHub</a>
        </div>
      </footer>
    </div>
  );
}