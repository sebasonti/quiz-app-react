import React from "react";
import Card from "./Card";

export default function CardList({ cardsContent }) {
    return (
        <div className="card-grid">
            {cardsContent.map((card) => (
                <Card key={card.id} content={card} />
            ))}
        </div>
    );
}
