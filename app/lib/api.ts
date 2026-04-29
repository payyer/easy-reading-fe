/**
 * Centralized API service for backend communication
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiRequestOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * Execute an API request with built-in error handling, timeout, and dynamic body parsing
 *
 * @param endpoint - API path (e.g., /health)
 * @param options - Request options (method, body, headers, timeout)
 * @returns Response with success flag and typed data
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 10000,
    body,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Use AbortController to implement timeout cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Kiểm tra nếu body là FormData (dùng để upload file)
    const isFormData = body instanceof FormData;

    // Khởi tạo headers
    const headers: Record<string, string> = {
      ...(customHeaders as Record<string, string>),
    };

    // Nếu KHÔNG PHẢI FormData và chưa có Content-Type thì mặc định là JSON
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Xử lý body: Nếu là FormData thì giữ nguyên, nếu là object thì stringify
    const finalBody = isFormData
      ? body
      : body
      ? JSON.stringify(body)
      : undefined;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: finalBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        data: data,
        status: response.status,
      };
    }

    return {
      success: true,
      data: data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        success: false,
        error: "Network error - Backend không thể kết nối",
        status: 0,
      };
    }

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: `Request timeout sau ${timeout}ms`,
        status: 0,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 0,
    };
  }
}

export function apiGet<T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method">
) {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

export function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body,
  });
}

export function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body,
  });
}

export function apiDelete<T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method">
) {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}
