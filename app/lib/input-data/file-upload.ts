import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const BUCKET_NAME = 'quickcount'
const PATH = 'gianyar'

console.log(supabaseUrl, supabaseKey , "TEST")
export const supabaseClient = createClient(supabaseUrl, supabaseKey)

export const uploadFile = async (file: File) => {
  const timeStamp = Date.now();
  const { data, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(PATH + '/' + timeStamp + '-' + file.name, file);

  const { data: url } = supabaseClient
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(data?.path as string);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  console.log('Uploaded file:', data);
  return {data, url};
}