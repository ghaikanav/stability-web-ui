import fs from "fs";
import * as Generation from "./generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../api/feature/helper";
import { client, metadata } from "../api/feature/base";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    promptMessage,
    imageUrl,
  }: { promptMessage: string; imageUrl: string } = JSON.parse(req.body);

  console.log("body", promptMessage, imageUrl);

  const request = buildGenerationRequest("stable-diffusion-xl-1024-v0-9", {
    type: "image-to-image-masking",
    initImage: Buffer.from(imageUrl.split(",")[1], "base64"),
    maskImage: fs.readFileSync("src/sources/mask.png"),
    prompts: [
      {
        text: promptMessage,
      },
    ],
    seed: 44332211,
    samples: 1,
    cfgScale: 8,
    steps: 50,
    sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
  });

  await executeGenerationRequest(client, request, metadata)
    .then(onGenerationComplete)
    .catch((error) => {
      console.error("Failed to make image-to-image-masking request:", error);
    });

  res.status(200).json({ message: "Hello from Next.js!" });
}
