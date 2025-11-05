//formulario para añadir parkings
/*



     - Estado del formulario con los campos:
       - longitude (número)
       - latitude (número)
       - spots (número entero)
       - owner (string)
       - price (número decimal)
       - available (boolean)
     - Validaciones (similares a RegisterForm):
       - Longitude: entre -180 y 180
       - Latitude: entre -90 y 90
       - Spots: número positivo
       - Owner: mínimo 3 caracteres
       - Price: número positivo
     - handleSubmit que:
       - Valide el formulario
       - Llame a createParking(formData)
       - Maneje errores
       - Redirija al mapa si tiene éxito
     - Inputs en el JSX para cada campo

*/








import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddParking from "../../../pages/AddParking";

const AddParkingForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        longitude: 0, // (número)
        latitude: 0, // (número)
        spots: 0, // (número entero)
        owner: '', // (string)
        price: 0, // (número decimal)
        available: false // (boolean)
    });


    const [errors, setErrors] = useState({}); //almacenar mensajes d error por cad campo

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value,
        });
        // Limpiar el error cuando el usuario empieza a escribir en el campo
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        let isValid = true; //si ha yalgnun error en la validacion se pone a false
        const newErrors = {};

        //1. validacion longitude
        if (formData.longitude < -180 || formData.longitude > 180) {
            newErrors.longitude = 'La longitud debe estar entre -180 y 180';
            isValid = false;
        }

        //2.validacion latitude
        if (formData.latitude < 0 || formData.latitude > 0) {
            newErrors.latitude = 'La latitude debe estar entre ';
            isValid = false;
        }

        //3. validacion spot

        if (formData.spots == 0) {
            newErrors.spots = 'Spot debe ser x';
            isValid = false;
        }

        //4. Validacion owner

        //5. Validacion price

        if (formData.price < 0) {
            newErrors.price = 'El precio debe ser un valor positivo';
            isValid = false;
        }

        //6 validacion available

        setErrors(newErrors);

        return isValid;


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) { //si la validacion ha fallado en algun punto


        }

        try {
            await AddParking(formData);
            navigate('/map'); //poner la siguiente redireccion

        } catch (error) {

            if (error.message === 'Este parking ya existe'); //Revisar este error TODO

            //setErrors...

            else {
                setErrors({
                    submit: 'Error al crear el parking. Por favor, inténtelo de nuevo más tarde.'
                });
            }
        } finally {
            //TODO
        }
    };

    // Clase común para inputs (usando errores para el estilo)
    const getInputClass = (field) => {
        return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 
            ${errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
    };

    //const isAvailable = formData.available === false;


    return (

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo owner */}
            <div>
                <label htmlFor="owner">Propietario</label>
                <input
                    id="owner"
                    type="text"
                    value={formData.owner}
                    required
                    onChange={handleChange} //TODO quitar 
                    autoComplete="owner"
                    className={getInputClass('owner')}
                    placeholder="Ej: Jose Baute (mín. 4 caracteres)"
                    aria-invalid={!!errors.owner} // WCAG: Indica si el campo tiene un error
                    aria-describedby={errors.owner ? 'owner-error' : undefined} // WCAG: Vincula el campo al mensaje de error
                //disabled={isLoading} // Deshabilita el campo si está cargando
                />
                {errors.owner && <p id="owner-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.owner}</p>}
            </div>

            {/*Campo price*/}
            <div>
                <label htmlFor="price">Precio</label>

            </div>

            {/*Campo spot*/}
            <div>
                <label htmlFor="spot">Spot</label>

            </div>
            
            {/*Campo Longitude*/}
            <div>
                <label htmlFor="longitude">Longitud</label>

            </div>

            {/*Campo latitude*/}
            <div>
                <label htmlFor="latitude">Latitud</label>

            </div>

            {/*Campo available*/}
            <div>
                <label htmlFor="available">Disponible</label>
                <input
                    id="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
            </div>


        </form>

    );


    //FORMULARIO HTML



};

export default AddParkingForm;






























