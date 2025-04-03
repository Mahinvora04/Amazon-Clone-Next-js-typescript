'use client';

import Image from 'next/image';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {/* <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div> */}

      <Image
        src="/icon/loading-4x._V391853216_.gif"
        alt="loading"
        width={200}
        height={300}
      />
    </div>
  );
};

export default Loader;
