import AuthLayout from "../Layouts/AuthLayout";
import ViewParkingDetailsForm from "../features/parking/components/ViewParkingDetailsForm";

export default function ViewAccountDetails() {
  return (
    <AuthLayout title="Detalles del parking">
      <ViewParkingDetailsForm/>
    </AuthLayout>
  );
} 