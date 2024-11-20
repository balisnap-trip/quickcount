import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Ambil token JWT dari permintaan
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Jika token tidak ada atau role bukan 'admin', redirect ke login
  if (!token || token.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/admin/login', req.url));
  }

  // Jika token ada dan role 'admin', lanjutkan ke halaman berikutnya
  return NextResponse.next(); // Melanjutkan ke halaman yang diminta
}

export const config = {
  matcher: ['/admin/:path*'], // Melindungi semua path di /admin/*
};
