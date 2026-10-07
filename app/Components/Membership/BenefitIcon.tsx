import {
  Calendar,
  Dumbbell,
  Health,
  House,
  Profile2user,
  Reserve,
  Star,
  Tennis,
} from "reicon-react";

import type { BenefitIcon as Name } from "./membership.data";

const MAP = {
  Calendar,
  Profile2user,
  Reserve,
  Star,
  House,
  Dumbbell,
  Health,
  Tennis,
} as const;

export default function BenefitIcon({
  name,
  size = 20,
}: {
  name: Name;
  size?: number;
}) {
  const Icon = MAP[name];

  return <Icon size={size} aria-hidden="true" />;
}
