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
import { ProductsSectionComponent } from "./products-section";
import { ContactSectionComponent } from "./contact-section";
import { QuoteSectionComponent } from "./quote-section";
import type {
  SectionConfigUnion,
  CustomSection,
  Author,
  ZoeSiteConfig,
} from "@/types";
import type { PostMeta } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

interface SectionRendererProps {
  sections: SectionConfigUnion[];
  posts?: PostMeta[];
  githubProjects?: ProjectFromGitHub[];
  author?: Author;
  siteConfig?: ZoeSiteConfig;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {config.items.map((item, j) => (
            <div
              key={j}
              className="group flex flex-col gap-4 p-7 md:p-8 rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
            >
              {item.icon && (
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-3xl shrink-0 transition-colors group-hover:bg-primary/15">
                  {item.icon}
                </div>
              )}
              <h3 className="font-semibold text-lg md:text-xl tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// Track non-hero section index for alternating backgrounds
function getSectionBg(type: string, nonHeroIndex: number): string | undefined {
  if (type === "hero") return undefined;
  return nonHeroIndex % 2 === 1 ? "bg-muted/30" : undefined;
}

export function SectionRenderer({ sections, posts, githubProjects, author, siteConfig }: SectionRendererProps) {
  let nonHeroIndex = 0;

  return (
    <>
      {sections.map((section, idx) => {
        // Backward compat: no type field = custom section
        const type = section.type || "custom";
        const bg = getSectionBg(type, type !== "hero" ? nonHeroIndex : 0);
        if (type !== "hero") nonHeroIndex++;

        const wrap = (node: React.ReactNode) =>
          bg ? <div key={idx} className={bg}>{node}</div> : <>{node}</>;

        switch (type) {
          case "hero":
            return (
              <HeroSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'hero' }}
              />
            );
          case "features":
            return wrap(
              <FeaturesSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'features' }}
              />
            );
          case "logos":
            return wrap(
              <LogosSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'logos' }}
              />
            );
          case "testimonials":
            return wrap(
              <TestimonialsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'testimonials' }}
              />
            );
          case "stats":
            return wrap(
              <StatsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'stats' }}
              />
            );
          case "pricing":
            return wrap(
              <PricingSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'pricing' }}
              />
            );
          case "faq":
            return wrap(
              <FAQSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'faq' }}
              />
            );
          case "cta":
            return wrap(
              <CTASectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'cta' }}
              />
            );
          case "posts":
            return wrap(
              <PostsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'posts' }}
                posts={posts || []}
                siteConfig={siteConfig}
              />
            );
          case "projects":
            return wrap(
              <ProjectsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'projects' }}
                projects={githubProjects || []}
                siteConfig={siteConfig}
              />
            );
          case "products":
            return wrap(
              <ProductsSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'products' }}
                siteConfig={siteConfig}
              />
            );
          case "contact":
            return wrap(
              <ContactSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'contact' }}
                author={author}
                siteConfig={siteConfig}
              />
            );
          case "quote":
            return wrap(
              <QuoteSectionComponent
                key={idx}
                config={section as SectionConfigUnion & { type: 'quote' }}
              />
            );
          case "custom":
          default:
            return wrap(
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
