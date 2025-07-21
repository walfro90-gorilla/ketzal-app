import { redirect } from 'next/navigation'
import ResetPasswordForm from '@/components/reset-password-form'

interface ResetPasswordPageProps {
  searchParams: {
    token?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = searchParams

  if (!token) {
    redirect('/login')
  }

  return <ResetPasswordForm token={token} />
}
