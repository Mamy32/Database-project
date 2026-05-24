import { useState, useEffect } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
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

import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export type Field = {
  key: string;

  label: string;

  type?:
    | "text"
    | "number"
    | "select"
    | "date"
    | "time"
    | "phone";

  options?: {
    value: string;
    label: string;
  }[];

  render?: (
    row: any
  ) => React.ReactNode;

  // NEW
  onChange?: (
    value: any,
    form: any,
    setForm: any
  ) => void;

  // NEW
  readOnly?: boolean;
};

type Props = {
  title: string;
  subtitle?: string;

  // API route
  dbKey: string;

  // database ID field
  idField: string;

  fields: Field[];

  defaults?: Record<string, any>;
};

export function CrudPage({
  title,
  subtitle,
  dbKey,
  idField,
  fields,
  defaults = {},
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `http://localhost:5000/${dbKey}`
      );

      setRows(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // OPEN CREATE
  // =========================================

  function openCreate() {
    setEditing(null);
    setForm({ ...defaults });
    setOpen(true);
  }

  // =========================================
  // OPEN EDIT
  // =========================================

  function openEdit(row: any) {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  }

  // =========================================
  // CREATE / UPDATE
  // =========================================

  async function submit() {
    try {

      if (editing) {

        // UPDATE
        await axios.put(
          `http://localhost:5000/${dbKey}/${editing[idField]}`,
          form
        );

      } else {

        // CREATE
        await axios.post(
          `http://localhost:5000/${dbKey}`,
          form
        );
      }

      fetchData();

      setOpen(false);

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // DELETE
  // =========================================

  async function remove(id: number) {

    if (!confirm("Delete this record?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/${dbKey}/${id}`
      );

      fetchData();

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div>
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
                  {editing ? "Edit" : "New"}{" "}
                  {title.replace(/s$/, "")}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 py-2">

                {fields.map((f) => (

                  <div
                    key={f.key}
                    className="space-y-1.5"
                  >

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

    f.onChange(
      value,
      form,
      setForm
    );
  }
}}
  >
    <option value="">
      Select…
    </option>

    {f.options?.map((o) => (
      <option
        key={o.value}
        value={o.value}
      >
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

    setForm({
      ...form,
      [f.key]: value,
    });

    if (f.onChange) {

      f.onChange(
        value,
        form,
        setForm
      );
    }
  }}
/>
)}
                  </div>
                ))}
              </div>

              <DialogFooter>

                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
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
                <TableHead key={f.key}>
                  {f.label}
                </TableHead>
              ))}

              <TableHead className="w-24 text-right">
                Actions
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={fields.length + 1}
                  className="text-center text-muted-foreground py-8"
                >
                  No records yet
                </TableCell>
              </TableRow>
            )}

            {rows.map((r) => (

              <TableRow key={r[idField]}>

                {fields.map((f) => (
                  <TableCell key={f.key}>
                    {f.render
                      ? f.render(r)
                      : r[f.key]}
                  </TableCell>
                ))}

                <TableCell className="text-right">

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

                </TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}