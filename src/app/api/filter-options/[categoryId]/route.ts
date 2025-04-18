import { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(
  req: Request,
  context: { params: { categoryId: string } },
) {
  const { categoryId } = await context.params;

  try {
    const data = [
      { value: 'price', label: 'Price' },
      { value: 'seller', label: 'Seller' },
      { value: 'in_stock', label: 'Availability' },
    ];

    const stockFilterValues = ['In stock', 'Out of stock'];

    const [sellerFilterValues] = await db.query<RowDataPacket[]>(
      'SELECT DISTINCT seller FROM products WHERE category_id = ?',
      [categoryId],
    );

    const sellerArray = sellerFilterValues.map((item) => item.seller);

    return NextResponse.json({
      success: true,
      status: 200,
      data,
      sellerArray,
      stockFilterValues,
    });
  } catch (err) {
    console.error('Error fetching filter options:', err);
    return NextResponse.json({
      success: false,
      status: 500,
      error: 'Internal Server Error',
    });
  }
}
