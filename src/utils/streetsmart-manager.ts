import {
  type ApiOptions,
  type Coordinate,
  GlobalViewerEvents,
  type PanoramaViewer,
  PanoramaViewerEvents,
  StreetSmartApi,
  ViewerType,
} from "@cyclomedia/streetsmart-api";

export class StreetSmartManager {
  private static options: ApiOptions;

  private static _viewer: PanoramaViewer | null = null;
  private static get panoramaViewer(): PanoramaViewer | null {
    if (!this._viewer) {
      if (!StreetSmartApi.getApiReadyState()) {
        console.warn("StreetSmart API is not ready yet.");
        return null;
      }
      const viewer = StreetSmartApi.getViewers().find(
        (viewer) => viewer.getType() === ViewerType.PANORAMA,
      ) as PanoramaViewer | undefined;
      // Right before Cyclomedia tries to initialize
      this._viewer = viewer || null;
    }
    return this._viewer;
  }

  private static _isInitialized = false;
  static get isInitialized(): boolean {
    return this._isInitialized;
  }
  private static set isInitialized(value: boolean) {
    this._isInitialized = value;
  }
  private static _isOpen = false;
  static get isOpen(): boolean {
    return this._isOpen;
  }
  private static set isOpen(value: boolean) {
    this._isOpen = value;
  }

  static isInitializing = false;

  private constructor() {}

  static async initialize(options: ApiOptions): Promise<void> {
    // Patch for popout support.
    try {
      Object.defineProperty(Element, Symbol.hasInstance, {
        value(obj: { tagName?: string }) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-extra-non-null-assertion
          return obj && obj["tagName"]!!;
        },
      });
    } catch (e) {
      console.warn(
        (e as Error).message ||
          "Could not (re)patch Element for popout support.",
      );
    }

    // Initialize the StreetSmart API with the target element
    this.options = options;
    if (StreetSmartApi.getApiReadyState()) {
      console.warn(
        "Trying to initialize StreetSmart API, but it is already initialized.",
      );
      return;
    }
    try {
      this.isInitializing = true;
      await StreetSmartApi.init(this.options);
      console.log(this.options.targetElement);
      this.isInitialized = true;
      console.debug("StreetSmart API initialized successfully.");
    } catch (error) {
      console.error("Error initializing StreetSmart API:", error);
    } finally {
      this.isInitializing = false;
    }
  }

  static async open(coordinate: Coordinate): Promise<void> {
    if (!this.options || !this.isInitialized) {
      console.error("StreetSmart API is not initialized.");
      return;
    }

    if (this.isOpen) {
      console.warn(
        "StreetSmart API is already open. Close it first before opening again.",
      );
      return;
    }

    try {
      await StreetSmartApi.open(
        {
          coordinate,
        },
        {
          viewerType: [ViewerType.PANORAMA],
          srs: this.options.srs,
          panoramaViewer: {
            closable: true,
            maximizable: false,
            timeTravelVisible: true,
            recordingsVisible: true,
            navbarVisible: true,
            replace: true,
          },
          obliqueViewer: {
            closable: true,
            maximizable: false,
          },
        },
      );

      const viewer = this.panoramaViewer;
      if (!viewer) {
        console.warn("No PanoramaViewer found after opening StreetSmart API.");
        return;
      }

      viewer.on(PanoramaViewerEvents.PANORAMA_CREATED, (event) => {
        console.debug("Panorama created:", event);
      });

      StreetSmartApi.on(GlobalViewerEvents.VIEWER_REMOVED, this.close);
    } catch (error) {
      console.error("Error opening StreetSmart API:", error);
    }
  }

  static close = async (): Promise<void> => {
    if (!StreetSmartApi.getApiReadyState()) return;
    try {
      console.debug("Closing StreetSmart API...");
      StreetSmartApi.off(GlobalViewerEvents.VIEWER_REMOVED, this.close);
      await StreetSmartApi.destroy({
        targetElement: this.options.targetElement,
        loginOauth: false,
      });
      console.debug("StreetSmart API closed successfully.");
    } catch (error) {
      console.error("Error closing StreetSmart API:", error);
    } finally {
      this.isInitialized = false;
      this.isOpen = false;
    }
  };
}
