import React from "react";

export default function FavouriteButton({ size = 24, strokeWidth = 1.5, fill = "none", onClick }) {
    return (
        <svg
            className="absolute top-2 right-6 w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer transition"
            aria-hidden="true"
            fill={fill}
            focusable="false"
            height={size}
            role="presentation"
            viewBox="0 0 24 24"
            width={size}
            onClick={onClick}
        >
            <path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
            />
        </svg>
    )
}