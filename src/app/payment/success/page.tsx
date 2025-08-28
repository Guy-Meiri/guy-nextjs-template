import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-4xl font-bold tracking-tight text-green-600">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Confirmation</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You will receive a confirmation email shortly with your receipt and purchase details.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button>
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/payments">
                    <Button variant="outline">
                      Back to Payments
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
