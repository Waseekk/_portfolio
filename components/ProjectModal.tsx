"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, LogIn, Zap, Clock, Users, TrendingUp } from "lucide-react";
import Image from "next/image";

export type ProjectDetail = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image?: string;
  stack: string[];
  links: {
    demo?: string | null;
    code?: string | null;
  };
  buttonText?: string;
  note?: string;
  metrics?: {
    label: string;
    value: string;
    icon: "zap" | "clock" | "users" | "trending";
  }[];
  features?: string[];
  challenge?: string;
  solution?: string;
};

type Props = {
  project: ProjectDetail | null;
  onClose: () => void;
};

const iconMap = {
  zap: Zap,
  clock: Clock,
  users: Users,
  trending: TrendingUp,
};

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null;

  const projectName = project.name;

  function handleChatClick() {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("chat:suggest", { detail: { project: projectName } }));
    }, 300);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d1117] rounded-xl border border-[#21262d] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#21262d] hover:bg-[#30363d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image section */}
          {project.image && (
            <div className="relative w-full rounded-t-xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.name}
                width={1000}
                height={800}
                className="w-full h-auto object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {project.name}
              </h2>
              <p className="text-accent text-lg">{project.tagline}</p>
            </div>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {project.metrics.map((metric, i) => {
                  const Icon = iconMap[metric.icon];
                  return (
                    <div
                      key={i}
                      className="bg-[#161b22] rounded-lg p-4 border border-[#21262d]"
                    >
                      <Icon className="w-5 h-5 text-accent mb-2" />
                      <div className="text-xl font-bold text-white">{metric.value}</div>
                      <div className="text-sm text-muted">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <p className="text-muted leading-relaxed">{project.description}</p>
            </div>

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {project.challenge && (
                  <div className="bg-[#161b22] rounded-lg p-4 border border-[#21262d]">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">The Challenge</h4>
                    <p className="text-sm text-muted">{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-[#161b22] rounded-lg p-4 border border-[#21262d]">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">The Solution</h4>
                    <p className="text-sm text-muted">{project.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">Key Features</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-accent mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <span
                    key={i}
                    className="pill bg-accent/10 text-accent border border-accent/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#21262d]">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {project.buttonText || "Live Demo"}
                </a>
              )}
              {project.links.code && (
                <a
                  href={project.links.code}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
              <button
                onClick={handleChatClick}
                className="btn btn-ghost flex items-center gap-2"
              >
                Ask Me About This Project
              </button>
              {!project.links.demo && !project.links.code && project.note && (
                <span className="text-sm text-muted italic flex items-center gap-2">
                  {project.note}
                </span>
              )}
            </div>

            {/* Login invitation for Swiftor */}
            {project.id === "swiftor" && (
              <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-lg border border-accent/20">
                <p className="text-sm text-muted">
                  <span className="text-white font-medium">Want to try it out?</span>{" "}
                  Log in to explore the full dashboard, process articles, and see the AI in action.
                </p>
                <a
                  href="https://swiftor.online"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-accent hover:underline text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login to Swiftor
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
