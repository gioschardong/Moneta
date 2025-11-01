"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  emoji: string
  color: string
}

// const defaultCategories: Category[] = [
//   { id: "1", name: "Food", emoji: "🍔", color: "#FF6B6B" },
//   { id: "2", name: "Transport", emoji: "🚗", color: "#4ECDC4" },
//   { id: "3", name: "Entertainment", emoji: "🎮", color: "#95E1D3" },
//   { id: "4", name: "Shopping", emoji: "🛍️", color: "#F38181" },
//   { id: "5", name: "Bills", emoji: "📄", color: "#AA96DA" },
//   { id: "6", name: "Health", emoji: "🏥", color: "#FCBAD3" },
//   { id: "7", name: "Salary", emoji: "💰", color: "#00E676" },
//   { id: "8", name: "Investment", emoji: "📈", color: "#6C63FF" },
// ]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", emoji: "", color: "#6C63FF" })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("moneta_token") // ou onde você guarda o JWT
        const res = await fetch("http://localhost:5075/api/categories", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })

        if (!res.ok) throw new Error("Erro ao buscar categorias")

        const data: Category[] = await res.json()
        setCategories(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

  // Removed saveCategories: now categories are managed only via backend

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return

    try {
      const token = localStorage.getItem("moneta_token")
      const res = await fetch("http://localhost:5075/api/categories", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCategory)
      })

      if (!res.ok) throw new Error("Erro ao adicionar categoria")

      const created = await res.json()
      setCategories([...categories, created])
      setNewCategory({ name: "", emoji: "", color: "#6C63FF" })
      setIsAddOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    try {
      const token = localStorage.getItem("moneta_token")
      const res = await fetch(`http://localhost:5075/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editingCategory)
      })

      if (!res.ok) throw new Error("Erro ao editar categoria")

      const updated = await res.json()
      const updatedList = categories.map((cat) => (cat.id === updated.id ? updated : cat))
      setCategories(updatedList)
      setIsEditOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const token = localStorage.getItem("moneta_token")
      const res = await fetch(`http://localhost:5075/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Erro ao excluir categoria")

      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory({ ...category })
    setIsEditOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
            <p className="text-muted-foreground">Manage your transaction categories</p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Groceries"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    placeholder="e.g., 🛒"
                    value={newCategory.emoji}
                    onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      placeholder="#6C63FF"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {/* Render emoji as string, fallback to default if empty */}
                      {typeof category.emoji === "string" && category.emoji
                        ? category.emoji
                        : "🏷️"}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs" style={{ color: category.color }}>
                        {category.name}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(category)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card className="p-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">No categories yet. Create your first category!</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-emoji">Emoji</Label>
                  <Input
                    id="edit-emoji"
                    value={editingCategory.emoji}
                    onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-color"
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
