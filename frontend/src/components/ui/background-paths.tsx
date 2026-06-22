"use client";

import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.8 + i * 0.04,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                preserveAspectRatio="none"
                fill="none"
            >
                <title>Background Paths</title>
                <defs>
                    <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c026d3" />
                        <stop offset="50%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="url(#path-gradient)"
                        strokeWidth={path.width}
                        strokeOpacity={0.12 + path.id * 0.01}
                        initial={{ pathLength: 0.3, opacity: 0.5 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.25, 0.55, 0.25],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 15,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#07080a]">
            {/* Ambient Shader Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -60, 40, 0],
                        scale: [1, 1.15, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[40rem] h-[40rem] rounded-full bg-purple-600/10 blur-[130px]"
                />
                <motion.div 
                    animate={{
                        x: [0, -40, 60, 0],
                        y: [0, 70, -50, 0],
                        scale: [1, 0.9, 1.15, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-[15%] -right-[10%] w-[50rem] h-[50rem] rounded-full bg-pink-600/10 blur-[160px]"
                />
                <motion.div 
                    animate={{
                        x: [0, 60, -50, 0],
                        y: [0, 40, 70, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[35%] left-[15%] w-[30rem] h-[30rem] rounded-full bg-blue-600/5 blur-[120px]"
                />
            </div>

            {/* Glowing Flowing Paths */}
            <div className="absolute inset-0 z-0 opacity-80">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}
