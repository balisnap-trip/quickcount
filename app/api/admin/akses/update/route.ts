import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const BUCKET_NAME = 'access-control'
const FILENAME = 'pageAccess.json'

export const POST = async (req: NextRequest) => {
  const { enabledAccess } = await req.json()

  try {
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Ambil file yang sudah ada (jika ada)
    const { data: existingFile, error: downloadError } = await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .download(FILENAME); // Ganti FILENAME sesuai dengan nama file

    let jsonData = { accessEnabled: enabledAccess }; // Default data untuk file baru

    if (existingFile) {
      // Parse file JSON yang sudah ada
      const existingData = await existingFile.text();
      jsonData = JSON.parse(existingData); // Ambil data JSON dari file yang ada
      jsonData.accessEnabled = enabledAccess; // Update nilai accessEnabled
    }

    await supabaseClient.storage.from(BUCKET_NAME).remove([FILENAME])

    // Unggah file yang sudah diperbarui
    const { data, error: uploadError } = await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .upload(
        FILENAME, 
        new Blob([JSON.stringify(jsonData)], { type: 'application/json' }), 
        { upsert: true } 
      );

    if (uploadError) {
      console.error('Gagal mengunggah file:', uploadError.message);
      return NextResponse.json({ error: 'Gagal mengupdate konfigurasi' }, { status: 500 });
    }

    console.log('File berhasil diperbarui:', data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error mengupdate konfigurasi:', error);
    return NextResponse.json({ error: 'Gagal mengupdate konfigurasi' }, { status: 500 });
  }
}
