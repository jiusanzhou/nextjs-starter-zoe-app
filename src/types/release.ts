// App Release Types

export interface ReleaseAssets {
  android?: string;
  ios?: string;
  mac?: string;
  windows?: string;
  linux?: string;
  dmg?: string;
  apk?: string;
  exe?: string;
  deb?: string;
  rpm?: string;
  [key: string]: string | undefined;
}

export interface Release {
  provider: 'github' | 'gitee';
  id: string;
  repo: string;
  title: string;
  version: string;
  created_at: string;
  published_at: string;
  prerelease: boolean;
  release_note: string;
  assets: ReleaseAssets;
  urls?: Record<string, string>;
  meta?: ReleaseMeta;
}

export interface ReleaseMeta {
  version?: string;
  assets?: ReleaseAssets;
  urls?: Record<string, string>;
}

export interface ReleaseConfig {
  provider?: 'github' | 'gitee';
  repo: string;
  assetRegexPatterns?: Record<string, string>;
}
