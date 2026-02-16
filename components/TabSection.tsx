"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedCard from "@/components/FeaturedCard";
import AnimatedCard from "@/components/AnimatedCard";
import EducationTimeline from "@/components/EducationTimeline";
import ResearchSection from "@/components/ResearchSection";
import portfolio from "@/app/data/portfolio.json";

const tabs = ["Education", "Featured Projects", "Research"] as const;
type Tab = (typeof tabs)[number];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } };

type Props = {
  onProjectClick: (name: string) => void;
};

export default function TabSection({ onProjectClick }: Props) {
  const [active, setActive] = useState<Tab>("Education");
  const featuredCards = portfolio.featured.map((p) => ({
    title: p.name,
    description: p.summary,
    tags: p.stack,
    href: p.links.demo,
    code: p.links.code,
    note: (p as any).note,
    buttonText: (p as any).buttonText,
  }));

  const otherCards = portfolio.projects.map((p) => ({
    title: p.name,
    description: p.summary,
    tags: p.stack,
    href: p.links.demo,
    code: p.links.code,
  }));

  return (
    <section id="projects" className="py-12">
      {/* Tab Bar */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-[#161c23]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
              active === tab ? "text-accent" : "text-muted hover:text-text"
            }`}
          >
            {tab}
            {active === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {active === "Education" && (
            <EducationTimeline entries={portfolio.education} />
          )}

          {active === "Featured Projects" && (
            <div>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {featuredCards.map((c, i) => (
                  <motion.div key={i} variants={item}>
                    <FeaturedCard
                      {...c}
                      onCardClick={() => onProjectClick(c.title)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <h3 className="text-lg font-semibold mt-10 mb-6">Other Projects</h3>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {otherCards.map((c, i) => (
                  <motion.div key={i} variants={item}>
                    <AnimatedCard {...c} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {active === "Research" && (
            <ResearchSection entries={portfolio.research} />
          )}

        </motion.div>
      </AnimatePresence>
    </section>
  );
}
