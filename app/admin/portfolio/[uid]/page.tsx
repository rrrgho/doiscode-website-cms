'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Upload, Trash2, Images } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

interface Gallery {
  id: string;
  imageUrl: string;
}

interface PortfolioDetail {
  uid: string;
  title: string;
  description: string;
  bannerUrl: string | null;
  isVisible: boolean;
  galleries: Gallery[];
}

export default function PortfolioDetailPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = use(params);
  const queryClient = useQueryClient();
  const bannerRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ title: '', description: '', isVisible: true, bannerUrl: '' });
  const [bannerUploading, setBannerUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const { data: portfolio, isLoading } = useQuery<PortfolioDetail>({
    queryKey: ['portfolio', uid],
    queryFn: async () => {
      const res = await fetch(`/api/v1/portfolio/${uid}?all=true`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: !!uid,
    select: (data) => {
      if (!dataLoaded) {
        setFormData({ title: data.title, description: data.description, isVisible: data.isVisible, bannerUrl: data.bannerUrl || '' });
        setDataLoaded(true);
      }
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/portfolio/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, description: formData.description, isVisible: formData.isVisible, bannerUrl: formData.bannerUrl }),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', uid] }),
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (galleryId: string) => {
      const res = await fetch(`/api/v1/portfolio/${uid}/gallery?galleryId=${galleryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', uid] }),
  });

  async function handleGalleryUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const file = fileRef?.current?.files?.[0];
    if (!file) { setError('Please select an image.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { imageUrl } = await uploadRes.json();

      const res = await fetch(`/api/v1/portfolio/${uid}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      if (!res.ok) throw new Error('Failed to add gallery image');
      if (fileRef.current) fileRef.current.value = '';
      queryClient.invalidateQueries({ queryKey: ['portfolio', uid] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setUploading(false);
    }
  }

  async function handleBannerUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const file = bannerRef.current?.files?.[0];
    if (!file) { setError('Please select a banner image.'); return; }
    setBannerUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { imageUrl } = await uploadRes.json();
      
      setFormData((prev) => ({ ...prev, bannerUrl: imageUrl }));
      if (bannerRef.current) bannerRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setBannerUploading(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/portfolio"
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Portfolio</h1>
        <p className="text-xs text-muted-foreground mt-1">UID: {uid}</p>
      </div>

      {/* Edit Form */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Portfolio Details</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description (HTML)</label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Project details..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Banner Image</label>
            <div className="flex flex-col gap-3">
              {formData.bannerUrl ? (
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <img src={formData.bannerUrl} alt="Banner" className="max-h-48 w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: '' }))}
                      className="rounded-full bg-destructive p-2 text-white hover:bg-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={bannerRef}
                      accept="image/*"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBannerUpload}
                    disabled={bannerUploading}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                  >
                    {bannerUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload Banner
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                formData.isVisible ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span 
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  formData.isVisible ? 'translate-x-4' : 'translate-x-1'
                }`} 
              />
            </button>
            <div>
              <p className="text-sm font-medium text-foreground">Visible on Website</p>
              <p className="text-xs text-muted-foreground">Turn off to hide this project from the public portfolio.</p>
            </div>
          </div>
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Photo Gallery</h2>

        {/* Upload */}
        <form onSubmit={handleGalleryUpload} className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Add Image to Gallery</label>
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
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </button>
        </form>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {/* Gallery grid */}
        {portfolio?.galleries && portfolio.galleries.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {portfolio.galleries.map((g) => (
              <div key={g.id} className="group relative overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.imageUrl} alt="Gallery" className="h-32 w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => deleteGalleryMutation.mutate(g.id)}
                    className="rounded-full bg-destructive p-2 text-white hover:bg-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Images className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No gallery images yet. Upload your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
