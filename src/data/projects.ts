export interface Project {
  name: string;
  desc: string;
  url?: string;
  github: string;
  featured: boolean;
  accent: string;
}

export const projects: Project[] = [
  { name: 'aggregate-graph', desc: '数据聚合图可视化', url: 'https://drawhub-pied.vercel.app/', github: 'https://github.com/Justwithyou/aggregate-graph', featured: true, accent: 'cyan' },
  { name: 'markdown-editor', desc: '在线 Markdown 编辑器', github: 'https://github.com/Justwithyou/Markdown-Editor', featured: false, accent: 'indigo' },
  { name: 'prompt-registry', desc: '提示词管理平台', github: 'https://github.com/Justwithyou/prompt-registry', featured: false, accent: 'indigo' },
];