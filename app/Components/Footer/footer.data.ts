export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Explora",
    links: [
      { label: "Inicio", href: "/" },
      {
        label: "Experiencias exclusivas",
        href: "/experiencias/exclusivas",
      },
      {
        label: "Experiencias familiares",
        href: "/experiencias/familiares",
      },
      {
        label: "Niveles de membresía",
        href: "/membresias/niveles",
      },
      {
        label: "Beneficios para propietarios",
        href: "/membresias/beneficios-propietarios",
      },
    ],
  },
  // {
  //   title: "Reuniones y eventos",
  //   links: [
  //     {
  //       label: "Eventos corporativos",
  //       href: "/eventos/corporativos",
  //     },
  //     {
  //       label: "Eventos sociales",
  //       href: "/eventos/sociales",
  //     },
  //   ],
  // },
];

export interface ContactItem {
  icon: "location" | "phone" | "mail";
  lines: string[];
  href?: string;
  external?: boolean;
}

// Formato de la API: el enlace copiado del navegador lleva parametros que caducan.
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=-11.1523611,-75.3918805";

export const WHATSAPP_URL =
  "https://wa.me/51971069763?text=Hola%20Zagari%20Resort%20Club%2C%20quisiera%20recibir%20m%C3%A1s%20informaci%C3%B3n.";

export const FOOTER_CONTACT: ContactItem[] = [
  {
    icon: "phone",
    lines: ["971 069 763", "Escríbenos por WhatsApp"],
    href: WHATSAPP_URL,
    external: true,
  },
  {
    icon: "location",
    lines: ["Ver ubicación en Google Maps", "-11.152361, -75.391881"],
    href: MAPS_URL,
    external: true,
  },
];

export interface SocialLink {
  name: string;
  href: string;
  icon: "facebook" | "instagram" | "tiktok";
}

export const FOOTER_SOCIAL: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/zagariresortclub/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/zagariresortclub",
    icon: "facebook",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@zagariresortclub",
    icon: "tiktok",
  },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Cookies", href: "/cookies" },
];
