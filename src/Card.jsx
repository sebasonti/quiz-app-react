import React, { useState, useEffect, useRef } from "react";

export default function Card({ content }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [height, setHeight] = useState("initial");

    const frontEl = useRef();
    const backEl = useRef();

    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    useEffect(setMaxHeight, [
        content.question,
        content.answer,
        content.options,
    ]);

    useEffect(() => {
        window.addEventListener("resize", setMaxHeight);
        return () => window.removeEventListener("resize", setMaxHeight);
    }, []);

    return (
        <div
            style={{ height: height }}
            className={`card ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped((prev) => !prev)}
        >
            <div className="front" ref={frontEl}>
                {content.question}
                <ul className="card-options">
                    {content.options.map((option) => (
                        <li className="card-option" key={option}>
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="back" ref={backEl}>
                {content.answer}
            </div>
        </div>
    );
}
