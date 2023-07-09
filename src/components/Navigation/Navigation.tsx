import { BiHomeAlt2 } from "react-icons/bi";
import Link from "next/link";

export default function Navigation() {
  return (
    <div className="p-4">
      <Link href="/">
        <BiHomeAlt2 className={"w-6 h-6 text-slate-800"} />
      </Link>
    </div>
  );
}
