import AuthLayout from "../Layouts/AuthLayout";
import ViewAccountDetailsForm from "../features/auth/components/ViewAccountDetailsForm";

export default function ViewAccountDetails() {
  return (
    <AuthLayout title="Detalles de la Cuenta">
      <ViewAccountDetailsForm />
    </AuthLayout>
  );
} 