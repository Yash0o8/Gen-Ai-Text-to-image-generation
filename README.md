GenAI Text-to-Image Generator
A full-stack Generative AI application that converts text prompts into high-quality images using Stable Diffusion.
Built with a React + Tailwind frontend and a FastAPI + PyTorch backend, supporting advanced controls like resolution selection, seed reproducibility, LoRA styles, image upscaling, and generation history.

🚀 Features
🧠 AI Image Generation


Stable Diffusion v1.5 (runwayml/stable-diffusion-v1-5)


Prompt + Negative Prompt support


CFG Scale & Steps control


Seed input for reproducible generations


Auto prompt enhancement for better image quality


🎛️ Advanced Controls


Resolution selector (512 / 640 / 768)


LoRA toggle (style adapter support)


Preset styles (frontend-based)


GPU / CPU auto-detection


🖼️ Image Tools


Real-time image preview


Image download


Upscaling (Option A):


2× and 4× resolution upscaling using high-quality interpolation




Metadata display (time, CFG, steps, resolution, seed)


🕘 History & UX


Image generation history (latest first)


Click-to-restore previous images


Dark mode support


Clean, responsive UI (Tailwind CSS)



🏗️ Tech Stack
Frontend


React (Vite)


Tailwind CSS


JavaScript (ES6)


Fetch API


Backend


FastAPI


PyTorch


Diffusers (Hugging Face)


PIL (Image Processing)


Uvicorn



📁 Project Structure
genai_text_to_img/
│
├── backend/
│   ├── main.py            # FastAPI app & API routes
│   ├── sd_pipeline.py     # Stable Diffusion + LoRA + Upscale logic
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Controls.jsx
│   │   │   ├── ImagePreview.jsx
│   │   │   ├── PromptBox.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   └── Generator.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── constants/
│   │       └── presets.js
│   └── package.json
│
└── README.md


⚙️ Setup Instructions
1️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt

Run the backend:
venv\Scripts\activate      # Windows
python -m uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000


2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173


🔍 API Endpoints
Generate Image
POST /generate

Payload
{
  "prompt": "a futuristic city at sunset",
  "negative_prompt": "blurry, low quality",
  "cfg_scale": 7.5,
  "steps": 30,
  "seed": 123,
  "width": 512,
  "height": 512,
  "use_lora": false
}


Upscale Image
POST /upscale

Payload
{
  "image": "<base64>",
  "scale": 2
}


System Info (GPU Badge)
GET /system


🖥️ CPU vs GPU


Automatically detects CUDA availability


Runs on GPU if available, otherwise safely falls back to CPU


Float32 enforced for stability (prevents black images & NaNs)



🔐 Security Notes


CORS enabled for development (*)


Input validation via Pydantic


Exception handling for all AI operations


Ready for production hardening (rate limiting, auth, CORS restriction)



📈 Project Completion Status
~98–99% Complete
✔ Core AI generation
✔ Upscaling
✔ Presets
✔ LoRA
✔ Metadata
✔ History
✔ UX polish
Optional future upgrades:


Auth & rate limiting


Cloud deployment


ESRGAN / SD Upscaler (Option B)


Save gallery to DB



👤 Author
Yash Pandey
Aspiring Data Analyst & GenAI Developer
Skilled in Python, Power BI, Web Development & AI pipelines
