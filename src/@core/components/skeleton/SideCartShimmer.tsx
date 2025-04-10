import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SideCartShimmer = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <div className="grid grid-cols-1 gap-4 bg-white">
        <div className="px-4 bg-white items-center sm:items-start">
          <Skeleton height={20} />
          <Skeleton height={20} />
          <Skeleton height={20} borderRadius={20} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 bg-white rounded">
            <Skeleton height={200} />
            <Skeleton height={20} style={{ marginTop: 10 }} />
            <Skeleton height={30} borderRadius={20} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default SideCartShimmer;
