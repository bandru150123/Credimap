import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Advanced Particle Engine
 * Supports multiple variants: floating, stream, grid, etc.
 */
export default function ParticleEngine({ variant = 'default', colors = ["#3b82f6", "#8b5cf6"] }) {
    const count = variant === 'galaxy' ? 3000 : 1000;
    const particles = useRef([]);

    const points = Array.from({ length: count }, () => ({
        position: [
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.05 + Math.random() * 0.1,
        speed: 0.1 + Math.random() * 0.2
    }));

    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        if (variant === 'galaxy') {
            groupRef.current.rotation.y = time * 0.05;
            groupRef.current.rotation.z = time * 0.02;
        } else if (variant === 'matrix') {
            groupRef.current.position.y = (time * 1.5) % 10 - 5;
        } else if (variant === 'waves') {
            groupRef.current.position.y = Math.sin(time * 0.5) * 2;
            groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.2;
        } else if (variant === 'grid') {
            groupRef.current.rotation.x = -Math.PI / 3;
            groupRef.current.position.y = -2;
        } else {
            groupRef.current.rotation.y = time * 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            {variant === 'galaxy' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

            {variant === 'grid' && (
                <gridHelper args={[100, 50, colors[0], colors[1]]} rotation={[Math.PI / 2, 0, 0]} />
            )}

            <Instances range={count}>
                <sphereGeometry args={[variant === 'orbs' ? 0.3 : 0.08, 8, 8]} />
                <meshBasicMaterial transparent opacity={variant === 'grid' ? 0.2 : 0.6} />
                {points.map((p, i) => (
                    <Instance
                        key={i}
                        position={p.position}
                        rotation={p.rotation}
                        scale={p.scale}
                        color={colors[i % colors.length]}
                    />
                ))}
            </Instances>

            {/* Dynamic light accents for specific themes */}
            {(variant === 'orbs' || variant === 'waves') && (
                <pointLight position={[10, 10, 10]} intensity={2} color={colors[0]} />
            )}
        </group>
    );
}
