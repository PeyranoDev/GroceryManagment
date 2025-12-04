import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const UsersModal = ({ isOpen, onClose, onSave, defaultValues = {}, mode = 'create', canAssignAdmin = false, canAssignSuperAdmin = false, submitting = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const normalizeRole = (r) => {
    if (r === 3 || String(r).toLowerCase() === 'superadmin') return 'superadmin';
    if (r === 2 || String(r).toLowerCase() === 'admin') return 'admin';
    return 'staff';
  };

  useEffect(() => {
    if (isOpen) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setPassword(defaultValues.password || "");
      setRole(normalizeRole(defaultValues.role));
    }
  }, [isOpen, defaultValues]);

  const defaultRoleNorm = normalizeRole(defaultValues.role);
  const hasChanges = (
    mode === 'edit' && (
      name.trim() !== (defaultValues.name || '').trim() ||
      email.trim() !== (defaultValues.email || '').trim() ||
      normalizeRole(role) !== defaultRoleNorm
    )
  );

  const hasAllCreateFields = (
    mode !== 'edit' &&
    !!name.trim() &&
    !!email.trim() &&
    !!password.trim() &&
    !!role
  );

  const canSubmit = mode === 'edit' ? hasChanges && !!name.trim() && !!email.trim() : hasAllCreateFields;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      role: role
    };
    if (mode !== 'edit') {
      payload.password = password;
    }
    onSave && onSave(payload);
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
        {mode !== 'edit' && (
          <div className="w-72 sm:w-60">
            <Input label="Contraseña" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        )}
        <div className="w-72 sm:w-60">
          <Select label="Rol" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="staff">Staff</option>
            {canAssignAdmin && <option value="admin">Administrador</option>}
            {canAssignSuperAdmin && <option value="superadmin">SuperAdmin</option>}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
            Cancelar
          </button>
          <button type="submit" disabled={submitting || !canSubmit} className={`bg-[var(--color-primary)] ${submitting || !canSubmit ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-primary-dark)]'} text-[var(--color-text)] font-semibold py-2 px-4 rounded-md`}>
            {submitting ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </span>
            ) : (
              mode === 'edit' ? 'Guardar Cambios' : 'Crear Usuario'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsersModal;
