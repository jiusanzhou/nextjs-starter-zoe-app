import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { getAllPosts } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'blog.archives'),
    description: getLabel(config, 'blog.browseTags'),
  };
}

interface YearGroup {
  year: number;
  posts: {
    slug: string;
    title: string;
    date: string;
  }[];
}

export default function ArchivesPage() {
  const config = loadZoeConfig();
  const posts = getAllPosts();

  const yearGroups: YearGroup[] = [];
  const yearMap = new Map<number, YearGroup>();

  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    let group = yearMap.get(year);
    if (!group) {
      group = { year, posts: [] };
      yearMap.set(year, group);
      yearGroups.push(group);
    }
    group.posts.push({
      slug: post.slug,
      title: post.title,
      date: post.date,
    });
  }

  yearGroups.sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getLabel(config, 'blog.archives')}</h1>
        <p className="mt-2 text-muted-foreground">
          {getLabel(config, 'blog.totalPosts', { count: posts.length })}
        </p>
      </div>

      {yearGroups.length > 0 ? (
        <div className="space-y-8">
          {yearGroups.map((group) => (
            <section key={group.year}>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                {group.year}
                <span className="text-sm text-muted-foreground ml-2">
                  ({group.posts.length})
                </span>
              </h2>
              <ul className="space-y-3">
                {group.posts.map((post) => (
                  <li key={post.slug} className="flex items-baseline gap-4">
                    <time
                      dateTime={post.date}
                      className="text-sm text-muted-foreground w-24 flex-shrink-0"
                    >
                      {format(new Date(post.date), getLabel(config, 'blog.archiveDateFormat'))}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {getLabel(config, 'blog.noPosts')}
        </div>
      )}
    </div>
  );
}
