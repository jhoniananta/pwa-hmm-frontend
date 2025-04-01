'use client';

interface LinkViewerProps {
  url: string;
}

export default function LinkViewer({ url }: LinkViewerProps) {
  return (
    <div className="w-full h-[800px] rounded-xl bg-gray-50 overflow-hidden">
      <iframe 
        src={url}
        className="w-full h-full"
        title="Website Viewer"
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
      />
    </div>
  );
} 