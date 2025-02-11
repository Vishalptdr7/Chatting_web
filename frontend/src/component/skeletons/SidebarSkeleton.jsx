import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-300 bg-white flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-gray-300 w-full p-5 bg-gray-50">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gray-500" />
          <span className="font-medium text-gray-600 hidden lg:block">
            Contacts
          </span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-4 space-y-4">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 px-4">
            {/* Avatar skeleton */}
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:flex flex-col space-y-2 w-40">
              <div className="h-4 w-3/4 bg-gray-300 rounded-md animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-300 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
