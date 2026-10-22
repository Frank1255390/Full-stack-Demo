from storage import init_db, save_record, get_history
from datetime import datetime, timezone
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pypinyin import lazy_pinyin, Style
from snownlp import SnowNLP

app = FastAPI()

init_db()  # 初始化数据库，创建表格

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

profile = {
    "heroTitle": "我的项目",
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

def score_label(score):
    if score >= 0.6:
        return "偏积极"
    elif score <= 0.4:
        return "偏消极"
    else:
        return "中性"

# BaseModel 根据下面的说明检查收到的数据格式
# 前端传入的 JSON 格式就是 {"text":"今天很开心"}
class AnalyzeRequest(BaseModel):
    text: str

@app.get("/api/profile")
def get_profile():
    return profile

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.text
    score = round(SnowNLP(text).sentiments, 2)
    result = {
        "text":text,
        "score":score,
        "label":score_label(score),
        "pinyin":" ".join(lazy_pinyin(text, style=Style.TONE)),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds")
        # isoformat 把时间保存成标准格式
    }
    save_record(result)
    return result

@app.get("/api/history")
def history():
    return get_history(5)