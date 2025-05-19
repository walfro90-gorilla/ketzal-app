'use client'

import { createReview } from '@/app/(public)/reviews/reviews.api'
import { Carousel, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa"
import { useUser } from "@/context/UserContext";
import { nanoid } from 'nanoid';
import type { Review, User } from "@/types/review";
import type { Session } from "next-auth";

interface ReviewSectionProps {
  serviceId: string;
  reviewsService: Review[];
  users: User[];
  session: Session;
}

export default function ReviewSection({ serviceId, reviewsService, users, session }: ReviewSectionProps) {
  const [reviews, setReviews] = useState(reviewsService || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    setReviews(reviewsService || []);
  }, [serviceId, reviewsService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = session?.user?.id || user?.id || "";
    // const userName = session?.user?.name || "";
    // const userImage = session?.user?.image || undefined;
    const newReview = {
      userId,
      comment,
      rating,
      serviceId: Number(serviceId),
      id: nanoid(),
      createdAt: new Date(),
      title: 'Review', // Valor por defecto, puedes personalizarlo
      content: comment, // Usamos el comentario como contenido principal
    };
    setLoading(true);
    try {
      await createReview(newReview);  
      setReviews([
        ...reviews,
        newReview,
      ]);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Error creating review: ", err);
      setError("Error creating review. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#181818] text-[#bfc9d1] py-8">
      <h2 className="text-2xl font-semibold mb-2 text-white">Review</h2>
      <div className="mb-6 text-[#bfc9d1]">Average Review : <span className="text-white font-bold">{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0}</span></div>
      {/* Reviews */}
      <div>
        {reviews.length === 0 && <div className="text-[#bfc9d1]">No hay reseñas aún.</div>}
        <Carousel dots={true} autoplay className="space-y-4 mb-8">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#232323] border border-[#2c2c2c] rounded-xl p-6 flex flex-col items-center gap-6 mx-auto w-full md:w-3/4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#2c2c2c] flex items-center justify-center mb-2">
                  {users.find((user) => user.id === r.userId)?.image ? (
                    <img src={users.find((user) => user.id === r.userId)?.image} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl text-[#bfc9d1]">{users.find((user) => user.id === r.userId)?.name[0] || "?"}</span>
                  )}
                </div>
                <span className="text-white font-semibold text-base text-center">{users.find((user) => user.id === r.userId)?.name || "Unknown"}</span>
                <span className="text-xs text-[#bfc9d1]">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/ /g, '-')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <FaStar key={n} className={n <= r.rating ? "text-yellow-400" : "text-[#2c2c2c]"} size={18} />
                  ))}
                </div>
                <div className="text-[#bfc9d1] mb-4 text-sm md:text-base text-center">{r.comment}</div>
                <button className="text-xs text-[#bfc9d1] underline hover:text-white transition-all">REPORTAR</button>
              </div>
            </div>
          ))}
        </Carousel>
        {/* Formulario */}
        {session ? (
          <form onSubmit={handleSubmit} className="bg-[#181818] border border-[#232323] rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="flex flex-col items-center md:items-start w-full md:w-1/4">
              <div className="w-16 h-16 rounded-full bg-[#232323] flex items-center justify-center mb-2 mx-auto">
                {session.user?.image ? (
                  <img src={session.user?.image ? session.user.image : '/placeholder.svg'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#bfc9d1]">{session.user?.name?.[0] ?? "?"}</span>
                )}
              </div>
              <div className="w-16 h-16 flex items-center justify-center mb-2 mx-auto">

                <span className="text-white font-semibold text-sm">{session.user?.name ?? ""}</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <FaStar key={n} className={n <= rating ? "text-yellow-400" : "text-[#232323]"} onClick={() => setRating(n)} size={22} style={{ cursor: 'pointer' }} />
                ))}
              </div>



              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
                placeholder="Escribe tu comentario..."
                className="w-full bg-[#232323] border-none rounded-lg p-3 text-[#bfc9d1] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                rows={2}
              />

              <Popconfirm
                title="¿Estás seguro de que deseas enviar esta reseña?"
                onConfirm={(e) => handleSubmit(e as React.FormEvent)}
                okText="Sí"
                cancelText="No"
                disabled={!comment.trim()}
              >
                <button type="button" disabled={loading || !comment.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full mt-2 transition-all disabled:opacity-60">
                  {loading ? "Enviando..." : "Enviar review"}
                </button>
              </Popconfirm>
            </div>
          </form>
        ) : (
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => window.location.href = `/login?callbackUrl=/tours/${serviceId}`}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-2 rounded-full transition-all"
            >
              Login para agregar review
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

