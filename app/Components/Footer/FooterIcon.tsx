import { Call, Instagram, Location, Sms } from "reicon-react";

interface FooterIconProps {
  name:
    | "location"
    | "phone"
    | "mail"
    | "facebook"
    | "instagram"
    | "tiktok";

  size?: number;

  className?: string;
}

export default function FooterIcon({
  name,
  size = 18,
  className = "",
}: FooterIconProps) {
  const common = {
    size,
    className,
    "aria-hidden": true as const,
  };

  if (name === "location") return <Location {...common} />;
  if (name === "phone") return <Call {...common} />;
  if (name === "mail") return <Sms {...common} />;
  if (name === "instagram") return <Instagram {...common} />;

  // reicon no incluye logotipos de marca salvo Instagram.
  const brand = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "currentColor",
    "aria-hidden": true,
    focusable: "false" as const,
    className,
  };

  if (name === "tiktok") {
    return (
      <svg {...brand}>
        <path d="M16.6 3.5h-2.75v11.2a2.3 2.3 0 1 1-1.9-2.26V9.6a5.1 5.1 0 1 0 4.65 5.08V9.1a6.3 6.3 0 0 0 3.6 1.13V7.48a3.6 3.6 0 0 1-3.6-3.98Z" />
      </svg>
    );
  }

  return (
    <svg {...brand}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8Z" />
    </svg>
  );
}
