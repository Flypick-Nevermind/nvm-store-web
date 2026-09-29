'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { DEFAULT_FALLBACK_REVIEWS, MOCK_REVIEWS } from '@/lib/api/mockReviews';
import type { CustomerReview, ProductVariant } from '@/types/api';

interface CustomerReviewsProps {
  productId: string;
  productName: string;
  variants?: ProductVariant[];
}

type StarFilter = 'all' | 'with-photos' | '5' | '4' | '3' | '2' | '1';
type SortOption = 'newest' | 'helpful' | 'highest' | 'lowest';

export function CustomerReviews({ productId, productName, variants = [] }: CustomerReviewsProps) {
  // Initial reviews from mock data or local storage
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    return MOCK_REVIEWS[productId] || DEFAULT_FALLBACK_REVIEWS;
  });

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`nvm_reviews_${productId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initial = MOCK_REVIEWS[productId] || DEFAULT_FALLBACK_REVIEWS;
          // Merge custom reviews on top of initial mock reviews
          const customIds = new Set(parsed.map((r: CustomerReview) => r.id));
          const merged = [...parsed, ...initial.filter((r) => !customIds.has(r.id))];
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setReviews(merged);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [productId]);

  // Helpful votes state (tracks which review ids the current session voted on)
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});

  // Filtering & Sorting
  const [activeFilter, setActiveFilter] = useState<StarFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('helpful');

  // Modal State for adding review
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalHoverRating, setModalHoverRating] = useState(0);
  const [modalName, setModalName] = useState('');
  const [modalVariant, setModalVariant] = useState(variants[0]?.name || 'Standard');
  const [modalTitle, setModalTitle] = useState('');
  const [modalComment, setModalComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Lightbox for review image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 5.0,
        total: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        percentages: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        withPhotosCount: 0,
        recommendPercent: 100,
      };
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let withPhotos = 0;
    let recommendCount = 0;

    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      sum += r.rating;
      if (r.images && r.images.length > 0) withPhotos += 1;
      if (r.rating >= 4) recommendCount += 1;
    });

    const average = +(sum / reviews.length).toFixed(1);
    const percentages: Record<number, number> = {
      5: Math.round((counts[5] / reviews.length) * 100),
      4: Math.round((counts[4] / reviews.length) * 100),
      3: Math.round((counts[3] / reviews.length) * 100),
      2: Math.round((counts[2] / reviews.length) * 100),
      1: Math.round((counts[1] / reviews.length) * 100),
    };

    const recommendPercent = Math.round((recommendCount / reviews.length) * 100);

    return {
      average,
      total: reviews.length,
      counts,
      percentages,
      withPhotosCount: withPhotos,
      recommendPercent,
    };
  }, [reviews]);

  // Filtered and Sorted Reviews
  const displayedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (activeFilter === 'with-photos') {
      result = result.filter((r) => r.images && r.images.length > 0);
    } else if (['5', '4', '3', '2', '1'].includes(activeFilter)) {
      const targetStar = parseInt(activeFilter, 10);
      result = result.filter((r) => r.rating === targetStar);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, activeFilter, sortBy]);

  const handleHelpfulClick = (reviewId: string) => {
    if (votedHelpful[reviewId]) return;

    setVotedHelpful((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalComment.trim()) return;

    const newReview: CustomerReview = {
      id: `rev-user-${Date.now()}`,
      productId,
      authorName: modalName.trim(),
      rating: modalRating,
      title: modalTitle.trim() || 'Ulasan Pembeli',
      comment: modalComment.trim(),
      variantName: modalVariant,
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      isVerifiedPurchase: true,
      helpfulCount: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    try {
      localStorage.setItem(`nvm_reviews_${productId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      setModalTitle('');
      setModalComment('');
    }, 1800);
  };

  const starLabels = [
    '',
    'Sangat Kecewa',
    'Kurang Puas',
    'Cukup Oke',
    'Bagus & Puas',
    'Sangat Suka! ✨',
  ];

  return (
    <section
      id="customer-reviews"
      className="mt-16 pt-10 border-t border-[#E8D5C0] flex flex-col gap-8 scroll-mt-28"
    >
      {/* ── Section Title ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#9E1A59] uppercase tracking-widest">
            Ulasan Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] tracking-tight">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs sm:text-sm text-[#777] mt-1">
            Ulasan nyata dari pembeli terverifikasi produk {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-all cursor-pointer shadow-sm hover:shadow self-start sm:self-auto shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Tulis Ulasan
        </button>
      </div>

      {/* ── Rating Scorecard & Distribution ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D5C0] shadow-2xs">
        {/* Left: Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[#E8D5C0]/80">
          <span className="text-5xl sm:text-6xl font-display font-black text-[#1A1A1A] leading-none mb-2">
            {stats.average}
          </span>
          <div className="flex items-center gap-1 text-[#F59E0B] text-lg mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>{star <= Math.round(stats.average) ? '★' : '☆'}</span>
            ))}
          </div>
          <p className="text-xs font-bold text-[#1A1A1A]">
            Berdasarkan {stats.total} ulasan pembeli
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1] text-[10px] font-extrabold uppercase">
            <span>✓</span> {stats.recommendPercent}% Pembeli Puas
          </div>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center gap-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star] || 0;
            const pct = stats.percentages[star] || 0;
            const isFilterActive = activeFilter === String(star);

            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setActiveFilter(isFilterActive ? 'all' : (String(star) as StarFilter))
                }
                className="w-full flex items-center gap-3 text-xs group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-14 flex items-center gap-1 font-bold text-[#1A1A1A] shrink-0">
                  <span>{star}</span>
                  <span className="text-[#F59E0B]">★</span>
                </div>

                <div className="flex-1 h-3 rounded-full bg-[#FFF8E1] border border-[#E8D5C0]/60 overflow-hidden p-0.5">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-500',
                      isFilterActive ? 'bg-[#9E1A59]' : 'bg-[#F59E0B]',
                    ].join(' ')}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-right text-[11px] text-[#888] font-medium shrink-0">
                  {count} ulasan
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filters & Sort Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8D5C0]/60">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={[
              'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border',
              activeFilter === 'all'
                ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-xs'
                : 'bg-white text-[#666] border-[#E8D5C0] hover:border-[#9E1A59]/40',
            ].join(' ')}
          >
            Semua ({stats.total})
          </button>

          {stats.withPhotosCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('with-photos')}
              className={[
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1',
                activeFilter === 'with-photos'
                  ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-xs'
                  : 'bg-white text-[#666] border-[#E8D5C0] hover:border-[#9E1A59]/40',
              ].join(' ')}
            >
              <span>📷</span>
              Dengan Foto ({stats.withPhotosCount})
            </button>
          )}

          {[5, 4, 3].map((star) => {
            const count = stats.counts[star] || 0;
            if (count === 0) return null;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setActiveFilter(String(star) as StarFilter)}
                className={[
                  'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border',
                  activeFilter === String(star)
                    ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-xs'
                    : 'bg-white text-[#666] border-[#E8D5C0] hover:border-[#9E1A59]/40',
                ].join(' ')}
              >
                {star} ★ ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-[#888] font-medium hidden sm:inline">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:border-[#9E1A59] focus:outline-none focus:border-[#9E1A59] transition-all cursor-pointer shadow-2xs appearance-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            <option value="helpful">Paling Membantu</option>
            <option value="newest">Terbaru</option>
            <option value="highest">Rating Tertinggi</option>
            <option value="lowest">Rating Terendah</option>
          </select>
        </div>
      </div>

      {/* ── Reviews List ──────────────────────────────────── */}
      {displayedReviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {displayedReviews.map((review) => {
            const hasVoted = votedHelpful[review.id];

            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D5C0] shadow-2xs flex flex-col gap-3"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9E1A59] to-[#C23070] text-white flex items-center justify-center text-xs font-black uppercase shrink-0 shadow-xs">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                          {review.authorName}
                        </h4>
                        {review.isVerifiedPurchase && <Badge variant="aqua">✓ Terverifikasi</Badge>}
                      </div>
                      <p className="text-[11px] text-[#888] mt-0.5">
                        {review.date}
                        {review.variantName && (
                          <>
                            {' · '}
                            <span className="text-[#9E1A59] font-medium">{review.variantName}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-[#F59E0B] text-sm shrink-0">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>

                {/* Review Title & Comment */}
                <div className="flex flex-col gap-1">
                  {review.title && (
                    <h5 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{review.title}</h5>
                  )}
                  <p className="text-xs sm:text-sm text-[#444] leading-relaxed">{review.comment}</p>
                </div>

                {/* Optional Customer Photos */}
                {review.images && review.images.length > 0 && (
                  <div className="flex items-center gap-2.5 pt-1 overflow-x-auto no-scrollbar">
                    {review.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#E8D5C0] group cursor-pointer shrink-0 hover:ring-2 hover:ring-[#9E1A59] transition-all"
                        aria-label={`Buka foto ulasan ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt="Foto ulasan pembeli"
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8D5C0]/50 mt-1">
                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(review.id)}
                    disabled={hasVoted}
                    className={[
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer',
                      hasVoted
                        ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1] cursor-default'
                        : 'bg-[#FFF8E1] text-[#666] border border-[#E8D5C0] hover:text-[#9E1A59] hover:bg-white',
                    ].join(' ')}
                  >
                    <span>👍</span>
                    <span>{hasVoted ? 'Terima Kasih!' : 'Membantu'}</span>
                    <span className="font-bold">({review.helpfulCount})</span>
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-white rounded-2xl border border-[#E8D5C0]">
          <span className="text-4xl" aria-hidden="true">
            💬
          </span>
          <p className="font-display font-bold text-base text-[#1A1A1A]">
            Belum ada ulasan untuk filter ini
          </p>
          <p className="text-xs text-[#888] max-w-xs">
            Coba pilih filter bintang yang lain atau jadilah yang pertama memberikan ulasan!
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="mt-2 px-4 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold hover:bg-[#7A1244] transition-colors cursor-pointer"
          >
            Lihat Semua Ulasan
          </button>
        </div>
      )}

      {/* ── Modal: Tulis Ulasan ───────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E8D5C0] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:bg-[#FFF8E1] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                ✕
              </button>

              <div className="flex flex-col gap-1 mb-6">
                <span className="text-[10px] font-black text-[#9E1A59] uppercase tracking-widest">
                  REVIEW PRODUK
                </span>
                <h3 className="text-xl font-display font-black text-[#1A1A1A]">
                  Tulis Ulasan Kamu
                </h3>
                <p className="text-xs text-[#888] truncate">{productName}</p>
              </div>

              {submittedSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <span className="text-5xl animate-bounce">🎉</span>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">Ulasan Berhasil Terkirim!</h4>
                  <p className="text-xs text-[#666]">
                    Terima kasih telah berbagi pengalamanmu bersama NEVERMIND.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Star Rating Picker */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0]/80 gap-2">
                    <span className="text-xs font-semibold text-[#888]">
                      Berapa bintang untuk produk ini?
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (modalHoverRating || modalRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setModalHoverRating(star)}
                            onMouseLeave={() => setModalHoverRating(0)}
                            onClick={() => setModalRating(star)}
                            className="text-3xl text-[#F59E0B] transition-transform hover:scale-115 cursor-pointer focus:outline-none"
                            aria-label={`Beri ${star} bintang`}
                          >
                            {isFilled ? '★' : '☆'}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[#9E1A59]">
                      {starLabels[modalHoverRating || modalRating]}
                    </span>
                  </div>

                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rev-author-name" className="text-xs font-bold text-[#1A1A1A]">
                      Nama Lengkap / Panggilan <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="rev-author-name"
                      type="text"
                      required
                      placeholder="Contoh: Jessica Tamara"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all"
                    />
                  </div>

                  {/* Variant Selection */}
                  {variants.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rev-variant" className="text-xs font-bold text-[#1A1A1A]">
                        Varian yang Dibeli
                      </label>
                      <select
                        id="rev-variant"
                        value={modalVariant}
                        onChange={(e) => setModalVariant(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] bg-white focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all cursor-pointer"
                      >
                        {variants.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Review Title */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rev-title" className="text-xs font-bold text-[#1A1A1A]">
                      Judul Ulasan
                    </label>
                    <input
                      id="rev-title"
                      type="text"
                      placeholder="Contoh: Tasnya cantik banget, packaging aman!"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rev-comment" className="text-xs font-bold text-[#1A1A1A]">
                      Isi Ulasan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="rev-comment"
                      required
                      rows={4}
                      placeholder="Ceritakan pengalamanmu: bahan tas, kerapihan jahitan, keakuratan foto, atau kecepatan pengiriman..."
                      value={modalComment}
                      onChange={(e) => setModalComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-all cursor-pointer shadow-md"
                  >
                    Kirim Ulasan Sekarang ✨
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Photo Lightbox ────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full aspect-square rounded-3xl overflow-hidden z-10"
            >
              <Image
                src={selectedImage}
                alt="Foto ulasan pembeli ukuran penuh"
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black transition-colors cursor-pointer"
                aria-label="Tutup foto"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
