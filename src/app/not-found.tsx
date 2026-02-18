import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 404 动画数字 */}
      <div className="relative mb-8">
        <h1 className="text-[10rem] sm:text-[12rem] font-bold text-muted-foreground/20 select-none leading-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl sm:text-7xl animate-bounce">🔍</div>
        </div>
      </div>

      {/* 提示文字 */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        页面走丢了
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        抱歉，您访问的页面不存在或已被移除。
        <br />
        可能是链接过期了，或者您输入了错误的地址。
      </p>

      {/* 操作按钮 */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            返回首页
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            浏览博客
          </Link>
        </Button>
      </div>

      {/* 底部提示 */}
      <p className="mt-12 text-sm text-muted-foreground">
        如果您认为这是一个错误，请{" "}
        <Link href="https://github.com/jiusanzhou/nextjs-starter-zoe-app/issues" className="text-primary hover:underline">
          提交 Issue
        </Link>
        {" "}告诉我们。
      </p>
    </div>
  );
}
