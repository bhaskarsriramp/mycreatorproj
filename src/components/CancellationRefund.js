import Navbar from './Navbar'
import React from 'react'
import Footer from './Footer'


function cancellationPolicy() {
  return (
   <>

      <header>
        <title>Cancellation and Refund Policy | Audioreel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </header>

   <Navbar />
   

    <div className="container">
        <p>
        Cancellation & Refund Policy
        </p>

        <p>

Last updated on Dec 29th 2024 <br />


Linck One Enterprises believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.<br /> <br />Under this policy:<br />

Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.

Linck One Enterprises does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.

</p>
<p>

In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 days of receipt of the products.

In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.

In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.

In case of any Refunds approved by the Linck One Enterprises, it’ll take 5-7 days for the refund to be processed to the end customer.
        </p>
    </div>
    <Footer />
   </>
  )
}

export default cancellationPolicy