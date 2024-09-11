// components/Loader.js
import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center loader-wrapper justify-center bg-white bg-opacity-75 z-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
                <div>I am working...</div>
            </div>
            <style jsx>{`
                .loader-wrapper {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    position: fixed;

                    z-index: 99999999;
                }

                .loader {
                    display: flex;
                    border-top-color: #3498db;
                    width: 175px;
                    height: 175px;
                    background-image: url(/loader-earth.gif);
                    -webkit-background-size: 175px;
                    -moz-background-size: 175px;
                    -o-background-size: 175px;
                    background-size: 175px;
                    align-items: center;
                    justify-content: center;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg) scale(0.1);
                    }
                    100% {
                        transform: rotate(360deg) scale(1.5);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loader;
