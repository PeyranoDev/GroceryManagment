import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const UsersModal = ({ isOpen, onClose, onSave, defaultValues = {}, mode = 'create' }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (isOpen) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setPassword(defaultValues.password || "");
      setRole(defaultValues.isSuperAdmin ? 'admin' : 'user');
    }
  }, [isOpen, defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      isSuperAdmin: role === 'admin'
    };
    onSave && onSave(payload);
    onClose && onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Editar Usuario' : 'Crear Usuario'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="w-72 sm:w-60">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="w-72 sm:w-80">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="w-72 sm:w-60">
          <Input label="Contraseña" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="w-72 sm:w-60">
          <Select label="Rol" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
            Cancelar
          </button>
          <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
            {mode === 'edit' ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsersModal;
