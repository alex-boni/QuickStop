import AuthLayout from "../Layouts/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";

export default function Login() {
  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Bienvenido de nuevo, por favor ingresa tus credenciales y después pulsa el botón de Iniciar Sesión.">
      <title>Iniciar Sesión - QuickStop</title>
      <LoginForm />
    </AuthLayout>
  );
}
