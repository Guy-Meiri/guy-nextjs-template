"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Payment() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    const initPaddle = async () => {
      const paddleInstance = await initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        environment: 'sandbox'
      });
      setPaddle(paddleInstance);
    };
    initPaddle();
  }, []);

  const handleCheckout = () => {
    if (!paddle) return;

    paddle.Checkout.open({
     items: [{
      priceId: 'pri_01k3p4s1336p39fzcvkgw2ye00'
     }],
     settings: {
       displayMode: 'overlay',
       theme: 'dark',
       successUrl: 'http://localhost:3000/payment/success'
     }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Paddle Payment Integration</CardTitle>
        <CardDescription>
          Payment processing powered by Paddle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-6">
          <div>
            <p className="text-lg text-muted-foreground">
              🚧 Paddle payment component placeholder
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This component will be integrated with Paddle for payment processing
            </p>
          </div>
          
          <Button 
            onClick={handleCheckout}
            disabled={!paddle}
            size="lg"
          >
            {paddle ? "Start Checkout" : "Loading..."}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
