import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import imgApi from '@/api/imgApi';

export interface IBlobFile {
  name: string;
  url: string;
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);

  const [blobFiles, setBlobFiles] = useState<IBlobFile[]>([]);

  const [change, setChange] = useState<string>(`${new Date()}`);

  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getFiles = async () => {
      const result = await imgApi.get('/files');
      if (result && result.status) {
        setBlobFiles(result.data);
      }
    };
    getFiles();
  }, [change]);

  const handleInputFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files?.[0]) return;
    if (evt.target.files) {
      setFile(evt.target.files[0]);
    }
  };

  const uploadFile = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await imgApi.post('/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (result && result.status) {
          if (inputFileRef.current) {
            inputFileRef.current.value = '';
          }
          setFile(null);
          setChange(`${new Date()}`);
          alert(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('no file');
    }
  };

  if (blobFiles && blobFiles.length > 0) {
    console.log({ blobFiles });
  }

  return (
    <div className="container">
      <div className="flex flex-col p-4">
        <div className="flex flex-row gap-4 w-full">
          <div className="w-2/3">
            <h1 className="text-4xl text-center my-4">Upload file</h1>
            <form onSubmit={uploadFile} className="flex flex-col">
              <input
                ref={inputFileRef}
                type="file"
                onChange={handleInputFileChange}
                className="bg-zinc-200 p-3 rounded block mb-2"
              />
              <button
                type="submit"
                className="bg-green-500 border-green-400 text-zinc-100 p-2 rounded disabled:opacity-50"
                disabled={!file}>
                Upload
              </button>
            </form>
          </div>
          <div className="w-1/3">
            <h1 className="text-4xl text-center my-4">Preview</h1>
            {file ? (
              <div className="border-2 border-gray-200 rounded-md">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded file"
                  className="w-full h-auto object-contain"
                  width={1}
                  height={1}
                />
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-md w-full h-96" />
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col p-4">
        <h1 className="text-5xl text-center my-4">List files</h1>
        <div className="grid grid-cols-4 gap-2">
          {blobFiles &&
            blobFiles.length > 0 &&
            blobFiles.map((blobFile, index) => (
              <div key={index} className="flex flex-col justify-between border-2 border-gray-200 rounded-xl">
                <Image
                  src={blobFile.url}
                  alt={blobFile.name}
                  className="w-full h-auto object-contain rounded-xl"
                  width={256}
                  height={256}
                />
                <h3>{blobFile.name}</h3>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
