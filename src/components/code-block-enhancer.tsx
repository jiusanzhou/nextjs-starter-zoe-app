"use client";

import { useEffect } from "react";

export function CodeBlockEnhancer() {
  useEffect(() => {
    // 找到所有 shiki 代码块
    const codeBlocks = document.querySelectorAll(".prose .shiki");
    
    codeBlocks.forEach((block) => {
      // 避免重复添加
      if (block.parentElement?.classList.contains("code-block-wrapper")) {
        return;
      }

      // 创建 wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      
      // 创建复制按钮
      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-button";
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px;">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        复制
      `;
      
      copyBtn.addEventListener("click", async () => {
        const code = block.textContent || "";
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px;">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            已复制
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px;">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              复制
            `;
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });

      // 包装代码块
      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(copyBtn);
      wrapper.appendChild(block);
    });
  }, []);

  return null;
}
