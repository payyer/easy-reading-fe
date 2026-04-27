import { HealthCheckClient } from "./health-check-client";

export default function HealthCheckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto">
        <HealthCheckClient />
      </div>
    </div>
  );
}
