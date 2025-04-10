import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CartShimmer = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <div className="flex flex-col lg:flex-row gap-4 bg-white">
        {/* Left Side - 70% Width */}
        <div className="w-full lg:w-[70%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 p-4 bg-white">
          <div className="p-6 bg-white border-b border-gray-300">
            <Skeleton height={30} />
          </div>

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 bg-white rounded border-b border-gray-300"
            >
              {/* Left Image Placeholder */}
              <div className="w-full sm:w-1/3 flex justify-center sm:justify-start">
                <Skeleton height={200} width={200} />
              </div>

              {/* Right Text Details */}
              <div className="w-full space-y-3 text-center sm:text-left">
                <Skeleton
                  height={24}
                  width={`60%`}
                  className="mx-auto sm:mx-0"
                />
                <Skeleton
                  height={20}
                  width={`80%`}
                  className="mx-auto sm:mx-0"
                />
                <Skeleton
                  height={20}
                  width={`40%`}
                  className="mx-auto sm:mx-0"
                />
                <Skeleton height={30} width={100} className="mx-auto sm:mx-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - 30% Width */}
        <div className="w-full lg:w-[30%] grid grid-cols-1 gap-6 p-4 bg-white">
          <div className="p-6 bg-white border-l border-gray-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Skeleton height={30} />
              <Skeleton height={30} />
            </div>
            <Skeleton height={30} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CartShimmer;
