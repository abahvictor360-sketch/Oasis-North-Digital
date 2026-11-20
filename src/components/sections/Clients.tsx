import Image from "next/image";
import type { Client } from "@/content/site";

export default function Clients({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;
  return (
    <section
      id="clients"
      aria-label="Teams we have delivered for"
      className="border-b border-border px-6 py-9 sm:px-10 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs leading-relaxed text-muted">
          Our team has delivered work for
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {clients.map((client) => (
            <li
              key={client.name}
              className="flex min-h-20 items-center justify-center rounded-xl border border-border bg-bg-card px-4 py-3"
            >
              {client.logo ? (
                <div className="relative h-12 w-32 rounded-md bg-white p-2">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="128px"
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <span className="text-center text-sm font-medium">
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
