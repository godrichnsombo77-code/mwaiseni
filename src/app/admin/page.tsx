"use client";

import { useState, useEffect, useRef, type FormEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock, LogOut, Plus, Pencil, Trash2, Eye, EyeOff,
  Save, X, Loader2, Package, ArrowUpDown, Upload, ImageIcon,
  Check, ToggleLeft, ToggleRight,
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
   COMPRESS IMAGE (client-side)
   ═══════════════════════════════════════════ */

function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas error")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Blob error")); return; }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Image load error"));
    img.src = URL.createObjectURL(file);
  });
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
   PRODUCT FORM (with image upload + compression)
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
    img: product?.img || "",
    tag: product?.tag || "",
    gradient: product?.gradient || "",
    order: product?.order || 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleUpload(file: File) {
    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setUploadStatus("Type non support\u00e9. Utilisez JPG, PNG, WebP ou GIF.");
      return;
    }

    setUploading(true);
    setUploadStatus("Compression de l'image...");

    try {
      // Compress image client-side to max 800px wide, 70% quality
      const compressed = await compressImage(file, 800, 0.7);
      const sizeKB = Math.round(compressed.size / 1024);
      setUploadStatus(`Envoi (${sizeKB} Ko)...`);

      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, img: data.url }));
        setUploadStatus("Image envoy\u00e9e avec succ\u00e8s !");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus(data.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("Erreur r\u00e9seau. R\u00e9essayez.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const previewUrl = form.img;

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
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required className="h-11 rounded-xl" placeholder="Ex: Arachides Grill\u00e9es" />
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

          {/* Image Upload Zone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80">Image du produit *</label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${
                dragOver
                  ? "border-emerald-400 bg-emerald-50"
                  : uploadStatus.startsWith("Image envoy\u00e9")
                  ? "border-emerald-400 bg-emerald-50/50"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-600">{uploadStatus}</p>
                </div>
              ) : previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                    <img src={previewUrl} alt="Aper\u00e7u" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cliquer ou glisser pour changer l&apos;image
                  </p>
                  {uploadStatus && (
                    <p className={`text-xs font-semibold ${uploadStatus.startsWith("Image") ? "text-emerald-600" : "text-red-500"}`}>
                      {uploadStatus}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Glisser une image ici ou cliquer pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    JPG, PNG, WebP ou GIF — L&apos;image sera compress\u00e9e automatiquement
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Manual image path (fallback) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Ou chemin image manuel (optionnel)
            </label>
            <div className="flex gap-2">
              <ImageIcon className="w-4 h-4 mt-3 text-muted-foreground shrink-0" />
              <Input
                value={form.img}
                onChange={(e) => handleChange("img", e.target.value)}
                className="h-11 rounded-xl"
                placeholder="/images/mon-produit.jpg"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Tag *</label>
              <Input value={form.tag} onChange={(e) => handleChange("tag", e.target.value)} required className="h-11 rounded-xl" placeholder="Ex: Best-seller" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Ordre d&apos;affichage</label>
              <Input type="number" min={0} value={form.order} onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)} className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80">Couleur gradient *</label>
            <Input value={form.gradient} onChange={(e) => handleChange("gradient", e.target.value)} required className="h-11 rounded-xl" placeholder="from-amber-600 to-orange-700" />
            <div className="flex flex-wrap gap-2 mt-2">
              {["from-amber-600 to-orange-700", "from-yellow-600 to-amber-700", "from-orange-600 to-red-700", "from-yellow-500 to-orange-600", "from-green-600 to-emerald-700", "from-purple-500 to-violet-600", "from-cyan-500 to-blue-600", "from-rose-500 to-pink-600"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleChange("gradient", g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.gradient === g ? "ring-2 ring-emerald-400 ring-offset-1" : "ring-1 ring-gray-200 hover:ring-gray-300"}`}
                >
                  <span className={`bg-gradient-to-r ${g} bg-clip-text text-transparent`}>
                    {g.split(" ").pop()?.replace("to-", "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-xl font-bold">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold shadow-lg shadow-emerald-600/20">
              <Save className="w-4 h-4 mr-2" />
              {product?.id ? "Enregistrer" : "Cr\u00e9er le produit"}
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
  const [togglingId, setTogglingId] = useState<string | null>(null);
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
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          showNotif("Produit modifi\u00e9 avec succ\u00e8s");
          setEditingProduct(null);
          loadProducts();
        } else {
          showNotif("Erreur lors de la modification");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          showNotif("Produit cr\u00e9\u00e9 avec succ\u00e8s");
          setIsCreating(false);
          setEditingProduct(null);
          loadProducts();
        } else {
          showNotif("Erreur lors de la cr\u00e9ation");
        }
      }
    } catch {
      showNotif("Erreur r\u00e9seau");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product: Product) {
    setTogglingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        showNotif(product.active ? "Produit d\u00e9sactiv\u00e9" : "Produit r\u00e9activ\u00e9");
        loadProducts();
      } else {
        showNotif("Erreur lors du changement de statut");
      }
    } catch {
      showNotif("Erreur r\u00e9seau");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Supprimer "${product.name}" ? Cette action est irr\u00e9versible.`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotif("Produit supprim\u00e9");
        loadProducts();
      } else {
        showNotif("Erreur lors de la suppression");
      }
    } catch {
      showNotif("Erreur r\u00e9seau");
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
                Mwaiseni Services SARL &mdash; {isSuperAdmin ? "Super Admin" : "\u00c9diteur"}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="rounded-xl font-semibold border-gray-200">
            <LogOut className="w-4 h-4 mr-2" />D\u00e9connexion
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
            <p className="text-muted-foreground text-sm">
              {products.filter(p => p.active).length} actif(s) / {products.length} produit(s) au total
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsCreating(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />Nouveau produit
          </Button>
        </div>

        {/* Products list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Aucun produit dans la base de donn\u00e9es</p>
            <p className="text-muted-foreground text-sm mt-1">Le site affiche les produits par d\u00e9faut.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${!product.active ? "opacity-70 border-gray-200" : "border-gray-100"}`}
              >
                <div className="flex items-center gap-5 p-5">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base tracking-tight truncate">{product.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${product.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
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
                    {/* Toggle Active/Inactive — BIG VISIBLE BUTTON */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(product)}
                      disabled={togglingId === product.id}
                      className={`rounded-xl h-9 px-3 flex items-center gap-1.5 font-semibold text-xs ${
                        product.active
                          ? "border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
                      }`}
                      title={product.active ? "D\u00e9sactiver" : "R\u00e9activer"}
                    >
                      {togglingId === product.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : product.active ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span className="hidden sm:inline">D\u00e9sactiver</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">R\u00e9activer</span>
                        </>
                      )}
                    </Button>

                    {/* Edit */}
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

                    {/* Delete — super admin only */}
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
