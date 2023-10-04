'use client'

import Container from "./container"

const Loader = () => {

    const spanElements = []
    for (let i = 0; i < 18; i++) {
        spanElements.push(
            <span key={i} className="loader grid col-span-1 cursor-pointer group"></span>
        )
    }

    return <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {spanElements}
        </div>
    </Container>
}

export default Loader
