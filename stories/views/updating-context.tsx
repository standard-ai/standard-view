// UpdatingContext.js - Updating the context from above triggers a context
// update within <View3D /> without re-rendering the whole <View3D>
import React, {
  memo,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Box from '../../src/primitives/Box';

const Context = createContext(0);

// This increments the rotation angle continuosly for the Context and should
// propagate to all children using the same Context
const AppContext = ({
  children,
  rotationSpeed = 0.02,
  updateInterval = 100,
}: {
  children: React.ReactNode;
  rotationSpeed?: number;
  updateInterval?: number;
}) => {
  const [rotation, setRotation] = useState(0);
  // Update the rotation to add a bit on each update
  useEffect(() => {
    const id = setTimeout(() => {
      setRotation(r => (r + rotationSpeed) % (2 * Math.PI));
    }, updateInterval);
    return () => clearTimeout(id);
  }, [rotation, setRotation, rotationSpeed, updateInterval]);

  return <Context.Provider value={rotation}>{children}</Context.Provider>;
};

// This keeps rotating since the Context value keeps incrementing
const RotatingDiv = () => {
  const rotation = useContext(Context);
  // A bit of style; we're not savages :)
  const style = {
    color: 'white',
    background: 'black',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center' as const,
    transformOrigin: 'center center',
    transform: `rotate(${rotation}rad)`,
  };
  return <div style={style}>{rotation.toFixed(2)}</div>;
};

// It does rotate at the same time/speed as the DIV
const RotatingBox = () => {
  const rotation = useContext(Context);
  return (
    <Box
      textureURL="/standard-cube/sc.jpg"
      color="white"
      scale={[2, 2, 2]}
      rotation={[0, 0, -rotation]}
    />
  );
};

// The normal JS/HTML div-based implementation
const App2D = memo(() => {
  console.log('App2D renders only once');
  return <RotatingDiv />;
});

// The 3d canvas-based implementation that should follow the 2d one
const App3D = memo(() => {
  console.log('App3D renders only once');
  return (
    <View3D orbitControls contexts={Context}>
      <RotatingBox />
    </View3D>
  );
});

function UpdatingContextStory(args: any = {}): React.ReactElement {
  const { rotationSpeed = 0.02, updateInterval = 100 } = args || {};

  return (
    <AppContext rotationSpeed={rotationSpeed} updateInterval={updateInterval}>
      <App2D />
      <App3D />
    </AppContext>
  );
}

UpdatingContextStory.args = {
  rotationSpeed: 0.02,
  updateInterval: 100,
};

UpdatingContextStory.argTypes = {
  rotationSpeed: {
    control: { type: 'number', min: 0.001, max: 0.1, step: 0.001 },
    description: 'Rotation speed',
    defaultValue: 0.02,
  },
  updateInterval: {
    control: { type: 'number', min: 10, max: 1000, step: 10 },
    description: 'Update interval in milliseconds',
    defaultValue: 100,
  },
};

export default UpdatingContextStory;
