const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
);

const BUCKET = 'products';

async function uploadImage(buffer, filename, mimetype) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: mimetype, upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return publicUrl;
}

async function deleteImage(url) {
  // Extract filename from the full public URL
  const filename = url.split(`/${BUCKET}/`)[1];
  if (!filename) return;
  await supabase.storage.from(BUCKET).remove([filename]);
}

module.exports = { uploadImage, deleteImage };
