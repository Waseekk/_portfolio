"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type Props = {
  title: string;
  description: string;
  tags?: string[];
  href?: string;   // demo
  code?: string;   // GitHub
};

export default function AnimatedCard({ title, description, tags = [], href, code }: Props) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("chat:suggest", { detail: { project: title } }));
  }

  return (
    <motion.article
      onClick={handleClick}
      initial={{ y: 10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: "0 12px 35px rgba(125, 211, 252, 0.20)" }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="card cursor-pointer"
      title="Click to chat about this project"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted mt-1 mb-3">{description}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((t, i) => <span key={i} className="pill">{t}</span>)}
      </div>
      <div className="mt-4 flex gap-3">
        {href && <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">Live <ExternalLink className="w-4 h-4" /></a>}
        {code && <a className="btn btn-ghost" href={code} target="_blank" rel="noreferrer">Code</a>}
      </div>
    </motion.article>
  );
}
