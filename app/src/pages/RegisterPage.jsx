import RegisterForm from "../features/auth/components/RegisterForm";
import AuthLayout from "../Layouts/AuthLayout";
function Register() {

    return (
            <AuthLayout title="Crear una cuenta" subtitle="Introduce tus datos y pulsa en el botón Crear Cuenta para acceder a todas las funcionalidades">
                <RegisterForm />
            </AuthLayout>
    );
}
export default Register;