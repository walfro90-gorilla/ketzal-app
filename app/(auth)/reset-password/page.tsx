import { redirect } from 'next/navigation'
import ResetPasswordForm from '@/components/reset-password-form'

// Next 15: searchParams es Promise.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  if (!token) redirect('/login')
  return <ResetPasswordForm token={token} />
}
