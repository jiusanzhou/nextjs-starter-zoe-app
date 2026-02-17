import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * MDX Components
 * 自定义 MDX 渲染组件
 */

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const H1 = ({ className, children, ...props }: HeadingProps) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
    {...props}
  >
    {children}
  </h1>
);

const H2 = ({ className, children, ...props }: HeadingProps) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

const H3 = ({ className, children, ...props }: HeadingProps) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight mt-8",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

const H4 = ({ className, children, ...props }: HeadingProps) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight mt-6",
      className
    )}
    {...props}
  >
    {children}
  </h4>
);

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const P = ({ className, children, ...props }: ParagraphProps) => (
  <p
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  >
    {children}
  </p>
);

interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children?: React.ReactNode;
}

const Blockquote = ({ className, children, ...props }: BlockquoteProps) => (
  <blockquote
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  >
    {children}
  </blockquote>
);

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const Ul = ({ className, children, ...props }: ListProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
    {children}
  </ul>
);

interface OListProps extends React.HTMLAttributes<HTMLOListElement> {
  children?: React.ReactNode;
}

const Ol = ({ className, children, ...props }: OListProps) => (
  <ol
    className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
    {...props}
  >
    {children}
  </ol>
);

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const InlineCode = ({ className, children, ...props }: CodeProps) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
      className
    )}
    {...props}
  >
    {children}
  </code>
);

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

const Pre = ({ className, children, ...props }: PreProps) => (
  <pre
    className={cn(
      "mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4",
      className
    )}
    {...props}
  >
    {children}
  </pre>
);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href?: string;
}

const A = ({ className, href, children, ...props }: LinkProps) => {
  const isExternal = href?.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(
          "font-medium text-primary underline underline-offset-4",
          className
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href || "#"}
      className={cn(
        "font-medium text-primary underline underline-offset-4",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

interface ImgProps {
  src?: string;
  alt?: string;
  className?: string;
}

const Img = ({ src, alt, className }: ImgProps) => {
  if (!src) return null;

  // 外部图片或数据 URL - 使用原生 img
  if (src.startsWith("http") || src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ""}
        className={cn("rounded-md border my-6", className)}
      />
    );
  }

  // 本地图片使用 Next.js Image
  return (
    <Image
      src={src}
      alt={alt || ""}
      width={800}
      height={400}
      className={cn("rounded-md border my-6", className)}
    />
  );
};

interface HrProps extends React.HTMLAttributes<HTMLHRElement> {}

const Hr = ({ className, ...props }: HrProps) => (
  <hr className={cn("my-8", className)} {...props} />
);

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

const Table = ({ className, children, ...props }: TableProps) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className={cn("w-full", className)} {...props}>
      {children}
    </table>
  </div>
);

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
}

const Tr = ({ className, children, ...props }: TrProps) => (
  <tr
    className={cn("m-0 border-t p-0 even:bg-muted", className)}
    {...props}
  >
    {children}
  </tr>
);

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

const Th = ({ className, children, ...props }: ThProps) => (
  <th
    className={cn(
      "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

const Td = ({ className, children, ...props }: TdProps) => (
  <td
    className={cn(
      "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

/**
 * MDX 组件映射
 */
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  code: InlineCode,
  pre: Pre,
  a: A,
  img: Img,
  hr: Hr,
  table: Table,
  tr: Tr,
  th: Th,
  td: Td,
};

export default mdxComponents;
