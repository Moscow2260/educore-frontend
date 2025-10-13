import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Container } from 'react-bootstrap';
import '../../styles/main.css';
import libraryImage from '../../img2/library-869061.jpg';
import lecturerImage from '../../img2/pexels-ron-lach-8035303.jpg';
import studentImage from '../../img2/pexels-pixabay-356065.jpg';

const HeroCarousel = () => {
  return (
    <section id="hero" className="hero section dark-background">
      <Carousel fade interval={5000} controls indicators>
        {/* Slide 1 - Admin */}
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={libraryImage}
              alt="Library Background"
            />
          </div>
          <Carousel.Caption className="carousel-container d-flex justify-content-center align-items-center min-vh-100">
            <Container>
              <h2 className="animate__animated animate__fadeInDown mb4">
                Welcome to Educore<br />
              </h2>
              <p className="animate__animated animate__fadeInUp mb-4 fs-5">Are you an Administrator?</p>
              <Link to="/admin-login" className="btn-get-started animate__animated animate__fadeInUp">
                Admin Login
              </Link>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 - Lecturer */}
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={lecturerImage}
              alt="Lecturer Background"
            />
          </div>
          <Carousel.Caption className="carousel-container">
            <Container>
              <h2 className="animate__animated animate__fadeInDown">Welcome to Educore</h2>
              <p className="animate__animated animate__fadeInUp">Are you a Lecturer?</p>
              <Link to="/lecturer-login" className="btn-get-started animate__animated animate__fadeInUp">
                Lecturer Login
              </Link>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 - Student */}
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={studentImage}
              alt="Student Background"
            />
          </div>
          <Carousel.Caption className="carousel-container">
            <Container>
              <h2 className="animate__animated animate__fadeInDown">Welcome to Educore</h2>
              <p className="animate__animated animate__fadeInUp">Are you a Student?</p>
              <Link to="/student-login" className="btn-get-started animate__animated animate__fadeInUp">
                Student Login
              </Link>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;