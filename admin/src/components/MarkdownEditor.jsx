import React from 'react';

const MarkdownEditor = ({ value, onChange, placeholder, height = '200px' }) => {
  const markdownGuide = [
    { syntax: '# Heading 1', description: 'Large heading' },
    { syntax: '## Heading 2', description: 'Medium heading' },
    { syntax: '### Heading 3', description: 'Small heading' },
    { syntax: '**bold text**', description: 'Bold text' },
    { syntax: '*italic text*', description: 'Italic text' },
    { syntax: '- Bullet point', description: 'Unordered list' },
    { syntax: '1. Numbered point', description: 'Ordered list' },
    { syntax: '[Link](http://...)', description: 'Hyperlink' },
    { syntax: '---', description: 'Horizontal line' },
  ];

  // Simple markdown to HTML conversion for preview
  const renderPreview = (text) => {
    if (!text)
      return <p className="text-gray-500">Preview will appear here...</p>;

    return text.split('\n').map((line, index) => {
      let content = line;

      // Headers
      if (line.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="text-2xl font-bold mt-3 mb-2 text-[#5C4B42]"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="text-xl font-bold mt-3 mb-2 text-[#5C4B42]"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="text-lg font-bold mt-2 mb-1 text-[#5C4B42]"
          >
            {line.substring(4)}
          </h3>
        );
      }

      // Bold
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Bullet points
      if (line.startsWith('- ')) {
        return (
          <p key={index} className="my-1 ml-4">
            • {line.substring(2)}
          </p>
        );
      }
      // Numbered list
      if (/^\d+\./.test(line)) {
        return (
          <p key={index} className="my-1 ml-4">
            {line}
          </p>
        );
      }
      // Horizontal rule
      if (line === '---') {
        return <hr key={index} className="my-3 border-[#E8D9CC]" />;
      }

      return (
        <p key={index} className="my-2">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="markdown-editor">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Column */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#5C4B42]">
              Editor
            </label>
            <span className="text-xs text-[#5C4B42]/60">
              {value.length} characters
            </span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-[#E8D9CC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0] resize-vertical font-mono text-sm"
            style={{ minHeight: height }}
          />
        </div>

        {/* Preview & Guide Column */}
        <div>
          <label className="block text-sm font-medium text-[#5C4B42] mb-2">
            Live Preview
          </label>
          <div
            className="border border-[#E8D9CC] rounded-lg bg-white p-4 overflow-y-auto prose prose-sm max-w-none"
            style={{ minHeight: height, maxHeight: height }}
          >
            {renderPreview(value)}
          </div>
        </div>
      </div>

      {/* Formatting Guide */}
      <div className="mt-4 p-4 bg-[#F9F5F2] rounded-lg border border-[#E8D9CC]">
        <h4 className="font-medium text-[#5C4B42] mb-2">
          Markdown Formatting Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {markdownGuide.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <code className="bg-white px-2 py-1 rounded border text-xs font-mono flex-shrink-0">
                {item.syntax}
              </code>
              <span className="text-[#5C4B42]/80 text-xs">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
