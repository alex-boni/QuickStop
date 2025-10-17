import AuthLayout from "../Layouts/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";

export default function Login() {
  return (
    <AuthLayout title="Iniciar Sesión">
      <LoginForm />
    </AuthLayout>
  );
}
