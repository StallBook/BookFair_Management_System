import { notification } from "antd";
import type { ArgsProps } from "antd/es/notification";

type NotificationType = "success" | "error" | "info" | "warning";

export const showNotification: Record<
  NotificationType,
  (title: string, description?: string, config?: Partial<ArgsProps>) => void
> = {
  success: (title, description, config) =>
    notification.success({
      message: title,
      description,
      ...config,
    }),
  error: (title, description, config) =>
    notification.error({
      message: title,
      description,
      ...config,
    }),
  info: (title, description, config) =>
    notification.info({
      message: title,
      description,
      ...config,
    }),
  warning: (title, description, config) =>
    notification.warning({
      message: title,
      description,
      ...config,
    }),
};
