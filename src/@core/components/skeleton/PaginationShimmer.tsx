import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PaginationShimmer = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <div className="flex justify-between items-center px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <Skeleton height={35} width={80} borderRadius={8} />
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} height={35} width={35} borderRadius={8} />
          ))}
          <Skeleton height={35} width={80} borderRadius={8} />
        </div>

        <Skeleton height={20} width={120} borderRadius={6} />

        <Skeleton height={35} width={60} borderRadius={8} />
      </div>
    </SkeletonTheme>
  );
};

export default PaginationShimmer;
