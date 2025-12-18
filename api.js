const API_URL = "http://127.0.0.1:8000";

/* -----------------------------
   Text → Image generation
------------------------------ */
export async function generateImage(payload) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Image generation failed";
    try {
      const err = await response.json();
      message = err.detail || err.error || message;
    } catch (_) {}
    throw new Error(message);
  }

  return response.json();
}

/* -----------------------------
   Image Upscaling (Option A)
------------------------------ */
export async function upscaleImage({ image, scale }) {
  const response = await fetch(`${API_URL}/upscale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
      scale,
    }),
  });

  if (!response.ok) {
    let message = "Upscale failed";
    try {
      const err = await response.json();
      message = err.detail || err.error || message;
    } catch (_) {}
    throw new Error(message);
  }

  return response.json();
}
