"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EligibilityFormPage() {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    state: "",
    sentenceComplete: "",
    offenseType: "",
    finesOrRestitution: "",
    convictionCount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const qualifies =
      form.sentenceComplete === "yes" &&
      form.offenseType === "nonviolent" &&
      form.finesOrRestitution === "no" &&
      Number(form.convictionCount) <= 3;
    setEligible(qualifies);
    setShowResults(true);
  };

  if (!showResults) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Eligibility Screening</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Was your sentence completed?</label>
            <select name="sentenceComplete" value={form.sentenceComplete} onChange={handleChange} className="border rounded px-3 py-2 w-full">
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Offense Type</label>
            <select name="offenseType" value={form.offenseType} onChange={handleChange} className="border rounded px-3 py-2 w-full">
              <option value="">Select</option>
              <option value="nonviolent">Non-violent</option>
              <option value="violent">Violent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Outstanding fines or restitution?</label>
            <select name="finesOrRestitution" value={form.finesOrRestitution} onChange={handleChange} className="border rounded px-3 py-2 w-full">
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of convictions</label>
            <input type="number" name="convictionCount" value={form.convictionCount} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
        </div>
        <button onClick={handleSubmit} className="mt-6 bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700">
          Check My Eligibility
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 p-8 max-w-xl mx-auto">
      <h2 className={`text-2xl font-bold ${eligible ? "text-green-700" : "text-red-700"}`}>
        {eligible ? "You Appear Eligible ✅" : "Further Review Required ⚠️"}
      </h2>
      <p className="text-gray-700">
        {eligible
          ? "Based on your responses, you qualify under most state Clean Slate criteria."
          : "Some of your answers suggest additional manual review may be required. We can still prepare your petition package."}
      </p>
      <div className="border-t my-4 pt-4 text-left text-sm text-gray-600">
        <p><strong>State:</strong> {form.state || "N/A"}</p>
        <p><strong>Convictions:</strong> {form.convictionCount}</p>
        <p><strong>Offense Type:</strong> {form.offenseType}</p>
        <p><strong>Outstanding Fines:</strong> {form.finesOrRestitution}</p>
      </div>
      <button onClick={() => router.push("/checkout")} className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700">
        Proceed to Checkout
      </button>
    </div>
  );
}
