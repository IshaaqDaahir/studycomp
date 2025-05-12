import NavBar from "@/app/navbar/page";
import HomePage from "@/app/home/page";

export default function Dashboard() {
  return (
    <div>
        <div><NavBar /></div>
        <div><HomePage searchParams={{}}/></div>
    </div>
  );
}
