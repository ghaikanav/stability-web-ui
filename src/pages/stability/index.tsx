import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import styles from "./index.module.css";

export const Stability = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSelectedFileRef = useRef<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Process the file here
      console.log(file);

      // Check if the same file is selected again
      if (file.name === lastSelectedFileRef.current?.name) {
        // Clear the input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        lastSelectedFileRef.current = file;
      };

      reader.readAsDataURL(file);

      console.log(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);

    lastSelectedFileRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  const handleGenerate = async () => {

    const requestBody = 
    {
      promptMessage: textInput,
      imageUrl
    }
    const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify(requestBody) })
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <>
      <div>Welcome to stable diffusion!</div>
      <div>
        <input
          type="text"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text"
        />
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
        />
      </div>

      {imageUrl && (
        <div className={styles.imageContainer}>
          <button onClick={handleRemoveImage} style={{ cursor: "pointer" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
          <Image
            src={imageUrl}
            alt="Uploaded"
            style={{ objectFit: "cover" }}
            height={200}
            width={200}
          />
        </div>
      )}

      <button onClick={handleGenerate}>Generate</button>
    </>
  );
};

export default Stability;
