import { useState } from "react";

export function useFormValidation(
  initialValues = { email: "", password: "", remember: false }
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateRules = {
    email: (value) => {
      if (!value) return "El correo es obligatorio";

      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(value)) return "Formato de correo inválido";

      if (value.length > 254) return "El correo es demasiado largo";

      return null;
    },
    password: (value) => {
      if (!value) return "La contraseña es obligatoria";

      if (value.length < 8)
        return "La contraseña debe tener al menos 8 caracteres";
      if (value.length > 128) return "La contraseña es demasiado larga";

      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
        return "La contraseña debe contener al menos una letra y un número";
      }

      if (/\s/.test(value)) return "La contraseña no puede contener espacios";

      const commonPasswords = [
        "password",
        "123456",
        "qwerty",
        "abc123",
        "password123",
      ];
      if (commonPasswords.includes(value.toLowerCase())) {
        return "Esta contraseña es demasiado común";
      }

      return null;
    },

    remember: () => null,
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: fieldValue }));

    if (touched[name] || fieldValue) {
      const error = validateRules[name]?.(fieldValue) || "";
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateRules[name]?.(values[name]) || "";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(validateRules).forEach((field) => {
      newTouched[field] = true;
      const error = validateRules[field](values[field]);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateRules[name]?.(value) || "";
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}
