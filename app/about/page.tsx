// pages/index.tsx (pour Pages Router)
// OU app/page.tsx (pour App Router)

import CostumWorldLanding from "@/components/CostumWorldLanding";

// Si vous utilisez App Router: import CostumWorldLanding from './components/CostumWorldLanding';

export default function Home() {
  return (
    <div>
      <CostumWorldLanding />
    </div>
  );
}

