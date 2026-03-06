import type { ZoeSiteConfig } from '@/types';

const defaultLabels: Record<string, string> = {
  // Blog
  'blog': 'Blog',
  'blog.archives': 'Archives',
  'blog.tags': 'Tags',
  'blog.drafts': 'Drafts',
  'blog.drafts.description': 'These posts are unpublished and only visible in development mode',
  'blog.drafts.empty': 'No drafts yet',
  'blog.drafts.badge': 'Draft',
  'blog.drafts.frontmatterHint': 'Set {code} in frontmatter to create a draft',
  'blog.back': 'Back to Blog',
  'blog.readMore': 'Read More',
  'blog.viewMore': 'View More',
  'blog.noTags': 'No tags yet',
  'blog.noPosts': 'No posts yet',
  'blog.browseTags': 'Browse posts by tag',
  'blog.totalPosts': '{count} posts',
  'blog.tagPrefix': 'Tag: ',
  'blog.minRead': 'min read',
  'blog.comments': 'Comments',
  'blog.dateFormat': 'MMM dd, yyyy',
  'blog.archiveDateFormat': 'MM-dd',
  'blog.postNotFound': 'Post Not Found',
  'blog.searchPlaceholder': 'Search articles...',
  'blog.featured': 'Featured',
  'blog.pinnedPost': 'Pinned',
  'blog.gridView': 'Grid view',
  'blog.listView': 'List view',
  'blog.heroDescription': 'Thoughts, tutorials, and insights',
  'blog.allPosts': 'All Posts',
  'blog.prevPost': 'Previous',
  'blog.nextPost': 'Next',
  'blog.tagNotFound': 'Tag Not Found',
  'blog.tagDescription': 'All posts tagged with "{name}"',
  'blog.postsCount': '{count} posts',
  'blog.archiveDescription': 'All posts organized by year',
  'blog.tagsDescription': 'Browse all topics',
  'blog.writtenBy': 'Written by',

  // Projects
  'projects': 'Projects',
  'projects.description': 'My open source projects and portfolio',
  'projects.tag': 'Tag:',
  'projects.viewMore': 'View More',
  'projects.noProjects': 'No projects yet',
  'projects.count': '{count} projects',
  'projects.filterAll': 'All',

  // Help
  'help': 'Help Center',
  'help.title': 'Hi, how can we help?',
  'help.searchPlaceholder': 'Search help content...',
  'help.notConfigured': 'Help center is not configured. Please add helpqa.repo to zoe-site.yaml.',
  'help.categories': 'Help Categories',
  'help.category': 'Help Category',
  'help.pinned': 'Popular Questions',
  'help.faq': 'FAQ',
  'help.viewAll': 'View All',
  'help.back': 'Back to Help Center',
  'help.noContent': 'No content available',
  'help.detail': 'Help Detail',
  'help.feedback': 'Was this helpful?',
  'help.feedbackThanks': 'Thanks for your feedback!',

  // Pricing
  'pricing': 'Pricing',
  'pricing.description': 'Choose the right plan for you',
  'pricing.monthly': 'Monthly',
  'pricing.yearly': 'Yearly',
  'pricing.yearlySave': 'Save {percent}%',
  'pricing.getStarted': 'Get Started',
  'pricing.recommended': 'Recommended',

  // Loading
  'loading': 'Loading...',

  // Not Found
  'notFound.title': 'Page Not Found',
  'notFound.description': 'Sorry, the page you are looking for does not exist or has been removed.',
  'notFound.hint': 'The link may have expired, or you may have entered the wrong address.',
  'notFound.home': 'Go Home',
  'notFound.blog': 'Browse Blog',
  'notFound.issueHint': 'If you think this is a bug, please',
  'notFound.issueLink': 'submit an issue',
  'notFound.issueEnd': 'to let us know.',

  // Error
  'error.title': 'Something went wrong',
  'error.description': 'An unexpected error occurred. Please try again.',
  'error.retry': 'Try Again',
  'error.home': 'Go Home',

  // Contact
  'contact': 'Contact',
  'contact.description': 'Get in touch',
  'contact.form.name': 'Name',
  'contact.form.namePlaceholder': 'Your name',
  'contact.form.email': 'Email',
  'contact.form.emailPlaceholder': 'your@email.com',
  'contact.form.message': 'Message',
  'contact.form.messagePlaceholder': 'Tell us about your project...',
  'contact.form.submit': 'Send Message',
  'contact.form.sent': 'Message sent! We\u2019ll get back to you soon.',

  // Homepage
  'home.projects': 'Projects',
  'home.projects.description': 'Open source work',
  'home.latestPosts': 'Latest Posts',
  'home.latestPosts.description': 'Recent writings',

  // Page
  'page.notFound': 'Page Not Found',

  // Header
  'header.more': 'More',

  // Footer
  'footer.wechatQR': 'WeChat QR Code',
  'footer.wechatScan': 'Scan to add on WeChat',

  // Releases
  'releases': 'Downloads',
  'releases.description': 'Download the latest version',
  'releases.notConfigured': 'Release repository not configured',
  'releases.configHint': 'Please configure the releaseRepo field in zoe-site.yaml.',
  'releases.latest': 'Latest',
  'releases.prerelease': 'Pre-release',
  'releases.latestVersion': 'Latest version:',
  'releases.publishedAt': 'Published on',
  'releases.versionList': 'Version List',
  'releases.versionListDescription': 'Choose the version for your platform',
  'releases.noReleases': 'No releases yet',
  'releases.showAll': 'Show all {count} versions',
  'releases.notes': 'Release Notes',

  // Changelog
  'changelog': 'Changelog',
  'changelog.description': 'View version history',
  'changelog.empty': 'No changelog entries yet',
  'changelog.latestVersion': 'Latest version:',
  'changelog.publishedAt': 'Published on',
  'changelog.viewHistory': 'View version history and new features',
  'changelog.viewDetails': 'View details',
  'changelog.emptyHint.markdown': 'Add Markdown files to the {dir} directory,',
  'changelog.emptyHint.config': 'or configure a GitHub repository in {file}:',
};

export function getLabel(config: ZoeSiteConfig | undefined | null, key: string, vars?: Record<string, string | number>): string {
  let label = config?.labels?.[key] ?? defaultLabels[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      label = label.replace(`{${k}}`, String(v));
    }
  }
  return label;
}
