import RegisterForm from "../features/auth/components/RegisterForm";
import AuthLayout from "../Layouts/AuthLayout";
function Register() {

    return (
            <AuthLayout title="Crear una cuenta" subtitle="Introduzca sus datos para registrarse">
                <RegisterForm />
            </AuthLayout>
    );
}
export default Register;