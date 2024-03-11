import fs from "fs";
import * as Generation from "./generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../api/feature/helper";
import {client,metadata} from "../api/feature/base"

const request = buildGenerationRequest("stable-diffusion-xl-1024-v0-9", {
  type: "image-to-image-masking",
  initImage: fs.readFileSync("./init_image.png"),
  maskImage: fs.readFileSync("./mask_image.png"),
  prompts: [
    {
      text: "crayon drawing of rocket ship launching from forest",
    },
  ],
  seed: 44332211,
  samples: 1,
  cfgScale: 8,
  steps: 50,
  sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
});

executeGenerationRequest(client, request, metadata)
  .then(onGenerationComplete)
  .catch((error) => {
    console.error("Failed to make image-to-image-masking request:", error);
  });