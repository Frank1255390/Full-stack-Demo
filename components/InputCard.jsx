"use client";
// 告诉Next.js 这个文件需要在浏览器中运行
// 这个页面需要读取用户的内容,响应按钮点击,发送请求

// 文字实验室的"输入区"卡片。给"开始分析"接上了后端：
// 点按钮就把输入的文字 POST 给 /api/analyze，拿到结果通过 onResult 交给父组件。
// 请求出问题时用 try/catch 接住，在按钮上方给一行提示，不让界面无声失效。
import { useState } from "react"; // useState用于暂存内容,例如输入框里的文字,请求失败时显示的错误

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InputCard({ onResult }) {
  /*
  这个语句相当于 React 框架提供的函数
  useState 的作用是让 React 帮忙记住一个值
  [] 中的 text 表示当前的值
   setXXX 是 React 提供的更新函数,用于更新当前记住的 text
  */
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // 定义函数, async 表示这个函数可能需要等待一段时间,因为需要等待后端回答
  async function handleAnalyze() {
    setError(""); // 开始新一轮的分析前,先把上一轮可能会残留的错误提示清除

    try {
      // await 表示停在这里等待后端回答(不糊冻结整个页面)
      const res = await fetch(`${API}/api/analyze`, {
        method: "POST", // method 用与说明请求方式
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ← 新增：带上 cookie
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        /* 
        catch 和普通的try/catch的用法一样,表示没通过就执行catch中的内容
        catch中的 () => ({}) 是一种函数的简写,和一下函数含义一样:
        fuction () {
          return{};
        } 
        */
        const body = await res.json().catch(() => ({}));
        // throw 的作用和 return 类似,但 throw 是以错误的形式终端流程.所以会直接跳转到catch
        throw new Error(body.detail || `分析失败：${res.status}`);
      }
      /*
      TextLabView 中的 onResult={setResult} 语句,将 setResult 函数赋值给 onResult
      所以这里实际上使用的是 TextLabView 中的 setResult 函数
      这样就可以做到文件之间的数据互通
      */
      onResult(await res.json());
    } catch (error) {
      setError(error.message);
    }
  }

  // 使用 return 把页面结构交出去
  return (
    // 这里的 className 中在 css 文件中都有对应的格式,运行时浏览器会到 css 中寻找对应的格式
    <article className="panel panel-half lab-panel card">
      <div className="panel-heading">
        <p className="section-kicker">输入区</p>
        <h3>输入一段文字</h3>
      </div>
      {/* 
      form 用来把一组输入区域和相关按钮组织在一起
      onSubmit 是 React 提供的功能,当输入的内容要提交时就会运行下面的函数
      */}
      <form className="lab-form" onSubmit={(e) => e.preventDefault()}>
        {/* <lable>用来给输入框添加一段说明,htmlFor 用来关联要添加说明的文本框 */}
        <label htmlFor="text-input">文本内容</label>
        <textarea
          id="text-input"
          rows="8"
          placeholder="例如：生活没有标准答案，但每一天都值得认真感受。"
          value={text}
          // onChange 表示输入框内容发生变化时，运行右边的函数
          // target value 是浏览器提供的常用属性
          // target 指向发生变化的元素,value 表示输入的值
          onChange={(e) => setText(e.target.value)}
        />
        {/* state 现身：text 一变，这行数字自动跟着变 */}
        <p className="lab-count">已输入 {text.length} 字</p>
        {/* 
        {}表示这里面不是普通文字，而是一段 JavaScript 表达式
        && 的意思是,左边不为空就执行右边
        */}
        {error && <p className="lab-error">{error}</p>}
        <button
          className="primary-button"
          type="button"
          onClick={handleAnalyze} // 按下按钮时执行 handleAnalyze
        >
          开始分析
        </button>
      </form>
    </article>
  );
}
