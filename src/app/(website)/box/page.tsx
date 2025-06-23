"use client"

import { SpinningReel } from '@/components/Reel';
import { SpinningReel2 } from '@/components/Reel2';
import SpiningReel from '@/components/SpiningReel';
import React from 'react'
const items = [
  {
    id: 1,
    name: "Gold Watch",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    odds: 0.4, // 50%
  },
  {
    id: 2,
    name: "Silver Chain",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80",
    odds: 0.4, // 30%
  },
  {
    id: 3,
    name: "Premium Sneakers",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80",
    odds: 0.2, // 20%
  },
];

function Box() {
  return (
    <div>
      <div>
        <SpinningReel items={items}/>
      </div>
      <div>
        <SpinningReel2 items={items}/>
      </div>
        <div>
        <SpiningReel items={items}/>
      </div>
    </div>
  )
}

export default Box