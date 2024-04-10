'use client'

import React, { useEffect, useState } from 'react';
// import { insertFileInSignal, setSignal, userSignalState } from '../_utils/context';
import { useSelector } from 'react-redux';
import { fileData, tProfileDb } from '../profilesDb/profile.schema';
import { useRouter, } from 'next/navigation';
import Link from 'next/link';
import { getLocalStorageItem, setLocalStorageItem } from '../_utils/localstorage';
import { contextValue, } from '../_utils/context';
import { backend } from '../_components/environmentVariable';
const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$")

// Define types for form data
type FormData = Record<string, string | File | null> & {
  username: string;
  email: string;
  userImage: File | null;
  password: string;
  accountType: string;
};

// Define type for error state
type ErrorState = {
  username: string;
  email: string;
  userImage: string;
  password: string;
  accountType: string;
};
const regex = {
  password: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$",
  username: '^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$',
  email: '/^\S+@\S+\.\S+$/',
}
// Define initial state for the form
export const initialFormState: FormData = {
  username: '',
  email: '',
  userImage: null,
  password: '',
  accountType: 'standard', // Default to standard
};

// Define initial state for errors
const initialErrorState: ErrorState =  {
  username: '',
  email: '',
  userImage: '',
  password: '',
  accountType: '',
};

const SignUpForm: React.FC = () => {
  const { insertFileInSignal, setSignal, userSignalState } = contextValue//useAuth()
  const router = useRouter()

  useEffect(() => {
    const data = getLocalStorageItem()
    const values =  Object.values( data )
    //console.log(data);
    const keys = Object.keys(initialFormState)
    if( values.length===6){
      const signalValue: tProfileDb ={ ...data, listOfFiles: [] }
      userSignalState.value =  signalValue
      router.push('dashboard')
    }
  }, [])


  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<ErrorState>(initialErrorState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    //console.log(e.target.type);
    
    setFormData({
      ...formData,
      [name]: value,
    });
    if(e.target.type=='password'){
      //console.log(value);
      if(!passwordRegex.test(value)) {
        setErrors( prev => ({...prev,password:'Weak Password. It should contain one upeer case,lowe case  word, and one special character, and  one number' }))
        return
      }else{
        setErrors(prev => ({ ...prev, password: ''}))
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxSizeInBytes = 5*Math.pow(2,20)// 10 MB (in bytes)
      const file =e.target.files[0]
    if (file && file.size > maxSizeInBytes) {
      const error =  'File size exceeds the limit (10 MB). Please choose a smaller file.';
      setErrors({...errors, userImage:error})
      e.target.value = '';
    } else {
      setErrors({ ...errors, userImage:''});
      // Proceed with file upload logic
    }
      setFormData({
        ...formData,
        userImage: e.target.files[0],
      });
    }
  };
  const [ifUserExist, setIfUserExist] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input validation
    const newErrors:ErrorState = initialErrorState;
    Object.keys(formData).forEach((key) => {
      if(key=='userImage') return
      if (!formData[key as keyof FormData]) {
        newErrors[key as keyof ErrorState] = `${key} is required`;
      }
    });
    const password = formData.password
    
    //console.log(newErrors);
    const errors = Object.values(newErrors)
    for( let i=0; i<errors.length; i++) {
      if(errors[i].length>0){
        setErrors(newErrors)
        return
      }
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if(key=='userImage' && !value) {
        return
      }
      formDataToSend.append(key, value as string | Blob);
    });
    //console.log('clicked');

    try {

      const response = await fetch(`${backend}/signup`, {
        method: 'POST',
        body: formDataToSend,
      });
      const responseValue = await response.json()
      const { ok } = responseValue
      if (ok) {
        const { userIndex, message, storageUsed, userImage, } = responseValue
        const { username, password, email } = formData
        const user: tProfileDb = {
          userIndex,
          username,
          email,
          userImage,
          password,
          storageUsed,
          listOfFiles: [],
          sharedFiles: [],
        }
        //console.log(user);
        setLocalStorageItem(user)
        userSignalState.value = user

        //console.log('Form submitted successfully');
        router.push('dashboard')
      } else {
        if(responseValue.message=='User already exist, please login') {
          setIfUserExist(true)
        }
      }
    } catch (error) {
      const err = `Error submitting form: ${error}`
      console.error(err);
      throw new Error(err)
    }
  };

  return (
    <div className='h-svh overflow-auto '>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 rounded-lg shadow-md">
  <h1 className='font-bold text-4xl flex justify-center content-center mb-10'>Signup</h1>
  <div className="mb-4 ">
    <label htmlFor="userImage" className="block font-bold mb-2">User Image (Image smaller than 5MB)</label>
    <input
      type="file"
      id="userImage"
      name="userImage"
      accept="image/*"
      onChange={handleImageChange}
      className="w-full px-4 py-2"
      autoFocus
    />
    {errors.userImage && <span className="text-red-500">{errors.userImage}</span>}
  </div>
  <div className="mb-4">
    <label htmlFor="username" className="block  font-bold mb-2">Username</label>
    <input
      type="text"
      id="username"
      name="username"
      value={formData.username}
      onChange={handleChange}
      className="border rounded px-4 py-2 w-full"
    />
    {errors.username && <span className="text-red-500">{errors.username}</span>}
  </div>
  <div className="mb-4">
    <label htmlFor="email" className="block font-bold mb-2">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="border rounded px-4 py-2 w-full"
    />
    {errors.email && <span className="text-red-500">{errors.email}</span>}
  </div>
  <div className="mb-4">
    <label className="block font-bold mb-2">Account Type</label>
    <div>
      <label htmlFor="standard" className="inline-flex items-center mr-4">
        <input
          type="radio"
          id="standard"
          name="accountType"
          value="standard"
          checked={formData.accountType === 'standard'}
          onChange={handleChange}
          className="form-radio h-4 w-4 text-blue-500"
        />
        <span className="ml-2">Standard</span>
      </label>
      <label htmlFor="premium" className="inline-flex items-center">
        <input
          type="radio"
          id="premium"
          name="accountType"
          value="premium"
          checked={formData.accountType === 'premium'}
          onChange={handleChange}
          className="form-radio h-4 w-4 text-blue-500"
        />
        <span className="ml-2">Premium</span>
      </label>
    </div>
    {errors.accountType && <span className="text-red-500">{errors.accountType}</span>}
  </div>
  <div className="mb-4">
    <label htmlFor="password" className="block font-bold mb-2">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="border rounded px-4 py-2 w-full"
    />
    {errors.password && <span className="text-red-500">{errors.password}</span>}
  </div>
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded disabled:opacity-45 mr-4"
    disabled={!formData.username || !formData.email || !formData.password || !formData.accountType}
  >
    Sign Up
  </button>
  <Link
    href='/login'
  ><button
  className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded disabled:opacity-45 ml-5 "
  >Login</button>
  </Link>
  {ifUserExist && <div className='text-red-900 font-bold capitalize'>{formData.email} already exists, please try signing in</div>}
</form>
</div>
  );
};

export default SignUpForm;
