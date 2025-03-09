
import React from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "transparent" | "inline";
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  className = "",
  size = "md",
  variant = "default"
}) => {
  const { t } = useLanguage();
  const defaultMessage = t("general.loading") || "Loading...";
  
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  const variantMap = {
    default: "flex flex-col items-center justify-center p-4 space-y-3",
    transparent: "flex flex-col items-center justify-center p-4 space-y-3 bg-transparent",
    inline: "flex items-center space-x-2"
  };
  
  return (
    <div className={`${variantMap[variant]} ${className}`} role="status" aria-live="polite">
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]}`} />
      {message || defaultMessage ? (
        <p className="text-sm text-muted-foreground">
          {message || defaultMessage}
        </p>
      ) : null}
    </div>
  );
};

export default LoadingIndicator;
