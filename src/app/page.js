// File: src/app/page.jsx
import Link from "next/link";
import Image from "next/image";

// --- Redesigned Feature Card Component ---
function FeatureCard({ icon, title, children }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="flex-shrink-0 mb-5 text-sky-500">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-500">{children}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-800 font-sans antialiased">
      <nav className="sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            BrainLoop
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-600 font-medium hover:text-sky-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login?view=register"
              className="px-5 py-2 bg-sky-500 text-white rounded-full font-semibold hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20 hover:shadow-sky-500/40"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* --- UPDATED HERO SECTION --- */}
      <main className="relative text-center container mx-auto px-6 pt-24 pb-32 md:pt-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[80vw] h-[50vh] bg-gradient-to-r from-sky-200/50 to-cyan-200/50 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-500">
            Stop Cramming. Start Mastering.
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            BrainLoop&apos;s Spaced Repetition System turns your study efforts
            into lasting knowledge. Enter &apos;The Loop&apos; for smart, daily
            revision sessions tailored just for you.
          </p>
          <Link
            href="/login"
            className="mt-10 inline-block px-8 py-4 bg-sky-500 text-white text-lg font-bold rounded-full hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50"
          >
            Launch Your Dashboard
          </Link>
        </div>
      </main>

      {/* --- UPDATED FEATURES SECTION --- */}
      <section className="relative bg-slate-50 border-y border-slate-200 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              A Smarter Way to Study
            </h2>
            <p className="text-slate-500 mt-2">
              Core features designed for deep, lasting comprehension.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              }
              title="Track Everything"
            >
              From problem statements and examples to your personal notes and
              tags, BrainLoop provides a structured home for every detail. Keep
              your learning organized and accessible.
            </FeatureCard>
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                  <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
                </svg>
              }
              title="Enter The Loop"
            >
              Click &apos;Start Loop&apos; to enter a focused study session. Our
              system intelligently selects problems that are due for revision,
              creating your personalized daily quest to conquer concepts.
            </FeatureCard>
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
                </svg>
              }
              title="Learn for the Long-Term"
            >
              Our Spaced Repetition engine schedules reviews at the perfect
              moment to move knowledge into your long-term memory. Track your
              progress with detailed revision history and watch your skills
              grow.
            </FeatureCard>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50">
        <div className="container mx-auto px-6 py-12 text-center text-slate-500 border-t border-slate-200">
          <p>
            &copy; {new Date().getFullYear()} BrainLoop by MidayTech. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
