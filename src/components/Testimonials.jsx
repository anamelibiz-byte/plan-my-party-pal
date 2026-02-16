import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Plan My Party Pal made organizing my daughter\'s 6th birthday so stress-free! The timeline builder kept me on track, and the budget tracker helped me stay within my budget. Highly recommend!',
    party: 'Princess Party for Emma, age 6',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Austin, TX',
    rating: 5,
    text: 'As a busy dad, I didn\'t know where to start with party planning. This app gave me everything I needed - from theme ideas to shopping lists. My son\'s superhero party was a huge success!',
    party: 'Superhero Party for Jake, age 8',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    text: 'The RSVP management feature saved me so much time! I could track who was coming, send reminders, and manage dietary restrictions all in one place. Game changer!',
    party: 'Unicorn Party for Sofia, age 5',
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Portland, OR',
    rating: 5,
    text: 'I love how the app suggests age-appropriate activities and helps with venue selection. We threw an amazing outdoor sports party for 20 kids without breaking the bank!',
    party: 'Sports Party for Ethan, age 10',
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    location: 'Chicago, IL',
    rating: 5,
    text: 'The PDF export feature is brilliant! I could print out my checklist and share it with my husband. We felt so organized on party day. Thank you!',
    party: 'Dinosaur Party for Liam, age 4',
  },
  {
    id: 6,
    name: 'Jennifer Park',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Planning my twin daughters\' party was overwhelming until I found this app. The guest list manager and automated emails made coordination so easy. Best $5/month I spend!',
    party: 'Under the Sea Party for Twins, age 7',
  },
];

export default function Testimonials() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
            Loved by Parents Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of parents who've planned stress-free, memorable parties with Plan My Party Pal
          </p>
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />
            ))}
            <span className="ml-2 text-gray-700 font-semibold">4.9 out of 5</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-600">2,500+ reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-2">
                <Quote className="text-white" size={20} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>

              {/* Party Info */}
              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-700 font-semibold">{testimonial.party}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/app"
            className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
          >
            Start Planning Your Party Today →
          </a>
        </div>
      </div>
    </div>
  );
}
