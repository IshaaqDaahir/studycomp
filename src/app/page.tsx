import NavBar from "@/app/navbar/page";
import HomePage from "@/app/home/page";

// Types Declaration
    type DashboardProps = {
        searchParams: {q?: string}; 
    };

export default function Dashboard({ searchParams }: DashboardProps) {
  return (
    <div>
        <div><NavBar /></div>
        <div><HomePage searchParams={searchParams}/></div>
    </div>
  );
}
