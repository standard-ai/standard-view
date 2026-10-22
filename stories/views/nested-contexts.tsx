// nested-contexts.tsx - Tests updating context data for n element
import React, { createContext, useContext, useState, useEffect } from 'react';
// standard-view
import View3D from '../../src/views/View3D';
import Box from '../../src/primitives/Box';
import Group from '../../src/groups/Group';

// Create a single context for rotation
const RotationContext = createContext(0);

// Provider component that manages rotation
const RotationProvider = ({
  children,
  speed,
}: {
  children: React.ReactNode;
  speed: number;
}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + speed) % (2 * Math.PI));
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <RotationContext.Provider value={rotation}>
      {children}
    </RotationContext.Provider>
  );
};

// Rotating box component
const RotatingBox = ({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) => {
  const rotation = useContext(RotationContext);

  return (
    <Group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, -rotation]}
    >
      <Box color="black" />
    </Group>
  );
};

// Grid of rotating boxes
const RotatingBoxes = ({ count }: { count: number }) => {
  const gridSize = Math.ceil(Math.sqrt(count));
  const boxes: React.ReactElement[] = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const x = (col - gridSize / 2) * 2;
    const y = (row - gridSize / 2) * 2;

    boxes.push(<RotatingBox key={i} position={[x, y, 0]} scale={0.5} />);
  }

  return <>{boxes}</>;
};

function NestedContextStory(args: any = {}): React.ReactElement {
  const { contextCount = 25, rotationSpeed = 0.002 } = args || {};

  return (
    <RotationProvider speed={rotationSpeed}>
      <div style={{ height: '100vh' }}>
        <View3D orbitControls contexts={[RotationContext]}>
          <RotatingBoxes count={contextCount} />
        </View3D>
      </div>
    </RotationProvider>
  );
}

NestedContextStory.args = {
  contextCount: 25,
  rotationSpeed: 0.002,
};

NestedContextStory.argTypes = {
  contextCount: {
    control: { type: 'number', min: 1, max: 50, step: 1 },
    description: 'Number of contexts',
    defaultValue: 25,
  },
  rotationSpeed: {
    control: { type: 'number', min: 0.001, max: 0.01, step: 0.001 },
    description: 'Rotation speed',
    defaultValue: 0.002,
  },
};

export default NestedContextStory;
