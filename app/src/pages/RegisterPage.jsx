import RegisterForm from "../features/auth/components/RegisterForm";
import AuthLayout from "../Layouts/AuthLayout";
function Register() {

    return (
            <AuthLayout title="Regístrate" subtitle="Bienvenido, por favor rellena los campos del formulario y pulsa en el botón Crear Cuenta para registrarte">
                <RegisterForm />
            </AuthLayout>
    );
}
export default Register;