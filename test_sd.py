import torch
from diffusers import StableDiffusionPipeline

model_id = "runwayml/stable-diffusion-v1-5"

pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)

pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

image = pipe(
    "a cute cartoon astronaut riding a cat, cinematic lighting",
    num_inference_steps=30,
    guidance_scale=7.5
).images[0]

image.save("output.png")
print("Image saved as output.png")
