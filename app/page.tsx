"use client";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import AnimatedCard from "@/components/AnimatedCard";
import ChatbotWidget from "@/components/ChatbotWidget";
import portfolio from "@/app/data/portfolio.json";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function Home() {
  const cards = portfolio.projects.map(p => ({
    title: p.name,
    description: p.summary,
    tags: p.stack,
    href: p.links.demo,
    code: p.links.code
  }));

  return (
    <>
      <Nav />
      <main id="home" className="container">
        <section className="py-16 text-center">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold">
            Hi, I’m <span className="text-accent">Irtefa</span> — I build data-driven products.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-3 text-muted max-w-2xl mx-auto">
            {portfolio.bio}
          </motion.p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a className="btn btn-primary" href="#projects">View Projects</a>
            <a className="btn btn-ghost" href="/resume.pdf" target="_blank">Résumé</a>
          </div>
        </section>

        <section id="projects" className="py-10">
          <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c, i) => (
              <motion.div key={i} variants={item}>
                <AnimatedCard {...c} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="skills" className="py-10">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {["SQL","Python","Tableau","Next.js","FAISS","LangGraph","n8n","R","PostgreSQL","Azure DevOps"].map(s => (
              <span key={s} className="pill">{s}</span>
            ))}
          </div>
        </section>

        <section id="about" className="py-10">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-muted max-w-3xl">
            I ship practical AI/analytics solutions, clean dashboards, and robust SQL. Previously at Radiant Data System and others.
          </p>
        </section>

        <section id="contact" className="py-10">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-muted">Email: <a href="mailto:your@email.com" className="underline">your@email.com</a></p>
        </section>
      </main>
      <footer className="border-t border-[#151a21] py-8 mt-10">
        <div className="container text-center text-muted text-sm">© {new Date().getFullYear()} Irtefa Waseek</div>
      </footer>
      <ChatbotWidget />
    </>
  );
}
