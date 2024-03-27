/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { pauseImg, playImg, replayImg } from '../utils';
import { highlightsSlides } from '../constants';

gsap.registerPlugin(ScrollTrigger);
const VideoCarousel = () => {
  /** Required refs and hooks */
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  /** Function to handle process of video states */
  const handleProcess = (type, index) => {
    switch (type) {
      case 'video-end':
        setVideo((prevState) => ({
          ...prevState,
          isEnd: true,
          videoId: index + 1,
        }));
        break;
      case 'video-last':
        setVideo((prevState) => ({
          ...prevState,
          isLastVideo: true,
        }));
        break;
      case 'video-reset':
        setVideo((prevState) => ({
          ...prevState,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case 'pause':
        setVideo((prevState) => ({
          ...prevState,
          isPlaying: !prevState.isPlaying,
        }));
        break;
      case 'play':
        setVideo((prevState) => ({
          ...prevState,
          isPlaying: !prevState.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  /** Function to identify play/pause/replay states */
  const handleIdentifyState = () => {
    let buttonnStates = {
      src: '',
      alt: '',
    };

    if (isLastVideo) {
      buttonnStates = {
        src: replayImg,
        alt: 'replay',
      };
    } else if (!isPlaying) {
      buttonnStates = {
        src: playImg,
        alt: 'playing',
      };
    } else {
      buttonnStates = {
        src: pauseImg,
        alt: 'pause',
      };
    }

    return buttonnStates;
  };

  /**  */
  const handleLoadedMetaData = (event) =>
    setLoadedData((prev) => [...prev, event]);

  /** GSAP hook to animate the video slider */
  useGSAP(() => {
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });

    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    });
  }, [isEnd, videoId]);

  /** Effect to play the video */
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  /** Effect to keep track of the video playing status and animation */
  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animate the progress of the video
      const animation = gsap.to(span[videoId], {
        onUpdate: () => {
          let progress = Math.ceil(animation.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;
          }

          gsap.to(videoDivRef.current[videoId], {
            width: window.innerWidth < 760 ? '10vw' : '4vw',
          });

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: '#fff',
          });
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });

            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        },
      });

      if (videoId === 0) {
        animation.restart();
      }

      const animationUpdate = () => {
        if (videoRef.current[videoId.currentTime]) {
          animation.progress(
            videoRef.current[videoId].currentTime /
              highlightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animationUpdate);
      } else {
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [videoId, startPlay]);

  return (
    <>
      <div className="flex items-center">
        {highlightsSlides.map((highLight, index) => (
          <div
            key={highLight.id}
            id="slider"
            className="sm:pr-20 pr-10 relative"
          >
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  className={`${
                    highLight.id === 2 && 'translate-x-44'
                  } pointer-events-none`}
                  muted
                  ref={(element) => (videoRef.current[index] = element)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(e, index)}
                  onEnded={() => {
                    if (index !== 3) {
                      handleProcess('video-end', index);
                    } else {
                      handleProcess('video-last');
                    }
                  }}
                >
                  <source src={highLight.video} type="video/mp4"></source>
                </video>
              </div>
            </div>
            <div className="absolute top-12 left-[5%] z-10">
              {highLight.textLists.map((text) => (
                <p key={text} className="md:text-2xl text-xl font-medium">
                  {text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(element) => (videoDivRef.current[index] = element)}
              className="mx-2 h-3 w-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(element) => (videoSpanRef.current[index] = element)}
              />
            </span>
          ))}
        </div>
        <button
          className="control-btn"
          onClick={
            isLastVideo
              ? () => handleProcess('video-reset')
              : !isPlaying
              ? () => handleProcess('play')
              : () => handleProcess('pause')
          }
        >
          <img
            src={handleIdentifyState().src}
            alt={handleIdentifyState().alt}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
