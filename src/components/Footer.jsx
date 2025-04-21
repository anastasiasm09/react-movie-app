import { Tooltip } from "@heroui/tooltip";

export default function Footer() {

    return (
        <footer className="justify-center items-center w-full flex flex-col py-4">
            <Tooltip content="All film-related metadata used in REACT-MOVIE-APP, including actor, director and studio names, 
                synopses, release dates, trailers and poster art is supplied by The Movie Database (TMDb)."
            >
                <a
                    href="https://www.themoviedb.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                    <img
                        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg"
                        alt="TMDb logo"
                        className="h-2"
                    />
                </a>
            </Tooltip>
            <p className="font-light text-[0.5rem] max-w-xs">
                REACT-MOVIE-APP uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
        </footer>
    )
}