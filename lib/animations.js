// Enhanced animation variants with better easing and spring physics

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9] // Custom cubic bezier
        }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -80 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 120,
            damping: 12
        }
    }
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -120 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    }
};

export const slideInRight = {
    hidden: { opacity: 0, x: 120 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Increased for more noticeable effect
            delayChildren: 0.3
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

// Page transition variants
export const pageTransition = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    },
    exit: {
        opacity: 0,
        y: -40,
        transition: {
            duration: 0.4,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    }
};

// Enhanced hover animations
export const hoverScale = {
    scale: 1.08,
    transition: {
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 300,
        damping: 20
    }
};

export const hoverGlow = {
    boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)",
    transition: { duration: 0.3 }
};

export const hoverLift = {
    y: -10,
    scale: 1.03,
    boxShadow: "0 20px 40px rgba(0, 212, 255, 0.3)",
    transition: {
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.9]
    }
};

// Rotate and scale animation
export const rotateScale = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

// Pulse animation for attention
export const pulse = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
};
