import React from 'react';
import BlurCircle from '../components/BlurCircle';
import MovieCard from '../components/MovieCard';
import { useAppContext } from '../context/AppContext';

const Movies = () => {
    const { shows } = useAppContext();
    // Clone first and last 2 slides for seamless looping
    const extendedShows = [...shows.slice(-2), ...shows, ...shows.slice(0, 2)];
    const totalSlides = extendedShows.length;
    const [currentIndex, setCurrentIndex] = React.useState(2); // Start at the first "real" slide
    const [isTransitioning, setIsTransitioning] = React.useState(true);

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => {
            if (prev === 0) {
                // Instantly jump to the last cloned slide (no animation)
                setIsTransitioning(false);
                return totalSlides - 3;
            }
            return prev - 1;
        });
    };

    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => {
            if (prev === totalSlides - 3) {
                // Instantly jump to the first cloned slide (no animation)
                setIsTransitioning(false);
                return 2;
            }
            return prev + 1;
        });
    };

    // Reset to the "real" first or last slide after transition
    React.useEffect(() => {
        if (!isTransitioning) {
            setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
        }
    }, [isTransitioning]);

    return shows.length > 0 ? (
        <div className='relative my-20 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <BlurCircle top="150px" left="0px" />
            <BlurCircle bottom="50px" right="50px" />
            <h1 className='text-2xl font-bold my-8 text-center'>New Release</h1>
            <div className='relative'>
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className='absolute left-0 z-10 bg-orange-500 text-white rounded-l-lg p-4 h-20 -ml-4 flex items-center justify-center'
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                    &#10094;
                </button>
                {/* Slides Container */}
                <div className='overflow-hidden py-4'>
                    <div
                        className={`flex transition-transform ${isTransitioning ? 'duration-700' : 'duration-0'} ease-in-out`}
                        style={{
                            transform: `translateX(calc(-${currentIndex * (300 + 32)}px + ${(window.innerWidth - 300) / 2}px))`,
                            gap: '32px',
                            padding: '0 100px',
                        }}
                    >
                        {extendedShows.map((movie, index) => (
                            <div
                                key={`${movie._id}-${index}`}
                                className="flex-shrink-0"
                                style={{
                                    width: '300px',
                                    transition: 'transform 0.3s, opacity 0.3s',
                                    opacity: index === currentIndex ? 1 : 0.6,
                                    transform: index === currentIndex ? 'scale(1.05)' : 'scale(0.9)',
                                }}
                            >
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className='absolute right-0 z-10 bg-orange-500 text-white rounded-r-lg p-4 h-20 -mr-4 flex items-center justify-center'
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                    &#10095;
                </button>
            </div>
            {/* More Button */}
            <div className="flex justify-center mt-8">
                <button className="bg-red-600 text-white px-8 py-2 rounded-lg font-medium">
                    More
                </button>
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold text-center'>No movies available</h1>
        </div>
    );
};

export default Movies;
