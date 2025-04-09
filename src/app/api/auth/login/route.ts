import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const cookieStore = await cookies();

    const [userResults] = await db.query<RowDataPacket[]>(
      'SELECT user_id, email, password FROM users WHERE email = ?',
      [email],
    );

    if (!userResults || userResults.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const user = userResults[0];

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required and must be a string' },
        { status: 400 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const authToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    cookieStore.set('authToken', authToken);
    cookieStore.set('userId', user.user_id);

    return NextResponse.json({
      success: true,
      status: 200,
      message: 'Login successful!',
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
