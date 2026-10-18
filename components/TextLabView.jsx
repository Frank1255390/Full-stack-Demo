"use client";

// 文字实验室页。这一节把"结果"这份 state 提到了这里——因为 InputCard 负责发请求、
// ResultCard 负责显示，两个兄弟组件要共享同一份结果，就放到它们共同的父组件里
//用了 useState，所以顶上写了 "use client"。
import { useState } from "react"; // 保存结果的工具
import Nav from "./Nav.jsx"; // 导航栏
import PageHeading from "./PageHeading.jsx"; // 标题部件
import AnimatedCardGrid from "./AnimatedCardGrid.jsx"; // 动画区域
import InputCard from "./InputCard.jsx"; // 输入卡片
import ResultCard from "./ResultCard.jsx"; // 结果卡片
import { textLab } from "../data/site.js"; // 文字实验室的标题

export default function TextLabView() {
  const [result, setResult] = useState(null);

  return (
    // AnimatedCardGrid 是卡片进入动画
    <AnimatedCardGrid className="dashboard-grid">
      <article className="hero-stage panel-full">
        <Nav /> {/* 在这行显示 Nav 中的信息 */}
        {/* PageHeading 显示标题部件,并导入 site.js 中的文字 */}
        <PageHeading
          title={textLab.heroTitle}
          subtitle={textLab.heroSubtitle}
        />
      </article>

      {/* 
      这句话的意思就是要使用 InputCard 里面 export 给外部的函数
      InputCard 中的函数的参数名是 onResult,这里把函数 setResult 传给 onResult
      这样在 InputCard 中使用 onResult 时,就是在调用 setResult 函数
      */}
      <InputCard onResult={setResult} />
      <ResultCard result={result} />
    </AnimatedCardGrid>
  );
}
