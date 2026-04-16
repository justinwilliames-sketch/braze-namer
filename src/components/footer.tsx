const MAIN_SITE = "https://get.yourorbit.team";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-white/[0.06] py-6">
      <div className="max-w-[1080px] mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-600 font-semibold text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/orbit-icon-dark.png" alt="" width={16} height={16} className="dark:hidden opacity-40" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/orbit-icon-white.png" alt="" width={16} height={16} className="hidden dark:block opacity-40" />
          Orbit
        </div>
        <div className="flex gap-5 text-sm">
          <a
            href={`${MAIN_SITE}/donate`}
            className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Support
          </a>
          <a
            href="https://www.linkedin.com/in/justinwilliames"
            target="_blank"
            rel="noopener"
            className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Built by Justin Williames
          </a>
        </div>
      </div>
    </footer>
  );
}
