'use client'

import { useState } from 'react';
import { Button, Card, Container, TextInput, Title, Box, Text, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Gunakan signIn dari NextAuth

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fungsi untuk menangani submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false, // Jangan redirect otomatis, kita akan mengatur redirect manual
    });

    setLoading(false);

    console.log(res)

    if (res?.error) {
      setError('Invalid username or password');
    } else {
      // Jika login berhasil, alihkan ke halaman admin
      router.push('/admin');
    }
  };

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card shadow="sm" padding="lg" style={{ width: '100%', maxWidth: 400 }}>
        <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
          Login
        </Title>

        <LoadingOverlay visible={loading} opacity={0.3} />

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            mb="md"
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mb="md"
          />

          {error && (
            <Box mt="md">
              <Text c="red" size="sm" style={{ textAlign: 'center' }}>
                {error}
              </Text>
            </Box>
          )}

          <Button fullWidth mt="lg" type="submit">
            Login
          </Button>
        </form>
      </Card>
    </Container>
  );
}
