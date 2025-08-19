'use client';

import dynamic from 'next/dynamic';
import { EditorProvider } from '@/contexts/EditorContext';

const ImageEditor = dynamic(
  () => import('@/components/ImageEditor').then(mod => mod.ImageEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading editor...</div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <EditorProvider>
      <ImageEditor />
    </EditorProvider>
  );
}
