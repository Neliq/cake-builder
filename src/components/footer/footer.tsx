import { Separator } from "@/components/ui/separator";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Strona główna",
    href: "#",
  },
  {
    title: "Koszyk",
    href: "#",
  },
  {
    title: "Torty naszych klientów",
    href: "#",
  },
  {
    title: "O nas",
    href: "#",
  },
  {
    title: "Kontakt",
    href: "#",
  },
  {
    title: "Cennik",
    href: "#",
  },
  {
    title: "Kreator tortu",
    href: "/kreator",
  },
  {
    title: "Regulamin",
    href: "#",
  },
  {
    title: "Polityka prywatności",
    href: "#",
  },
  {
    title: "FAQ",
    href: "#",
  },
];

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 flex flex-col justify-start items-center">
            {/* Logo */}
            <Image src="logo.svg" alt="Logo" width={64} height={64} />

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Cake Factory
              </Link>
              . Wszelkie prawa zastrzeżone.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <InstagramIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
