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
import useScrollLock from '../../hooks/useScrollLock';

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
          backgroundColor: '#ffffff',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e5e5'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          Education Response
          <button
            onClick={onClose}
            className="transition-colors duration-200"
            style={{color: '#666666'}}
            onMouseEnter={(e) => e.target.style.color = '#000000'}
            onMouseLeave={(e) => e.target.style.color = '#666666'}
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="prose max-w-none whitespace-pre-wrap" style={{color: '#000000'}}>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              // Enhanced heading styles with better contrast
              h1: ({children}) => (
                <h1 className="text-2xl font-bold my-4" style={{color: '#000000'}}>
                  {children}
                </h1>
              ),
              h2: ({children}) => (
                <h2 className="text-xl font-semibold my-3" style={{color: '#000000'}}>
                  {children}
                </h2>
              ),
              h3: ({children}) => (
                <h3 className="text-lg font-medium my-2" style={{color: '#000000'}}>
                  {children}
                </h3>
              ),
              h4: ({children}) => (
                <h4 className="text-base font-medium my-2" style={{color: '#000000'}}>
                  {children}
                </h4>
              ),
              // Enhanced paragraph styles
              p: ({...props}) => (
                <p className="my-3 text-base leading-relaxed" style={{color: '#000000'}} {...props} />
              ),
              // Enhanced list styles
              ul: ({...props}) => (
                <ul className="list-disc pl-6 my-3 space-y-1" style={{color: '#000000'}} {...props} />
              ),
              ol: ({...props}) => (
                <ol className="list-decimal pl-6 my-3 space-y-1" style={{color: '#000000'}} {...props} />
              ),
              li: ({...props}) => (
                <li className="text-base leading-relaxed" style={{color: '#000000'}} {...props} />
              ),
              // Enhanced code styles
              code({inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vs}
                    language={match[1]}
                    PreTag="div"
                    className="rounded my-3"
                    showLineNumbers={true}
                    {...props}
                  >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                ) : (
                  <code
                    className="px-2 py-1 rounded text-sm font-mono"
                    style={{
                      backgroundColor: '#f0f0f0',
                      color: '#000000',
                      border: '1px solid #e5e5e5'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              // Enhanced link styles
              a({href, children, ...props}) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                    style={{color: '#0066cc'}}
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              // Enhanced blockquote styles
              blockquote: ({...props}) => (
                <blockquote
                  className="border-l-4 pl-4 my-4 italic"
                  style={{
                    borderColor: '#0066cc',
                    color: '#666666',
                    backgroundColor: '#f0f0f0'
                  }}
                  {...props}
                />
              ),
              // Enhanced strong/bold styles
              strong: ({...props}) => (
                <strong className="font-semibold" style={{color: '#000000'}} {...props} />
              ),
              // Enhanced emphasis/italic styles
              em: ({...props}) => (
                <em className="italic" style={{color: '#000000'}} {...props} />
              )
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
        {linkPreview && (
          <div className="mt-4 p-4 rounded-md" style={{border: '1px solid #e5e5e5'}}>
            {linkPreview.image && (
              <img src={linkPreview.image} alt="Link Preview" className="w-full h-48 object-cover mb-2 rounded-md" />
            )}
            {linkPreview.title}
            <p className="text-sm" style={{color: '#666666'}}>{linkPreview.description}</p>
          </div>
        )}
        <div className="mt-4 pt-3 flex flex-col" style={{borderTop: '1px solid #e5e5e5'}}>
          <div className="mb-3">
            <p className="text-xs flex items-center gap-1" style={{color: '#666666'}}>
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
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.target.style.color = '#000000'}
              onMouseLeave={(e) => e.target.style.color = '#666666'}
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
