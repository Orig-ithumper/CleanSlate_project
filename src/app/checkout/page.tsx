"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// ⚠️ placeholder publishable key — safe for testing demo UI.
const stripePromise = loadStripe("pk_test_PLACEHOLDER_ONLY_do_not_use_real_keys");

export default function CheckoutPage() {
  const [option, setOption] = useState<"withStateFee" | "withoutStateFee" | null>(null);
  const [stateFee, setStateFee] = useState(0);
  const [stateName, setStateName] = useState("");

  const handlePayment = async () => {
    alert(
      `Demo only — this would redirect to Stripe checkout for:\n\n` +
        `$${175 + (option === "withStateFee" ? stateFee : 0)} total`
    );
    // ❌ No real API call here — this is only a visual demo.
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Checkout – Clean Slate Processing
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Select how you’d like to handle <strong>state filing fees</strong> in addition to the $175 processing fee.
        </p>

        <div className="space-y-4 mb-8">
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="feeOption"
              onChange={() => setOption("withStateFee")}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-semibold text-gray-800">
                Option 1 — $175 Processing + State Fee
              </p>
              <p className="text-sm text-gray-600">
                You pay all costs here, including any court or state filing fees.
              </p>
            </div>
          </label>

          {option === "withStateFee" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select State
              </label>
              <select
                value={stateName}
                onChange={(e) => {
                  const value = e.target.value;
                  setStateName(value);
                  const defaultFee =
                    value === "California"
                      ? 120
                      : value === "Texas"
                      ? 100
                      : 0;
                  setStateFee(defaultFee);
                }}
                className="w-full border rounded px-3 py-2 mb-3"
              >
                <option value="">-- Choose state for fee estimate --</option>
                <option value="California">California (~$120)</option>
                <option value="Texas">Texas (~$100)</option>
                <option value="Pennsylvania">Pennsylvania ($0 auto system)</option>
              </select>

              {stateName && (
                <p className="text-gray-700 text-sm">
                  Estimated state filing fee for {stateName}: 
                  <strong>${stateFee}</strong>
                </p>
              )}
            </div>
          )}

          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="feeOption"
              onChange={() => setOption("withoutStateFee")}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-semibold text-gray-800">
                Option 2 — $175 Processing Only
              </p>
              <p className="text-sm text-gray-600">
                You pay our service fee now and will send any state filing fee directly to your court or agency.
              </p>
            </div>
          </label>
        </div>

        <div className="border-t pt-6 mb-4 text-gray-800">
          <p className="flex justify-between">
            <span>Processing Fee</span> <span>$175</span>
          </p>
          <p className="flex justify-between mb-2">
            <span>State Fee</span>{" "}
            <span>{option === "withStateFee" ? `$${stateFee}` : "$0 (paid separately)"}</span>
          </p>
          <hr className="my-2" />
          <p className="flex justify-between font-bold text-lg">
            <span>Total Due Now</span>
            <span>
              ${option === "withStateFee" ? 175 + stateFee : 175}
            </span>
          </p>
        </div>

        <button
          disabled={!option}
          onClick={handlePayment}
          className={`w-full py-3 text-white font-semibold rounded-md ${
            option
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Proceed to Payment (Demo)
        </button>

        <div className="mt-6 text-sm text-gray-500 border-t pt-4">
          <h2 className="font-semibold text-gray-700 mb-1">No‑Refund Policy</h2>
          <p>
            All fees are non‑refundable once payment processing begins.
            Our team allocates time and resources immediately upon submission to prepare
            your expungement paperwork.
          </p>
        </div>
      </div>
    </main>
  );
}
