import { JSX } from "react";

export const renderError = (
  errorMessage?: string,
  className: string = ""
): JSX.Element | null => {
  if (!errorMessage) return null;

  return (
    <p className={`text-red-600 text-sm mt-1 ${className}`}>
      {errorMessage}
    </p>
  );
};
