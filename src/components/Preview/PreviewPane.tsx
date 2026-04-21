import type { ResumeData } from '../../types/resume';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface Props {
  data: ResumeData;
}

export function PreviewPane({ data }: Props) {
  const { personalInfo, sections } = data;

  // Use Apple's preferred San Francisco / PingFang SC (Apple Heiti) as primary
  const resumeFontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const sansFontFamily = resumeFontFamily;

  return (
    <div 
      className="a4-page bg-white text-black" 
      style={{ 
        minHeight: '297mm', 
        width: '210mm', 
        margin: '0 auto', 
        padding: '3rem 3.5rem', /* Visual padding for screen preview; print padding is natively handled by @page */
        fontFamily: resumeFontFamily,
        color: '#000000',
        boxSizing: 'border-box'
      }}
    >
      {/* Header / Personal Info */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          letterSpacing: '0.1em', 
          margin: '0 0 0.5rem 0', 
          fontFamily: sansFontFamily 
        }}>
          {personalInfo.name || '姓名'}
        </h1>
        {personalInfo.title && (
          <p style={{
            fontSize: '1rem',
            fontWeight: 500,
            margin: '0.25rem 0 0.75rem 0',
            fontFamily: sansFontFamily,
            color: '#333',
            letterSpacing: '0.02em'
          }}>
            {personalInfo.title}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          alignItems: 'center', 
          fontSize: '0.9rem', 
          fontFamily: sansFontFamily,
          color: '#333333'
        }}>
          {[
            personalInfo.gender, 
            personalInfo.age ? `${personalInfo.age}岁` : '', 
            personalInfo.experience, 
            personalInfo.email, 
            personalInfo.phone, 
            personalInfo.location, 
            personalInfo.website
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <span key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                {item}
                {idx < arr.length - 1 && (
                  <span style={{ margin: '0 0.6rem', color: '#999999', fontSize: '0.8em' }}>•</span>
                )}
              </span>
            ))}
        </div>
      </header>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map((section) => (
          <section key={section.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              margin: '0 0 0.75rem 0', 
              borderBottom: '1px solid black', 
              paddingBottom: '0.25rem',
              fontFamily: sansFontFamily
            }}>
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {section.items.map((item) => (
                <div key={item.id} style={{ fontSize: '15px', lineHeight: 1.6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  {/* Top line: Title & Date */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline', 
                    fontWeight: 'bold', 
                    fontFamily: sansFontFamily 
                  }}>
                    <div style={{ fontSize: '16px' }}>
                      {item.title}
                      {item.subtitle && (
                        <span style={{ fontWeight: 'normal', margin: '0 0.5rem' }}>|</span>
                      )}
                      {item.subtitle && (
                        <span style={{ fontWeight: 600 }}>{item.subtitle}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      {item.date}
                    </div>
                  </div>
                  
                  {/* Bottom line: Location & Details */}
                  {(item.location || item.description) && (
                    <div style={{ marginTop: '0.25rem' }}>
                      {item.location && (
                        <div style={{ fontSize: '14px', marginBottom: '0.25rem', opacity: 0.9 }}>
                          {item.location}
                        </div>
                      )}
                      {item.description && (
                        <div style={{ marginTop: '0.25rem', fontSize: '14px', color: '#000000' }}>
                          <ReactMarkdown
                            remarkPlugins={[remarkBreaks]}
                            components={{
                              p: ({node, ...props}) => <p style={{ margin: '0.25rem 0', textAlign: 'justify' }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ listStyleType: 'disc', margin: '0.25rem 0 0.25rem 1.2rem', paddingLeft: '0' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ listStyleType: 'decimal', margin: '0.25rem 0 0.25rem 1.2rem', paddingLeft: '0' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ margin: '0.25rem 0', textAlign: 'justify' }} {...props} />,
                              strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold' }} {...props} />,
                              em: ({node, ...props}) => <em style={{ fontStyle: 'normal', fontWeight: 'bold' }} {...props} />,
                              a: ({node, ...props}) => <a style={{ color: 'inherit', textDecoration: 'underline' }} {...props} />
                            }}
                          >
                            {item.description.replace(/\n[ \t]*(?=\n)/g, '\n\u200B')}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
