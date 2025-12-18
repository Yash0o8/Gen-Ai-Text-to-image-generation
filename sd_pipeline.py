import torch
from diffusers import StableDiffusionPipeline, EulerAncestralDiscreteScheduler
from PIL import Image

# --------------------------------------------------
# Base model
# --------------------------------------------------
MODEL_ID = "runwayml/stable-diffusion-v1-5"

# Device detection
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading Stable Diffusion on {device}")

# --------------------------------------------------
# Load pipeline
# --------------------------------------------------
pipe = StableDiffusionPipeline.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float32,
    safety_checker=None,
)

# Force float32 everywhere (CPU/GPU stable)
pipe.unet.to(torch.float32)
pipe.vae.to(torch.float32)
pipe.text_encoder.to(torch.float32)

# Stable scheduler
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(
    pipe.scheduler.config
)

pipe = pipe.to(device)
#pipe.set_progress_bar_config(disable=True)   # progress        bar disable

print("Stable Diffusion loaded successfully.")
print("Model ID:", pipe.config._name_or_path)

# --------------------------------------------------
# LoRA CONFIG
# --------------------------------------------------
LORA_PATH = "latent-consistency/lcm-lora-sdv1-5"
LORA_ENABLED = False

def enable_lora():
    global LORA_ENABLED
    if not LORA_ENABLED:
        pipe.load_lora_weights(LORA_PATH)
        pipe.fuse_lora()
        LORA_ENABLED = True
        print("✅ LoRA enabled")

def disable_lora():
    global LORA_ENABLED
    if LORA_ENABLED:
        pipe.unfuse_lora()
        LORA_ENABLED = False
        print("🛑 LoRA disabled")

# --------------------------------------------------
# TEXT → IMAGE GENERATION
# --------------------------------------------------
def generate_image(
    prompt: str,
    negative_prompt: str,
    cfg_scale: float = 7.5,
    steps: int = 30,
    seed: int | None = None,
    width: int = 512,
    height: int = 512,
    use_lora: bool = False,
):
    width = int(width)
    height = int(height)
    steps = int(steps)
    cfg_scale = float(cfg_scale)

    generator = (
        torch.Generator(device=device).manual_seed(int(seed))
        if seed is not None
        else None
    )

    if use_lora:
        enable_lora()
    else:
        disable_lora()

    with torch.no_grad():
        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            guidance_scale=cfg_scale,
            num_inference_steps=steps,
            width=width,
            height=height,
            generator=generator,
        )

    return result.images[0].convert("RGB")

# --------------------------------------------------
# IMAGE UPSCALING (Option A)
# --------------------------------------------------
def upscale_image(
    image: Image.Image,
    scale: int = 2,
    steps: int = 20,
):
    if scale not in (2, 4):
        raise ValueError("Scale must be 2 or 4")

    width, height = image.size
    target_w = width * scale
    target_h = height * scale

    with torch.no_grad():
        result = pipe(
            prompt="",
            image=image,
            strength=0.2,
            guidance_scale=7.5,
            num_inference_steps=steps,
            width=target_w,
            height=target_h,
        )

    return result.images[0].convert("RGB")
