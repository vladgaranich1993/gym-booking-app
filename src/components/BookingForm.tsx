// src/components/BookingForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof bookingSchema>;

export default function BookingForm({ eventId }: { eventId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(bookingSchema) });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, ...data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Booking failed');
      reset();
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register('name')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Booking...' : 'Book Session'}
      </button>

      {isSubmitSuccessful && (
        <p className="text-green-600">Booking successful!</p>
      )}
    </form>
  );
}
