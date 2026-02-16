"use client";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

type EducationEntry = {
  degree: string;
  institution: string;
  year: string;
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1 } };

export default function EducationTimeline({ entries }: { entries: EducationEntry[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative pl-8 space-y-8"
    >
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-accent/20" />

      {entries.map((entry, i) => (
        <motion.div key={i} variants={item} className="relative">
          {/* Dot */}
          <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-accent" />
          </div>
          <div className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{entry.degree}</h3>
                <p className="text-muted text-sm mt-1">{entry.institution}</p>
              </div>
              <span className="text-accent text-sm font-medium whitespace-nowrap">{entry.year}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
