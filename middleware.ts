import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Ambil token JWT dari permintaan
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Jika token tidak ada atau user bukan admin, redirect ke login
  if (!token || token.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/admin/login', req.url));
  }

  // Jika token ada dan role admin, lanjutkan ke halaman berikutnya
  if (token) {
    // Ubah token menjadi string (JSON string) sebelum menyimpan ke cookie
    const stringifiedToken = JSON.stringify(token);
    const response = NextResponse.next();

    // Set cookie dengan token yang sudah diserialisasi
    response.cookies.set('token', stringifiedToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Melindungi semua path di /admin/*
};
