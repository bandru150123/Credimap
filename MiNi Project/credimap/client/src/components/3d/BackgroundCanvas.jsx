import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import ParticleEngine from './ParticleEngine';
import CameraDrift from './CameraDrift';
import { THEMES } from '../../config/themes.config';

/**
 * Main 3D Background Canvas Component
 * Renders continuously behind all UI with GPU optimization
 */
export default function BackgroundCanvas({ theme = 'default' }) {
    const config = THEMES[theme] || THEMES.galaxy || THEMES.default;

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#020617]">
            {/* Initial gradient pulse to prevent black screen */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 animate-pulse"></div>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 75 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: true
                }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', (event) => {
                        event.preventDefault();
                        console.warn('WebGL context lost. Attempting to restore...');
                    }, false);
                }}
                dpr={[1, 2]}
            >
                <color attach="background" args={[config.colors[2] || '#000000']} />

                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <CameraDrift />

                    <ParticleEngine
                        variant={config.variant}
                        colors={config.colors}
                    />
                </Suspense>
            </Canvas>

            {/* Subtle vignette for depth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
    );
}
