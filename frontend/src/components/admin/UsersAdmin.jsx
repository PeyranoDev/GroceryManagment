import { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, Edit, Trash, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../ui/card/Card";
import Toast from "../ui/toast/Toast";
import ConfirmModal from "../ui/modal/ConfirmModal";
import UsersModal from "./UsersModal";
import { usersAPI, authAPI } from "../../services/api";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const { isSuperAdmin, isAdmin, user, impersonate } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [defaultValues, setDefaultValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [inactiveIds, setInactiveIds] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

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

  const activeUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    const isActiveLocal = (x) => (x.isActive !== false) && !inactiveIds.includes(x.id);
    // SuperAdmin ve todos, Admin/Staff no ven a los SuperAdmin
    return (isSuperAdmin() ? list.filter(isActiveLocal) : list.filter((x) => x.role !== 'SuperAdmin' && x.role !== 3 && isActiveLocal(x)));
  }, [users, inactiveIds, isSuperAdmin]);

  const inactiveUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    const isInactiveLocal = (x) => (x.isActive === false) || inactiveIds.includes(x.id);
    return isSuperAdmin() ? list.filter(isInactiveLocal) : [];
  }, [users, inactiveIds, isSuperAdmin]);

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (payload) => {
    try {
      setSubmitting(true);
      if (editingId) {
        const updatePayload = {
          name: payload.name,
          email: payload.email,
          newPassword: payload.password || undefined,
        };
        const res = await usersAPI.update(editingId, updatePayload);
        const updated = res.data || res;
        setUsers((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
        // Use setRole for all role changes (including SuperAdmin)
        await usersAPI.setRole(editingId, payload.role);
        const roleMap = { staff: 1, admin: 2, superadmin: 3 };
        const newRoleNum = roleMap[String(payload.role).toLowerCase()] || 1;
        setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, role: newRoleNum } : u)));
        setToastMsg("Cambios guardados exitosamente");
        setToastType("success");
        setToastOpen(true);
      } else {
        const registerPayload = {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          confirmPassword: payload.password,
          groceryId: user?.currentGroceryId || user?.groceryId || 1,
        };
        const res = await authAPI.register(registerPayload);
        const createdUser = (res.data || res)?.user || (res.User || {});
        const createdId = createdUser?.id ?? createdUser?.Id;

        // Use setRole for all roles (including SuperAdmin)
        await usersAPI.setRole(createdId, payload.role);
        const roleMap = { staff: 1, admin: 2, superadmin: 3 };
        const newRoleNum = roleMap[String(payload.role).toLowerCase()] || 1;
        setUsers((prev) => [{ id: createdId, name: createdUser?.name ?? createdUser?.Name, email: createdUser?.email ?? createdUser?.Email, role: newRoleNum, isActive: true }, ...prev]);
        setToastMsg("Usuario registrado correctamente");
        setToastType("success");
        setToastOpen(true);
      }
      setEditingId(null);
      setIsModalOpen(false);
      setModalMode('create');
      setDefaultValues({});
    } catch (err) {
      setToastMsg(err.message || "Error procesando la solicitud");
      setToastType("info");
      setToastOpen(true);
      setIsModalOpen(false);
    }
    finally {
      setSubmitting(false);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setDefaultValues({ name: u.name, email: u.email, role: u.role });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const removeUser = (u) => {
    setDeleteTarget(u);
    setDeleteConfirmOpen(true);
  };

  const loginAs = async (u) => {
    try {
      if (!isSuperAdmin()) return;
      const v = await impersonate(u.id);
      const roleHierarchy = { Staff: 1, Admin: 2, SuperAdmin: 3 };
      const shouldGoToDashboard = (roleHierarchy[v.currentRole] || 0) >= roleHierarchy.Admin;
      try {
        localStorage.setItem('toast_after_navigation', JSON.stringify({ message: `Sesión iniciada como ${u.name}`, type: 'success' }));
      } catch {}
      navigate(shouldGoToDashboard ? '/dashboard' : '/caja');
    } catch (err) {
      setToastMsg(err.message || 'No se pudo impersonar al usuario');
      setToastType('info');
      setToastOpen(true);
    }
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
        (isSuperAdmin() || isAdmin()) && (
          <div className="flex items-center gap-3">
            <button onClick={() => { setModalMode('create'); setEditingId(null); setDefaultValues({}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
              <UserPlus size={16} /> Crear Usuario
            </button>
            {isSuperAdmin() && inactiveUsers.length > 0 && (
              <button onClick={() => setShowInactive((v) => !v)} className="text-[var(--color-secondary-text)] border border-[var(--color-border)] bg-transparent py-2 px-3 rounded-md">
                {showInactive ? 'Ocultar usuarios inactivos' : 'Mostrar usuarios inactivos'}
              </button>
            )}
          </div>
        )
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
            {activeUsers.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)]">
                <td className="p-3 font-mono text-[var(--color-secondary-text)]">{u.id}</td>
                <td className="p-3 text-[var(--color-text)]">{u.name}{user && u.id === user.id ? ' (Yo)' : ''}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{u.email}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{u.role === 3 || String(u.role).toLowerCase() === 'superadmin' ? 'SuperAdmin' : ((u.role === 2 || String(u.role).toLowerCase() === 'admin') ? 'Admin' : 'Staff')}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-5">
                    {(isSuperAdmin() || (isAdmin() && u.role !== 3 && String(u.role).toLowerCase() !== 'superadmin')) && (
                      <>
                        <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => removeUser(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                          <Trash size={20} />
                        </button>
                      </>
                    )}
                    {isSuperAdmin() && (
                      <button onClick={() => loginAs(u)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]" title="Acceder como este usuario">
                        <LogIn size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {activeUsers.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay usuarios.</div>
        )}
      </div>

      {isSuperAdmin() && showInactive && (
        <div className="mt-6">
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
                {inactiveUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--color-border)] opacity-60">
                    <td className="p-3 font-mono text-[var(--color-secondary-text)]">{u.id}</td>
                    <td className="p-3 text-[var(--color-text)]">{u.name}{user && u.id === user.id ? ' (Yo)' : ''}</td>
                    <td className="p-3 text-[var(--color-secondary-text)]">{u.email}</td>
                    <td className="p-3 text-[var(--color-secondary-text)]">{u.role === 3 || String(u.role).toLowerCase() === 'superadmin' ? 'SuperAdmin' : ((u.role === 2 || String(u.role).toLowerCase() === 'admin') ? 'Admin' : 'Staff')}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-5">
                        <button onClick={async () => { try { await usersAPI.activate(u.id); setUsers((prev)=>prev.map((x)=>x.id===u.id? { ...x, isActive: true } : x)); setInactiveIds((prev)=>{ const updated = prev.filter((id)=>id!==u.id); if (updated.length === 0) setShowInactive(false); return updated; }); setToastMsg("Usuario reactivado"); setToastType("success"); setToastOpen(true);} catch(err){ setToastMsg(err.message||"No se pudo reactivar"); setToastType("info"); setToastOpen(true);} }} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Reactivar">
                          Reactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="md:hidden space-y-4">
        {activeUsers.map((u) => (
          <div key={u.id} className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-text)] text-base">{u.name}{user && u.id === user.id ? ' (Yo)' : ''}</h3>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.email}</p>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.role === 3 || String(u.role).toLowerCase() === 'superadmin' ? 'SuperAdmin' : ((u.role === 2 || String(u.role).toLowerCase() === 'admin') ? 'Admin' : 'Staff')}</p>
              </div>
            </div>
            <div className="flex justify-center gap-5 pt-2">
              {(isSuperAdmin() || (isAdmin() && u.role !== 3 && String(u.role).toLowerCase() !== 'superadmin')) && (
                <>
                  <button onClick={() => startEdit(u)} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Editar">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => removeUser(u)} className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]" title="Eliminar">
                    <Trash size={20} />
                  </button>
                </>
              )}
              {isSuperAdmin() && (
                <button onClick={() => loginAs(u)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]" title="Acceder como este usuario">
                  <LogIn size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
        {activeUsers.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">No hay usuarios.</div>
        )}
        {isSuperAdmin() && showInactive && inactiveUsers.map((u)=>(
          <div key={`inactive-${u.id}`} className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3 opacity-60">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-text)] text-base">{u.name}{user && u.id === user.id ? ' (Yo)' : ''}</h3>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.email}</p>
                <p className="text-sm text-[var(--color-secondary-text)] mt-1">{u.role === 3 || String(u.role).toLowerCase() === 'superadmin' ? 'SuperAdmin' : ((u.role === 2 || String(u.role).toLowerCase() === 'admin') ? 'Admin' : 'Staff')}</p>
              </div>
            </div>
            <div className="flex justify-center gap-5 pt-2">
              <button onClick={async () => { try { await usersAPI.activate(u.id); setUsers((prev)=>prev.map((x)=>x.id===u.id? { ...x, isActive: true } : x)); setInactiveIds((prev)=>{ const updated = prev.filter((id)=>id!==u.id); if (updated.length === 0) setShowInactive(false); return updated; }); setToastMsg("Usuario reactivado"); setToastType("success"); setToastOpen(true);} catch(err){ setToastMsg(err.message||"No se pudo reactivar"); setToastType("info"); setToastOpen(true);} }} className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]" title="Reactivar">
                Reactivar
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
    <UsersModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false); setEditingId(null); setDefaultValues({}); setModalMode('create'); }}
      onSave={handleSave}
      defaultValues={defaultValues}
      mode={modalMode}
      canAssignAdmin={isSuperAdmin() || isAdmin()}
      canAssignSuperAdmin={isSuperAdmin()}
      submitting={submitting}
    />
    <ConfirmModal
      isOpen={deleteConfirmOpen}
      onClose={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}
      title="Confirmar eliminación"
      message={deleteTarget ? `¿Desea eliminar a ${deleteTarget.name}?` : ''}
      confirmText="Eliminar"
      cancelText="Cancelar"
      variant="danger"
      onConfirm={async () => {
        try {
          await usersAPI.delete(deleteTarget.id);
          setUsers((prev) => prev.map((x) => x.id === deleteTarget.id ? { ...x, isActive: false } : x));
          setInactiveIds((prev) => prev.includes(deleteTarget.id) ? prev : [...prev, deleteTarget.id]);
          setToastMsg("Usuario eliminado correctamente");
          setToastType("success");
          setToastOpen(true);
        } catch (err) {
          setToastMsg(err.message || "No se pudo eliminar el usuario");
          setToastType("info");
          setToastOpen(true);
        } finally {
          setDeleteTarget(null);
        }
      }}
    />
    <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </>
  );
};

export default UsersAdmin;
