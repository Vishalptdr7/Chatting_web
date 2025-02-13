import { THEMES } from "../constant";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false, time: "12:00 PM" },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
    time: "12:02 PM",
  },
];

const ThemeButton = ({ theme, selectedTheme, onClick }) => (
  <button
    key={theme}
    className={`
      group flex flex-col items-center gap-2 p-3 rounded-lg transition-all
      ${
        selectedTheme === theme
          ? "bg-primary text-primary-content scale-105 shadow-md"
          : "hover:bg-base-200/50"
      }
    `}
    onClick={() => onClick(theme)}
    aria-label={`Select ${theme} theme`}
  >
    <div
      className="relative h-10 w-full rounded-md overflow-hidden shadow-sm"
      data-theme={theme}
    >
      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
        <div className="rounded bg-primary"></div>
        <div className="rounded bg-secondary"></div>
        <div className="rounded bg-accent"></div>
        <div className="rounded bg-neutral"></div>
      </div>
    </div>
    <span className="text-xs font-medium truncate w-full text-center">
      {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </span>
  </button>
);

const ChatPreview = ({ messages }) => (
  <div className="rounded-xl border border-base-300 bg-base-100 shadow-lg overflow-hidden">
    <div className="p-4 bg-base-200">
      <div className="max-w-lg mx-auto">
        <div className="bg-base-100 rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
              J
            </div>
            <div>
              <h3 className="font-semibold text-sm">John Doe</h3>
              <p className="text-xs text-base-content/70">Online</p>
            </div>
          </div>

          <div className="p-4 space-y-4 min-h-[220px] max-h-[220px] overflow-y-auto bg-base-100 custom-scrollbar">
            {messages.map(({ id, content, isSent, time }) => (
              <div
                key={id}
                className={`flex ${isSent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl p-3 shadow-md ${
                    isSent ? "bg-primary text-primary-content" : "bg-base-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{content}</p>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      isSent
                        ? "text-primary-content/70"
                        : "text-base-content/70"
                    }`}
                  >
                    {time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-base-300 bg-base-100 flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1 text-sm h-11 rounded-lg shadow-sm"
              placeholder="Type a message..."
              value="This is a preview"
              readOnly
            />
            <button className="btn btn-primary h-11 min-h-0 shadow-md">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-6 pt-20 max-w-4xl">
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {THEMES.map((t) => (
            <ThemeButton
              key={t}
              theme={t}
              selectedTheme={theme}
              onClick={setTheme}
            />
          ))}
        </div>

        <h3 className="text-xl font-bold mb-3">Preview</h3>
        <ChatPreview messages={PREVIEW_MESSAGES} />
      </div>
    </div>
  );
};

export default SettingPage;
