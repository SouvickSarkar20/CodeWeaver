"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, FileViewerProps, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../types/config';
import { parseXml } from '../types/stpes';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';
import { StepsList } from '../components/StepsList';

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt") || ""; 

  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;

        let currentFolder = ""
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          //this will give the name of the path like src , app ..

          let currentFolderName = parsedPath[0];
          //just stores the name like src or components 

          parsedPath = parsedPath.slice(1);
          //this removes the first element from the  array parsedpath everytime 
          //arr.slice(startind , endind) -> return the array ele from the given strtind to endind - 1

          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              });
            } else {
              file.content = step.code;
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
        //the above is the core logic for creating the folders and files inside them 
        //moves through every element in the parsed array and checks if it is not the last then creates a folder ...which is a entry in a array and then make the structure move into the children array of that same element
        //if we reach the last element then we create the file and add it to the path and done 
      }
    });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(steps => steps.map((s: Step) => ({ ...s, status: "completed" })));
    }
  }, [steps]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {

      const mountStructure: Record<string, any> = {};
      //Recor<string,any> -> data structure where the key will be of type string and the value will be of type any

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ?
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) : {}
          };
        } else if (file.type === 'file') {
          return {
            file: {
              contents: file.content || ''
            }
          };
        }
        return mountStructure[file.name];
      };
      files.forEach(file => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/api/template`, { prompt: prompt.trim() });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;
    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({ ...x, status: "pending" })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
      messages: [...prompts, prompt].map(content => ({ role: "user", content }))
    });
    setLoading(false);

    setSteps(s => [
      ...s,
      ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: "pending" as const }))
    ]);


    setLlmMessages([...prompts, prompt].map(content => ({ role: "user", content })));
    setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-screen grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div className='flex'>
                {(loading || !templateSet) && <Loader />}
                {!(loading || !templateSet) && (
                  <div className='flex'>
                    <textarea value={userPrompt} onChange={(e) => setPrompt(e.target.value)} className='p-2 w-full'></textarea>
                    <button onClick={async () => {
                      const newMessage = { role: "user" as const, content: userPrompt };
                      setLoading(true);
                      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                        messages: [...llmMessages, newMessage]
                      });
                      setLoading(false);

                      setLlmMessages(x => [...x, newMessage]);
                      setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
                      // setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: "pending" }))]);
                    }} className='bg-purple-400 px-4'>Send</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>

          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer ?? null} files={files} />

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
