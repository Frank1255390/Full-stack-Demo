// app/layout.jsx 是 Next.js 的"全站外壳"——所有页面都套在它里面。
// 它取代了index.html + main.jsx + App.jsx 最外面那层壳：
//   - <html>/<body> 由它提供；
//   - app-shell / page-shell / page-content 这层包裹
// 注意：导航条 Nav 不在这儿，它在每一页的 hero 里（HomeView / TextLabView 各放一份），

import "../css/reset.css"; // 引入基础样式文件
import "../css/variables.css"; // 颜色和字体
import "../css/layout.css"; // 页面布局
import "../css/hero.css"; // 大标题区域
import "../css/nav.css"; // 导航栏
import "../css/cards.css"; // 卡片样式
import "../css/lab.css"; // 文字实验室
import "../css/responsive.css"; // 小屏幕布局

// 生成标题和简介,标题显示在最上方标题栏,简介可能被搜索引擎作为搜索结果摘要,不显示在页面中
export const metadata = {
  title: "Full-stack-Demo",
  description: "个人主页 + 文字实验室",
};

/*
 主页和文字实验室的内容各不相同，但都会放进同一套 <html> <body> 中
 例如访问 / 时，children 大致对应 <HomeView />
 访问 /text-lab 时，children 大致对应 <TextLabView />
 */
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <div className="page-shell">
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
