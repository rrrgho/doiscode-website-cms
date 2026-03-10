'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Upload, Loader2, Users } from 'lucide-react';

interface Client {
  id: string;
  client_name: string;
  image: string;
}

async function fetchClients(): Promise<Client[]> {
  const res = await fetch('/api/v1/clients');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!name.trim() || !file) {
      setError('Please enter a client name and select an image.');
      return;
    }
    setUploading(true);
    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { imageUrl } = await uploadRes.json();

      // Create client
      const res = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageUrl }),
      });
      if (!res.ok) throw new Error('Failed to save client');
      setName('');
      if (fileRef.current) fileRef.current.value = '';
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Our Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload client logos that appear on the website homepage. API: <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/v1/clients</code>
        </p>
      </div>

      {/* Upload Form */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Add New Client</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Client Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. United Plantation BHD"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Logo Image</label>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Add Client
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {/* Client List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-foreground">Clients ({clients.length})</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No clients yet. Add your first client above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {clients.map((client) => (
              <li key={client.id} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.image}
                    alt={client.client_name}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{client.client_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{client.image}</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(client.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-2 flex-shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
