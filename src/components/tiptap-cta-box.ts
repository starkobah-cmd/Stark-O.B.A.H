import { Node } from "@tiptap/core";

export const CtaBoxNode = Node.create({ name: "ctaBox", group: "block", content: "block*" });
export interface CtaBoxAttributes {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  badge?: string;
  description?: string;
  footerNote?: string;
  theme?: string;
  layout?: string;
}
export function setGlobalOnEditCta(_: any) {}
