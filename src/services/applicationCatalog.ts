// Application Catalog for Linux (Snap/APT) and Windows (Chocolatey)
export type AppCategory = 
  | 'development' 
  | 'productivity' 
  | 'communication' 
  | 'media' 
  | 'utilities' 
  | 'security'
  | 'database';

export type PackageManager = 'snap' | 'apt' | 'chocolatey' | 'container';

export interface Application {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  icon?: string;
  packageManager: PackageManager;
  packageName: string;
  version?: string;
  os: 'linux' | 'windows' | 'both';
}

export const applicationCatalog: Application[] = [
  // Development Tools
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: 'Code editor',
    category: 'development',
    icon: '💻',
    packageManager: 'snap',
    packageName: 'code',
    os: 'both',
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Version control system',
    category: 'development',
    icon: '📦',
    packageManager: 'apt',
    packageName: 'git',
    os: 'both',
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Container platform',
    category: 'development',
    icon: '🐳',
    packageManager: 'snap',
    packageName: 'docker',
    os: 'both',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime',
    category: 'development',
    icon: '🟢',
    packageManager: 'snap',
    packageName: 'node',
    os: 'both',
  },
  
  // Productivity
  {
    id: 'libreoffice',
    name: 'LibreOffice',
    description: 'Office suite',
    category: 'productivity',
    icon: '📝',
    packageManager: 'snap',
    packageName: 'libreoffice',
    os: 'linux',
  },
  {
    id: 'office365',
    name: 'Microsoft Office',
    description: 'Office suite',
    category: 'productivity',
    icon: '📊',
    packageManager: 'chocolatey',
    packageName: 'microsoft-office-deployment',
    os: 'windows',
  },
  
  // Communication
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication',
    category: 'communication',
    icon: '💬',
    packageManager: 'snap',
    packageName: 'slack',
    os: 'both',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Chat platform',
    category: 'communication',
    icon: '🎮',
    packageManager: 'snap',
    packageName: 'discord',
    os: 'both',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video conferencing',
    category: 'communication',
    icon: '📹',
    packageManager: 'snap',
    packageName: 'zoom-client',
    os: 'both',
  },
  
  // Media
  {
    id: 'vlc',
    name: 'VLC Media Player',
    description: 'Media player',
    category: 'media',
    icon: '🎬',
    packageManager: 'snap',
    packageName: 'vlc',
    os: 'both',
  },
  {
    id: 'gimp',
    name: 'GIMP',
    description: 'Image editor',
    category: 'media',
    icon: '🎨',
    packageManager: 'snap',
    packageName: 'gimp',
    os: 'linux',
  },
  
  // Databases
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'SQL database',
    category: 'database',
    icon: '🐘',
    packageManager: 'container',
    packageName: 'postgres:latest',
    os: 'both',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'SQL database',
    category: 'database',
    icon: '🐬',
    packageManager: 'container',
    packageName: 'mysql:latest',
    os: 'both',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL database',
    category: 'database',
    icon: '🍃',
    packageManager: 'container',
    packageName: 'mongo:latest',
    os: 'both',
  },
  
  // Utilities
  {
    id: 'chrome',
    name: 'Google Chrome',
    description: 'Web browser',
    category: 'utilities',
    icon: '🌐',
    packageManager: 'chocolatey',
    packageName: 'googlechrome',
    os: 'both',
  },
  {
    id: 'firefox',
    name: 'Firefox',
    description: 'Web browser',
    category: 'utilities',
    icon: '🦊',
    packageManager: 'snap',
    packageName: 'firefox',
    os: 'both',
  },
  
  // Security
  {
    id: 'fail2ban',
    name: 'Fail2Ban',
    description: 'Intrusion prevention',
    category: 'security',
    icon: '🛡️',
    packageManager: 'apt',
    packageName: 'fail2ban',
    os: 'linux',
  },
];

export const getApplicationsByCategory = (category: AppCategory): Application[] => {
  return applicationCatalog.filter(app => app.category === category);
};

export const getApplicationsByOS = (os: 'linux' | 'windows'): Application[] => {
  return applicationCatalog.filter(app => app.os === os || app.os === 'both');
};

export const searchApplications = (query: string): Application[] => {
  const lowerQuery = query.toLowerCase();
  return applicationCatalog.filter(app => 
    app.name.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery) ||
    app.packageName.toLowerCase().includes(lowerQuery)
  );
};
