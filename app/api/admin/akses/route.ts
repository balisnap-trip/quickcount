import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const BUCKET_NAME = 'access-control'
const FILENAME = 'pageAccess.json'

const supabaseClient = createClient(supabaseUrl, supabaseKey)

export const GET = async () => {
  try {
    const { data } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(FILENAME); 
    const { publicUrl } = data

    const now = new Date();

    const formattedDate = now.toISOString();
    const res = await fetch(`${publicUrl}?t=${formattedDate}`)
    console.log(`${publicUrl}?t=${formattedDate}`)
    const config = await res.json()
    return NextResponse.json(config, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat konfigurasi' }, { status: 500 })
  }
}