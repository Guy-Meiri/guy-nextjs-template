import { Payment } from "@/components/payments/payment";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Payments
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your subscriptions and payments
            </p>
          </div>
          
          <Payment />
        </div>
      </div>
    </div>
  );
}
