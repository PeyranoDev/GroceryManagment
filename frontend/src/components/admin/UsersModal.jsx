import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";

const UsersModal = ({ isOpen, onClose, onSave, defaultValues = {}, mode = 'create' }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [isOpen, defaultValues]);

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingrese un email válido";
    }
    
    if (mode === 'create') {
      if (!password || password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    } else if (password && password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const payload = {
      name: name.trim(),
      email: email.trim(),
    };

    if (mode === 'create') {
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    } else if (password) {
      payload.newPassword = password;
    }
    
    onSave && onSave(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Editar Empleado' : 'Crear Empleado'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="w-72 sm:w-80">
          <Input 
            label="Nombre" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            error={errors.name}
          />
        </div>
        <div className="w-72 sm:w-80">
          <Input 
            label="Email" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            error={errors.email}
          />
        </div>
        <div className="w-72 sm:w-80">
          <Input 
            label={mode === 'edit' ? "Nueva Contraseña (opcional)" : "Contraseña"} 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required={mode === 'create'}
            error={errors.password}
          />
        </div>
        <div className="w-72 sm:w-80">
          <Input 
            label="Confirmar Contraseña" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required={mode === 'create' || !!password}
            error={errors.confirmPassword}
          />
        </div>
        
        <div className="text-xs text-[var(--color-secondary-text)] mt-2">
          El empleado será creado con rol de <strong>Staff</strong> y tendrá acceso a caja e inventario.
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md border border-[var(--color-border)]">
            Cancelar
          </button>
          <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
            {mode === 'edit' ? 'Guardar Cambios' : 'Crear Empleado'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsersModal;
