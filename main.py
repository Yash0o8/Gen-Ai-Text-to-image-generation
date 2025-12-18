from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
import base64
import torch
from PIL import Image

from sd_pipeline import generate_image

app = FastAPI(title="GenAI Text-to-Image API")

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Request Schemas
# --------------------------------------------------
class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    cfg_scale: float = 7.5
    steps: int = 30
    seed: int | None = None
    width: int = 512
    height: int = 512
    use_lora: bool = False


class UpscaleRequest(BaseModel):
    image: str   # base64 (NO data:image/... prefix)
    scale: int = 2


# --------------------------------------------------
# System Info (GPU Badge)
# --------------------------------------------------
@app.get("/system")
def system_info():
    return {
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }


# --------------------------------------------------
# Generate Image
# --------------------------------------------------
@app.post("/generate")
def generate(req: GenerateRequest):
    try:
        image = generate_image(
            prompt=req.prompt,
            negative_prompt=req.negative_prompt,
            cfg_scale=req.cfg_scale,
            steps=req.steps,
            seed=req.seed,
            width=req.width,
            height=req.height,
            use_lora=req.use_lora,
        )

        buffer = io.BytesIO()
        image.save(buffer, format="PNG")

        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return {"image": encoded}

    except Exception as e:
        print("🔥 GENERATE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# Upscale Image (Option A – PIL)
# --------------------------------------------------
@app.post("/upscale")
def upscale(req: UpscaleRequest):
    try:
        image_bytes = base64.b64decode(req.image)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        new_size = (image.width * req.scale, image.height * req.scale)
        upscaled = image.resize(new_size, Image.LANCZOS)

        buffer = io.BytesIO()
        upscaled.save(buffer, format="PNG")

        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return {"image": encoded}

    except Exception as e:
        print("🔥 UPSCALE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
