import React from "react";

export function ScrollReveal({ children, className = "" }: any) {
  return <div className={`transition-all duration-500 ${className}`}>{children}</div>;
}

export function StaggerReveal({ children, className = "" }: any) {
  return <div className={`transition-all duration-500 ${className}`}>{children}</div>;
}

export function TextReveal({ children, className = "" }: any) {
  return <span className={`inline-block ${className}`}>{children}</span>;
}
