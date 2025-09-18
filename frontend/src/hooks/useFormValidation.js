import { useState } from "react";

export function useFormValidation(initialValues = { email: "", password: "" }) {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validateRules[name]?.(value) || "";
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
