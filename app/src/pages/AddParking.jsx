//usar el AddParkingForm.jsx
import React from 'react';
import AddParkingForm from '../features/parking/components/AddParkingForm';
import AuthLayout from '../Layouts/AuthLayout';

export default function AddParking() {
    return (
        <AuthLayout title="Añadir Parking">
            <AddParkingForm />
        </AuthLayout>
    );
}       