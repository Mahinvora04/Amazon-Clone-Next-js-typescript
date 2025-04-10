'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const FilterShimmer = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <div className="left-0 top-0 p-4 border-r border-gray-300">
        <ul className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <li key={i}>
              {/* Filter Label */}
              <Skeleton width={100} height={20} />

              {/* Filter Options */}
              <ul className="mt-2 space-y-2">
                {[...Array(3)].map((_, j) => (
                  <li key={j} className="flex items-center space-x-3">
                    <Skeleton width={16} height={16} />
                    <Skeleton width={120} height={14} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </SkeletonTheme>
  );
};

export default FilterShimmer;
