import React, {useEffect, useState} from 'react'
import { Form,Input ,message} from 'antd';
import { Link , useNavigate} from 'react-router-dom';
import axios from "axios";
import Spinner from './Spinner';


const Register = () => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    //form submit
    const submitHandle= async (values)=>{
        try {
            setLoading(true)
            await axios.post('/api/v1/users/register',values)
            message.success('Registration successful')
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            message.error('invalid username or password');
        }
    };

    useEffect(()=>{
        if(localStorage.getItem('user')){
            navigate('/')
        }
    },[navigate]);

  return (
    <>
      <div className='register-page d-flex align-items-center justify-content-center'>
      {loading && <Spinner />}
        <Form layout='vertical' onFinish={submitHandle}>
        <h1>Money Tracker - Registration Form</h1>
            <Form.Item label="Name" name="name">
                <Input type='text'/>
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input type='email'/>
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input type='password'/>
            </Form.Item>
            <div className='d-flex'>
            <Link to='/login'>Already registerd? click here to login</Link>
            <button className='btn btn-primary'>Register</button>
            </div>
        </Form>
      </div>
    </>
  )
}

export default Register
