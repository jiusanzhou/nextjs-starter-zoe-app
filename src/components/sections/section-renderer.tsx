import { Section } from "@/components/section";
import { HeroSectionComponent } from "./hero-section";
import { FeaturesSectionComponent } from "./features-section";
import { LogosSectionComponent } from "./logos-section";
import { TestimonialsSectionComponent } from "./testimonials-section";
import { StatsSectionComponent } from "./stats-section";
import { PricingSectionComponent } from "./pricing-section";
import { FAQSectionComponent } from "./faq-section";
import { CTASectionComponent } from "./cta-section";
import { PostsSectionComponent } from "./posts-section";
import { ProjectsSectionComponent } from "./projects-section";
import { ContactSectionComponent } from "./contact-section";
import type {
  SectionConfigUnion,
  CustomSection,
  Author,
} from "@/types";
import type { PostMeta } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

interface SectionRendererProps {
  sections: SectionConfigUnion[];
  // Data dependencies passed from the page
  posts?: PostMeta[];
  githubProjects?: ProjectFromGitHub[];
  author?: Author;
}

// Render a legacy/custom section (no type field or type='custom')
function CustomSectionComponent({ config, idx }: { config: CustomSection; idx: number }) {
  return (
    <Section
      position={config.position || "left"}
      title={config.title}
      description={config.description}
      wrapperClassName={idx === 0 ? "bg-muted/50" : undefined}
    >
      {config.items && config.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.items.map((item, j) => (
            <div key={j} className="p-6 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20">
              {item.icon && <div className="text-3xl mb-4">{item.icon}</div>}
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export function SectionRenderer({ sections, posts, githubProjects, author }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, idx) => {
        // Backward compat: no type field = custom section
        const type = section.type || "custom";

        switch (type) {
          case "hero":
            return (
              <HeroSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'hero' }}
              />
            );
          case "features":
            return (
              <FeaturesSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'features' }}
              />
            );
          case "logos":
            return (
              <LogosSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'logos' }}
              />
            );
          case "testimonials":
            return (
              <TestimonialsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'testimonials' }}
              />
            );
          case "stats":
            return (
              <StatsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'stats' }}
              />
            );
          case "pricing":
            return (
              <PricingSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'pricing' }}
              />
            );
          case "faq":
            return (
              <FAQSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'faq' }}
              />
            );
          case "cta":
            return (
              <CTASectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'cta' }}
              />
            );
          case "posts":
            return (
              <PostsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'posts' }}
                posts={posts || []}
              />
            );
          case "projects":
            return (
              <ProjectsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'projects' }}
                projects={githubProjects || []}
              />
            );
          case "contact":
            return (
              <ContactSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'contact' }}
                author={author}
              />
            );
          case "custom":
          default:
            return (
              <CustomSectionComponent
                key={idx}
                config={section as CustomSection}
                idx={idx}
              />
            );
        }
      })}
    </>
  );
}
