/**
 * Toast — wrapper fino sobre sonner (já configurado no root layout).
 * Usa a mesma API customizada mas delega ao sonner para consistência.
 *
 * Uso:
 *   const { success, error, toast } = useToast();
 *   success("Memorial salvo!");
 *   error("Algo deu errado.");
 */

import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

function toast(message: string, type: ToastType = "info", duration = 4500) {
  switch (type) {
    case "success":
      sonnerToast.success(message, { duration });
      break;
    case "error":
      sonnerToast.error(message, { duration });
      break;
    case "warning":
      sonnerToast.warning(message, { duration });
      break;
    default:
      sonnerToast(message, { duration });
  }
}

export function useToast() {
  return {
    toast,
    success: (message: string, duration?: number) =>
      toast(message, "success", duration),
    error: (message: string, duration?: number) =>
      toast(message, "error", duration),
    info: (message: string, duration?: number) =>
      toast(message, "info", duration),
    warning: (message: string, duration?: number) =>
      toast(message, "warning", duration),
  };
}

// Re-export direto do sonner para uso avançado
export { sonnerToast as toastDirect };
