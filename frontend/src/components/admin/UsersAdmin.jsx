import { useEffect, useState } from "react";
import { Users, UserPlus, Edit, Trash, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/card/Card";
import UsersModal from "./UsersModal";
import { usersAPI } from "../../services/api";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [defaultValues, setDefaultValues] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll();
      const data = res.data || res;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (payload) => {
    try {
      if (editingId) {
        const res = await usersAPI.update(editingId, payload);
        const updated = res.data || res;
        setUsers((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const res = await usersAPI.create(payload);
        const created = res.data || res;
        setUsers((prev) => [created, ...prev]);
      }
      setEditingId(null);
      setIsModalOpen(false);
      setModalMode('create');
      setDefaultValues({});
    } catch (err) {
      alert(`Error guardando usuario: ${err.message}`);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setDefaultValues({ name: u.name, email: u.email, password: u.password, isSuperAdmin: !!u.isSuperAdmin });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const removeUser = async (u) => {
    if (!confirm(`¿Eliminar usuario ${u.name}?`)) return;
    try {
      await usersAPI.delete(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert(`Error eliminando usuario: ${err.message}`);
    }
  };

  const loginAs = (u) => {
    navigate('/login', { state: { user: u } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-error)]">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
    <Card
      size="wide"
      title={<div className="flex items-center gap-2"><Users size={22} /> Gestión de Usuarios</div>}
      actions={
        <button onClick={() => { setModalMode('create'); setEditingId(null); setDefaultValues({}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
          <UserPlus size={16} /> Crear Usuario
        </button>
      }
    >
      

      <div className="hidden md:block overflow-x-auto rounded-t-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)]">
                <td className="p-3 font-mono text-[var(--color-secondary-text)]">{u.id}</td>
                <td className="p-3 text-[var(--color-text)]">{u.name}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{u.email}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{u.isSuperAdmin ? 'Administrador' : 'Usuario'}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-5">
                    <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => removeUser(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                      <Trash size={20} />
                    </button>
                    <button onClick={() => loginAs(u)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]" title="Acceder como este usuario">
                      <LogIn size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay usuarios.</div>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div key={u.id} className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-text)] text-base">{u.name}</h3>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.email}</p>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.isSuperAdmin ? 'Administrador' : 'Usuario'}</p>
              </div>
            </div>
            <div className="flex justify-center gap-5 pt-2">
              <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                <Edit size={20} />
              </button>
              <button onClick={() => removeUser(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                <Trash size={20} />
              </button>
              <button onClick={() => loginAs(u)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]" title="Acceder como este usuario">
                <LogIn size={20} />
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay usuarios.</div>
        )}
      </div>
    </Card>
    <UsersModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false); setEditingId(null); setDefaultValues({}); setModalMode('create'); }}
      onSave={handleSave}
      defaultValues={defaultValues}
      mode={modalMode}
    />
    </>
  );
};

export default UsersAdmin;
