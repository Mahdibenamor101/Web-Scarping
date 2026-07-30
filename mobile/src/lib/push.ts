import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiFetch, ApiError } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests permission, gets an Expo push token, and registers it against
 * the current session (POST /api/push-tokens, see the growth_features
 * mobile migration). Called once after login and once on every app start
 * while signed in, since Expo can reissue a token.
 *
 * `getExpoPushTokenAsync` needs a real EAS project id
 * (app.json -> extra.eas.projectId) to actually mint a usable token --
 * this repo doesn't have one configured (no Expo account wired up in this
 * environment, see mobile/README.md), so this fails soft: catches,
 * console.warns, and the app keeps working with no push registered,
 * rather than crashing the login flow over a missing credential.
 */
export async function registerForPushNotifications(): Promise<void> {
  try {
    if (!Constants.isDevice) {
      console.warn("[push] simulators/emulators cannot receive real push notifications, skipping.");
      return;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    if (status !== "granted") {
      console.warn("[push] permission denied, skipping registration.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#E2811F",
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);

    await apiFetch("/api/push-tokens", {
      method: "POST",
      body: { token, platform: Platform.OS === "ios" ? "ios" : "android" },
    });
  } catch (err) {
    // Never blocks login/app usage -- see the doc comment above.
    console.warn("[push] registration failed (expected without a configured EAS project id):", err);
  }
}

export async function unregisterCurrentPushToken(): Promise<void> {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await apiFetch("/api/push-tokens", { method: "DELETE", body: { token } });
  } catch (err) {
    if (!(err instanceof ApiError)) console.warn("[push] unregister failed", err);
  }
}
