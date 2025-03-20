export interface DesktopIcon {
  id: number;
  name: string;
  icon: string;
  appType: 'terminal' | 'notepad' | 'computer' | 'web' | 'programs';
  isSelected: boolean;
  url?: string;
}

export interface Window {
  id: number;
  title: string;
  icon: string;
  type: 'terminal' | 'notepad' | 'computer' | 'web' | 'programs';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  url?: string;
}

export interface HelpWindow {
  id: string;
  title: string;
  icon: string;
  content: string;
  width: number;
  height: number;
  isResizable: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  zIndex: number;
}
