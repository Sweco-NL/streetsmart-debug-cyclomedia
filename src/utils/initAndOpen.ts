import type { Coordinate, Locale } from "@cyclomedia/streetsmart-api";
import { StreetSmartManager } from "./streetsmart-manager";

type InitStreetSmartArgs = {
  apiKey: string;
  username: string;
  password: string;
  coordinate: Coordinate;
  targetElement: HTMLDivElement;
  srs: string;
  locale: Locale;
  orientation?: number;
  tilt?: number;
};

export async function initAndOpen({
  apiKey,
  username,
  password,
  coordinate,
  srs,
  locale,
  targetElement,
}: InitStreetSmartArgs) {
  if (StreetSmartManager.isInitialized || StreetSmartManager.isInitializing) {
    return;
  }
  // Check if the API is already initialized
  await StreetSmartManager.initialize({
    targetElement,
    srs,
    locale,
    apiKey,
    addressSettings: {
      locale,
      database: "CMDatabase",
    },
    loginOauth: false,
    // loginRedirectUri: "redirect/login.html",
    // logoutRedirectUri: "redirect/logout.html",
    // clientId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    username,
    password,
  });
  await StreetSmartManager.open(coordinate);
}
