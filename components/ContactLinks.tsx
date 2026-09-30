"use client";

import { type MouseEvent } from "react";
import { popStyle } from "@/components/popStyle";
import { site } from "@/data/site";

export function ContactLinks() {
  return (
    <div>
      <h2
        className="pop max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.03em] md:text-4xl"
        style={popStyle(3)}
      >
        Let&apos;s make something
        <br />
        great together.
      </h2>
      <p className="pop mt-8" style={popStyle(4)}>
        <a
          href={mailHref(site.email)}
          className="contact-mail inline-block max-w-full break-words text-2xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl"
          onClick={keepPlaceholder}
        >
          {site.email}
        </a>
      </p>
    </div>
  );
}

function mailHref(value: string) {
  return value.includes("@") ? `mailto:${value}` : "#placeholder";
}

function keepPlaceholder(event: MouseEvent<HTMLAnchorElement>) {
  if (event.currentTarget.getAttribute("href") === "#placeholder") {
    event.preventDefault();
  }
}
