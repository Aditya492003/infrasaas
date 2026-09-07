import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Monitor, 
  Box, 
  Zap, 
  Split, 
  DoorOpen, 
  Globe, 
  Database, 
  Layers, 
  Flame, 
  HardDrive, 
  Disc, 
  FolderTree, 
  ListOrdered, 
  Radio, 
  Search,
  Plus,
  Cpu
} from 'lucide-react';
import { COMPONENT_CATEGORIES } from '../../data/infrastructureTypes';

const ICON_MAP = {
  Server,
  Monitor,
  Box,
  Zap,
  Split,
  DoorOpen,
  Globe,
  Database,
  Layers,
  Flame,
  HardDrive,
  Disc,
  FolderTree,
  ListOrdered,
  Radio,
  Cpu
};

export const ComponentSidebar = ({ onAddComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter components by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_CATEGORIES;

    const q = searchQuery.toLowerCase();
    return COMPONENT_CATEGORIES.map(category => ({
      ...category,
      items: category.items.filter(
        item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const handleDragStart = (event, type) => {
    event.dataTransfer.setData('application/infrasim-component', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col flex-shrink-0 select-none z-10">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Components</h2>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Drag or click</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Component Library List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No components match "{searchQuery}"
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {category.name}
              </div>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const IconComp = ICON_MAP[item.icon] || Cpu;
                  return (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.type)}
                      onClick={() => onAddComponent(item.type)}
                      className="group flex items-center justify-between p-2 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-grab active:cursor-grabbing transition-all text-left"
                      title={`Click or drag to add ${item.name}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors flex-shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 group-hover:text-slate-500 truncate leading-tight mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddComponent(item.type);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 hover:bg-white p-1 rounded transition-all"
                        title="Add to canvas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
