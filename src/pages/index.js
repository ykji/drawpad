import Board from "@/components/Board";
import Menu from "@/components/Menu";
import Toolbox from "@/components/Toolbox";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold m-5 absolute">Drawpad.</h1>
      <Menu />
      <Toolbox />
      <Board />
    </>
  );
}
