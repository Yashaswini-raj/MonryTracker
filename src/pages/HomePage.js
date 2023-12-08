import React ,{useEffect, useState} from 'react'
import {Modal, model,Form,Input, Select,layout,DatePicker, message, Table} from 'antd'
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Spinner from './Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';
const { RangePicker } = DatePicker;
const HomePage = () => {
  const [showModal,setShowModal]=useState(false);
  const [loading,setLoading]=useState(false);
  const [allTransection,setAllTransection]=useState([]);
  const [frequency,setfrequency]=useState('7')
  const [selectedDate,setSelectdate]=useState([])
  const [type, setType]=useState('all')
  const [viewData,setViewData]=useState('table')
  const [editable,setEditable]=useState(null)
//table data
const columns=[
  {
    title:"Date",
    dataIndex:'date',
    render:(text)=> <span>{moment(text).format('YYYY-MM-DD')}</span>
  },
  {
    title:"Amount",
    dataIndex:'amount'
  },
  {
    title:"Type",
    dataIndex:'type'
  },
  {
    title:"Category",
    dataIndex:'category'
  },
  {
    title:"Reference",
    dataIndex:'reference'
  },{
    title:'Actions',
    render:(text,record)=>(
      <div>
        <EditOutlined onClick={()=>{
          setEditable(record)
          setShowModal(true)
        }}/>
        <DeleteOutlined  className='mx-2'
          onClick={()=>{
            handleDelete(record)
          }}
        />
      </div>
    )
  }

]

 

 
//useEffect
useEffect(() => {
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/api/v1/transection/get-transection", {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAllTransection(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      message.error("Ftech Issue With Tranction");
    }
  };
  getAllTransactions();
}, [frequency, selectedDate, type]);

//delete
const handleDelete=async(record)=>{
  try {
    setLoading(true)
    await axios.post('/api/v1/transection/delete-transection',{transacationId:record._id})
    setLoading(false)
    message.success("Deleted successfully")
  } catch (error) {
    setLoading(false)
    console.log(error);
    message.error("unable to delete")
  }
}
  //form submit
  const handleSubmit= async(value)=>{
try {
  const user=JSON.parse(localStorage.getItem('user'))
  setLoading(true)
  if(editable){
    await axios.post('/api/v1/transection/edit-transection',{
    payload:{
      ...value,
      userId:user._id
    },
    transacationId:editable._id
    })
    setLoading(false);
    message.success("Transection Updated Sccessfully")
  }
  else{
  await axios.post('/api/v1/transection/add-transection',{
    ...value ,
    userid:user._id})
  setLoading(false);
  message.success("Transection Added Sccessfully")
  }
  setShowModal(false)
  setEditable(null)
} catch (error) {
  setLoading(false)
  message.error('Failed to add Transection')
}
  }
  return (
    <Layout>
    {loading && <Spinner/>}
    <div className="filters">
   
    <div><h6>Select Frequency</h6>
    <Select value={frequency} onChange={(values)=>setfrequency(values)}>
      <Select.Option value='7'>Last 1 week</Select.Option>
      <Select.Option value='30'>Last 1 month</Select.Option>
      <Select.Option value='365'>Last 1 year</Select.Option>
      <Select.Option value='custom'>custom</Select.Option>
    </Select>
    {frequency === 'custom' && 
    <RangePicker value={selectedDate}
     onChange={(values)=>setSelectdate(values)}/>}
    </div>
    <div><h6>Select Type</h6>
    <Select value={type} onChange={(values)=>setType(values)}>
      <Select.Option value='all'>{"   "}All</Select.Option>
      <Select.Option value='income'>Income</Select.Option>
      <Select.Option value='expense'>Expense</Select.Option>
    
    </Select>
    {frequency === 'custom' && 
    <RangePicker value={selectedDate}
     onChange={(values)=>setSelectdate(values)}/>}
    </div>
    <div>
 
    </div>
    <div className='switch-icons'>
    <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon':'inactive-icon'}`}
    onClick={()=>setViewData('table')}/>
    <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon':'inactive-icon'}`}
    onClick={()=>setViewData('analytics')}/>
 </div>
      <button className="btn btn-primary" onClick={()=>setShowModal(true)} > Add New</button>
     
    </div>
    <div className="content">
    {viewData==='table'?
    <Table columns={columns} dataSource={allTransection}rowKey={(record, index) => index}/> 
    :(<Analytics allTransection={allTransection}/>) }
    
    </div>
      <Modal
       title={editable ? 'Edit Transaction' :"Add Transection"}
        open={showModal}
         onCancel={()=>setShowModal(false)} 
          
         footer={false}>

          <Form 
          layout ="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
          >
            <Form.Item label="Amount" name="amount">
            <Input type="text"/>
            </Form.Item>
          
            <Form.Item label="Type" name="type">
            <Select>
           <Select.Option value="income">Income</Select.Option>
           <Select.Option value="expense">Expense</Select.Option>
           </Select>
            </Form.Item>

            <Form.Item label="Category" name="category">
            <Select>
            <Select.Option value="salary">Salary</Select.Option>
           <Select.Option value="fee">Fee</Select.Option>
           <Select.Option value="food">Food</Select.Option>
           <Select.Option value="bill">Bill</Select.Option>
           <Select.Option value="project">Projects</Select.Option>
           <Select.Option value="=medical">Medical</Select.Option>
           <Select.Option value="tax">Tax</Select.Option>
           <Select.Option value="icecream">Icecream</Select.Option>
           </Select>
            </Form.Item>

            <Form.Item label="Date" name="date">
            <Input type="date"/>
            </Form.Item>

            <Form.Item label="Refrence" name="reference">
            <Input type="text"/>
            </Form.Item>
            <Form.Item label="Description" name="description">
            <Input type="text"/>
            </Form.Item>
            <div className='d-flex justify-content-end'>
              <button type='submit' className='btn btn-primary'>SAVE</button>
            </div>
          </Form>
         </Modal>
      
    
    </Layout>
  )
}

export default HomePage
