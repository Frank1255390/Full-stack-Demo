"use client";

// 结果区卡片。显示父组件(TextLabView)传来的 result"。
// 没有结果时（result 为 null）先显示一份默认占位；有结果就显示后端返回的内容。
// 拼音、情感分数目前后端还是占位/粗略值，后续会换成真的。
import { useEffect, useRef } from "react";
import { animate, scrambleText } from "animejs";

export default function ResultCard({ result }) {
  const cardRef = useRef(null);
  const scoreRef = useRef(null);

  const original = result ? result.text : "生活没有标准答案...";
  const pinyin = result
    ? result.pinyin
    : "shēng huó méi yǒu biāo zhǔn dá àn...";
  const score = result ? result.score : 0.86;
  const label = result ? result.label : "偏积极";

  // useEffect 是 React 提供的一个函数,用来安排页面后面要做的事
  // () 表示一个小函数(不传入任何参数),=> 表示函数接下来要做的事
  useEffect(() => {
    // 卡片自己淡入：.card 默认 opacity:0，这张卡负责把自己显出来
    // current 是 React 的固定属性名,用来存放由 useRef 返回对象的内容
    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      ease: "outBack", // 结束时使用带一点回弹感的效果
    });
  }, []);
  // 数字滚动效果
  useEffect(() => {
    if (!result) return;

    animate(scoreRef.current, {
      innerHTML: scrambleText({ chars: "0-9" }),
      duration: 1500,
    });
  }, [result]);

  return (
    <article
      ref={cardRef}
      className="panel panel-half lab-panel result-panel card"
    >
      <div className="panel-heading">
        <p className="section-kicker">结果区</p>
        <h3>分析结果</h3>
      </div>
      <div className="result-stack">
        <div className="result-item">
          <span>原文</span>
          <p className={result ? "" : "result-placeholder"}>{original}</p>
        </div>
        <div className="result-item">
          <span>拼音</span>
          <p className={result ? "" : "result-placeholder"}>{pinyin}</p>
        </div>
        <div className="result-grid">
          <div className="result-badge">
            <span>情感分数</span>
            <strong
              data-score
              ref={scoreRef}
              className={result ? "" : "result-placeholder"}
            >
              {score}
            </strong>
          </div>
          <div className="result-badge">
            <span>情感判断</span>
            <strong className={result ? "" : "result-placeholder"}>
              {label}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}
