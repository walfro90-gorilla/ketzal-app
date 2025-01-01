import LoginForm from './login-form'
import RegisterForm from './register-form'

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex space-x-4">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  )
}

