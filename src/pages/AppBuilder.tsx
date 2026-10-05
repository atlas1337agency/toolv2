import React, { useState, DragEvent, useEffect } from 'react';
import { 
  Download, Smartphone, Tablet, Monitor, Type, Square, Image as ImageIcon, 
  AlignLeft, Trash2, Code, Move, Layout, Box, Grid, Layers, Minus, 
  CheckSquare, ToggleLeft, SlidersHorizontal, List, CreditCard, User,
  Navigation, PanelBottom, AppWindow, Loader, Globe, Map, Video, Plus, Settings,
  ChevronDown, ChevronRight, MousePointer2, Smartphone as MobileIcon, Laptop,
  AlignLeft as AlignLeftIcon, AlignCenter, AlignRight, AlignJustify,
  ArrowDown, ArrowRight, AlignVerticalSpaceAround, AlignHorizontalSpaceAround
} from 'lucide-react';
import JSZip from 'jszip';

// --- Types ---
type DeviceMode = 'mobile' | 'tablet' | 'desktop';
type ComponentCategory = 'Layout' | 'Basic UI' | 'Input' | 'Data' | 'Navigation' | 'Advanced' | 'Special';

interface ComponentDef {
  type: string;
  category: ComponentCategory;
  icon: React.ElementType;
  label: string;
  defaultProps: any;
  isContainer?: boolean;
}

interface AppElement {
  id: string;
  type: string;
  props: any;
  children: AppElement[];
}

interface Screen {
  id: string;
  name: string;
  elements: AppElement[];
}

