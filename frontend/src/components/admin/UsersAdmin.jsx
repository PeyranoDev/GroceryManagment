import { useEffect, useState } from "react";
import { Users, UserPlus, Edit, Trash } from "lucide-react";
import Card from "../ui/card/Card";
import UsersModal from "./UsersModal";
import { staffAPI } from "../../services/api";

const MAX_STAFF = 4;

const UsersAdmin = () => {
  const [staff, setStaff] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [canCreateMore, setCanCreateMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [defaultValues, setDefaultValues] = useState({});

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffAPI.getMyStaff();
      const data = res.data || res;
      setStaff(data.staff || []);
      setStaffCount(data.count || 0);
      setCanCreateMore(data.canCreateMore ?? true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSave = async (payload) => {
    try {
      if (editingId) {
        const res = await staffAPI.update(editingId, payload);
        const updated = res.data || res;
        setStaff((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const res = await staffAPI.create(payload);
        const created = res.data?.user || res.user || res.data || res;
        setStaff((prev) => [created, ...prev]);
        setStaffCount((prev) => prev + 1);
        setCanCreateMore(staffCount + 1 < MAX_STAFF);
      }
      setEditingId(null);
      setIsModalOpen(false);
      setModalMode('create');
      setDefaultValues({});
    } catch (err) {
      alert(`Error guardando empleado: ${err.message}`);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setDefaultValues({ name: u.name, email: u.email });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const removeStaff = async (u) => {
    if (!confirm(`¿Eliminar empleado ${u.name}?`)) return;
    try {
      await staffAPI.delete(u.id);
      setStaff((prev) => prev.filter((x) => x.id !== u.id));
      setStaffCount((prev) => prev - 1);
      setCanCreateMore(true);
    } catch (err) {
      alert(`Error eliminando empleado: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando empleados...</div>
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
      title={
        <div className="flex items-center gap-2">
          <Users size={22} /> 
          Gestión de Empleados
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${canCreateMore ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-error)]'} text-white`}>
            {staffCount}/{MAX_STAFF}
          </span>
        </div>
      }
      actions={
        <button 
          onClick={() => { setModalMode('create'); setEditingId(null); setDefaultValues({}); setIsModalOpen(true); }} 
          disabled={!canCreateMore}
          className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-md ${
            canCreateMore 
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)]' 
              : 'bg-[var(--color-border)] text-[var(--color-secondary-text)] cursor-not-allowed'
          }`}
          title={canCreateMore ? 'Crear nuevo empleado' : `Límite de ${MAX_STAFF} empleados alcanzado`}
        >
          <UserPlus size={16} /> Crear Empleado
        </button>
      }
    >
      
      {!canCreateMore && (
        <div className="mb-4 p-3 bg-[var(--color-warning-bg)] border border-[var(--color-warning)] rounded-md text-sm text-[var(--color-warning-text)]">
          Has alcanzado el límite máximo de {MAX_STAFF} empleados para tu tienda.
        </div>
      )}

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
            {staff.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)]">
                <td className="p-3 font-mono text-[var(--color-secondary-text)]">{u.id}</td>
                <td className="p-3 text-[var(--color-text)]">{u.name}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{u.email}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">
                  <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-secondary)] text-white">
                    Staff
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-5">
                    <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => removeStaff(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay empleados registrados.</div>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {staff.map((u) => (
          <div key={u.id} className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-text)] text-base">{u.name}</h3>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.email}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-[var(--color-secondary)] text-white">
                  Staff
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-5 pt-2">
              <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                <Edit size={20} />
              </button>
              <button onClick={() => removeStaff(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay empleados registrados.</div>
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
