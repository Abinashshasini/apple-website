import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { rightImg, watchImg } from '../utils';
import VideoCarousel from './VideoCarousel';

gsap.registerPlugin(ScrollTrigger);
const Highlights = () => {
  /** GSAP hook to animate title */
  useGSAP(() => {
    gsap.to('#title', {
      scrollTrigger: {
        trigger: '#title',
      },
      opacity: 1,
      y: 0,
    });
    gsap.to('.link', {
      scrollTrigger: {
        trigger: '#title',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.25,
      yoyo: true,
    });
  }, []);

  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full common-padding bg-zinc"
    >
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex justify-between items-center">
          <h1 id="title" className="section-heading">
            Get the highlights.
          </h1>
          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the film <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              Watch the event{' '}
              <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>
        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
