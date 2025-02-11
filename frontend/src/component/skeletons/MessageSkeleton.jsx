const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex items-start space-x-3 ${
            idx % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          {idx % 2 === 0 && (
            <div className="size-10 rounded-full bg-gray-300 animate-pulse" />
          )}

          <div className="flex flex-col space-y-2">
            <div className="h-4 w-20 bg-gray-300 rounded-md animate-pulse" />
            <div className="h-16 w-48 bg-gray-300 rounded-lg animate-pulse" />
          </div>

          {idx % 2 !== 0 && (
            <div className="size-10 rounded-full bg-gray-300 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
