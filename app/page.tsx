"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Nav from "@/components/Nav";
import CursorFire from "@/components/CursorFire";
import { Brain, Landmark, Plane } from "lucide-react";
import TabSection from "@/components/TabSection";
import ChatbotWidget from "@/components/ChatbotWidget";
import ProjectModal, { ProjectDetail } from "@/components/ProjectModal";
import portfolio from "@/app/data/portfolio.json";
import projectDetails from "@/app/data/projectDetails.json";


// Map project names to their detail IDs
const projectIdMap: Record<string, string> = {
  "Swiftor": "swiftor",
  "Pixiva": "pixiva",
  "Multi-Tool Research Bot": "research-bot",
  "AR License Plate Detection": "license-plate",
  "YouTube QA Bot": "youtube-bot",
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [activeExpIndex, setActiveExpIndex] = useState<number>(-1);
  const expItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExpMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseY = e.clientY;
    let closest = -1;
    let closestDist = Infinity;
    expItemRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const dist = Math.abs(mouseY - (rect.top + rect.height / 2));
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveExpIndex(closest);
  };

  const handleExpMouseLeave = () => setActiveExpIndex(-1);

  function openProjectModal(projectName: string) {
    const projectId = projectIdMap[projectName];
    if (projectId && projectDetails[projectId as keyof typeof projectDetails]) {
      setSelectedProject(projectDetails[projectId as keyof typeof projectDetails] as ProjectDetail);
    }
  }

  return (
    <>
      <CursorFire />
      <Nav />
      <main id="home" className="container">
        {/* Hero Section — Two Column with Photo */}
        <section className="py-10 md:py-12 flex flex-col-reverse md:flex-row items-start gap-10 md:gap-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center md:text-left md:pt-6"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Hi, I'm <span className="text-accent">Waseek</span>
              <br />
              <span className="text-muted text-2xl md:text-3xl font-semibold">
                AI Engineer
              </span>
            </h1>
            <p className="mt-4 text-muted max-w-xl text-lg leading-relaxed">
              {portfolio.bio}
            </p>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
              <a className="btn btn-primary text-lg px-6 py-3" href="#projects">
                View Projects
              </a>
              <a
                className="btn btn-ghost text-lg px-6 py-3"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </div>
          </motion.div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0"
          >
            <div className="w-64 md:w-80 lg:w-96 rounded-2xl overflow-hidden border-4 border-accent/30 shadow-[0_0_40px_rgba(125,211,252,0.15)]">
              <Image
                src="/profile.png"
                alt="Irtefa Waseek"
                width={384}
                height={512}
                className="w-full h-auto object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* About Me */}
        <section id="about" className="pb-6 -mt-16 md:-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-muted leading-relaxed max-w-3xl">
              {portfolio.about}
            </p>
          </motion.div>
        </section>

        {/* Experience — Timeline */}
        <section id="experience" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8">Experience</h2>
          </motion.div>
          <div
            className="relative"
            onMouseMove={handleExpMouseMove}
            onMouseLeave={handleExpMouseLeave}
          >
            {/* Center timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/20 -translate-x-1/2" />

            <div className="space-y-12">
              {portfolio.experience.map((exp, i) => {
                const isLeft = i % 2 === 0;
                const isActive = activeExpIndex === i;
                return (
                  <motion.div
                    key={i}
                    ref={(el) => { expItemRefs.current[i] = el as HTMLDivElement | null; }}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative flex items-start"
                  >
                    {/* Center dot */}
                    <motion.div
                      className="absolute left-1/2 top-3 w-4 h-4 rounded-full border-2 border-accent -translate-x-1/2 z-10 flex items-center justify-center"
                      initial={{ backgroundColor: "rgba(125,211,252,0.1)" }}
                      whileInView={{ backgroundColor: "rgba(125,211,252,0.3)", boxShadow: "0 0 12px rgba(125,211,252,0.4)" }}
                      viewport={{ once: false, amount: 0.8 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </motion.div>

                    {/* Left content */}
                    <div className={`w-[calc(50%-1.5rem)] ${isLeft ? "text-right pr-6" : ""}`}>
                      {isLeft && (
                        <div className="relative inline-block text-right">
                          <span className="text-xs text-accent font-medium">{exp.period}</span>
                          <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                          <p className="text-muted text-sm">{exp.company}</p>
                          {(exp as any).summary && (
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "opacity-100 max-h-60" : "opacity-0 max-h-0"}`}>
                              <ul className="mt-3 space-y-1 text-sm text-muted list-disc list-inside text-left">
                                {((exp as any).summary as string[]).map((point: string, j: number) => (
                                  <li key={j}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Spacer for center line */}
                    <div className="w-12 shrink-0" />

                    {/* Right content */}
                    <div className={`w-[calc(50%-1.5rem)] ${!isLeft ? "pl-6" : ""}`}>
                      {!isLeft && (
                        <div className="relative">
                          <span className="text-xs text-accent font-medium">{exp.period}</span>
                          <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                          <p className="text-muted text-sm">{exp.company}</p>
                          {(exp as any).summary && (
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "opacity-100 max-h-60" : "opacity-0 max-h-0"}`}>
                              <ul className="mt-3 space-y-1 text-sm text-muted list-disc list-inside">
                                {((exp as any).summary as string[]).map((point: string, j: number) => (
                                  <li key={j}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Multi-Tab Section */}
        <TabSection onProjectClick={openProjectModal} />

        {/* Skills Section */}
        <section id="skills" className="py-12">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#21262d]">
              <h3 className="text-sm font-medium text-accent mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.languages.map((s) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#21262d]">
              <h3 className="text-sm font-medium text-accent mb-3">AI / ML</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.ai_ml.map((s) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#21262d]">
              <h3 className="text-sm font-medium text-accent mb-3">Data</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.data.map((s) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#21262d]">
              <h3 className="text-sm font-medium text-accent mb-3">Web</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.web.map((s) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#21262d]">
              <h3 className="text-sm font-medium text-accent mb-3">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.tools.map((s) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hobbies Section */}
        <section id="hobbies" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8">Beyond Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Big card — left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="relative overflow-hidden rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-accent/30 transition-all duration-300 p-8 flex flex-col justify-between min-h-[260px]"
              >
                <span className="absolute -top-4 -right-2 text-[7rem] font-black text-white/[0.03] leading-none select-none pointer-events-none">
                  MIND
                </span>
                <Brain size={28} className="text-accent mb-6" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{portfolio.hobbies[0].name}</h3>
                  <p className="text-muted text-sm leading-relaxed">{portfolio.hobbies[0].description}</p>
                </div>
              </motion.div>

              {/* Right column — two stacked */}
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-accent/30 transition-all duration-300 p-6 flex flex-col justify-between flex-1"
                >
                  <span className="absolute -top-3 -right-1 text-[5rem] font-black text-white/[0.03] leading-none select-none pointer-events-none">
                    FUTURE
                  </span>
                  <Landmark size={22} className="text-accent mb-4" />
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{portfolio.hobbies[1].name}</h3>
                    <p className="text-muted text-sm leading-relaxed">{portfolio.hobbies[1].description}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-accent/30 transition-all duration-300 p-6 flex flex-col justify-between flex-1"
                >
                  <span className="absolute -top-3 -right-1 text-[5rem] font-black text-white/[0.03] leading-none select-none pointer-events-none">
                    GO
                  </span>
                  <Plane size={22} className="text-accent mb-4" />
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{portfolio.hobbies[2].name}</h3>
                    <p className="text-muted text-sm leading-relaxed">{portfolio.hobbies[2].description}</p>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:waseekirtefa@gmail.com"
              className="btn btn-ghost"
            >
              Email
            </a>
            <a
              href="https://github.com/Waseekk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/irtefa"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#151a21] py-8 mt-10">
        <div className="container text-center text-muted text-sm">
          &copy; {new Date().getFullYear()} Irtefa Waseek
        </div>
      </footer>
      <ChatbotWidget />

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
