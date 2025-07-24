"use client";
import { useEffect, useState } from "react";
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import PopularCategories from '@/components/PopularCategories';
import PopularDestinations from '@/components/PopularDestinations';
import SpecialOffers from '@/components/SpecialOffers';
import Testimonials from '@/components/Testimonials';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [servicesRes, categoriesRes, reviewsRes, usersRes] = await Promise.all([
        fetch("/api/services").then(res => res.json()),
        fetch("/api/categories").then(res => res.json()),
        fetch("/api/reviews").then(res => res.json()),
        fetch("/api/users").then(res => res.json()),
      ]);
      setServices(servicesRes || []);
      setCategories(categoriesRes || []);
      setReviews(reviewsRes || []);
      setUsers(usersRes || []);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <PopularCategories services={services} categories={categories} />
        <PopularDestinations />
        <SpecialOffers services={services} />
        <Testimonials reviews={reviews} users={users} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}

