import { useFrame, useThree } from '@react-three/fiber';

/**
 * Subtle camera drift animation
 * Creates gentle movement without being distracting
 */
export default function CameraDrift() {
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Gentle circular drift
        camera.position.x = Math.sin(t * 0.1) * 0.5;
        camera.position.y = Math.cos(t * 0.15) * 0.3;

        // Look at center
        camera.lookAt(0, 0, 0);
    });

    return null;
}
