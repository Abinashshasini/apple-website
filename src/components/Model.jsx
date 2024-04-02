import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

import ModelView from './ModelView';
import { yellowImg } from '../utils';
import { models, sizes } from '../constants';
import { animateWithGsapTimeline } from '../utils/animations';

const Model = () => {
  /** Required states for 3D view */
  const [size, setSize] = useState('small');
  const [model, setModel] = useState({
    title: 'iPhone 15 pro in Natural Titanium',
    color: ['#8F8A81', '#ffe7b9', '#6f6c64'],
    img: yellowImg,
  });
  /**
   * SETUP for Camera and Properties
   * Refs for camera control for modal view
   * Ref to access propertis while animating for the models
   * States to access rotation values of each model's
   * Timeline for gsap
   */
  const cameraControlSmall = useRef(null);
  const cameraControlLarge = useRef(null);
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);
  const timeLine = gsap.timeline();

  /** Effect to animate the large and small iPhone's */
  useEffect(() => {
    if (size === 'large') {
      animateWithGsapTimeline(
        timeLine,
        small,
        smallRotation,
        '#view1',
        '#view2',
        { transform: 'translateX(-100%)', duration: 2 }
      );
    }

    if (size === 'small') {
      animateWithGsapTimeline(
        timeLine,
        large,
        largeRotation,
        '#view2',
        '#view1',
        { transform: 'translateX(0)', duration: 2 }
      );
    }
  }, [size]);

  /** GSAP hook to animate the heading */
  useGSAP(() => {
    gsap.to('#heading', {
      opacity: 1,
      y: 0,
    });
  }, []);
  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>
        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            <ModelView
              index={1}
              groupRef={small}
              gspaType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />
            <ModelView
              index={2}
              groupRef={large}
              gspaType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            <Canvas
              className="w-full h-full"
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden',
              }}
              id="canvas_cnt"
              eventSource={document.getElementById('root')}
            >
              <View.Port></View.Port>
            </Canvas>
          </div>
          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>
            <div className="flex-center">
              <ul className="color-container">
                {models.map((element, index) => (
                  <li
                    key={index}
                    className="w-6 h-6 rounded-full mx-2 cursor-pointer"
                    style={{
                      backgroundColor: element.color[0],
                    }}
                    onClick={() => setModel(element)}
                  />
                ))}
              </ul>
              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className="size-btn transition-all"
                    style={{
                      backgroundColor: size === value ? 'white' : 'transparent',
                      color: size === value ? 'black' : 'white',
                    }}
                    onClick={() => setSize(value)}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
