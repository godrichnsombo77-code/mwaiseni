"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock, LogOut, Plus, Pencil, Trash2, Eye, EyeOff,
  Save, X, Loader2, Package, ArrowUpDown,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface Product {
  id: string;
  name: string;
  brand: string;
  desc: string;
  img: string;
  tag: string;
  gradient: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════ */

function LoginScreen({ onLogin }: { onLogin: (role: string, token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.role, data.token);
      } else {
        setError(data.error || "Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 sm:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Administration</h1>
            <p className="text-muted-foreground text-sm mt-2">Mwaiseni Services SARL</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Mot de passe</label>
              <Input
                type="password"
                placeholder="Entrez le mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT FORM
   ═══════════════════════════════════════════ */

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Partial<Product> | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    desc: product?.desc || "",
    img: product?.img || "/images/",
    tag: product?.tag || "",
    gradient: product?.gradient || "",
    order: product?.order || 0,
  });

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black tracking-tight">
            {product?.id ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Nom du produit *</label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required className="h-11 rounded-xl" placeholder="Ex: Arachides Grillées" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Marque *</label>
              <Input value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} required className="h-11 rounded-xl" placeholder="Ex: Nkalanga Yetu" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80">Description *</label>
            <Textarea value={form.desc} onChange={(e) => handleChange("desc", e.target.value)} required rows={3} className="rounded-xl resize-none" placeholder="Description du produit..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Chemin image *</label>
              <Input value={form.img} onChange={(e) => handleChange("img", e.target.value)} required className="h-11 rounded-xl" placeholder="/images/arachides-grillees.jpg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Tag *</label>
              <Input value={form.tag} onChange={(e) => handleChange("tag", e.target.value)} required className="h-11 rounded-xl" placeholder="Ex: Best-seller" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Couleur gradient *</label>
              <Input value={form.gradient} onChange={(e) => handleChange("gradient", e.target.value)} required className="h-11 rounded-xl" placeholder="from-amber-600 to-orange-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Ordre d'affichage</label>
              <Input type="number" min={0} value={form.order} onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)} className="h-11 rounded-xl" />
            </div>
          </div>
          {form.img && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 h-40 bg-gray-50 flex items-center justify-center">
              <Image src={form.img} alt="Aperçu" width={200} height={200} className="object-contain max-h-40" />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-xl font-bold">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold shadow-lg shadow-emerald-600/20">
              <Save className="w-4 h-4 mr-2" />
              {product?.id ? "Enregistrer" : "Créer le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════ */

function AdminDashboard({ role, token, onLogout }: { role: string; token: string; onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");

  const isSuperAdmin = role === "super_admin";

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSave(data: Partial<Product>) {
    setSaving(true);
    try {
      if (editingProduct?.id) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          showNotif("Produit modifié avec succès");
          setEditingProduct(null);
          loadProducts();
        } else {
          showNotif("Erreur lors de la modification");
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          showNotif("Produit créé avec succès");
          setIsCreating(false);
          setEditingProduct(null);
          loadProducts();
        } else {
          showNotif("Erreur lors de la création");
        }
      }
    } catch {
      showNotif("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        showNotif(product.active ? "Produit désactivé" : "Produit activé");
        loadProducts();
      }
    } catch {
      showNotif("Erreur");
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotif("Produit supprimé");
        loadProducts();
      } else {
        showNotif("Erreur lors de la suppression");
      }
    } catch {
      showNotif("Erreur réseau");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight">Gestion des Produits</h1>
              <p className="text-xs text-muted-foreground">
                Mwaiseni Services SARL &mdash; {isSuperAdmin ? "Super Admin" : "Éditeur"}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="rounded-xl font-semibold border-gray-200">
            <LogOut className="w-4 h-4 mr-2" />Déconnexion
          </Button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 font-semibold text-sm animate-in slide-in-from-right">
          {notification}
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground text-sm">{products.length} produit(s) au total</p>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => {
                setEditingProduct(null);
                setIsCreating(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />Nouveau produit
            </Button>
          )}
        </div>

        {/* Products list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Aucun produit dans la base de données</p>
            <p className="text-muted-foreground text-sm mt-1">Le site affiche les produits par défaut.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${!product.active ? "opacity-60 border-gray-200" : "border-gray-100"}`}
              >
                <div className="flex items-center gap-5 p-5">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    <Image
                      src={product.img}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base tracking-tight truncate">{product.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${product.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {product.active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      {product.brand} &middot; <span className="text-xs">{product.tag}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />Ordre: {product.order}
                      </span>
                      <span>Gradient: {product.gradient}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(product)}
                      className="rounded-xl border-gray-200 h-9 w-9 p-0"
                      title={product.active ? "Désactiver" : "Activer"}
                    >
                      {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsCreating(false);
                      }}
                      className="rounded-xl border-gray-200 h-9 w-9 p-0"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 h-9 w-9 p-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal form */}
      {(isCreating || editingProduct) && (
        <ProductForm
          product={editingProduct || null}
          onSave={handleSave}
          onCancel={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function AdminPage() {
  const [authed, setAuthed] = useState<{ role: string; token: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mwaiseni_auth");
    if (stored) {
      try {
        setAuthed(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("mwaiseni_auth");
      }
    }
  }, []);

  function handleLogin(role: string, token: string) {
    const auth = { role, token };
    sessionStorage.setItem("mwaiseni_auth", JSON.stringify(auth));
    setAuthed(auth);
  }

  function handleLogout() {
    sessionStorage.removeItem("mwaiseni_auth");
    setAuthed(null);
  }

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboard role={authed.role} token={authed.token} onLogout={handleLogout} />;
}
