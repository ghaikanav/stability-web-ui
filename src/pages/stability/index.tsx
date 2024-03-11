import { ChangeEvent, useState } from "react";
import { ImageInput } from "@/components/ImageInput";
import Image from "next/image";
import Head from "next/head";

export const Stability = () => {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);
  const [maskImageUrl, setMaskImageUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [outputImageUrl, setOutputImageUrl] = useState<string>("");

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  const handleGenerate = async () => {
    const requestBody = {
      promptMessage: textInput,
      inputImageUrl,
      maskImageUrl,
    };
    const { url } = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching data:", error));

    setOutputImageUrl("data:image/jpeg;base64," + url);
  };

  return (
    <>
      <Head>
        <title>Stability UI</title>
      </Head>
      <div>Welcome to stable diffusion!</div>
      <div>
        <input
          type="text"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text"
        />
      </div>
      <ImageInput
        name={"Input Image"}
        label={"inputImage"}
        imageUrl={inputImageUrl}
        setImageUrl={setInputImageUrl}
      />
      <ImageInput
        name={"Mask Image"}
        label={"maskImage"}
        imageUrl={maskImageUrl}
        setImageUrl={setMaskImageUrl}
      />
      <div>
        <button onClick={handleGenerate}>Generate</button>
      </div>
      <div>
        {outputImageUrl && (
          <Image src={outputImageUrl} alt="" height={200} width={200} />
        )}
      </div>
    </>
  );
};

export default Stability;
