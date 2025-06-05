import { FAQ } from "./FAQ";

export type FaqItem = {
  active: number | null;
  handleToggle: (index: number) => void;
  faq: FAQ;
};
