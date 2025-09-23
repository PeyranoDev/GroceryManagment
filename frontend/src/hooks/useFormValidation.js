import { useState } from "react";

export function useFormValidation(
  initialValues = { email: "", password: "", remember: false }
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateRules = {
    email: (value) => {
      if (!value) return "El correo es obligatorio";
      if (!/\S+@\S+\.\S+/.test(value)) return "Correo inválido";
      return null;
    },
    password: (value) => {
      if (!value) return "La contraseña es obligatoria";
      if (value.length < 6) return "Debe tener al menos 6 caracteres";
      return null;
    },
    // Para checkbox normalmente no hay error, pero podrías agregar reglas acá
    remember: () => null,
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: fieldValue }));

    const error = validateRules[name]?.(fieldValue) || "";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(validateRules).forEach((field) => {
      const error = validateRules[field](values[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
  };
}
