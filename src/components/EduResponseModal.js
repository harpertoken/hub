import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import useScrollLock from '../hooks/useScrollLock';

const EducationResponseModal = ({ isOpen, onClose, response }) => {
  const [linkPreview, setLinkPreview] = useState(null);

  useEffect(() => {
    if (response) {
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      const links = response.match(linkRegex);

      if (links && links.length > 0) {
        const firstLink = links[0];
        fetch(`/api/link-preview?url=${encodeURIComponent(firstLink)}`)
          .then(res => res.json())
          .then(data => {
            setLinkPreview(data);
          })
          .catch(err => {
            console.error("Error fetching link preview:", err);
          });
      } else {
        setLinkPreview(null);
      }
    }
  }, [response]);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="rounded-md shadow-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-primary)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>Education Response</h2>
          <button
            onClick={onClose}
            className="transition-colors duration-200"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="prose max-w-none whitespace-pre-wrap" style={{color: 'var(--text-primary)'}}>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              // Enhanced heading styles with better contrast
              h1: ({node, children, ...props}) => (
                <h1 className="text-2xl font-semibold mt-6 mb-4" style={{color: 'var(--text-primary)'}} {...props}>
                  {children}
                </h1>
              ),
              h2: ({node, children, ...props}) => (
                <h2 className="text-xl font-semibold mt-5 mb-3" style={{color: 'var(--text-primary)'}} {...props}>
                  {children}
                </h2>
              ),
              h3: ({node, children, ...props}) => (
                <h3 className="text-lg font-medium mt-4 mb-2" style={{color: 'var(--text-primary)'}} {...props}>
                  {children}
                </h3>
              ),
              h4: ({node, children, ...props}) => (
                <h4 className="text-base font-medium mt-3 mb-2" style={{color: 'var(--text-primary)'}} {...props}>
                  {children}
                </h4>
              ),
              // Enhanced paragraph styles
              p: ({node, ...props}) => (
                <p className="my-3 text-base leading-relaxed" style={{color: 'var(--text-primary)'}} {...props} />
              ),
              // Enhanced list styles
              ul: ({node, ...props}) => (
                <ul className="list-disc pl-6 my-3 space-y-1" style={{color: 'var(--text-primary)'}} {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal pl-6 my-3 space-y-1" style={{color: 'var(--text-primary)'}} {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="text-base leading-relaxed" style={{color: 'var(--text-primary)'}} {...props} />
              ),
              // Enhanced code styles
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vs}
                    language={match[1]}
                    PreTag="div"
                    className="rounded my-3"
                    style={{border: '1px solid var(--border-color)'}}
                    showLineNumbers={true}
                    {...props}
                  >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                ) : (
                  <code
                    className="px-2 py-1 rounded text-sm font-mono"
                    style={{
                      backgroundColor: 'var(--button-hover)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              // Enhanced link styles
              a({node, href, children, ...props}) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                    style={{color: 'var(--accent-color)'}}
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              // Enhanced blockquote styles
              blockquote: ({node, ...props}) => (
                <blockquote
                  className="border-l-4 pl-4 my-4 italic"
                  style={{
                    borderColor: 'var(--accent-color)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--button-hover)'
                  }}
                  {...props}
                />
              ),
              // Enhanced strong/bold styles
              strong: ({node, ...props}) => (
                <strong className="font-semibold" style={{color: 'var(--text-primary)'}} {...props} />
              ),
              // Enhanced emphasis/italic styles
              em: ({node, ...props}) => (
                <em className="italic" style={{color: 'var(--text-primary)'}} {...props} />
              )
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
        {linkPreview && (
          <div className="mt-4 p-4 rounded-md" style={{border: '1px solid var(--border-color)'}}>
            {linkPreview.image && (
              <img src={linkPreview.image} alt="Link Preview" className="w-full h-48 object-cover mb-2 rounded-md" />
            )}
            <h3 className="text-md font-semibold" style={{color: 'var(--text-primary)'}}>{linkPreview.title}</h3>
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{linkPreview.description}</p>
          </div>
        )}
        <div className="mt-4 pt-3 flex flex-col" style={{borderTop: '1px solid var(--border-color)'}}>
          <div className="mb-3">
            <p className="text-xs flex items-center gap-1" style={{color: 'var(--text-secondary)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>AI may occasionally provide incorrect information. Always verify important details from reliable sources.</span>
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="transition-colors duration-200"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationResponseModal;
