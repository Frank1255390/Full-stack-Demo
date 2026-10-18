import json
from datetime import datetime, timezone
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pypinyin import lazy_pinyin, Style
from snownlp import SnowNLP

HISTORY_FILE = "history.json"

def load_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_record(record):
    records = load_history()
    records.append(record)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    # ensure_ascii 让文件的中文可以直接阅读,indent 设置首行缩进

app = FastAPI()

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

@app.get("/api/history")
def history():
    records = load_history()   # 读出文件里的全部记录
    records.reverse()
    return records[:5]

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