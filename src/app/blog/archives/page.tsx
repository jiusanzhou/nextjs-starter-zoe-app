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
    description: getLabel(config, 'blog.archiveDescription'),
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
    <div className="blog-archives">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {getLabel(config, 'blog.archives')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {getLabel(config, 'blog.archiveDescription')} &mdash; {getLabel(config, 'blog.totalPosts', { count: posts.length })}
        </p>
      </div>

      {yearGroups.length > 0 ? (
        <div className="space-y-16">
          {yearGroups.map((group) => (
            <section key={group.year} className="relative">
              <div className="flex gap-6 sm:gap-12">
                {/* Year - Large number on left */}
                <div className="flex-shrink-0 w-16 sm:w-24">
                  <div className="sticky top-24 text-4xl sm:text-6xl font-bold text-muted-foreground/30 tabular-nums">
                    {group.year}
                  </div>
                </div>

                {/* Timeline + Posts */}
                <div className="flex-1 relative">
                  {/* Vertical line */}
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

                  <div className="space-y-0">
                    {group.posts.map((post, idx) => (
                      <div key={post.slug} className="relative pl-8 pb-6 last:pb-0 group">
                        {/* Timeline node */}
                        <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                        {/* Post card */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block rounded-lg border bg-card p-4 hover:bg-muted/50 hover:border-primary/30 transition-all"
                        >
                          <time
                            dateTime={post.date}
                            className="text-xs text-muted-foreground"
                          >
                            {format(new Date(post.date), getLabel(config, 'blog.archiveDateFormat'))}
                          </time>
                          <h3 className="mt-1 font-medium group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          {getLabel(config, 'blog.noPosts')}
        </div>
      )}
    </div>
  );
}
