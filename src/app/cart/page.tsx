'use client';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import useStore from '../store';

import CartShimmer from '@/@core/components/skeleton/CartShimmer';

const Cart = () => {
  const {
    cart,
    wishlist,
    getCartByUserId,
    addToCart,
    getWishlistByUserId,
    addToWishlist,
    decreaseProductQuantity,
    increaseProductQuantity,
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const hasFetchedData = useRef(false);

  useEffect(() => {
    try {
      if (!hasFetchedData.current) {
        hasFetchedData.current = true;
        const fetchData = async () => {
          await getCartByUserId();
          await getWishlistByUserId();
          setIsLoading(false);
        };
        fetchData();
      }
    } catch (err) {
      console.error('Error fetching cart data:', err);
      setError('Failed to fetch cart');
    }
  }, [getCartByUserId, getWishlistByUserId]);

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
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  if (isLoading) return <CartShimmer />;

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  if (cart.length === 0)
    return (
      <div className="p-4 bg-gray-100 text-black flex flex-col lg:flex-row">
        <div className="bg-white m-5 p-5 flex-1">
          <h2 className="text-2xl font-bold mb-4 text-center sm:text-left pb-4 border-b border-gray-300">
            Shopping Cart
          </h2>
          <div className="w-3xl">Your cart is Empty.</div>
        </div>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 text-black flex flex-col lg:flex-row">
      {/* Left Section - Cart Items */}
      <div className="bg-white m-5 p-5 flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left pb-4 border-b border-gray-300">
          Shopping Cart
        </h2>
        <ul className="space-y-4 border-b border-gray-300">
          {cart.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.product_id === product.product_id,
            );
            return (
              <div
                key={product.product_id}
                className="flex flex-col sm:flex-row items-center p-4"
              >
                {product.image_url && (
                  <Image
                    src={product.image_url || 'default-product.png'}
                    alt={product.product_name || 'Product image'}
                    className="w-60 h-auto object-cover bg-gray-100 p-5"
                    width={200}
                    height={200}
                  />
                )}
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                  <h2 className="text-2xl">{product.product_name}</h2>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-3xl mt-2">&#8377;{product.price}</p>
                  <p
                    className={`w-fit mt-2 mx-auto sm:mx-0 text-center text-sm 
                  ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {product.in_stock ? 'In stock' : 'Out of stock'}
                  </p>
                  <p className="text-gray-600 pt-2">{product.seller}</p>
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

                    {/* Delete Button */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() => handleAddToCart(product.product_id)}
                      >
                        Delete
                      </button>
                    </span>
                    <span className="hidden md:inline"> | </span>

                    {/* See More Like This */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() =>
                          router.push(`/products/${product.category_id}`)
                        }
                      >
                        See more like this
                      </button>
                    </span>
                    <span className="hidden md:inline"> | </span>

                    {/* Save for Later */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() => handleAddToWishlist(product.product_id)}
                      >
                        {isInWishlist
                          ? 'Remove from Wishlist'
                          : 'Save for later'}
                      </button>
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </ul>

        <div>
          <p className=" text-2xl pt-1 text-end">
            Subtotal ( {cart.length} items ):{' '}
            <span className="font-bold">
              &#8377;{totalPrice.toFixed(2)}
            </span>{' '}
          </p>
        </div>
      </div>

      {/* Right Section - Checkout */}
      <div className="bg-white p-5 my-5 sm:w-full w-full lg:w-1/3">
        <p className="text-2xl pt-1 text-center">
          Subtotal ( {cart.length} items ):{' '}
          <span className="font-bold">&#8377;{totalPrice.toFixed(2)}</span>{' '}
        </p>
        <button
          onClick={() => router.push(`/checkout`)}
          className="rounded-4xl w-full px-4 py-1 mt-3 bg-amber-300 hover:cursor-pointer"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

export default Cart;
