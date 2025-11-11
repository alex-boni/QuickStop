import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../AuthService';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData(prev => ({ ...prev, [id]: value }));
		if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			newErrors.email = 'Introduce un correo electrónico válido.';
			isValid = false;
		}
		//if (!formData.password || formData.password.length < 8) {
		//	newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
		//	isValid = false;
		//}
		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			const firstErrorField = Object.keys(errors).find(key => errors[key]);
			if (firstErrorField) document.getElementById(firstErrorField)?.focus();
			return;
		}
		setIsLoading(true);
		try {
			const response = await loginUser(formData);
			//guardar token y datos del usuario en el contexto
			if (response?.token) {
				const userData = {
					id: response.userId,
					name: response.name,
					email: response.email,
					role: response.role
				};
				login(response.token, userData);
			}
			navigate('/');
		} catch (error) {
			if (error.message === 'InvalidCredentials') {
				setErrors({ global: 'Las credenciales no son correctas. Por favor, verifica tu correo y contraseña.' });
			} else {
				console.error(error.message);
				setErrors({ global: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.' });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getInputClass = (field) => {
		return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 \
						${errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{errors.global && <p className="text-sm text-red-600" aria-live="assertive">{errors.global}</p>}

			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
				<input
					id="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					required
					autoComplete="email"
					className={getInputClass('email')}
					placeholder="tu.correo@ejemplo.com"
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? 'email-error' : undefined}
					disabled={isLoading}
				/>
				{errors.email && <p id="email-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.email}</p>}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
				<input
					id="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					required
					autoComplete="current-password"
					className={getInputClass('password')}
					placeholder="Mínimo 8 caracteres"
					aria-invalid={!!errors.password}
					aria-describedby={errors.password ? 'password-error' : undefined}
					disabled={isLoading}
				/>
				{errors.password && <p id="password-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.password}</p>}
			</div>

			<button
				type="submit"
				className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
				disabled={isLoading}
				aria-label={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión en QuickStop'}
			>
				{isLoading ? (
					<>
						<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Iniciando sesión...
					</>
				) : (
					'Iniciar Sesión'
				)}
			</button>

			<p className="text-center text-sm text-gray-600 mt-4">
				¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Regístrate aquí</a>
			</p>
		</form>
	);
};

export default LoginForm;
