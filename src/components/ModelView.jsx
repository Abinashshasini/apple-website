/* eslint-disable react/no-unknown-property */
import { lazy } from 'react';
import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  View,
} from '@react-three/drei';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import * as THREE from 'three';
import Lights from './Lights';
import Iphone from './Iphone';

const ModelView = ({
  index,
  groupRef,
  gspaType,
  controlRef,
  setRotationState,
  item,
  size,
}) => {
  return (
    <View
      index={index}
      id={gspaType}
      className={`w-full h-full ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambeint Light */}
      <ambientLight intensity={0.3} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* Lights */}
      <Lights />

      {/* Model */}
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? 'small' : 'large'}`}
        position={[0, 0, 0]}
      >
        <Suspense
          fallback={
            <Html>
              <div>loading</div>
            </Html>
          }
        >
          <Iphone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};

ModelView.propTypes = {
  index: PropTypes.number,
  groupRef: PropTypes.object,
  gspaType: PropTypes.string,
  controlRef: PropTypes.object,
  setRotationState: PropTypes.func,
  item: PropTypes.object,
  size: PropTypes.string,
};

export default ModelView;
