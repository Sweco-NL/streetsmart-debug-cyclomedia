import { useEffect, useRef } from "react";
import type { Coordinate } from "@cyclomedia/streetsmart-api";
import { initAndOpen } from "../../utils/initAndOpen";
import { StreetSmartManager } from "../../utils/streetsmart-manager";

type StreetSmartProps = {
  apiKey: string;
  username: string;
  password: string;
  coordinate: Coordinate;
  srs: string;
};

const StreetSmart = ({
  apiKey,
  username,
  password,
  coordinate,
  srs,
}: StreetSmartProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      void StreetSmartManager.close();
    };
  }, []);

  useEffect(() => {
    if (!ref?.current) return;

    if (StreetSmartManager.isInitialized || StreetSmartManager.isInitializing) {
      return;
    }
    const targetElement = ref.current;

    void initAndOpen({
      targetElement,
      apiKey,
      username,
      password,
      coordinate,
      srs,
      locale: "nl",
    });
  }, [apiKey, username, password, coordinate, srs]);

  return (
    <div
      id="streetsmart-container"
      ref={ref}
      style={{ height: "100%", width: "100%" }}
    >
      Loading...
    </div>
  );
};

export default StreetSmart;
