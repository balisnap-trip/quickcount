'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// app/admin/page.tsx
export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    router.push('/dashboard')
  }, [router])
  return null
}
