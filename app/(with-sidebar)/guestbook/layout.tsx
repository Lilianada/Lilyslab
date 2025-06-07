import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Sign my guestbook and leave a message for me and future visitors.",
};

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
