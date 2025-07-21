'use client'

import { useRouter } from 'next/navigation'
import ForgotPasswordForm from '@/components/forgot-password-form'

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  return <ForgotPasswordForm onBackToLogin={() => router.push('/login')} />
}
