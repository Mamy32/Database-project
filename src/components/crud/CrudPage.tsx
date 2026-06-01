import { useState, useEffect } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import { API_URL } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "date" | "time" | "phone" | "custom";
  options?: {
    value: string;
    label: string;
  }[];
  render?: (row: any) => React.ReactNode;
  onChange?: (value: any, form: any, setForm: any) => void;
  readOnly?: boolean;
  defaultValue?: any;
  sortable?: boolean; // NEW: Enable sorting on this field
};

type Props = {
  title: string;
  subtitle?: string;
  dbKey: string;
  idField: string;
  fields: Field[];
  defaults?: Record<string, any>;
  customActions?: (record: any) => React.ReactNode;
  enableSearch?: boolean; // NEW: Enable search bar
  defaultSortField?: string; // NEW: Default field to sort by
  defaultSortOrder?: "asc" | "desc"; // NEW: Default sort order
};

export function CrudPage({
  title,
  subtitle,
  dbKey,
  idField,
  fields,
  defaults = {},
  customActions,
  enableSearch = false,
  defaultSortField = "",
  defaultSortOrder = "asc",
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  
  const buildInitialForm = () => {
    const initial: Record<string, any> = {
      ...defaults,
      date: new Date().toISOString().split("T")[0],
    };

    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.key] = typeof f.defaultValue === "function"
          ? f.defaultValue()
          : f.defaultValue;
      }
    });

    return initial;
  };

  const [form, setForm] = useState<Record<string, any>>(buildInitialForm());

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${API_URL}/${dbKey}`);
      setRows(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(buildInitialForm());
    setOpen(true);
  }

  function openEdit(row: any) {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  }

  async function submit() {
    try {
      if (dbKey === "attendance") {
        form.date = new Date().toISOString().split("T")[0];
      }
      
      if (editing) {
        await axios.put(`${API_URL}/${dbKey}/${editing[idField]}`, form);
      } else {
        await axios.post(`${API_URL}/${dbKey}`, form);
      }

      fetchData();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_URL}/${dbKey}/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // SEARCH & SORT LOGIC
  // =========================================

  // Filter rows based on search term
  const filteredRows = enableSearch && searchTerm
    ? rows.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        // Search through all field values
        return fields.some((field) => {
          const value = row[field.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      })
    : rows;

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    // Handle different data types
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    // Handle dates
    if (sortField.includes("Date") && aVal && bVal) {
      const aDate = new Date(aVal).getTime();
      const bDate = new Date(bVal).getTime();
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }
    
    // Handle strings (default)
    aVal = String(aVal || "").toLowerCase();
    bVal = String(bVal || "").toLowerCase();
    
    if (sortOrder === "asc") {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  // Handle sort click
  const handleSort = (fieldKey: string) => {
    const field = fields.find(f => f.key === fieldKey);
    if (!field?.sortable) return;
    
    if (sortField === fieldKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(fieldKey);
      setSortOrder("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (fieldKey: string) => {
    if (sortField !== fieldKey) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      {/* Search Bar */}
      {enableSearch && (
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {sortedRows.length} record(s) found
          </div>
        </div>
      )}

      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreate}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add {title.replace(/s$/, "")}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit" : "New"} {title.replace(/s$/, "")}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 py-2">
                {fields.map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <Label>{f.label}</Label>

                    {f.type === "select" ? (
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={form[f.key] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm({
                            ...form,
                            [f.key]: value,
                          });
                          if (f.onChange) {
                            f.onChange(value, form, setForm);
                          }
                        }}
                      >
                        <option value="">Select…</option>
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "phone" ? (
                      <PhoneInput
                        country={"id"}
                        value={form[f.key] ?? ""}
                        onChange={(phone) =>
                          setForm({
                            ...form,
                            [f.key]: phone,
                          })
                        }
                        inputStyle={{
                          width: "100%",
                          height: "36px",
                        }}
                      />
                    ) : f.type === "custom" ? (
                      f.render?.(form)
                    ) : (
                      <Input
                        readOnly={f.readOnly}
                        type={
                          f.type === "number"
                            ? "number"
                            : f.type === "date"
                            ? "date"
                            : f.type === "time"
                            ? "time"
                            : "text"
                        }
                        value={form[f.key] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const updatedForm = {
                            ...form,
                            [f.key]: value,
                          };
                          setForm(updatedForm);
                          if (f.onChange) {
                            f.onChange(value, updatedForm, setForm);
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={submit}
                  className="bg-primary text-primary-foreground"
                >
                  {editing ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((f) => (
                <TableHead 
                  key={f.key}
                  className={f.sortable ? "cursor-pointer hover:bg-muted/50 select-none" : ""}
                  onClick={() => f.sortable && handleSort(f.key)}
                >
                  <div className="flex items-center gap-1">
                    {f.label}
                    {f.sortable && (
                      <span className="text-xs opacity-50">
                        {getSortIcon(f.key)}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={fields.length + 1}
                  className="text-center text-muted-foreground py-8"
                >
                  {searchTerm ? "No matching records found" : "No records yet"}
                </TableCell>
              </TableRow>
            )}

            {sortedRows.map((r) => (
              <TableRow key={r[idField]}>
                {fields.map((f) => (
                  <TableCell key={f.key}>
                    {f.render ? f.render(r) : r[f.key]}
                  </TableCell>
                ))}

                <TableCell className="text-right space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(r)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(r[idField])}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>

                  {customActions && customActions(r)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}