import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { loadDB, saveDB, uid } from "@/lib/mock-data";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "date";
  options?: { value: string; label: string }[];
  render?: (row: any) => React.ReactNode;
};

type Props = {
  title: string;
  subtitle?: string;
  dbKey: keyof ReturnType<typeof loadDB>;
  idPrefix: string;
  fields: Field[];
  defaults?: Record<string, any>;
};

export function CrudPage({ title, subtitle, dbKey, idPrefix, fields, defaults = {} }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    const db = loadDB();
    setRows(db[dbKey] as any[]);
  }, [dbKey]);

  function persist(next: any[]) {
    const db = loadDB();
    (db[dbKey] as any) = next;
    saveDB(db);
    setRows(next);
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...defaults });
    setOpen(true);
  }
  function openEdit(row: any) {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  }
  function submit() {
    if (editing) {
      const next = rows.map((r) => (r.id === editing.id ? { ...editing, ...form } : r));
      persist(next);
    } else {
      const newRow: Record<string, any> = { id: uid(idPrefix), ...form };
      // coerce numbers
      fields.forEach((f) => {
        if (f.type === "number" && newRow[f.key] !== undefined) newRow[f.key] = Number(newRow[f.key]);
      });
      persist([...rows, newRow]);
    }
    setOpen(false);
  }
  function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    persist(rows.filter((r) => r.id !== id));
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-1" /> Add {title.replace(/s$/, "")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit" : "New"} {title.replace(/s$/, "")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                {fields.map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <Label>{f.label}</Label>
                    {f.type === "select" ? (
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={form[f.key] ?? ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      >
                        <option value="">Select…</option>
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        value={form[f.key] ?? ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit} className="bg-primary text-primary-foreground">{editing ? "Save" : "Create"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((f) => <TableHead key={f.key}>{f.label}</TableHead>)}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={fields.length + 1} className="text-center text-muted-foreground py-8">No records yet</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                {fields.map((f) => (
                  <TableCell key={f.key}>{f.render ? f.render(r) : r[f.key]}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}