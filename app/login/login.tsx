'use client'


import React, { useEffect, useState } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../_utils/localstorage';
import { tProfileDb } from '../profilesDb/profile.schema';
// import { setSignal } from '../_utils/signal';
import { useRouter } from 'next/navigation';
import { contextValue, useAuth } from '../_utils/context';
import { Lumanosimo } from 'next/font/google';
import Link from 'next/link';
import { backend } from '../_components/environmentVariable';

// Define types for form data
type FormData = Record<string, string > & {
  email: string;
  password: string;
};

// Define type for error state
type ErrorState = Record<string, string> & {
  email: string;
  password: string;
};

// Define initial state for the form
const initialFormState: FormData = {
  email: '',
  password: '',
};

// Define initial state for errors
const initialErrorState: ErrorState =  {
  email: '',
  password: '',
};
const lumanosimoFont = Lumanosimo({
  subsets: ['latin'],
  weight: ['400']
})
function SignUpForm() {
  const { userSignalState,  } = contextValue //useAuth()
  // //console.log(userSignalState);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<ErrorState | null>(null);
  const router = useRouter()
  useEffect(() => {
    const data = getLocalStorageItem()
    const values =  Object.values( data )
    //console.log(data);
    if( values.length===6){
      const signalValue: tProfileDb ={ ...data, listOfFiles: [], friends: [] }
      userSignalState.value = signalValue
      router.push('dashboard')
    }
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input validation
    const newErrors: ErrorState = initialErrorState
    Object.keys(formData).forEach((key: string) => {
      if (!formData[key as keyof FormData]) {
        newErrors[key as keyof ErrorState] = `${key} is required`;
        return
      }
      delete newErrors[key]
    });
    // //console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Form submission
    const body:Record<string,string> = {}
    Object.entries(formData).forEach(([key, value]: string[]) => {
      body[key] =value
    });
    try {
      const response = await fetch(`${backend}/userLogin`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      if (response.ok) {
        const { userCred, message, } = await response.json()
        userSignalState.value = userCred
        delete userCred.listOfFiles
        setLocalStorageItem(userCred)
        router.push('dashboard')
      } else {
        // Handle error
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='h-svh flex justify-center content-center'>
    <form onSubmit={handleSubmit} className={`${lumanosimoFont} font-bold max-w-md max-h-max my-auto p-8 rounded-lg shadow-md`}>
  <div className="mb-4">
    <h1 className='flex justify-center content-center text-4xl'>Login</h1>
    <label htmlFor="email" className="mb-2">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="border rounded px-4 py-2 w-full"
      autoFocus
    />
    {errors && errors.email && <span className="text-red-500">{errors && errors.email}</span>}
  </div>
  <div className="mb-4">
    <label htmlFor="password" className="mb-2">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="border rounded px-4 py-2 w-full"
    />
    {errors && errors.password && <span className="text-red-500">{errors && errors.password}</span>}
  </div>
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded disabled:opacity-45 "
    disabled={ !formData.email || !formData.password}
  >
    Login
  </button>
  <Link
    href='/signup'
  ><button
  className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded disabled:opacity-45 ml-5 "
  >Signup</button>
    
  </Link>
</form>
</div>
  );
};

export default SignUpForm;
