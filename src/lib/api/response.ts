import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";
import { AppError, errorToResponse } from "@/lib/utils/errors";

export function apiSuccess<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

export function apiError(error: unknown, statusCode?: number) {
  const errorResponse = errorToResponse(error);
  const status =
    statusCode ||
    (error instanceof AppError ? error.statusCode : errorResponse.statusCode);

  return NextResponse.json(
    {
      success: false,
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: status,
      details: errorResponse.details,
    },
    { status }
  );
}
