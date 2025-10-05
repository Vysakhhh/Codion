import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import './Testimonial.css'

function Testimonial() {

const testimonials = [
  { name: "ananya.dev", role: "Frontend Engineer", quote: "This AI reviewer saved me hours of debugging!" },
  { name: "lucas.engineer", role: "Backend Developer", quote: "A game-changer for code quality and speed." },
  { name: "meera.js", role: "Full Stack Dev", quote: "Best developer tool of 2025." }
];
  return (
    <>
    
      <section className="py-5" style={{marginTop:"40px"}}>
        <div className="container">
          <h4 className="text-center text-light mb-4">Why Developers Love Codion</h4>
          <Swiper 
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="text-light p-4 rounded-3 text-center mx-auto  animated-border" style={{ maxWidth: '600px'}}>
                  <p className="fst-italic">"{item.quote}"</p>
                  <h6 className="mb-0 text-warning fw-bold">{item.name}</h6>
                  <small className="text-light">{item.role}</small>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    
    </>
  )
}

export default Testimonial