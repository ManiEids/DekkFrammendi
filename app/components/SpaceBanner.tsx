'use client';

export default function SpaceBanner() {
  // Static info for demonstration
  const lastUpdated = new Date("2025-04-01T17:52:20"); // 4/1/2025, 5:52:20 PM
  const totalTires = 5689;
  const now = new Date();
  const diffDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  const statusEmoji = diffDays >= 1 ? "⚠️" : "✅"; // Warning if outdated

  return (
    <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg text-center shadow-xl mx-4 my-4">
      <h2 className="text-2xl font-bold">Einstaklingsverkefni Vefforritun 2025 - Máni Eiðsson</h2>
      <p className="mt-2">
        Gagnagrunnur síðast uppfærður: {lastUpdated.toLocaleString('is-IS')}
      </p>
      <p className="mt-1">
        Total dekk: {totalTires} {statusEmoji}
      </p>
    </div>
  );
}
