import { lazy, Suspense, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";

// Lazy load components to optimize performance
const Sidebar = lazy(() => import("../component/Sidebar"));
const NoChatSelected = lazy(() => import("../component/NoChatSelected"));
const ChatContainer = lazy(() => import("../component/ChatContainer"));

const HomePage = () => {
  const { selectedUser } = useChatStore();

  // Memoize selectedUser to prevent unnecessary re-renders
  const chatComponent = useMemo(() => {
    return selectedUser ? <ChatContainer /> : <NoChatSelected />;
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          {/* Use Suspense for lazy-loaded components */}
          <Suspense fallback={<div>Loading...</div>}>
            <Sidebar />
            {chatComponent}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
