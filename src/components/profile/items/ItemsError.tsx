import React from "react";
import { Button } from "@/components/ui/button";
import { Paper, HeaderWithIcon } from "@/components/common";

export function ItemsError() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon icon="📦" title="Миний агуулах" />
      <Paper className="text-center py-16">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Алдаа гарлаа
        </h2>
        <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
          Таны агуулахын мэдээллийг ачаалахад алдаа гарлаа. Дахин оролдоно уу.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          Дахин оролдох
        </Button>
      </Paper>
    </div>
  );
}

export default ItemsError;
