import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image  from "next/image";
import {toast} from "@/hooks/use-toast";

const {
    env: {
      imagekit: { publicKey, urlEndpoint },
    },
  } = config;
  const authenticator = async () => {
    try {
      const response = await fetch(`${config.env.apiEndpoint}/api/imagekit`);
  
      if (!response.ok) {
        const errorText = await response.text();
  
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }
  
      const data = await response.json();
  
      const { signature, expire, token } = data;
      console.log("Received Auth Params:", data);
  
      return { token, expire, signature };
    } catch (error: unknown) {
      throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);

    }
  };

const ImageUpload =({onFileChange}:{onFileChange: (filePath: string)=> void;
})=>{
    const ikUploadRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<{filePath: string} | null>(null);

    const onError = (error: unknown)=>{
        console.log(error);

        toast({
            title: "Image upload failed",
            description: `Your image could not be uploaded. Please try again.`,
            variant: 'destructive',
        });
    }
    interface IKUploadResponse {
        filePath: string;
    }

    const onSuccess = (res: IKUploadResponse)=>{
        setFile(res);
        onFileChange(res.filePath);

        toast({
            title: "Image uploaded successfully",
            description: `${res.filePath} uploaded successfully!`,
        });
    }
    return<ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload className="hidden" ref={ikUploadRef} onError={onError} onSuccess={onSuccess} fileName="test-upload.png" />

            <button className="upload-btn" onClick={(e) =>{
                e.preventDefault();

                if(ikUploadRef.current){
                    ikUploadRef.current?.click();
                }
            }}>
                <Image src="/icons/upload.svg" alt="upload-icon" width={20} height={20} className="object-contain" />

                <p className="text-base text-light-100">Upload a File</p>

                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>

            {file && (
                <IKImage alt={file.filePath} path={file.filePath} width={500} height={500} />
            )}
        </ImageKitProvider>
}
export default ImageUpload;