"use client";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

type ResearchEntry = {
  title: string;
  description: string;
  tags: string[];
  type: string;
  link?: string | null;
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function ResearchSection({ entries }: { entries: ResearchEntry[] }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {entries.map((entry, i) => (
        <motion.article key={i} variants={item} className="card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                <span className="pill text-accent border-accent/20 text-xs">{entry.type}</span>
              </div>
              <p className="text-muted mt-2 leading-relaxed">{entry.description}</p>
              <div className="flex gap-2 flex-wrap mt-3">
                {entry.tags.map((t, j) => (
                  <span key={j} className="pill text-xs">{t}</span>
                ))}
              </div>
              {entry.link && (
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-sm mt-4 inline-flex items-center gap-2"
                >
                  View Repository <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </motion.article>
      ))}

      <div className="card p-5 border-dashed border-[#21262d]">
        <p className="text-muted text-sm text-center">More publications coming soon...</p>
      </div>
    </motion.div>
  );
}
