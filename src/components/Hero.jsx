import gsap from 'gsap';
import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils';

const Hero = () => {
  /** Required hooks */
  const [videoSource, setVideoSource] = useState(
    window.innerWidth < 740 ? smallHeroVideo : heroVideo
  );

  /** Function to set the video source based on width */
  const handleSetVideoSource = () => {
    if (window.innerWidth < 760) {
      setVideoSource(smallHeroVideo);
    } else {
      setVideoSource(heroVideo);
    }
  };

  /** Gspa hook to add animations */
  useGSAP(() => {
    gsap.to('#hero-title', {
      opacity: 1,
      delay: 1.5,
      duration: 2,
    });

    gsap.to('#cta', {
      opacity: 1,
      y: -50,
      delay: 2,
    });
  }, []);

  /** Effect to check of window width change */
  useEffect(() => {
    window.addEventListener('resize', handleSetVideoSource);

    return () => {
      window.removeEventListener('resize', handleSetVideoSource);
    };
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-col flex-center">
        <p className="hero-title" id="hero-title">
          iPhone 15 pro
        </p>
        <div className="md:w-10/12 w-9/12">
          <video
            autoPlay
            muted
            playsInline={true}
            key={videoSource}
            className="pointer-events-none"
          >
            <source src={videoSource} type="video/mp4"></source>
          </video>
        </div>
      </div>
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p>From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;
