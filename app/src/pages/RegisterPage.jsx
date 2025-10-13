import RegisterForm from "../features/auth/components/RegisterForm";
import AuthLayout from "../Layouts/AuthLayout";
function Register() {

    return (
            <AuthLayout title="Regístrate">
                <RegisterForm />
            </AuthLayout>
    );
}
export default Register;