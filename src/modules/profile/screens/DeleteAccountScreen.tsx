import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { useDeleteAccount } from "@modules/auth/hooks/useAuth";
import { palette, radius } from "@shared/designSystem";
import { Text, VStack, Card, Button, TextField } from "@shared/ui";

type ApiErr = { response?: { data?: { error?: { message?: string } } } };

/**
 * In-app account deletion — required by App Store guideline 5.1.1(v) for any
 * app that lets people create an account, and by Google Play.
 *
 * Deletion happens on the server the moment this succeeds (DELETE /users/me):
 * the login stops working and the person's details are scrubbed. Farm records
 * stay with the farm, which is what public/delete-account.html promises.
 */
export default function DeleteAccountScreen() {
  const navigation = useNavigation<any>();
  const del = useDeleteAccount();
  const [password, setPassword] = useState("");

  const error = del.isError
    ? (del.error as ApiErr)?.response?.data?.error?.message ||
      "Could not delete your account. Check your connection and try again."
    : undefined;

  const confirm = () => {
    Alert.alert(
      "Delete your account?",
      "You will be signed out and will not be able to sign in again. This cannot be undone.",
      [
        { text: "Keep account", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => del.mutate(password),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface.secondary }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={styles.topbar}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={palette.text.primary} />
          </Pressable>
          <Text variant="h3" tone="primary">
            Delete account
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <Card elevation="raised">
              <VStack gap={10}>
                <Text variant="label-lg" tone="primary">
                  What happens
                </Text>
                <Text variant="body-sm" tone="secondary">
                  Your login is removed immediately and you are signed out on
                  every device. Your name, email and phone number are erased.
                </Text>
                <Text variant="body-sm" tone="secondary">
                  Records you created for the farm, such as goat, task and
                  payment entries, stay with the farm because other people rely
                  on them. They no longer show your name.
                </Text>
              </VStack>
            </Card>

            <VStack gap={16} style={{ marginTop: 20 }}>
              <TextField
                label="Enter your password to confirm"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                error={error}
              />
              <Button
                label="Delete my account"
                variant="destructive"
                size="lg"
                loading={del.isPending}
                disabled={password.length === 0}
                onPress={confirm}
              />
            </VStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: palette.surface.primary,
    borderWidth: 1,
    borderColor: palette.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
});
