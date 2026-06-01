import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

export const Route = createFileRoute("/_app/subscriptions")({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [membersRes, plansRes] = await Promise.all([
        axios.get(`${API_URL}/members`),
        axios.get(`${API_URL}/plans`),
      ]);

      setMembers(membersRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      console.error(error);
    }
  }

  function calculateEndDate(startDate: string, duration: number) {
    if (!startDate || !duration) return "";
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + duration);
    return date.toISOString().split("T")[0];
  }

  // Generate PDF receipt
  const generateReceipt = async (subscription: any) => {
    const member = members.find((m) => m.memberID == subscription.memberID);
    const plan = plans.find((p) => p.planID == subscription.planID);

    const doc = new jsPDF();

    // Add header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text("FlexGym", 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Payment Receipt", 20, 35);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    // Receipt details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Receipt ID: ${subscription.subscriptionID}`, 20, 62);

    // Member Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Member Information", 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Name: ${member ? `${member.firstName} ${member.lastName}` : "N/A"}`, 20, 92);
    
    // Subscription Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Subscription Details", 20, 115);
    
    const tableData = [
      ["Plan:", plan ? plan.planName : "N/A"],
      ["Duration:", plan ? `${plan.duration} month(s)` : "N/A"],
      ["Start Date:", new Date(subscription.startDate).toLocaleDateString()],
      ["End Date:", new Date(subscription.endDate).toLocaleDateString()],
      ["Payment Method:", subscription.method],
      ["Status:", subscription.status],
    ];
    
    autoTable(doc, {
      startY: 122,
      head: [],
      body: tableData,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [100, 100, 100],
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [0, 0, 0], cellWidth: 40 },
        1: { cellWidth: 130 },
      },
      margin: { left: 20 },
    });

    // Payment Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Summary", 20, finalY);
    
    autoTable(doc, {
      startY: finalY + 5,
      head: [],
      body: [
        ["Payment Date:", new Date(subscription.paymentDate).toLocaleDateString()],
        ["Payment Amount:", `$${subscription.paymentAmount}`],
      ],
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [100, 100, 100],
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [0, 0, 0], cellWidth: 40 },
        1: { cellWidth: 130 },
      },
      margin: { left: 20 },
    });

    // Footer
    const footerY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing FlexGym!", 20, footerY);
    doc.text("This is a computer-generated receipt and does not require a signature.", 20, footerY + 5);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, footerY + 10);

    // Save PDF
    doc.save(`receipt_${subscription.subscriptionID}_${member?.lastName || "subscription"}.pdf`);
  };

  return (
    <CrudPage
      title="Subscriptions"
      subtitle="Active and past memberships"
      dbKey="subscriptions"
      idField="subscriptionID"
      fields={[
        {
          key: "memberID",
          label: "Member",
          type: "select",
          options: members.map((m) => ({
            value: m.memberID,
            label: `${m.firstName} ${m.lastName}`,
          })),
          render: (r) => {
            const member = members.find((m) => m.memberID == r.memberID);
            return member ? `${member.firstName} ${member.lastName}` : "—";
          },
        },
        {
          key: "planID",
          label: "Plan",
          type: "select",
          options: plans.map((p) => ({
            value: p.planID,
            label: p.planName,
          })),
          render: (r) => {
            const plan = plans.find((p) => p.planID == r.planID);
            return plan ? plan.planName : "—";
          },
          onChange: (value, form, setForm) => {
            const selectedPlan = plans.find((p) => p.planID == value);
            if (selectedPlan) {
              let endDate = "";
              if (form.startDate) {
                const date = new Date(form.startDate);
                date.setMonth(date.getMonth() + selectedPlan.duration);
                endDate = date.toISOString().split("T")[0];
              }
              setForm((prev: any) => ({
                ...prev,
                planID: value,
                paymentAmount: selectedPlan.planPrice,
                endDate,
              }));
            }
          },
        },
        {
          key: "startDate",
          label: "Start Date",
          type: "date",
          onChange: (value, form, setForm) => {
            const selectedPlan = plans.find((p) => p.planID == form.planID);
            if (selectedPlan) {
              const endDate = calculateEndDate(value, selectedPlan.duration);
              setForm((prev: any) => ({
                ...prev,
                startDate: value,
                endDate,
              }));
            }
          },
          render: (r) =>
            new Date(r.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
        },
        {
          key: "endDate",
          label: "End Date",
          type: "date",
          readOnly: true,
          render: (r) =>
            new Date(r.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
        },
        {
          key: "paymentAmount",
          label: "Payment Amount",
          type: "number",
          readOnly: true,
          render: (r) => `$${r.paymentAmount}`,
        },
        {
          key: "paymentDate",
          label: "Payment Date",
          type: "date",
          render: (r) =>
            new Date(r.paymentDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
        },
        {
          key: "method",
          label: "Payment Method",
          type: "select",
          options: [
            { value: "Cash", label: "Cash" },
            { value: "Credit Card", label: "Credit Card" },
            { value: "Debit Card", label: "Debit Card" },
            { value: "Bank Transfer", label: "Bank Transfer" },
            { value: "E-Wallet", label: "E-Wallet" },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Active", label: "Active" },
            { value: "Expired", label: "Expired" },
          ],
          render: (r) => (
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                r.status === "Active"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {r.status}
            </span>
          ),
        },
      ]}
      defaults={{
        status: "Active",
      }}
      // Add custom action button for receipt
      customActions={(record) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => generateReceipt(record)}
          className="ml-2"
        >
          <FileText className="h-4 w-4 mr-1" />
          Receipt
        </Button>
      )}
    />
  );
}