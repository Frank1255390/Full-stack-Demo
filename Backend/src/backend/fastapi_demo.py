from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


profile = {
    "heroTitle": "我的项目Backend",  # → 临时加的标记，验证完删掉
    "heroSubtitle": "项目，创意，灵感，心得",
    "featuredWork": {
        "kicker": "作品",
        "title": "文字实验室",
        "copy": "拼音和情绪，挖掘中文里的细节",
        "linkLabel": "打开作品",
    },
    "identity": {
        "motto": "老天爷放我一马",
        "learning": "全栈",
    },
}


class AnalyzeRequest(BaseModel):
    text: str

@app.get("/api/profile")
def get_profile():
    return profile

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    return{
        "text":req.text,
        "score":0.5,
        "label":"偏平静",
        "pinyin":"不知道,再说"
    }
