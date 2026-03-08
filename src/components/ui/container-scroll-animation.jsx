"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const ContainerScroll = ({
    titleComponent,
    children,
}) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 20,
        restDelta: 0.001
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.8, 1] : [1.1, 1];
    };

    const rotate = useTransform(smoothProgress, [0, 0.5], [20, 0]);
    const scale = useTransform(smoothProgress, [0, 0.5], scaleDimensions());
    const translate = useTransform(smoothProgress, [0, 0.5], [0, -100]);
    const opacity = useTransform(smoothProgress, [0, 0.1, 0.45, 0.5], [0, 1, 1, 1]);

    return (
        <div
            className="min-h-[60rem] md:min-h-[80rem] flex items-center justify-center relative p-4 md:p-20"
            ref={containerRef}
        >
            <div
                className="py-10 md:py-40 w-full relative"
                style={{
                    perspective: "1500px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} opacity={opacity} />
                <Card
                    rotate={rotate}
                    translate={translate}
                    scale={scale}
                    opacity={opacity}
                >
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent, opacity }) => {
    return (
        <motion.div
            style={{
                translateY: translate,
                opacity: opacity,
                willChange: "transform, opacity",
            }}
            className="max-w-5xl mx-auto text-center mb-10"
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    translate,
    opacity,
    children,
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                translateY: translate,
                opacity,
                boxShadow:
                    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
                willChange: "transform, opacity",
                transformStyle: "preserve-3d",
            }}
            className="max-w-5xl mx-auto h-[35rem] md:h-[45rem] w-full border border-[#ffffff10] p-2 md:p-6 bg-[#080C21] rounded-[30px] shadow-2xl relative"
        >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-[#010208] md:rounded-2xl md:p-4 border border-[#ffffff05] transform-gpu">
                {children}
            </div>
            {/* Glow effect inside card */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00ffff10] to-transparent pointer-events-none rounded-[30px]" />
        </motion.div>
    );
};
