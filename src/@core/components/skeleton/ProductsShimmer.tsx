import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import PaginationShimmer from './PaginationShimmer';

const ProductsShimmer = () => {
  return (
    <>
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <div className="grid w-full grid-cols-1 gap-6 p-4 bg-white">
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
                <Skeleton
                  height={30}
                  width={100}
                  className="mx-auto sm:mx-0"
                  borderRadius={20}
                />
              </div>
            </div>
          ))}
          <PaginationShimmer />
        </div>
      </SkeletonTheme>
    </>
  );
};

export default ProductsShimmer;
