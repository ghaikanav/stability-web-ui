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
    inputImageUrl,
    maskImageUrl,
  }: { promptMessage: string; inputImageUrl: string; maskImageUrl: string } =
    JSON.parse(req.body);

  console.log("body", promptMessage, inputImageUrl, maskImageUrl);

  const request = buildGenerationRequest("stable-diffusion-xl-1024-v0-9", {
    type: "image-to-image-masking",
    initImage: Buffer.from(inputImageUrl.split(",")[1], "base64"),
    maskImage: Buffer.from(maskImageUrl.split(",")[1], "base64"),
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

  let imageUrl = "";

  await executeGenerationRequest(client, request, metadata)
    .then((resp) => {
      imageUrl = onGenerationComplete(resp);
    })
    .catch((error) => {
      console.error("Failed to make image-to-image-masking request:", error);
    });

  console.log("response is", imageUrl);
  res.status(200).json({ url: imageUrl });
}
