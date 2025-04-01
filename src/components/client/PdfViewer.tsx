'use client';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  
  return (
    <div className="w-full h-[800px] rounded-xl bg-gray-50 overflow-hidden">
      <iframe 
        src={pdfViewerUrl}
        className="w-full h-full"
        title="PDF Viewer"
        frameBorder="0"
      />
    </div>
  );
} 