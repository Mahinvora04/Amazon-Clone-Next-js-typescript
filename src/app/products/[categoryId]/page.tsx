'use client';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Filter from '../../../components/Filter';
import Loader from '../../../components/Loader';
import PaginationComponent from '../../../components/PaginationComponent';
import useStore from '../../store';

interface SelectedFilters {
  seller: string[];
  in_stock: number | null;
  price: string;
}

export default function Products() {
  const { categoryId } = useParams() as { categoryId: string };
  const {
    products,
    productsCount,
    categoryType,
    wishlist,
    cart,
    fetchProducts,
    getCategoryTypeById,
    addToCart,
    getCartByUserId,
    addToWishlist,
    getWishlistByUserId,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useStore();
  const [filterFields, setFilterFields] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [payload, setPayload] = useState({
    page: currentPage,
    limit: pageSize,
    filters: filterFields,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts(categoryId, payload);
      await getCategoryTypeById(categoryId);
      setIsLoading(false);
    };

    loadData();
  }, [categoryId, fetchProducts, getCategoryTypeById, payload]);

  useEffect(() => {
    getCartByUserId();
  }, [getCartByUserId]);

  // ** Pagination **
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPayload((prevPayload) => ({ ...prevPayload, page }));
    fetchProducts(categoryId, { ...payload, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setPayload((prevPayload) => ({ ...prevPayload, limit: size }));
    fetchProducts(categoryId, { ...payload, limit: size });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterFieldsChange = (data: SelectedFilters) => {
    setFilterFields(data);
    setCurrentPage(1);
    setPayload((prevPayload) => ({ ...prevPayload, page: 1, filters: data }));
    fetchProducts(categoryId, { ...payload, page: 1, filters: data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
    await getCartByUserId();
  };

  const handleAddToWishlist = async (productId: string) => {
    await addToWishlist(productId);
    await getWishlistByUserId();
  };

  const handleDecreaseQuantity = async (productId: string) => {
    await decreaseProductQuantity(productId);
    await getCartByUserId();
  };

  const handleIncreaseQuantity = async (productId: string) => {
    await increaseProductQuantity(productId);
    await getCartByUserId();
  };

  const totalPrice = cart.reduce(
    (acc: number, product) => acc + product.price * product.quantity,
    0,
  );

  if (isLoading) return <Loader />;

  return (
    <div className="flex mx-auto p-4 bg-white text-black">
      <div className="hidden lg:block w-full lg:w-1/4">
        <Filter handleFilterFieldsChange={handleFilterFieldsChange} />
      </div>
      <div>
        <h1 className="text-3xl font-bold m-5 mb-0 text-center sm:text-left">
          {categoryType && categoryType.category_type}
        </h1>

        {categoryType.category_image && (
          <Image
            src={categoryType.category_image || 'default-product.png'}
            alt={categoryType.category_type || 'category image'}
            className="w-2xl h-auto object-cover mr-4 p-5"
            width={300}
            height={200}
          />
        )}
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {products.map((product) => {
              const isInCart = cart.some(
                (item) => item.product_id === product.product_id,
              );
              const isInWishlist = wishlist.some(
                (item) => item.product_id === product.product_id,
              );
              return (
                <div
                  key={product.product_id}
                  className="flex flex-col sm:flex-row items-center p-4"
                >
                  <Image
                    src={product.image_url || 'default-product.png'}
                    alt={product.product_name}
                    className="w-60 h-auto object-cover bg-gray-100 p-5"
                    width={300}
                    height={200}
                  />
                  <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                    <h2 className="text-2xl">{product.product_name}</h2>
                    <p className="tex t-gray-600">{product.description}</p>
                    <p className="text-3xl mt-2">&#8377;{product.price}</p>
                    <p
                      className={`bg-gray-200 w-fit px-4 rounded-4xl mt-2 mx-auto sm:mx-0 text-center text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {product.in_stock ? 'In stock' : 'Out of stock'}
                    </p>
                    <p className="text-gray-600 pt-2">{product.seller}</p>

                    <button
                      onClick={() => handleAddToCart(product.product_id)}
                      className={`rounded-4xl px-4 py-1 mt-3 bg-amber-300 hover:cursor-pointer`}
                    >
                      {isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.product_id)}
                      className={`px-2 text-md mt-3 text-blue-800 hover:cursor-pointer`}
                    >
                      {isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PaginationComponent
          totalDataCount={productsCount}
          pageSize={pageSize}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </div>
      <div className="hidden lg:block w-full lg:w-1/7 border-l border-gray-300">
        <div className="text-center">
          <p className="text-sm">Subtotal</p>
          <p className="font-bold text-red-700"> &#8377;{totalPrice}</p>
          <Link
            href="/cart"
            className="border px-6 py-1 w-fit rounded-3xl text-sm"
          >
            Go to cart
          </Link>
        </div>
        <ul className=" border-b border-gray-300">
          {cart.map((product) => {
            return (
              <div
                key={product.product_id}
                className="flex flex-col items-center p-4"
              >
                <Image
                  src={product.image_url || 'default-product.png'}
                  alt={product.product_name}
                  className="w-25 h-auto object-cover"
                  width={300}
                  height={200}
                />

                <div className="flex flex-col mt-4 sm:mt-0 text-center">
                  <p className="text-xl mt-2 text-center">
                    &#8377;{product.price}
                  </p>
                  <p className="text-gray-600 pt-2 flex flex-col items-center justify-center text-center md:flex-row sm:justify-start sm:items-center space-x-3">
                    {/* Quantity Selector */}
                    <span className="inline-flex items-center space-x-3 rounded-4xl border-4 border-amber-300 px-2 py-1">
                      {product.quantity > 1 ? (
                        <button
                          className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                          onClick={() =>
                            handleDecreaseQuantity(product.product_id)
                          }
                        >
                          −
                        </button>
                      ) : (
                        <>
                          <button
                            className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                            onClick={() => handleAddToCart(product.product_id)}
                          >
                            {' '}
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {product.quantity}
                      </span>

                      <button
                        className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                        onClick={() =>
                          handleIncreaseQuantity(product.product_id)
                        }
                      >
                        +
                      </button>
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
