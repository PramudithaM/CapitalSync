import React, { useState } from 'react';
import EmailAdd from '../assets/component/EmailAdd';
import PassWord from '../assets/component/PassWord';
import CheckBox from '../assets/component/CheckBox';
import SignIn from '../assets/component/SignIn';
import GoogleSignin from '../assets/component/GoogleSignin';
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailFunc, signInWithGoogle, signInWithGithub } from '../firebase';

const Loginpage = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [passWord, setPassWord] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // Email/password login
  const handleEmailSignIn = async () => {
    try {
      const userCredential = await signInWithEmailFunc(emailAddress, passWord);
      console.log("Signed in user:", userCredential.user);
      navigate("/home-page"); // go to home page
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message); // show error to user
    }
  };

  // Google login
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      console.log("Google user:", userCredential.user);
      navigate("/home-page");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // GitHub login
  const handleGithubSignIn = async () => {
    try {
      const userCredential = await signInWithGithub();
      console.log("GitHub user:", userCredential.user);
      navigate("/home-page");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <main>
      <div className='pattern'/>
      <div className='px-5 py-12 xs:p-10 max-w-7xl mx-auto flex flex-col relative z-10 flex items-center justify-center'>
        <div>
          <h1>Welcome Back</h1>
          <p className='text-center text-white pb-4 text-sm'>Sign in to continue to Wealth Track</p> 
          <div className='w-[430px] bg-dark-100 border border-slate-400 rounded-md p-8 shadow-lg blackdrop-filter blackdrop-blur-sm bg-opacity-30 relative '>
            <h3 className='text-white'>Email Address</h3>
            <EmailAdd emailAddress={emailAddress} setEmailAddress={setEmailAddress} />

            <h3 className='text-white mt-5'>Password</h3>
            <PassWord passWord={passWord} setPassWord={setPassWord} />

            <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />

            {/* Sign In button */}
            <SignIn handleSignIn={handleEmailSignIn} />

            <p className='flex justify-center text-white mt-3 text-sm'>
              New Here? <Link to='/sign-up'>Create an Account</Link>
            </p>

            <p className='text-center text-white mt-3 text-sm'>or continue with</p>
            <div className="flex gap-10 justify-between mt-3">
              <GoogleSignin text="Google" onClick={handleGoogleSignIn} />
              <GoogleSignin text="GitHub" onClick={handleGithubSignIn} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Loginpage;
