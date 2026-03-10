'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/RichTextEditor';

interface Portfolio {
  uid: string;
  title: string;
  description: string;
  isVisible: boolean;
  createdAt: string;
}

async function fetchPortfolios(): Promise<Portfolio[]> {
  const res = await fetch('/api/v1/portfolio?all=true');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function PortfolioPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: portfolios = [], isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: fetchPortfolios,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await fetch('/api/v1/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      setFormData({ title: '', description: '' });
      setShowForm(false);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (uid: string) => {
      const res = await fetch(`/api/v1/portfolio/${uid}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ uid, isVisible }: { uid: string; isVisible: boolean }) => {
      const res = await fetch(`/api/v1/portfolio/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible }),
      });
      if (!res.ok) throw new Error('Toggle failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    createMutation.mutate({ title: formData.title, description: formData.description });
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your company portfolio projects. API: <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/v1/portfolio</code>
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Portfolio
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">New Portfolio Item</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Palm Oil ERP System"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Description (HTML)</label>
              <RichTextEditor
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Describe what this project does, the technology used, and the results achieved..."
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Portfolio
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-foreground">Portfolios ({portfolios.length})</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No portfolios yet. Create your first one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {portfolios.map((p) => (
              <li key={p.uid} className="flex items-center gap-4 px-6 py-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{p.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMutation.mutate({ uid: p.uid, isVisible: !p.isVisible })}
                    disabled={toggleMutation.isPending}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      p.isVisible ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    title={p.isVisible ? "Visible on website" : "Hidden from website"}
                  >
                    <span 
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        p.isVisible ? 'translate-x-4' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                  <span className="text-xs font-medium w-12 text-muted-foreground">
                    {p.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/portfolio/${p.uid}`}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Edit / Gallery
                  </Link>
                  <button
                    onClick={() => deleteMutation.mutate(p.uid)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
