import EquityChart from "./EquityChart";
import SentimentPanel from "@/app/SentimentPanel";
import App from "../pages/_app";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-2 gap-8">
          <App />
        </div>
      </main>
    </div>
  );
}
