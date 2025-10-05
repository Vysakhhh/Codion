import React from 'react';
import './Landing.css';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';
import Navbar from '../components/Navbar';
import Testimonial from '../components/Testimonial';
import Footer from '../components/Footer';
import {Link} from 'react-router-dom'



function Landing() {
  
  const code = `
function reviewCode(code) {
  const feedback = ai.analyze(code);
  return feedback.improve();
}

const result = reviewCode("const x = 42;");
console.log(result);
`;

const developers = [
  "ananya.dev", "lucas.engineer", "david.codes", "meera.js", "isaac.backend",
  "sophie.designs", "mohamed.fullstack", "liwei.tech", "carla.builds", "nathan.mern"
];

  return (
    <>
      <Navbar />
      <section
        className="container animated-border mt-5 d-flex flex-column justify-content-center align-items-center text-white text-center p-5 rounded-4"
        style={{
          background: 'linear-gradient(135deg, #8e2de2, #4a00e0, #00c9ff, #92fe9d)',
          backgroundSize: '400% 400%',
          animation: 'gradientMove 10s ease infinite',
        }}
      >
        <div className="mb-5">
          <h1 className="display-3 fw-bold">The <span className='text-warning'>AI</span> Code Reviewer</h1>
          <p className="fw-semib mt-3 mb-4">
            Built to make you productive  <span className='fw-semibold text-warning lead mx-2 fst-italic '>get instant feedback</span> improve code quality.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
            <Link to="/login"  className="btn btn-dark btn-lg px-4 border border-white" > Try it Now</Link>
          </div>
        </div>

        <div className="landing-preview w-100 d-flex justify-content-center" style={{ marginTop: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <div
              style={{
                backgroundColor: '#1e1e1e',
                borderRadius: '8px 8px 0 0',
                padding: '0.5rem 1rem',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>

            <Highlight {...defaultProps} theme={theme} code={code.trim()} language="javascript">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={className}
                  style={{ ...style, backgroundColor: '#1e1e1e', padding: '1rem', margin: 0, borderRadius: '0 0 8px 8px', overflowX: 'auto', fontSize: '0.95rem', textAlign: 'left',}}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </section>

      <section className="developer-grid py-5 text-center" style={{ marginTop: '50px' }}>
        <p className="text-uppercase mb-4 text-light" style={{ letterSpacing: '2px' }}>
          Trusted by <span className='text-primary'> developers</span> worldwide
        </p>

        <div className="container my-5">
          <div className="row justify-content-center align-items-center g-1">
            {developers.map((dev, index) => (
              <div key={index} className="col-6 col-sm-4 col-md-2">
                <p className="dev-name">{dev}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='my-3'>
        <Testimonial/>
      </div>

    <div className='text-light' style={{marginTop:"80px"}}>
        <Footer/>
    </div>
    </>
  );
}

export default Landing;