import AuthLayout from "../Layouts/AuthLayout";
import EditParkingForm from "../features/parking/components/EditParkingForm";

export default function EditParking() {
  return (
    <AuthLayout title="Editar Parking">
      <EditParkingForm/>
    </AuthLayout>
  );
}
