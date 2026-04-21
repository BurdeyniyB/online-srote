import React, { useState, useEffect, useCallback } from "react";
import { MdAdd, MdEdit, MdDelete, MdCheck, MdClose, MdRefresh } from "react-icons/md";
import { fetchPromos, createPromo, updatePromo, deletePromo } from "../../http/promoAPI";

const EMPTY_FORM = { code: "", discount: "", description: "", isActive: true };

const AdminDiscounts = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPromos();
      setPromos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (promo) => {
    setEditId(promo.id);
    setForm({
      code: promo.code,
      discount: String(promo.discount),
      description: promo.description || "",
      isActive: promo.isActive,
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleSave = async () => {
    if (!form.code.trim()) { setFormError("Code is required"); return; }
    const discount = Number(form.discount);
    if (!form.discount || isNaN(discount) || discount < 1 || discount > 100) {
      setFormError("Discount must be between 1 and 100");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount,
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editId) {
        await updatePromo(editId, payload);
      } else {
        await createPromo(payload);
      }
      closeForm();
      load();
    } catch (e) {
      setFormError(e.response?.data?.message || "Error saving promo code");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete promo code "${code}"?`)) return;
    try {
      await deletePromo(id);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Error deleting");
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      await updatePromo(promo.id, { isActive: !promo.isActive });
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Error updating");
    }
  };

  return (
    <div className="admin-discounts">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discounts</h1>
        <div className="admin-header-actions">
          <button className="btn-export" onClick={load} title="Refresh">
            <MdRefresh /> Refresh
          </button>
          <button className="btn-add-promo" onClick={openCreate}>
            <MdAdd /> Add Promo Code
          </button>
        </div>
      </div>

      {/* ── Form modal ── */}
      {showForm && (
        <div className="promo-modal-overlay" onClick={closeForm}>
          <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="promo-modal-header">
              <span className="promo-modal-title">
                {editId ? "Edit Promo Code" : "New Promo Code"}
              </span>
              <button className="drawer-close" onClick={closeForm}>
                <MdClose />
              </button>
            </div>

            <div className="promo-modal-body">
              <div className="promo-field">
                <label>Code</label>
                <input
                  className="promo-input"
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="promo-field">
                <label>Discount (%)</label>
                <input
                  className="promo-input"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 15"
                  value={form.discount}
                  onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                />
              </div>
              <div className="promo-field">
                <label>Description (optional)</label>
                <input
                  className="promo-input"
                  placeholder="e.g. Summer sale"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="promo-field promo-field--row">
                <label>Active</label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
              </div>

              {formError && <div className="promo-form-error">{formError}</div>}

              <div className="promo-modal-actions">
                <button className="btn-export" onClick={closeForm}>Cancel</button>
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="orders-table-wrapper">
        {loading ? (
          <div className="orders-loading"><MdRefresh /> Loading…</div>
        ) : promos.length === 0 ? (
          <div className="orders-empty">No promo codes yet. Click "Add Promo Code" to create one.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, letterSpacing: "0.5px" }}>{p.code}</td>
                  <td>
                    <span className="promo-discount-badge">{p.discount}% off</span>
                  </td>
                  <td style={{ color: "#888", fontSize: 13 }}>{p.description || "—"}</td>
                  <td>
                    <button
                      className={`promo-status-btn ${p.isActive ? "active" : "inactive"}`}
                      onClick={() => handleToggleActive(p)}
                      title="Click to toggle"
                    >
                      {p.isActive ? <><MdCheck /> Active</> : <><MdClose /> Inactive</>}
                    </button>
                  </td>
                  <td style={{ color: "#888", fontSize: 13 }}>
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <div className="order-actions">
                      <button className="action-btn" title="Edit" onClick={() => openEdit(p)}>
                        <MdEdit />
                      </button>
                      <button
                        className="action-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(p.id, p.code)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDiscounts;
