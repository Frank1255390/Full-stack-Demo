"use client";

// 用法：<AnimatedCardGrid className="dashboard-grid">… hero + 几张卡片 …</AnimatedCardGrid>
// "卡片飞入"动画。
// 因为用了 useEffect / anime.js，要在浏览器里跑，所以顶上标了 "use client"。
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// 使用时,<AnimatedCardGrid> 标签内的内容,都会按照下面的动画显示
export default function AnimatedCardGrid({ className, children }) {
  const ref = useRef(null);

  /*
  在 React 中 useEffect 表示准备好,但暂时先不执行
  React 会自动检查组组件内的元素是否放好了(第30行)
  */
  useEffect(() => {
    // 查找所有类名为 card 的元素
    const cards = ref.current.querySelectorAll(".card");
    animate(cards, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(120), // 每张卡错开 120ms
      duration: 700,
      ease: "outBack", // 弹性落地
    });
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
