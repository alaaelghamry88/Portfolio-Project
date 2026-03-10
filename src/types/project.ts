export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  year: number;
  role: string;
  liveUrl?: string;
  githubUrl?: string;
  /** Path to thumbnail image in /public/images/projects */
  thumbnail: string;
  /** Path to short preview video in /public/videos/projects */
  videoPreview?: string;
  featured: boolean;
}
