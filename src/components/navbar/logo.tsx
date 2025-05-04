import Link from "next/link";
import Image from "next/image";

export const Logo = () => (
  <Link
    href="/"
    className="flex gap-2 justify-center items-center text-lg font-semibold"
  >
    <Image src="logo.svg" alt="Logo" width={32} height={32} />
    Cake Factory
  </Link>
);
