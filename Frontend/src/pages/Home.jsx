import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'



function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Function to highlight code
  const highlightCode = (code) => (
    <Highlight {...defaultProps} theme={theme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, margin: 0 }}>
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
  );

  // To determine file extension
  const getFileExtension = (lang) => {
    const map = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      bash: 'sh',
      html: 'html',
      json: 'json'
    };
    return map[lang] || lang;
  };

  return (
    <>
     <Navbar/>  
     
      <main className='container'>
        <div className="left">
          <div className="code">
           
            <div className="code-header">
              <div className="dots">
                <span className="red"></span>
                <span className="yellow"></span>
                <span className="green"></span>
              </div>

              <div className="file-meta">
                <span className="filename">code.{getFileExtension(language)}</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-dropdown"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="bash">Bash</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            {/* Code Editor */}
            <div className="editor-wrapper">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={10}
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 16,
                  height: '100%',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="review">Review</div>
        </div>

        <div className="right"></div>
      </main>


      <div style={{marginTop:"90px"}}>
        <Footer/>
      </div>
    </>
  );
}

export default Home;