// --- Component Registry ---
const COMPONENT_REGISTRY: ComponentDef[] = [
  // Layout
  { type: 'container', category: 'Layout', icon: Box, label: 'Container', isContainer: true, defaultProps: { padding: 16, backgroundColor: 'transparent', borderRadius: 0, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', gap: 0 } },
  { type: 'stack', category: 'Layout', icon: Layers, label: 'Stack', isContainer: true, defaultProps: { padding: 16, gap: 12, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', backgroundColor: 'transparent', borderRadius: 0 } },
  { type: 'grid', category: 'Layout', icon: Grid, label: 'Grid', isContainer: true, defaultProps: { padding: 16, columns: 2, gap: 12, backgroundColor: 'transparent', borderRadius: 0 } },
  
  // Basic UI
  { type: 'text', category: 'Basic UI', icon: Type, label: 'Text', defaultProps: { text: 'Double click to edit', fontSize: 16, color: '#111827', fontWeight: '400', textAlign: 'left', padding: 0 } },
  { type: 'button', category: 'Basic UI', icon: Square, label: 'Button', defaultProps: { title: 'Click Me', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: 8, padding: 12, fontSize: 16, fontWeight: '600', textAlign: 'center', actionType: 'none', actionTarget: '' } },
  { type: 'image', category: 'Basic UI', icon: ImageIcon, label: 'Image', defaultProps: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', width: '100%', height: 200, borderRadius: 12, objectFit: 'cover' } },
  { type: 'divider', category: 'Basic UI', icon: Minus, label: 'Divider', defaultProps: { color: '#e5e7eb', thickness: 1, marginVertical: 16 } },
  { type: 'spacer', category: 'Basic UI', icon: Move, label: 'Spacer', defaultProps: { height: 32 } },
  
  // Input
  { type: 'textInput', category: 'Input', icon: AlignLeft, label: 'Text Input', defaultProps: { placeholder: 'Enter text...', borderColor: '#d1d5db', backgroundColor: '#ffffff', color: '#111827', borderRadius: 8, padding: 12, fontSize: 16 } },
  { type: 'checkbox', category: 'Input', icon: CheckSquare, label: 'Checkbox', defaultProps: { label: 'Accept terms', checked: false, color: '#111827', activeColor: '#3b82f6' } },
  { type: 'switch', category: 'Input', icon: ToggleLeft, label: 'Switch', defaultProps: { label: 'Enable notifications', active: false, color: '#111827', activeColor: '#3b82f6' } },
  { type: 'slider', category: 'Input', icon: SlidersHorizontal, label: 'Slider', defaultProps: { min: 0, max: 100, value: 50, activeColor: '#3b82f6' } },
  
  // Data
  { type: 'list', category: 'Data', icon: List, label: 'List', isContainer: true, defaultProps: { padding: 0, gap: 8, flexDirection: 'column' } },
  { type: 'card', category: 'Data', icon: CreditCard, label: 'Card', isContainer: true, defaultProps: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16, shadow: 'md', flexDirection: 'column', gap: 8 } },
  { type: 'avatar', category: 'Data', icon: User, label: 'Avatar', defaultProps: { url: 'https://i.pravatar.cc/150?img=68', size: 48, borderRadius: 24 } },
  
  // Navigation
  { type: 'navbar', category: 'Navigation', icon: Navigation, label: 'Navbar', defaultProps: { title: 'App Title', backgroundColor: '#ffffff', color: '#111827', padding: 16, shadow: 'sm' } },
  { type: 'tabbar', category: 'Navigation', icon: PanelBottom, label: 'Tab Bar', defaultProps: { tabs: 'Home,Search,Profile', activeColor: '#3b82f6', backgroundColor: '#ffffff' } },
  
  // Advanced
  { type: 'modal', category: 'Advanced', icon: AppWindow, label: 'Modal', isContainer: true, defaultProps: { title: 'Modal Title', visible: true, backgroundColor: '#ffffff', padding: 20, borderRadius: 16 } },
  { type: 'loader', category: 'Advanced', icon: Loader, label: 'Loader', defaultProps: { color: '#3b82f6', size: 32 } },
  
  // Special
  { type: 'webview', category: 'Special', icon: Globe, label: 'WebView', defaultProps: { url: 'https://example.com', height: 300, borderRadius: 8 } },
  { type: 'map', category: 'Special', icon: Map, label: 'Map', defaultProps: { latitude: 37.7749, longitude: -122.4194, height: 250, borderRadius: 8 } },
  { type: 'video', category: 'Special', icon: Video, label: 'Video Player', defaultProps: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', height: 200, borderRadius: 8 } },
];

const CATEGORIES: ComponentCategory[] = ['Layout', 'Basic UI', 'Input', 'Data', 'Navigation', 'Advanced', 'Special'];

const PRESET_COLORS = ['#transparent', '#ffffff', '#000000', '#f3f4f6', '#9ca3af', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

export function AppBuilder() {
  // --- State ---
  const [screens, setScreens] = useState<Screen[]>([{ id: 'screen-1', name: 'Home Screen', elements: [] }]);
  const [currentScreenId, setCurrentScreenId] = useState<string>('screen-1');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ 'Layout': true, 'Basic UI': true, 'Data': true });
  const [activeTab, setActiveTab] = useState<'components' | 'screens'>('components');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<'components' | 'properties' | null>(null);

  const currentScreen = screens.find(s => s.id === currentScreenId) || screens[0];

  // --- Helpers ---
  const generateId = () => Math.random().toString(36).substring(7);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // --- Drag & Drop ---
  const handleDragStart = (e: DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
  };

  const handleDrop = (e: DragEvent, targetId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData('componentType');
    if (!type) return;

    const def = COMPONENT_REGISTRY.find(c => c.type === type);
    if (!def) return;

    const newElement: AppElement = {
      id: generateId(),
      type,
      props: { ...def.defaultProps },
      children: [],
    };

    if (targetId === null) {
      updateScreenElements(currentScreenId, [...currentScreen.elements, newElement]);
    } else {
      const newElements = insertElement(currentScreen.elements, targetId, newElement);
      updateScreenElements(currentScreenId, newElements);
    }
    setSelectedId(newElement.id);
  };

  const insertElement = (elements: AppElement[], targetId: string, newEl: AppElement): AppElement[] => {
    return elements.map(el => {
      if (!el || !el.props) return el;
      if (el.id === targetId) {
        return { ...el, children: [...el.children, newEl] };
      }
      if (el.children.length > 0) {
        return { ...el, children: insertElement(el.children, targetId, newEl) };
      }
      return el;
    });
  };

  // --- Element Management ---
  const updateScreenElements = (screenId: string, newElements: AppElement[]) => {
    setScreens(screens.map(s => s.id === screenId ? { ...s, elements: newElements } : s));
  };

  const updateElementProps = (id: string, newProps: any) => {
    const updateRecursive = (elements: AppElement[]): AppElement[] => {
      return elements.map(el => {
        if (!el || !el.props) return el;
        if (el.id === id) return { ...el, props: { ...el.props, ...newProps } };
        if (el.children && el.children.length > 0) return { ...el, children: updateRecursive(el.children) };
        return el;
      });
    };
    updateScreenElements(currentScreenId, updateRecursive(currentScreen.elements));
  };

  const removeElement = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const removeRecursive = (elements: AppElement[]): AppElement[] => {
      return elements.filter(el => el && el.id !== id).map(el => ({
        ...el,
        children: el.children ? removeRecursive(el.children) : []
      }));
    };
    updateScreenElements(currentScreenId, removeRecursive(currentScreen.elements));
    if (selectedId === id) setSelectedId(null);
  };

  const addScreen = () => {
    const newScreen = { id: generateId(), name: `Screen ${screens.length + 1}`, elements: [] };
    setScreens([...screens, newScreen]);
    setCurrentScreenId(newScreen.id);
  };

  // --- Find Selected Element ---
  const findElement = (elements: AppElement[], id: string): AppElement | null => {
    if (!elements || !Array.isArray(elements)) return null;
    for (const el of elements) {
      if (!el) continue;
      if (el.id === id) return el;
      if (el.children && Array.isArray(el.children)) {
        const found = findElement(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  const selectedElement = selectedId ? findElement(currentScreen.elements, selectedId) : null;

  // --- Renderers ---
  const renderElement = (el: AppElement) => {
    if (!el || !el.props) return null;
    const isSelected = selectedId === el.id;
    const def = COMPONENT_REGISTRY.find(c => c.type === el.type);
    const isContainer = def?.isContainer;

    const baseClasses = `relative group transition-all outline-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-[#111827] z-10' : 'hover:ring-2 hover:ring-blue-300/50 dark:hover:ring-blue-700/50 hover:ring-offset-1 dark:hover:ring-offset-[#111827]'}`;
    
    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(el.id);
    };

    const getShadowClass = (shadow: string) => {
      switch(shadow) {
        case 'sm': return 'shadow-sm';
        case 'md': return 'shadow-md';
        case 'lg': return 'shadow-lg';
        default: return '';
      }
    };

    const renderContent = () => {
      switch (el.type) {
        case 'text':
          return <div style={{ fontSize: el.props.fontSize, color: el.props.color, fontWeight: el.props.fontWeight, textAlign: el.props.textAlign, padding: el.props.padding, width: '100%' }}>{el.props.text}</div>;
        case 'button':
          return (
            <div style={{ backgroundColor: el.props.backgroundColor, borderRadius: el.props.borderRadius, padding: el.props.padding, width: '100%' }} className="flex items-center justify-center cursor-pointer active:opacity-80">
              <span style={{ color: el.props.color, fontSize: el.props.fontSize, fontWeight: el.props.fontWeight, textAlign: el.props.textAlign }}>{el.props.title}</span>
            </div>
          );
        case 'image':
          return (
            <div style={{ width: el.props.width, height: el.props.height, borderRadius: el.props.borderRadius }} className="overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
              <img src={el.props.url} alt="Preview" className="w-full h-full" style={{ objectFit: el.props.objectFit }} draggable={false} />
            </div>
          );
        case 'divider':
          return <div style={{ height: el.props.thickness, backgroundColor: el.props.color, margin: `${el.props.marginVertical}px 0`, width: '100%' }} />;
        case 'spacer':
          return <div style={{ height: el.props.height, width: '100%' }} />;
        case 'textInput':
          return (
            <div style={{ borderColor: el.props.borderColor, backgroundColor: el.props.backgroundColor, borderRadius: el.props.borderRadius, padding: el.props.padding, width: '100%' }} className="border">
              <span style={{ color: el.props.color, fontSize: el.props.fontSize }} className="opacity-60">{el.props.placeholder}</span>
            </div>
          );
        case 'checkbox':
          return (
            <div className="flex items-center gap-3 w-full" style={{ padding: el.props.padding }}>
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${el.props.checked ? 'border-transparent' : 'border-zinc-400'}`} style={{ backgroundColor: el.props.checked ? el.props.activeColor : 'transparent' }}>
                {el.props.checked && <CheckSquare className="w-4 h-4 text-white" />}
              </div>
              <span style={{ color: el.props.color, fontSize: el.props.fontSize }}>{el.props.label}</span>
            </div>
          );
        case 'switch':
          return (
            <div className="flex items-center justify-between w-full" style={{ padding: el.props.padding }}>
              <span style={{ color: el.props.color, fontSize: el.props.fontSize }}>{el.props.label}</span>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors`} style={{ backgroundColor: el.props.active ? el.props.activeColor : '#d1d5db' }}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${el.props.active ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          );
        case 'slider':
          return (
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full relative my-4">
              <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${((el.props.value - el.props.min) / (el.props.max - el.props.min)) * 100}%`, backgroundColor: el.props.activeColor }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow border border-zinc-200" style={{ left: `${((el.props.value - el.props.min) / (el.props.max - el.props.min)) * 100}%`, transform: 'translate(-50%, -50%)' }} />
            </div>
          );
        case 'avatar':
          return (
            <img src={el.props.url} style={{ width: el.props.size, height: el.props.size, borderRadius: el.props.borderRadius }} className="object-cover flex-shrink-0" draggable={false} />
          );
        case 'navbar':
          return (
            <div style={{ backgroundColor: el.props.backgroundColor, color: el.props.color, padding: el.props.padding }} className={`w-full flex items-center justify-center font-semibold ${getShadowClass(el.props.shadow)} z-10`}>
              {el.props.title}
            </div>
          );
        case 'tabbar':
          const tabs = (el.props.tabs || '').split(',').map((t: string) => t.trim()).filter(Boolean);
          return (
            <div style={{ backgroundColor: el.props.backgroundColor }} className="w-full flex justify-around p-3 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
              {tabs.map((tab: string, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ backgroundColor: i === 0 ? el.props.activeColor : undefined }} />
                  <span className="text-[10px] font-medium" style={{ color: i === 0 ? el.props.activeColor : '#9ca3af' }}>{tab}</span>
                </div>
              ))}
            </div>
          );
        case 'loader':
          return <div className="flex justify-center w-full py-4"><Loader className="animate-spin" style={{ color: el.props.color, width: el.props.size, height: el.props.size }} /></div>;
        case 'webview':
          return (
            <div style={{ height: el.props.height, borderRadius: el.props.borderRadius }} className="w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 overflow-hidden relative">
              {el.props.url ? (
                <iframe src={el.props.url} className="w-full h-full border-0 pointer-events-none" title="WebView Preview" />
              ) : (
                <div className="flex flex-col items-center text-zinc-500">
                  <Globe className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">WebView Placeholder</span>
                </div>
              )}
            </div>
          );
        case 'map':
          return (
            <div style={{ height: el.props.height, borderRadius: el.props.borderRadius }} className="w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 overflow-hidden relative">
              <iframe 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${el.props.longitude - 0.01},${el.props.latitude - 0.01},${el.props.longitude + 0.01},${el.props.latitude + 0.01}&layer=mapnik&marker=${el.props.latitude},${el.props.longitude}`}
                className="w-full h-full border-0 pointer-events-none" 
                title="Map Preview" 
              />
            </div>
          );
        case 'video':
          return (
            <div style={{ height: el.props.height, borderRadius: el.props.borderRadius }} className="w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 overflow-hidden relative">
              {el.props.url ? (
                <video src={el.props.url} controls className="w-full h-full object-cover pointer-events-none" />
              ) : (
                <div className="flex flex-col items-center text-zinc-500">
                  <Video className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Video Placeholder</span>
                </div>
              )}
            </div>
          );
        case 'container':
        case 'card':
        case 'stack':
        case 'list':
        case 'modal':
        case 'grid':
          const isGrid = el.type === 'grid';
          return (
            <div 
              style={{ 
                padding: el.props.padding, 
                backgroundColor: el.props.backgroundColor === 'transparent' ? undefined : el.props.backgroundColor, 
                borderRadius: el.props.borderRadius,
                display: isGrid ? 'grid' : 'flex',
                flexDirection: el.props.flexDirection,
                alignItems: el.props.alignItems,
                justifyContent: el.props.justifyContent,
                gap: el.props.gap,
                gridTemplateColumns: isGrid ? `repeat(${el.props.columns}, 1fr)` : undefined,
                minHeight: el.children.length === 0 ? '80px' : undefined,
                width: '100%'
              }}
              className={`
                ${el.children.length === 0 ? 'border-2 border-dashed border-blue-300/50 dark:border-blue-700/50 bg-blue-50/30 dark:bg-blue-900/10' : ''}
                ${getShadowClass(el.props.shadow || '')}
                ${el.type === 'modal' ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm z-50 border border-zinc-200 dark:border-zinc-800' : ''}
              `}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => handleDrop(e, el.id)}
            >
              {el.children.length === 0 && <div className="text-blue-400 dark:text-blue-500 text-xs font-medium text-center m-auto pointer-events-none">Drop {el.type} content here</div>}
              {el.children.map(child => renderElement(child))}
            </div>
          );
        default:
          return <div className="p-4 bg-red-100 text-red-500 w-full">Unknown Component</div>;
      }
    };

    return (
      <div key={el.id} onClick={handleElementClick} className={baseClasses} style={{ width: el.type === 'tabbar' || el.type === 'navbar' ? '100%' : undefined }}>
        {isSelected && (
          <div className="absolute -top-3 -right-3 flex gap-1 z-30">
            <button onClick={(e) => removeElement(el.id, e)} className="bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    );
  };

  // --- Export Code ---
  const generateCode = () => {
    const generateJSX = (elements: AppElement[], indent = '      '): string => {
      return elements.map(el => {
        if (!el || !el.props) return '';
        const propsStr = Object.entries(el.props || {})
          .filter(([k]) => k !== 'children')
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ');
        if (el.children && el.children.length > 0) {
          return `${indent}<${el.type} ${propsStr}>\n${generateJSX(el.children, indent + '  ')}\n${indent}</${el.type}>`;
        }
        return `${indent}<${el.type} ${propsStr} />`;
      }).join('\n');
    };

    let code = `import React from 'react';\nimport { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';\n\n`;
    
    screens.forEach(screen => {
      code += `export function ${screen.name.replace(/\s+/g, '')}() {\n  return (\n    <ScrollView style={styles.container}>\n${generateJSX(screen.elements)}\n    </ScrollView>\n  );\n}\n\n`;
    });

    code += `const styles = StyleSheet.create({\n  container: { flex: 1, backgroundColor: '#fff' }\n});`;
    return code;
  };

  const downloadSourceCode = async () => {
    const zip = new JSZip();
    zip.file('App.js', generateCode());
    zip.file('package.json', JSON.stringify({ name: "generated-app", version: "1.0.0", dependencies: { "react": "*", "react-native": "*" } }, null, 2));
    
    const readme = `# React Native App
Generated by App Builder Pro.

## How to run
1. Install Node.js and Expo CLI (\`npm install -g expo-cli\`)
2. Run \`npm install\`
3. Run \`expo start\`
4. Use the Expo Go app on your phone to scan the QR code.

## How to build APK/AAB
Run \`eas build -p android\`
`;
    zip.file('README.md', readme);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app-source.zip';
    a.click();
  };

  // --- Smart Properties UI Components ---
  const PropGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        {title}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const TextInput = ({ label, propKey, type = 'text', placeholder = '' }: { label: string, propKey: string, type?: string, placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
      <input 
        type={type} 
        value={selectedElement?.props[propKey] ?? ''} 
        placeholder={placeholder}
        onChange={(e) => updateElementProps(selectedElement!.id, { [propKey]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );

  const SliderInput = ({ label, propKey, min = 0, max = 100, step = 1 }: { label: string, propKey: string, min?: number, max?: number, step?: number }) => (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</label>
        <span className="text-xs text-zinc-500 font-mono">{selectedElement?.props[propKey] ?? 0}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step}
        value={selectedElement?.props[propKey] ?? 0} 
        onChange={(e) => updateElementProps(selectedElement!.id, { [propKey]: Number(e.target.value) })}
        className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  const ColorInput = ({ label, propKey }: { label: string, propKey: string }) => {
    const value = selectedElement?.props[propKey] || '#000000';
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 flex-shrink-0">
              <input 
                type="color" 
                value={value === 'transparent' ? '#ffffff' : value} 
                onChange={(e) => updateElementProps(selectedElement!.id, { [propKey]: e.target.value })}
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
              />
              {value === 'transparent' && <div className="absolute inset-0 bg-white dark:bg-zinc-900 flex items-center justify-center"><div className="w-full h-px bg-red-500 rotate-45" /></div>}
            </div>
            <input 
              type="text" 
              value={value} 
              onChange={(e) => updateElementProps(selectedElement!.id, { [propKey]: e.target.value })}
              className="flex-1 p-1.5 text-sm font-mono border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => updateElementProps(selectedElement!.id, { [propKey]: c === '#transparent' ? 'transparent' : c })}
                className={`w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 ${c === '#transparent' ? 'bg-white dark:bg-zinc-900 relative overflow-hidden' : ''}`}
                style={{ backgroundColor: c !== '#transparent' ? c : undefined }}
                title={c}
              >
                {c === '#transparent' && <div className="absolute inset-0 w-full h-px bg-red-500 rotate-45 top-1/2 -translate-y-1/2" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ToggleGroup = ({ label, propKey, options }: { label: string, propKey: string, options: {icon?: React.ReactNode, label?: string, value: string}[] }) => (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
        {options.map(opt => {
          const isActive = selectedElement?.props[propKey] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => updateElementProps(selectedElement!.id, { [propKey]: opt.value })}
              className={`flex-1 flex items-center justify-center py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
              title={opt.value}
            >
              {opt.icon || opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const SelectInput = ({ label, propKey, options }: { label: string, propKey: string, options: {label: string, value: string}[] }) => (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
      <select 
        value={selectedElement?.props[propKey] || ''} 
        onChange={(e) => updateElementProps(selectedElement!.id, { [propKey]: e.target.value })}
        className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  // --- Render Properties Panel ---
  const renderProperties = () => {
    if (!selectedElement) {
      return (
        <div className="text-center text-zinc-500 dark:text-zinc-400 mt-20 flex flex-col items-center px-4">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <MousePointer2 className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">No Element Selected</h3>
          <p className="text-sm">Click on any element in the canvas to edit its properties, styles, and actions.</p>
        </div>
      );
    }

    const { type, props } = selectedElement;
    const def = COMPONENT_REGISTRY.find(c => c.type === type);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-200 pb-20">
        <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm text-blue-600 dark:text-blue-400">
            {def && <def.icon className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{def?.label}</h2>
            <p className="text-[10px] text-zinc-500 font-mono">{selectedElement.id}</p>
          </div>
        </div>

        {/* Dynamic Properties based on type */}
        <PropGroup title="Data & Content">
          {props.text !== undefined && <TextInput label="Text Content" propKey="text" />}
          {props.title !== undefined && <TextInput label="Title" propKey="title" />}
          {props.url !== undefined && <TextInput label="Media URL" propKey="url" />}
          {props.placeholder !== undefined && <TextInput label="Placeholder" propKey="placeholder" />}
          {props.label !== undefined && <TextInput label="Label" propKey="label" />}
          {props.tabs !== undefined && <TextInput label="Tabs (comma separated)" propKey="tabs" placeholder="Home, Search, Profile" />}
          {props.checked !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="prop-checked" checked={props.checked} onChange={(e) => updateElementProps(selectedElement.id, { checked: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              <label htmlFor="prop-checked" className="text-sm text-zinc-700 dark:text-zinc-300">Is Checked / Active</label>
            </div>
          )}
          {props.active !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="prop-active" checked={props.active} onChange={(e) => updateElementProps(selectedElement.id, { active: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              <label htmlFor="prop-active" className="text-sm text-zinc-700 dark:text-zinc-300">Is Active</label>
            </div>
          )}
        </PropGroup>

        <PropGroup title="Appearance">
          {props.color !== undefined && <ColorInput label="Text/Icon Color" propKey="color" />}
          {props.backgroundColor !== undefined && <ColorInput label="Background Color" propKey="backgroundColor" />}
          {props.activeColor !== undefined && <ColorInput label="Active Color" propKey="activeColor" />}
          {props.borderColor !== undefined && <ColorInput label="Border Color" propKey="borderColor" />}
          
          {props.fontSize !== undefined && <SliderInput label="Font Size" propKey="fontSize" min={10} max={72} />}
          {props.fontWeight !== undefined && (
            <SelectInput label="Font Weight" propKey="fontWeight" options={[
              {label: 'Light (300)', value: '300'}, {label: 'Normal (400)', value: '400'}, {label: 'Medium (500)', value: '500'}, {label: 'Semi Bold (600)', value: '600'}, {label: 'Bold (700)', value: 'bold'}
            ]} />
          )}
          {props.textAlign !== undefined && (
            <ToggleGroup label="Text Align" propKey="textAlign" options={[
              {icon: <AlignLeftIcon className="w-4 h-4" />, value: 'left'},
              {icon: <AlignCenter className="w-4 h-4" />, value: 'center'},
              {icon: <AlignRight className="w-4 h-4" />, value: 'right'},
              {icon: <AlignJustify className="w-4 h-4" />, value: 'justify'}
            ]} />
          )}
          {props.shadow !== undefined && (
            <SelectInput label="Shadow" propKey="shadow" options={[
              {label: 'None', value: 'none'}, {label: 'Small', value: 'sm'}, {label: 'Medium', value: 'md'}, {label: 'Large', value: 'lg'}
            ]} />
          )}
        </PropGroup>

        <PropGroup title="Spacing & Size">
          {props.padding !== undefined && <SliderInput label="Padding" propKey="padding" min={0} max={64} />}
          {props.borderRadius !== undefined && <SliderInput label="Border Radius" propKey="borderRadius" min={0} max={100} />}
          {props.gap !== undefined && <SliderInput label="Gap (Spacing)" propKey="gap" min={0} max={64} />}
          {props.height !== undefined && <SliderInput label="Height" propKey="height" min={10} max={800} step={10} />}
          {props.size !== undefined && <SliderInput label="Size" propKey="size" min={16} max={256} />}
          {props.thickness !== undefined && <SliderInput label="Thickness" propKey="thickness" min={1} max={10} />}
        </PropGroup>

        {(props.flexDirection !== undefined || props.alignItems !== undefined) && (
          <PropGroup title="Flex Layout">
            {props.flexDirection !== undefined && (
              <ToggleGroup label="Direction" propKey="flexDirection" options={[
                {icon: <ArrowDown className="w-4 h-4" />, value: 'column', label: 'Col'}, 
                {icon: <ArrowRight className="w-4 h-4" />, value: 'row', label: 'Row'}
              ]} />
            )}
            {props.alignItems !== undefined && (
              <SelectInput label="Align Items (Cross Axis)" propKey="alignItems" options={[
                {label: 'Start', value: 'flex-start'}, {label: 'Center', value: 'center'}, {label: 'End', value: 'flex-end'}, {label: 'Stretch', value: 'stretch'}
              ]} />
            )}
            {props.justifyContent !== undefined && (
              <SelectInput label="Justify Content (Main Axis)" propKey="justifyContent" options={[
                {label: 'Start', value: 'flex-start'}, {label: 'Center', value: 'center'}, {label: 'End', value: 'flex-end'}, {label: 'Space Between', value: 'space-between'}, {label: 'Space Around', value: 'space-around'}
              ]} />
            )}
            {props.columns !== undefined && <SliderInput label="Grid Columns" propKey="columns" min={1} max={6} />}
          </PropGroup>
        )}

        {type === 'button' && (
          <PropGroup title="Interactions">
            <SelectInput label="On Click Action" propKey="actionType" options={[
              {label: 'None', value: 'none'}, {label: 'Navigate to Screen', value: 'navigate'}, {label: 'Open URL', value: 'url'}, {label: 'Show Alert', value: 'alert'}, {label: 'Fetch API', value: 'fetch'}
            ]} />
            {props.actionType === 'navigate' && (
              <SelectInput label="Target Screen" propKey="actionTarget" options={screens.map(s => ({label: s.name, value: s.id}))} />
            )}
            {props.actionType === 'url' && <TextInput label="URL to Open" propKey="actionTarget" placeholder="https://..." />}
            {props.actionType === 'alert' && <TextInput label="Alert Message" propKey="actionTarget" placeholder="Hello World!" />}
            {props.actionType === 'fetch' && <TextInput label="API Endpoint" propKey="actionTarget" placeholder="https://api.example.com/data" />}
          </PropGroup>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-[#0a0a0a] overflow-hidden">
      {/* Topbar */}
      <div className="flex-none h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a22] flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg hidden sm:block text-zinc-900 dark:text-white">App Builder Pro</h1>
          
          {/* Device Toggles */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button onClick={() => setDeviceMode('mobile')} className={`p-1.5 rounded-md transition-colors ${deviceMode === 'mobile' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`} title="Mobile View">
              <MobileIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setDeviceMode('tablet')} className={`p-1.5 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`} title="Tablet View">
              <Tablet className="w-4 h-4" />
            </button>
            <button onClick={() => setDeviceMode('desktop')} className={`p-1.5 rounded-md transition-colors ${deviceMode === 'desktop' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`} title="Desktop View">
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggles */}
          <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md" onClick={() => setMobileMenuOpen(mobileMenuOpen === 'components' ? null : 'components')}>
            <Plus className="w-5 h-5" />
          </button>
          <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md" onClick={() => setMobileMenuOpen(mobileMenuOpen === 'properties' ? null : 'properties')}>
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={downloadSourceCode}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Source</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Components & Screens) */}
        <div className={`absolute lg:relative z-40 h-full w-72 bg-white dark:bg-[#181a22] border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${mobileMenuOpen === 'components' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 p-2 gap-2">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'components' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              onClick={() => setActiveTab('components')}
            >
              Components
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'screens' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              onClick={() => setActiveTab('screens')}
            >
              Screens
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {activeTab === 'components' ? (
              <div className="space-y-3 pb-20">
                {CATEGORIES.map(category => {
                  const categoryComponents = COMPONENT_REGISTRY.filter(c => c.category === category);
                  if (categoryComponents.length === 0) return null;
                  const isExpanded = expandedCategories[category];

                  return (
                    <div key={category} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-[#181a22]">
                      <button 
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">{category}</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-2 grid grid-cols-2 gap-2">
                          {categoryComponents.map(comp => (
                            <div
                              key={comp.type}
                              draggable
                              onDragStart={(e) => handleDragStart(e, comp.type)}
                              className="flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 cursor-grab hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:cursor-grabbing"
                            >
                              <comp.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                              <span className="text-[10px] font-medium text-center text-zinc-600 dark:text-zinc-400 leading-tight">{comp.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {screens.map(screen => (
                  <div 
                    key={screen.id}
                    onClick={() => setCurrentScreenId(screen.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${currentScreenId === screen.id ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-blue-300'}`}
                  >
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{screen.name}</span>
                    <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{screen.elements.length}</span>
                  </div>
                ))}
                <button 
                  onClick={addScreen}
                  className="w-full p-3 mt-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Screen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas - Fully Responsive */}
        <div 
          className="flex-1 overflow-hidden bg-zinc-100 dark:bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-8 relative"
          onClick={() => setSelectedId(null)}
        >
          {/* Responsive Scaling Container */}
          <div className="w-full h-full flex items-center justify-center min-h-0 min-w-0">
            <div 
              className={`transition-all duration-300 ease-in-out relative flex flex-col bg-white dark:bg-[#111827] overflow-hidden shadow-2xl ${
                deviceMode === 'mobile' ? 'w-full max-w-[375px] h-full max-h-[812px] rounded-[2.5rem] border-[10px] sm:border-[14px] border-zinc-900 dark:border-black' : 
                deviceMode === 'tablet' ? 'w-full max-w-[768px] h-full max-h-[1024px] rounded-[1.5rem] sm:rounded-[2rem] border-[8px] sm:border-[12px] border-zinc-900 dark:border-black' : 
                'w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-800'
              }`}
              style={{
                aspectRatio: deviceMode === 'mobile' ? '375/812' : deviceMode === 'tablet' ? '768/1024' : 'auto'
              }}
            >
              {/* Mobile Notch */}
              {deviceMode === 'mobile' && (
                <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-zinc-900 dark:bg-black rounded-b-2xl sm:rounded-b-3xl w-1/2 max-w-[160px] mx-auto z-20 pointer-events-none"></div>
              )}

              {/* Canvas Area */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden relative w-full h-full custom-scrollbar"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e)}
              >
                {currentScreen.elements.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
                    <Layout className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-300 mb-2">Empty Screen</h3>
                    <p className="text-sm max-w-[250px]">Drag components from the left sidebar and drop them here.</p>
                  </div>
                ) : (
                  <div className="min-h-full pb-20 flex flex-col w-full">
                    {currentScreen.elements.map(el => renderElement(el))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (Properties) */}
        <div className={`absolute right-0 lg:relative z-40 h-full w-80 bg-white dark:bg-[#181a22] border-l border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${mobileMenuOpen === 'properties' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">Properties</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {renderProperties()}
          </div>
        </div>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(null)}
          />
        )}

      </div>
    </div>
  );
}
