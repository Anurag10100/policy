"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function RazorpayCheckout({
  amount,
  planName,
  description,
}: {
  amount: number;
  planName: string;
  description: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Load Razorpay script
    if (!document.querySelector('script[src*="razorpay"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      await new Promise((resolve) => (script.onload = resolve));
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "PolicyAI",
      description,
      prefill: {
        email: user.email,
      },
      notes: {
        plan: planName.toLowerCase(),
        user_id: user.id,
      },
      theme: {
        color: "#c9a84c",
      },
      handler: function () {
        window.location.href = "/dashboard?upgraded=true";
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[var(--accent)] text-[var(--bg)] py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
    >
      {loading ? "Loading..." : `Subscribe — ₹25,000/month`}
    </button>
  );
}
