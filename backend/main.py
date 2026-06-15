from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from rembg import remove
from pdf2docx import Converter
from PIL import Image, ImageEnhance, ImageFilter
from pdfplumber import open as pdf_open
from docx import Document

import cv2
import numpy as np
import base64
import uuid
import io
import os

app = FastAPI()

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "ToolHubAI backend running successfully 🚀"}


# -------------------------
# BACKGROUND REMOVER
# -------------------------
@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    input_image = await file.read()

    output = remove(input_image)

    encoded = base64.b64encode(output).decode("utf-8")

    return {"image": encoded}


# -------------------------
# OBJECT REMOVER
# -------------------------
@app.post("/remove-object")
async def remove_object(
    file: UploadFile = File(...),
    mask: UploadFile = File(...)
):
    image_bytes = await file.read()
    mask_bytes = await mask.read()

    np_image = np.frombuffer(image_bytes, np.uint8)
    np_mask = np.frombuffer(mask_bytes, np.uint8)

    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    mask_image = cv2.imdecode(np_mask, cv2.IMREAD_UNCHANGED)

    if image is None or mask_image is None:
        return {"error": "Invalid image or mask"}

    if mask_image.ndim == 3:
        mask_gray = cv2.cvtColor(mask_image, cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask_image

    _, mask_thresh = cv2.threshold(
        mask_gray,
        10,
        255,
        cv2.THRESH_BINARY
    )

    inpainted = cv2.inpaint(
        image,
        mask_thresh,
        3,
        cv2.INPAINT_TELEA
    )

    _, buffer = cv2.imencode(
        ".png",
        inpainted
    )

    encoded = base64.b64encode(
        buffer
    ).decode("utf-8")

    return {"image": encoded}


# -------------------------
# AI CHAT ASSISTANT
# -------------------------
class ChatRequest(BaseModel):
    message: str


@app.post("/chat-assistant")
async def chat_assistant(request: ChatRequest):
    prompt = request.message.strip().lower()

    if not prompt:
        return {
            "answer": "Send a question or tell me what you want help with."
        }

    if "deploy" in prompt or "live" in prompt:
        answer = (
            "Deploy frontend on Vercel and backend on Render."
        )

    elif "pdf" in prompt or "docx" in prompt:
        answer = (
            "Use PDF and DOCX tools for conversion."
        )

    else:
        answer = (
            "I can help with ToolHubAI features and workflow."
        )

    return {"answer": answer}


# -------------------------
# PDF → DOCX
# -------------------------
@app.post("/pdf-to-docx")
async def pdf_to_docx(file: UploadFile = File(...)):
    unique_id = str(uuid.uuid4())

    pdf_path = f"{unique_id}.pdf"
    docx_path = f"{unique_id}.docx"

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    cv = Converter(pdf_path)
    cv.convert(docx_path)
    cv.close()

    return FileResponse(
        path=docx_path,
        filename="converted.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


# -------------------------
# AI IMAGE ENHANCER
# -------------------------
@app.post("/enhance-image")
async def enhance_image(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(
        io.BytesIO(contents)
    )

    image = image.filter(
        ImageFilter.SHARPEN
    )

    contrast = ImageEnhance.Contrast(image)
    image = contrast.enhance(1.3)

    sharpness = ImageEnhance.Sharpness(image)
    image = sharpness.enhance(2.0)

    img_byte_arr = io.BytesIO()

    image.save(
        img_byte_arr,
        format="PNG"
    )

    encoded = base64.b64encode(
        img_byte_arr.getvalue()
    ).decode("utf-8")

    return {"image": encoded}


# -------------------------
# AI RESUME ANALYZER
# -------------------------
@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    text = ""

    if file.filename.endswith(".pdf"):
        contents = await file.read()

        temp_file = "resume.pdf"

        with open(temp_file, "wb") as f:
            f.write(contents)

        with pdf_open(temp_file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()

                if extracted:
                    text += extracted

    elif file.filename.endswith(".docx"):
        contents = await file.read()

        temp_file = "resume.docx"

        with open(temp_file, "wb") as f:
            f.write(contents)

        doc = Document(temp_file)

        for para in doc.paragraphs:
            text += para.text + "\n"

    skills_db = [
        "python", "java", "sql",
        "react", "fastapi",
        "machine learning",
        "data analysis",
        "docker", "aws",
        "javascript",
        "html", "css",
        "mongodb",
        "git", "github"
    ]

    found_skills = []

    for skill in skills_db:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    score = min(
        100,
        len(found_skills) * 8 + 20
    )

    suggestions = []

    if "projects" not in text.lower():
        suggestions.append(
            "Add a Projects section"
        )

    if "experience" not in text.lower():
        suggestions.append(
            "Add experience or internships"
        )

    ats_tips = [
        "Use clear headings",
        "Add measurable achievements",
        "Use job-related keywords",
        "Keep formatting simple"
    ]

    return {
        "score": score,
        "skills": found_skills,
        "suggestions": suggestions,
        "ats_tips": ats_tips
    }


# -------------------------
# PHOTO UPSCALER
# -------------------------
@app.post("/upscale-image")
async def upscale_image(file: UploadFile = File(...)):
    contents = await file.read()

    np_arr = np.frombuffer(
        contents,
        np.uint8
    )

    image = cv2.imdecode(
        np_arr,
        cv2.IMREAD_COLOR
    )

    upscaled = cv2.resize(
        image,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    kernel = np.array([
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ])

    upscaled = cv2.filter2D(
        upscaled,
        -1,
        kernel
    )

    _, buffer = cv2.imencode(
        ".png",
        upscaled
    )

    encoded = base64.b64encode(
        buffer
    ).decode("utf-8")

    return {"image": encoded}


# -------------------------
# RENDER STARTUP
# -------------------------
if __name__ == "__main__":
    import uvicorn

    port = int(
        os.environ.get("PORT", 10000)
    )

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )