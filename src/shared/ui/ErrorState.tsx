/**
 * ErrorState — a readable failure message with a Retry button.
 *
 * Exists because `apiClient` times out a stuck request after 30s (the API
 * sleeps on Render's free tier and can take 30-60s to wake) instead of
 * spinning forever, but a timeout on its own is silent: the screen that asked
 * for the data just never gets it. Without this, a query that errors renders
 * as an empty or zeroed screen with no explanation and no way back — the same
 * failure shape that got AshShifa rejected by App Review (2.1(a)).
 */
import React from "react";
import { CloudOff } from "lucide-react-native";
import { palette } from "../designSystem";
import { Text } from "./Text";
import { VStack } from "./Stack";
import { Card } from "./Card";
import { Button } from "./Button";

interface Props {
  /** Defaults to a generic, non-technical message — never the raw axios error. */
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function ErrorState({
  message = "Could not load this. Check your connection and try again.",
  onRetry,
  retrying,
}: Props) {
  return (
    <Card elevation="raised">
      <VStack gap={12} align="center" style={{ paddingVertical: 8 }}>
        <CloudOff size={28} color={palette.danger.text} strokeWidth={1.8} />
        <Text variant="body-sm" tone="secondary" style={{ textAlign: "center" }}>
          {message}
        </Text>
        <Button
          label="Retry"
          variant="secondary"
          size="sm"
          loading={retrying}
          onPress={onRetry}
        />
      </VStack>
    </Card>
  );
}
