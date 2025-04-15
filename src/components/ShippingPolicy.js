import Navbar from './Navbar'
import React from 'react'
import Footer from './Footer'


function shippingPolicy() {
  return (
   <>

      <header>
        <title>Shipping Policy | Audioreel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </header>
   <Navbar />


    <div className="container">
        <p>
        Shipping & Delivery Policy
        </p>

        <p>

Last updated on Dec 29 2024.
</p>
<p>


Shipping is not applicable for business.
        </p>
    </div>
    <Footer />
   </>
  )
}

export default shippingPolicy