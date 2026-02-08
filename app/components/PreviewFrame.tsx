"use client";

import { WebContainer } from '@webcontainer/api';
import React, { JSX, useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer | null;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps): JSX.Element {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (!webContainer) return;

    const startDevServer = async () => {
      try {
        console.log("📦 Installing dependencies...");
        const installProcess = await webContainer.spawn('npm', ['install']);
        installProcess.output.pipeTo(new WritableStream({ write(data) { console.log('[npm install]', data); } }));
        await installProcess.exit;
        console.log("✅ npm install complete.");

        console.log("🚀 Starting dev server...");
        const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
        devProcess.output.pipeTo(new WritableStream({ write(data) { console.log('[npm run dev]', data); } }));

        webContainer.on('server-ready', (port, serverUrl) => {
          console.log('✅ Dev server ready at:', serverUrl);
          setUrl(serverUrl);
        });
      } catch (error) {
        console.error('❌ WebContainer error:', error);
      }
    };

    startDevServer();
  }, [webContainer]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url ? (
        <div className="text-center">
          <p className="mb-2">Loading preview...</p>
        </div>
      ) : (
        <iframe
          src={url}
          width="100%"
          height="100%"
          className="border-none"
        />
      )}
    </div>
  );
}
