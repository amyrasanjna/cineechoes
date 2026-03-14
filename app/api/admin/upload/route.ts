import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const submittedPassword = request.headers.get('x-admin-password');
  return Boolean(adminPassword && submittedPassword && submittedPassword === adminPassword);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File is required.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `round-assets/${randomUUID()}.${ext}`;

  const { error } = await getSupabaseServer().storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'actress-images')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const { data: publicData } = getSupabaseServer().storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'actress-images')
    .getPublicUrl(path);

  return NextResponse.json({ url: publicData.publicUrl });
}
