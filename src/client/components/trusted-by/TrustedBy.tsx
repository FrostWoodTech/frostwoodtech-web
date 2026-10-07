import { TRUSTED_BY } from "@/client/data/hero";

export default function TrustedBy() {
  return (
    <section className="border-y border-rule py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="max-w-47.5 text-xs leading-5 font-bold tracking-widest text-ink uppercase">
          A few of the good people we work with
        </p>

        <ul className="grid grid-cols-3 gap-x-9 gap-y-6 text-center text-[15px] font-bold tracking-[-0.04em] text-mark sm:grid-cols-6 sm:gap-x-12">
          {TRUSTED_BY.map((client) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
