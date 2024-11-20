// hooks/useToken.js
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Ambil token dari cookie saat komponen pertama kali dirender
    const storedToken = Cookies.get('token'); // Ambil token dari cookie
    console.log(storedToken, "Token");
    if (storedToken) {
      setToken(storedToken); // Simpan token di state
    }
  }, []);

  return token; // Kembalikan token yang bisa digunakan di komponen
};

export default useToken;
