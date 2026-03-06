import { AuthorCard } from "@/components/author-card";
import type { ContactSection, Author } from "@/types";

interface ContactSectionProps {
  config: ContactSection;
  author?: Author;
}

export function ContactSectionComponent({ config, author }: ContactSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <AuthorCard author={author} className="max-w-lg" />
      </div>
    </section>
  );
}
