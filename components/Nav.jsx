"use client";

// 因为用到了 usePathname、要在浏览器里跑，所以顶上标了 "use client"。
// 跳转页面 Next.js 替我们写好了那，这里只用：
//   - <Link href="/..."> 表示"点这里跳到那一页"
//   - usePathname() 告诉我们"现在地址栏长什么样"（用来高亮当前页）
import Link from "next/link";
import { usePathname } from "next/navigation"; // 读取当前网址路径的工具

export default function Nav() {
  const pathname = usePathname();
  // href 表示点了之后会去那个连接,label 表示显示什么文字
  const items = [
    { href: "/", label: "主页" },
    { href: "/text-lab", label: "文字实验室" },
  ];

  return (
    <div className="hero-topline">
      <p className="brand-eyebrow">Full-stack-Demo</p>
      <nav className="inline-links hero-nav">
        {/* 依次读取items,每次拿到数据后暂存在 it 中 */}
        {items.map((it) => {
          // const active =
          // it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          let active;
          if (it.href === "/") {
            active = pathname === "/";
          } else {
            active = pathname.startsWith(it.href);
          }
          return (
            <Link
              key={it.href}
              href={it.href}
              className={"nav-link" + (active ? " active" : "")}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
