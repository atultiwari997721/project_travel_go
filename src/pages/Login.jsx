import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const { login } = useAuth();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      login(phoneNumber);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-secondary italic tracking-tighter mb-2">
              RAPIDO
            </h1>
            <p className="text-secondary font-semibold">India's Largest Bike Taxi App</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-secondary">
            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <h2 className="text-2xl font-bold mb-6 text-secondary">Ready for a ride?</h2>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mobile Number</label>
                  <div className="flex items-center border-b-2 border-secondary py-2">
                    <span className="text-lg font-bold mr-2 text-secondary">+91</span>
                    <input 
                      type="tel" 
                      maxLength="10"
                      className="bg-transparent border-none w-full text-secondary text-xl font-bold focus:outline-none"
                      placeholder="00000 00000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={phoneNumber.length !== 10}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                    phoneNumber.length === 10 
                      ? "bg-secondary text-primary hover:scale-[1.02] active:scale-95" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  SEND OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <h2 className="text-2xl font-bold mb-2 text-secondary">Verify OTP</h2>
                <p className="text-sm text-gray-500 mb-6">Sent to +91 {phoneNumber} <button onClick={() => setStep(1)} className="text-secondary font-bold underline">Edit</button></p>
                <div className="mb-8 flex justify-between">
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="w-14 h-16 border-b-4 border-secondary text-center text-3xl font-black focus:border-primary transition-colors focus:outline-none bg-gray-50 rounded-t-xl"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val) {
                          setOtp((prev) => (prev + val).slice(0, 4));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          setOtp((prev) => prev.slice(0, -1));
                        }
                      }}
                      autoFocus={i === otp.length}
                    />
                  ))}
                </div>
                <button 
                  type="submit"
                  disabled={otp.length !== 4}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                    otp.length === 4 
                      ? "bg-secondary text-primary hover:scale-[1.02] active:scale-95" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  VERIFY & PROCEED
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-secondary/60 text-xs font-semibold">
        By continuing, you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
};

export default Login;
