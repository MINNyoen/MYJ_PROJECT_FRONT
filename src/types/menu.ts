import { ReactNode } from "react";

export interface MenuType {
  title?: string;
  icon?: ReactNode;
  href?: string;
  onclick?: void;
  links?: MenuType[];
}