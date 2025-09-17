import { useEffect, useState } from "react";

export function useLoginFormValidation(
  initialValues = { email: "", password: "" }
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) {
        error = "El correo es obligatorio";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "El correo no es válido";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "La contraseña es obligatoria";
      } else if (value.length < 6) {
        error = "Debe tener al menos 6 caracteres";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  useEffect(() => {
    validateForm(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    values,
    errors,
    handleChange,
    validateForm,
  };
}
