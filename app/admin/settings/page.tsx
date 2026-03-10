'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

interface Settings {
  id: number;
  primaryColor: string;
  footerText: string;
  address: string;
  phone: string;
  email: string;
}

async function fetchSettings(): Promise<Settings> {
  const res = await fetch('/api/v1/settings');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Omit<Settings, 'id'>>({
    primaryColor: '#2563eb',
    footerText: '',
    address: '',
    phone: '',
    email: '',
  });
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        primaryColor: settings.primaryColor,
        footerText: settings.footerText,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const fields: { key: keyof typeof form; label: string; type?: string; placeholder?: string }[] = [
    { key: 'footerText', label: 'Footer Text', placeholder: '© 2025 Doiscode Technology. All rights reserved.' },
    { key: 'address', label: 'Address', placeholder: 'Jakarta, Indonesia' },
    { key: 'phone', label: 'Phone Number', placeholder: '+62 812 3456 7890' },
    { key: 'email', label: 'Contact Email', type: 'email', placeholder: 'hello@doiscode.com' },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Website Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure global website settings. API: <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/v1/settings</code>
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Primary Color */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Primary Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border border-input bg-background p-1"
            />
            <input
              type="text"
              value={form.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              placeholder="#2563eb"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div
              className="h-10 w-10 flex-shrink-0 rounded-lg border border-border"
              style={{ backgroundColor: form.primaryColor }}
            />
          </div>
        </div>

        {/* Other fields */}
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
            <input
              type={type || 'text'}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              ✓ Settings saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
