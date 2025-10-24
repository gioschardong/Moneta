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
  icon: string
  color: string
}

const defaultCategories: Category[] = [
  { id: "1", name: "Food", icon: "🍔", color: "#FF6B6B" },
  { id: "2", name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { id: "3", name: "Entertainment", icon: "🎮", color: "#95E1D3" },
  { id: "4", name: "Shopping", icon: "🛍️", color: "#F38181" },
  { id: "5", name: "Bills", icon: "📄", color: "#AA96DA" },
  { id: "6", name: "Health", icon: "🏥", color: "#FCBAD3" },
  { id: "7", name: "Salary", icon: "💰", color: "#00E676" },
  { id: "8", name: "Investment", icon: "📈", color: "#6C63FF" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", icon: "", color: "#6C63FF" })

  useEffect(() => {
    const stored = localStorage.getItem("financeflow_categories")
    if (stored) {
      setCategories(JSON.parse(stored))
    } else {
      setCategories(defaultCategories)
      localStorage.setItem("financeflow_categories", JSON.stringify(defaultCategories))
    }
  }, [])

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    localStorage.setItem("financeflow_categories", JSON.stringify(updatedCategories))
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon || "📁",
      color: newCategory.color,
    }

    saveCategories([...categories, category])
    setNewCategory({ name: "", icon: "", color: "#6C63FF" })
    setIsAddOpen(false)
  }

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    const updatedCategories = categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))

    saveCategories(updatedCategories)
    setEditingCategory(null)
    setIsEditOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      saveCategories(categories.filter((cat) => cat.id !== id))
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
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    placeholder="e.g., 🛒"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
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
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs" style={{ color: category.color }}>
                        {category.color}
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
                  <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                  <Input
                    id="edit-icon"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
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
