import React from 'react'
import {Link} from 'react-router-dom'



function SignUp() {
  return (
    <>
       <div className='container p-5 d-flex justify-content-center align-items-center' style={{ minHeight: "90vh" }}>

         <div className='d-flex flex-column mb-4'>
           <h1 className='text-center'><i class="fa-solid fa-code text-warning me-1"></i></h1>
          <h1 className='text-center text-white mb-5'>Sign Up</h1>
        <div className=" p-5  h-100 shadow rounded-4 bg-dark border-top border-bottom border-warning" style={{ width: "400px" }}>
          <form >
            <div className='mb-2 '>
              <label className='text-white my-1' htmlFor="email">Name</label>
              <input name='name' className='form-control ' type="text" placeholder='enter your name' />

            </div>
            <div className='mb-2 '>
              <label className='text-white my-1' htmlFor="email">Email</label>
              <input name='email' className='form-control ' type="email" placeholder='xyz@gmail.com' />

            </div>
            <div className='mb-2 '>
              <label className='text-white my-1' htmlFor="password">Password</label>
              <input name='password' className='form-control ' type="password" placeholder='enter your password' />

            </div>
            <div className='my-4' >
              <button className='btn btn-light w-100 text-black fw-semibold '>Continue</button>
            </div>
            <div className="d-flex align-items-center my-4">
              <div className="flex-grow-1 border-top"></div>
              <span className="mx-2 text-white">OR</span>
              <div className="flex-grow-1 border-top"></div>
            </div>

            <div className='bg-light rounded py-2 px-2'>
              Continue with GOOGLE
            </div>

            <div className='my-3 '>
              <span className='text-white ms-3'>Already have an account? <Link to="/login" className='link-btn ms-1'>Sign In</Link> </span>

            </div>
          </form>


        </div>
         </div>

      </div>
         
         <div className='mt-4 text-center '>
          <span className='text-white' style={{fontSize:"14px"}}>By creating an account, you agree to the <br />Terms of Service and Privacy policy </span>
         </div>
    
    </>
  )
}

export default SignUp