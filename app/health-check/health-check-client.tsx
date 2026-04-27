"use client";

import { useHealthCheck } from "@/app/hooks/useApi";
import Link from "next/link";

export function HealthCheckClient() {
  const { data, isLoading, isFetching, isError, isSuccess, error, refetch } =
    useHealthCheck();
  const showInitialLoading = isLoading && !data;
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Backend Health Check
      </h1>
      <p className="text-gray-600 mb-8">Test connection to Backend API</p>

      {/* Status Badge */}
      <div className="mb-6">
        {showInitialLoading && (
          <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
            ⏳ Connecting...
          </div>
        )}

        {isSuccess && (
          <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
            ✅ Connected {isFetching && "(checking...)"}
          </div>
        )}

        {isError && !data && (
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-semibold">
            ❌ Connection Failed
          </div>
        )}
      </div>

      {/* Test Button */}
      <button
        onClick={() => refetch()}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Testing..." : "Test Connection"}
      </button>

      {/* Response */}
      {isSuccess && data && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-semibold text-green-900 mb-2">Response:</h2>
          <pre className="text-sm text-green-800 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-semibold text-red-900 mb-2">Error:</h2>
          <p className="text-sm text-red-800">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <p className="text-xs text-red-600 mt-2">
            Make sure Backend is running on http://localhost:5000
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Configuration:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Backend URL:{" "}
            <code className="bg-white px-2 py-1 rounded">
              http://localhost:5000/api
            </code>
          </li>
          <li>
            • Endpoint:{" "}
            <code className="bg-white px-2 py-1 rounded">/health</code>
          </li>
          <li>
            • Method: <code className="bg-white px-2 py-1 rounded">GET</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
