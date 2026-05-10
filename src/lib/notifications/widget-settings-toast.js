import { toast } from "sonner";

const resolveErrorMessage = (error, fallbackMessage) => {
  if (!error) return fallbackMessage;
  if (typeof error === "string") return error;
  return error.message || fallbackMessage;
};

export const createWidgetSettingsNotifier = (label) => {
  const entityLabel = label || "Settings";

  return {
    defaultLoaded() {
      toast.success(`Using default ${entityLabel.toLowerCase()}`);
    },
    loadSuccess() {
      toast.success(`${entityLabel} loaded`);
    },
    loadError(error) {
      toast.error(resolveErrorMessage(error, `Failed to load ${entityLabel.toLowerCase()}`));
    },
    saveLoading() {
      return toast.loading(`Saving ${entityLabel.toLowerCase()}...`);
    },
    saveSuccess(id) {
      toast.success(`${entityLabel} saved`, { id });
    },
    saveError(error, id) {
      toast.error(resolveErrorMessage(error, `Failed to save ${entityLabel.toLowerCase()}`), { id });
    },
    resetSuccess() {
      toast.success(`${entityLabel} reset`);
    },
    copySuccess(message = "Copied to clipboard!") {
      toast.success(message);
    },
    copyError(error, fallbackMessage = "Failed to copy") {
      toast.error(resolveErrorMessage(error, fallbackMessage));
    },
    error(message) {
      toast.error(message);
    },
    success(message) {
      toast.success(message);
    },
  };
};
