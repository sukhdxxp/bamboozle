import { ImBook, ImHammer2 } from "react-icons/im";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import { BiMoviePlay } from "react-icons/bi";
import { LuRotate3D } from "react-icons/lu";
import {
  GiScrollQuill,
  GiNothingToSay,
  GiTv,
  GiLightBulb,
} from "react-icons/gi";
import {
  BsFillCloudLightningRainFill,
  BsChatSquareQuoteFill,
  BsEmojiWinkFill,
} from "react-icons/bs";
import { TbDog } from "react-icons/tb";

export default function DeckIcon({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  switch (id) {
    case "5c31acda71d37ab784ca76b9":
      return <ImBook className={className} />;
    case "5c31acda71d37ab784ca76ba":
      return <BiMoviePlay className={className} />;
    case "5c31acda71d37ab784ca76bb":
      return <GiLightBulb className={className} />;
    case "5c31acda71d37ab784ca76bc":
      return <LuRotate3D className={className} />;
    case "5c31acda71d37ab784ca76bd":
      return <GiTv className={className} />;
    case "5c31acda71d37ab784ca76be":
      return <GiScrollQuill className={className} />;
    case "5c31acda71d37ab784ca76bf":
      return <BsFillCloudLightningRainFill className={className} />;
    case "5c31acda71d37ab784ca76c0":
      return <GiNothingToSay className={className} />;
    case "5c31acda71d37ab784ca76c1":
      return <BsChatSquareQuoteFill className={className} />;
    case "5c31acda71d37ab784ca76c2":
      return <ImHammer2 className={className} />;
    case "5c31acda71d37ab784ca76c3":
      return <BsEmojiWinkFill className={className} />;
    case "5c31acda71d37ab784ca76c4":
      return <TbDog className={className} />;

    default:
      return <VscWorkspaceUnknown className={className} />;
  }
}
