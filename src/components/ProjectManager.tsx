import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Edit3, Trash2, Save, FolderOpen, X, AlertTriangle } from 'lucide-react';
import { storage } from '@/services/storage';

export interface SavedProject<T> {
  id: string;
  name: string;
  date: string;
  data: T;
}

interface ProjectManagerProps<T> {
  storageKey: string;
  currentData: T;
  onLoad: (data: T) => void;
  titleExtractor: (data: T) => string;
  typeLabel: string;
}

export function ProjectManager<T>({ storageKey, currentData, onLoad, titleExtractor, typeLabel }: ProjectManagerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject<T>[]>([]);

  // UI state for custom prompts/confirms
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const [duplicatingFor, setDuplicatingFor] = useState<SavedProject<T> | null>(null);
  const [confirmDeleteFor, setConfirmDeleteFor] = useState<string | null>(null);
  const [confirmLoadFor, setConfirmLoadFor] = useState<SavedProject<T> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProjects(storage.get(storageKey, []));
      // Reset UI states when opened
      setIsSaving(false);
      setDuplicatingFor(null);
      setConfirmDeleteFor(null);
      setConfirmLoadFor(null);
    }
  }, [isOpen, storageKey]);

  const saveProjects = (newProjects: SavedProject<T>[]) => {
    storage.set(storageKey, newProjects);
    setProjects(newProjects);
  };

  const handleSaveCurrent = () => {
    if (!saveName.trim()) return;

    const newProject: SavedProject<T> = {
      id: Date.now().toString(),
      name: saveName.trim(),
      date: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(currentData)), // deep copy to prevent reference mutation
    };

    saveProjects([newProject, ...projects]);
    setIsSaving(false);
  };

  const handleLoad = () => {
    if (confirmLoadFor) {
      onLoad(JSON.parse(JSON.stringify(confirmLoadFor.data)));
      setIsOpen(false);
    }
  };

  const handleDuplicate = () => {
    if (!duplicatingFor || !duplicateName.trim()) return;

    const newProject: SavedProject<T> = {
      id: Date.now().toString(),
      name: duplicateName.trim(),
      date: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(duplicatingFor.data)), 
    };

    saveProjects([newProject, ...projects]);
    setDuplicatingFor(null);
  };

  const handleDelete = () => {
    if (confirmDeleteFor) {
      saveProjects(projects.filter(p => p.id !== confirmDeleteFor));
      setConfirmDeleteFor(null);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <FolderOpen className="w-4 h-4 mr-2" />
        Saved {typeLabel}s
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm shadow-2xl">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-500" />
                Manage {typeLabel}s
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 relative">
              {!isSaving ? (
                <Button onClick={() => {
                  setSaveName(titleExtractor(currentData) || `My ${typeLabel}`);
                  setIsSaving(true);
                }} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Current as New {typeLabel}
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 items-center bg-zinc-50/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <Input 
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder={`Name your ${typeLabel}`}
                    className="flex-1"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveCurrent();
                      if (e.key === 'Escape') setIsSaving(false);
                    }}
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={handleSaveCurrent} className="flex-1 sm:flex-none">Save</Button>
                    <Button variant="ghost" onClick={() => setIsSaving(false)} className="flex-1 sm:flex-none">Cancel</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100/50 dark:bg-zinc-900/30">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No saved {typeLabel.toLowerCase()}s found.</p>
                  <p className="text-sm mt-1">Save your current draft to see it here.</p>
                </div>
              ) : (
                projects.map(p => (
                  <Card key={p.id} className="overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 transition-all hover:border-blue-500/30 hover:shadow-md relative">
                    <CardContent className="p-4 flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1">Saved on {new Date(p.date).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setConfirmLoadFor(p)}>
                            <Edit3 className="w-4 h-4 mr-1" /> Load
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setDuplicateName(`${p.name} (Copy)`);
                            setDuplicatingFor(p);
                          }}>
                            <Copy className="w-4 h-4 mr-1" /> Duplicate
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => setConfirmDeleteFor(p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Inline prompts for actions */}
                      {confirmLoadFor?.id === p.id && (
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 mt-2">
                          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <AlertTriangle className="w-4 h-4" />
                            Load this {typeLabel.toLowerCase()}? This will overwrite your current draft.
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" onClick={handleLoad} className="flex-1 sm:flex-none">Load</Button>
                            <Button size="sm" variant="ghost" onClick={() => setConfirmLoadFor(null)} className="flex-1 sm:flex-none">Cancel</Button>
                          </div>
                        </div>
                      )}

                      {duplicatingFor?.id === p.id && (
                        <div className="flex flex-col sm:flex-row gap-2 items-center bg-zinc-50/50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 mt-2">
                          <Input 
                            value={duplicateName}
                            onChange={e => setDuplicateName(e.target.value)}
                            placeholder="New name..."
                            className="flex-1"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleDuplicate();
                              if (e.key === 'Escape') setDuplicatingFor(null);
                            }}
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" onClick={handleDuplicate} className="flex-1 sm:flex-none">Save Copy</Button>
                            <Button size="sm" variant="ghost" onClick={() => setDuplicatingFor(null)} className="flex-1 sm:flex-none">Cancel</Button>
                          </div>
                        </div>
                      )}

                      {confirmDeleteFor === p.id && (
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 mt-2">
                          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                            <AlertTriangle className="w-4 h-4" />
                            Are you sure you want to delete this {typeLabel.toLowerCase()}?
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" variant="destructive" onClick={handleDelete} className="flex-1 sm:flex-none">Delete</Button>
                            <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteFor(null)} className="flex-1 sm:flex-none text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50">Cancel</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
