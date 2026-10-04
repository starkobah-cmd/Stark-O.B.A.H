import { Node } from "@tiptap/core";

export const FaqBlock = Node.create({ name: "faqBlock", group: "block", content: "block*" });
export const FaqItem = Node.create({ name: "faqItem", group: "block", content: "block*" });
export const FaqQuestion = Node.create({ name: "faqQuestion", group: "block", content: "inline*" });
export const FaqAnswer = Node.create({ name: "faqAnswer", group: "block", content: "block*" });
