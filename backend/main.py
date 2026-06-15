from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pdf2docx import Converter
from PIL import Image, ImageEnhance, ImageFilter

from docx import Document

import cv2
import numpy as np
import base64
import uuid
import io

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


# -------------------------
# HOME
# -------------------------
@app.get("/")
def home():
    return {
        "message": "ToolHubAI backend running 🚀"
    }


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

    image = cv2.imdecode(
        np_image,
        cv2.IMREAD_COLOR
    )

    mask_image = cv2.imdecode(
        np_mask,
        cv2.IMREAD_UNCHANGED
    )

    if image is None or mask_image is None:
        return {"error": "Invalid image or mask"}

    if len(mask_image.shape) == 3:
        mask_gray = cv2.cvtColor(
            mask_image,
            cv2.COLOR_BGR2GRAY
        )
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
# CHAT ASSISTANT
# -------------------------
class ChatRequest(BaseModel):
    message: str


@app.post("/chat-assistant")
async def chat_assistant(request: ChatRequest):
    prompt = request.message.lower()

    if "deploy" in prompt:
        return {
            "answer": "Deploy frontend on Vercel and backend on Render."
        }

    elif "pdf" in prompt:
        return {
            "answer": "Use the PDF tools to convert files."
        }

    return {
        "answer": "I can help with ToolHubAI tools."
    }


# -------------------------
# PDF → DOCX
# -------------------------
@app.post("/pdf-to-docx")
async def pdf_to_docx(
    file: UploadFile = File(...)
):
    unique_id = str(uuid.uuid4())

    pdf_path = f"{unique_id}.pdf"
    docx_path = f"{unique_id}.docx"

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    converter = Converter(pdf_path)
    converter.convert(docx_path)
    converter.close()

    return FileResponse(
        path=docx_path,
        filename="converted.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


# -------------------------
# IMAGE ENHANCER
# -------------------------
@app.post("/enhance-image")
async def enhance_image(
    file: UploadFile = File(...)
):
    contents = await file.read()

    image = Image.open(
        io.BytesIO(contents)
    )

    image = image.filter(
        ImageFilter.SHARPEN
    )

    image = ImageEnhance.Contrast(
        image
    ).enhance(1.3)

    image = ImageEnhance.Sharpness(
        image
    ).enhance(2.0)

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="PNG"
    )

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return {"image": encoded}


# -------------------------
# RESUME ANALYZER
# -------------------------
@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...)
):
    text = ""

    if file.filename.endswith(".pdf"):
        contents = await file.read()

        with open("resume.pdf", "wb") as f:
            f.write(contents)

        with pdf_open("resume.pdf") as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()

                if extracted:
                    text += extracted

    elif file.filename.endswith(".docx"):
        contents = await file.read()

        with open("resume.docx", "wb") as f:
            f.write(contents)

        doc = Document("resume.docx")

        for para in doc.paragraphs:
            text += para.text + "\n"

    skills_db = [
        "python",
        "java",
        "sql",
        "react",
        "fastapi",
        "javascript",
        "html",
        "css",
        "git",
        "github"
    ]

    found_skills = []

    for skill in skills_db:
        if skill in text.lower():
            found_skills.append(skill)

    score = min(
        100,
        len(found_skills) * 8 + 20
    )

    return {
        "score": score,
        "skills": found_skills,
        "suggestions": [
            "Add Projects section",
            "Use ATS keywords"
        ]
    }


# -------------------------
# PHOTO UPSCALER
# -------------------------
@app.post("/upscale-image")
async def upscale_image(
    file: UploadFile = File(...)
):
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

    _, buffer = cv2.imencode(
        ".png",
        upscaled
    )

    encoded = base64.b64encode(
        buffer
    ).decode("utf-8")

    return {"image": encoded}