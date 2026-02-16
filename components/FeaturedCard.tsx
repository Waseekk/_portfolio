"use client";
import { motion } from "framer-motion";
import { ExternalLink, Github, Lock } from "lucide-react";

type Props = {
  title: string;
  description: string;
  tags?: string[];
  href?: string | null;
  code?: string | null;
  note?: string;
  buttonText?: string;
  onCardClick?: () => void;
};

export default function FeaturedCard({ title, description, tags = [], href, code, note, buttonText = "Live Demo", onCardClick }: Props) {
  function handleClick() {
    if (onCardClick) {
      onCardClick();
    } else {
      window.dispatchEvent(new CustomEvent("chat:suggest", { detail: { project: title } }));
    }
  }

  return (
    <motion.article
      onClick={handleClick}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(125, 211, 252, 0.25)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="card cursor-pointer p-6 border-2 border-accent/20 hover:border-accent/40 transition-colors"
      title="Click to view project details"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {note && (
          <span className="flex items-center gap-1 text-xs text-muted bg-[#1a1f26] px-2 py-1 rounded">
            <Lock className="w-3 h-3" />
            {note}
          </span>
        )}
      </div>
      <p className="text-muted mb-4 leading-relaxed">{description}</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {tags.map((t, i) => (
          <span key={i} className="pill bg-accent/10 text-accent border border-accent/20">
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-3 mt-auto pt-2">
        {href && (
          <a
            className="btn btn-primary flex items-center gap-2"
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {buttonText} <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {code && (
          <a
            className="btn btn-ghost flex items-center gap-2"
            href={code}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-4 h-4" /> Code
          </a>
        )}
        {!href && !code && note && (
          <span className="text-sm text-muted italic">Code not publicly available</span>
        )}
      </div>
    </motion.article>
  );
}
