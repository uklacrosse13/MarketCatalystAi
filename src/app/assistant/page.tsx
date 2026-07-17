import ChatWindow from "@/components/assistant/ChatWindow";
import Disclaimer from "@/components/layout/Disclaimer";

export const metadata = { title: "Research Assistant — Market Catalyst AI" };

export default function AssistantPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">AI Research Assistant</h1>
        <p className="text-sm text-paper-500 mt-1">
          Ask how events, policy, or macro trends have historically rippled through markets.
        </p>
      </div>
      <ChatWindow />
      <Disclaimer compact />
    </div>
  );
}
