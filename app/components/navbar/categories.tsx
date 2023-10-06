'use client'

import Container from "../container"

//icons----------------------------------------------------------------
import { MdOutlineVilla, MdOutlineSportsGolf } from 'react-icons/md';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiBoatFishing,  GiCaveEntrance, GiForestCamp, GiIsland,  GiEightBall} from 'react-icons/gi';
import { BiBowlingBall, BiHomeCircle } from 'react-icons/bi'
import { HiOutlineHomeModern } from 'react-icons/hi2'
//----------------------------------------------------------------

import CategoryBox from "../category-box"
import { usePathname, useSearchParams } from "next/navigation"


export const categories = [
    {
        label: 'Pantai',
        icon: TbBeach,
        description: 'Homestay ini dekat dengan pantai!',
    },
    {
        label: 'Minimalis',
        icon: HiOutlineHomeModern,
        description: 'Homestay ini minimalis!',
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'Homestay ini modern!'
    },
    {
        label: 'Pedesaan',
        icon: TbMountain,
        description: 'Homestay ini di dalam pedesaan!'
    },
    {
        label: 'Kolam Renang',
        icon: TbPool,
        description: 'Homestay ini memiliki kolam renang yang indah!'
    },
    {
        label: 'Pulau',
        icon: GiIsland,
        description: 'Homestay ini ada di dalam pulau!'
    },
    {
        label: 'Danau',
        icon: GiBoatFishing,
        description: 'Homestay ini ada di dekat danau!'
    },
    {
        label: 'Billiard',
        icon: GiEightBall,
        description: 'Homestay ini mempunyai meja billiard!'
    },
    {
        label: 'Golf',
        icon: MdOutlineSportsGolf,
        description: 'Homestay ini mempunyai lapangan golf!'
    },
    {
        label: 'Bowling',
        icon: BiBowlingBall,
        description: 'Homestay ini dapat melakukan kegiatan bowling '
    },
    {
        label: 'Gua',
        icon: GiCaveEntrance,
        description: 'Homestay ini ada di dalam gua!'
    },
    {
        label: 'Berkemah',
        icon: GiForestCamp,
        description: 'Homestay ini menawarkan kegiatan berkemah!'
    },
    {
        label: 'Rumah Pohon',
        icon: BiHomeCircle,
        description: 'Homestay ini ada diatas pohon!'
    }
]

function Categories() {
    const params = useSearchParams()
    const category = params?.get('category')
    const pathname = usePathname()

    const isMainPage = pathname === '/'
    if (!isMainPage) return null

    return <Container>
        <div className="pt-4 flex flex-row justify-between items-center overflow-x-auto">
            {categories.map(item => (
                <CategoryBox
                    key={item.label}
                    label={item.label}
                    selected={category === item.label}
                    icon={item.icon}
                />
            ))}
        </div>
    </Container>
}

export default Categories