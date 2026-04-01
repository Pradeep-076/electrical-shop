/*
 * CeilingFan.jsx
 * ---------------------------------------------------------------
 * Image-based animated ceiling fan for the homepage.
 *
 * HOW IT WORKS:
 *  - A real ceiling fan photo (/images/ceiling-fan.png) is used as
 *    the rotating element inside a circular container.
 *  - CSS @keyframes "spinFan" rotates the image 360° infinitely.
 *  - A static metallic center-hub overlay sits on top so the hub
 *    appears to stay still while the blades spin — just like real life.
 *  - Motor housing, down-rod, and ceiling mount are pure CSS divs
 *    placed above the fan for a complete realistic assembly.
 *  - At "Fast" speed, a slight CSS blur(1.2px) is applied to
 *    simulate motion blur for extra realism.
 *
 * CONTROLS:
 *  - On/Off toggle switch
 *  - Speed buttons: Slow (4s) · Medium (1.8s) · Fast (0.5s)
 * ---------------------------------------------------------------
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CeilingFan.css';

const CeilingFan = () => {
    /* State: fan power and speed */
    const [isOn, setIsOn] = useState(true);
    const [speed, setSpeed] = useState('medium');

    /* Build CSS class for the rotating container */
    const containerClass = [
        'fan-image-container',
        isOn ? `speed-${speed}` : 'fan-off',
    ].join(' ');

    return (
        <section className="ceiling-fan-section">
            {/* ---- Section Title ---- */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="fan-heading"
            >
                Experience Our <span>Premium Fans</span>
            </motion.h2>
            <p className="fan-subheading">
                Whisper-quiet, energy-efficient ceiling fans crafted for modern homes.
            </p>

            {/* ============================================
                FAN ASSEMBLY — mount, rod, motor, image
                ============================================ */}
            <div className="fan-visual">
                {/* Ceiling mount plate */}
                <div className="fan-mount" />
                {/* Down rod */}
                <div className="fan-rod" />
                {/* Motor housing */}
                <div className="fan-motor-body" />

                {/* Rotating fan image + static center hub */}
                <div className={containerClass}>
                    {/* The fan photo — this element rotates */}
                    <img
                        src="/images/ceiling-fan.png"
                        alt="Rotating ceiling fan"
                        className="fan-image"
                        draggable="false"
                    />
                    {/* Static center hub overlay (stays still) */}
                    <div className="fan-center-hub" />
                </div>

                {/* Shadow on ground beneath fan */}
                <div className={`fan-shadow ${isOn ? '' : 'dim'}`} />
            </div>

            {/* ============================================
                CONTROLS — toggle + speed buttons
                ============================================ */}
            <div className="fan-controls">
                {/* On / Off toggle */}
                <div className="fan-toggle-row">
                    <span className="fan-label">Off</span>
                    <div
                        className={`fan-switch ${isOn ? 'on' : ''}`}
                        onClick={() => setIsOn((prev) => !prev)}
                        role="switch"
                        aria-checked={isOn}
                        aria-label="Fan power toggle"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsOn((prev) => !prev);
                            }
                        }}
                    >
                        <div className="fan-switch-knob" />
                    </div>
                    <span className="fan-label">On</span>
                </div>

                {/* Speed selector buttons */}
                <div className="fan-speed-row">
                    {['slow', 'medium', 'fast'].map((s) => (
                        <button
                            key={s}
                            className={`fan-speed-btn ${speed === s && isOn ? 'selected' : ''}`}
                            onClick={() => setSpeed(s)}
                            disabled={!isOn}
                            aria-label={`Set fan speed to ${s}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CeilingFan;
