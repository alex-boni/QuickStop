import RegisterForm from "../components/RegisterForm";
import { useState } from "react";

const MapPage = () => {
  const [response, setResponse] = useState(null);
  const handleRegister = async () => {
    try {
      const res = await fetch("/api/users/register");
      const data = await res.json();
      console.log("Response from /api/users/register:", data);
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <h1>home page</h1>
      {/* boton para probar ping con el backend desde el frontend. Llamamos al endpoint /api/users/register */}
      <button onClick={handleRegister}>Probar Llamada al backend</button>
      {/* mostrar la respuesta del backend */}
      <br />
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {/* <RegisterForm /> */}
    </div>
  );
};

export default MapPage;
