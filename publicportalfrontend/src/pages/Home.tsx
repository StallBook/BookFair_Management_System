import React from 'react'
import Navbar from '../components/Navbar'
import bg from '../assets/bg1.png'

const Home = () => {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col text-gray-800"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <Navbar className="w-full" />
            <h1 className="text-3xl font-bold underline text-center mt-10">
                Welcome to the Home Page
            </h1>
        </div>

    )
}

export default Home
